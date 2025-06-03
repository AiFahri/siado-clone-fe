import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";

import Input from "@/Components/Common/Input";
import type { Assignment, AssignmentSubmission } from "@/types/assignment";
import { lecturerApi, handleApiError } from "@/Utils/api";
import { fileStorage } from "@/Utils/supabase";

export default function SubmissionList() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "graded" | "ungraded"
  >("all");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentAndSubmissions();
    }
  }, [assignmentId]);

  const fetchAssignmentAndSubmissions = async () => {
    if (!assignmentId) return;

    try {
      setIsLoading(true);
      setError("");

      const assignmentData = await lecturerApi.assignments.getById(
        parseInt(assignmentId)
      );
      setAssignment(assignmentData);

      const submissionData = await lecturerApi.assignments.getSubmissions(
        parseInt(assignmentId)
      );
      const mappedSubmissions = Array.isArray(submissionData)
        ? (submissionData as unknown as Record<string, unknown>[]).map(
            (submission: Record<string, unknown>) =>
              ({
                ...submission,
                student: submission.user || submission.student,
                file_path: submission.file_url || submission.file_path,
                file_name:
                  submission.file_url && typeof submission.file_url === "string"
                    ? submission.file_url.split("/").pop()
                    : undefined,
                submitted_at: submission.created_at || submission.submitted_at,
              } as unknown as AssignmentSubmission)
          )
        : [];

      setSubmissions(mappedSubmissions);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.student?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.student?.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "graded" &&
        submission.grade !== null &&
        submission.grade !== undefined) ||
      (statusFilter === "ungraded" &&
        (submission.grade === null || submission.grade === undefined));

    return matchesSearch && matchesStatus;
  });

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const blob = await fileStorage.downloadFile(filePath);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading file:", err);
      alert("Gagal mengunduh file");
    }
  };

  const getGradeColor = (grade: number | null | undefined) => {
    if (grade === null || grade === undefined) return "text-gray-500";
    if (grade >= 80) return "text-green-600";
    if (grade >= 70) return "text-blue-600";
    if (grade >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (submission: AssignmentSubmission) => {
    if (submission.grade !== null && submission.grade !== undefined) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Sudah Dinilai
        </span>
      );
    }
    return (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Belum Dinilai
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-12 w-12 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-gray-700 text-lg font-medium animate-pulse">
            Memuat konten...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title={`Pengumpulan: ${assignment?.title || "Loading..."}`}
    >
      <Head title={`Pengumpulan ${assignment?.title} - Dosen`} />

      {assignment && (
        <Card className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {assignment.title}
              </h2>
              <p className="text-gray-600 mb-4">{assignment.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  Course: {assignment.course?.code} - {assignment.course?.name}
                </span>
                <span>
                  Deadline:{" "}
                  {new Date(assignment.due_date).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>
            <Link
              to={`/lecturer/assignments/${assignment.id}/edit`}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Edit Tugas
            </Link>
          </div>
        </Card>
      )}

      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-red-800 font-medium">Terjadi Kesalahan</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Cari Mahasiswa"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "ungraded" | "graded")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Semua Status</option>
              <option value="ungraded">Belum Dinilai</option>
              <option value="graded">Sudah Dinilai</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {submissions.length}
            </p>
            <p className="text-sm text-gray-600">Total Pengumpulan</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {
                submissions.filter(
                  (s) => s.grade === null || s.grade === undefined
                ).length
              }
            </p>
            <p className="text-sm text-gray-600">Belum Dinilai</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {
                submissions.filter(
                  (s) => s.grade !== null && s.grade !== undefined
                ).length
              }
            </p>
            <p className="text-sm text-gray-600">Sudah Dinilai</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mahasiswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Pengumpulan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jawaban
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nilai
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {submission.student?.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {submission.student?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.student?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(
                        submission.submitted_at || ""
                      ).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.content || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.file_path ? (
                        <button
                          onClick={() =>
                            handleDownloadFile(
                              submission.file_path!,
                              submission.file_name || "file"
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                          📎 {submission.file_name || "Download"}
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Tidak ada file
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(submission)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${getGradeColor(
                          submission.grade
                        )}`}
                      >
                        {submission.grade !== null &&
                        submission.grade !== undefined
                          ? submission.grade
                          : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/lecturer/submissions/${submission.id}/grade`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {submission.grade !== null &&
                        submission.grade !== undefined
                          ? "Edit Nilai"
                          : "Beri Nilai"}
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {submissions.length === 0
                      ? "Belum ada pengumpulan"
                      : "Tidak ada pengumpulan yang sesuai filter"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
