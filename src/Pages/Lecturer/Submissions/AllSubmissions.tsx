import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Input from "@/Components/Common/Input";
import type { AssignmentSubmission } from "@/types/assignment";
import { lecturerApi, handleApiError, clearApiCache } from "@/Utils/api";
import { fileStorage } from "@/Utils/supabase";

export default function AllSubmissions() {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "ungraded" | "graded"
  >("all");
  const [error, setError] = useState<string>("");

  const fetchAllSubmissions = useCallback(async () => {
    try {
      clearApiCache("all-submissions");
      setIsLoading(true);
      setError("");

      const submissions = await lecturerApi.assignments.getAllSubmissions();

      const courses = await lecturerApi.getCourses();
      const courseMap = new Map();
      courses.forEach((course) => {
        courseMap.set(course.id, course);
      });

      const enrichedSubmissions = submissions.map((submission) => {
        const submissionData = submission as unknown as Record<string, unknown>;
        const assignmentData = submissionData.assignment as unknown as {
          course_id?: number;
        };
        const course = courseMap.get(assignmentData?.course_id);

        return {
          ...submission,
          student: submissionData.user || submission.student,
          file_path: submissionData.file_url || submission.file_path,
          file_name:
            submissionData.file_url &&
            typeof submissionData.file_url === "string"
              ? (submissionData.file_url as string).split("/").pop()
              : undefined,
          submitted_at: submissionData.created_at || submission.submitted_at,
          content: submissionData.answer || submission.content,
          assignment: {
            ...assignmentData,
            course: course || null,
          },
        } as unknown as AssignmentSubmission;
      });

      setSubmissions(enrichedSubmissions);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSubmissions();
  }, [fetchAllSubmissions]);

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.student?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.student?.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (
        submission as unknown as { assignment?: { title?: string } }
      ).assignment?.title
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      false;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "graded" &&
        submission.grade !== null &&
        submission.grade !== undefined) ||
      (statusFilter === "ungraded" &&
        (submission.grade === null || submission.grade === undefined));

    return matchesSearch && matchesStatus;
  });

  const getTotalStats = () => {
    const totalSubmissions = submissions.length;
    const totalGraded = submissions.filter(
      (s) => s.grade !== null && s.grade !== undefined
    ).length;
    const totalPending = totalSubmissions - totalGraded;

    return { totalSubmissions, totalGraded, totalPending };
  };

  const stats = getTotalStats();

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
    } catch {
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

  return (
    <DashboardLayout title="Semua Pengumpulan">
      <Head title="Semua Pengumpulan - Dosen" />

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalSubmissions}
            </p>
            <p className="text-sm text-gray-600">Total Pengumpulan</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {stats.totalPending}
            </p>
            <p className="text-sm text-gray-600">Perlu Dinilai</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {stats.totalGraded}
            </p>
            <p className="text-sm text-gray-600">Sudah Dinilai</p>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Cari Submission"
            placeholder="Cari berdasarkan nama mahasiswa, email, atau judul tugas..."
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

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mahasiswa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tugas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Submit
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {submission.student?.name || "Nama tidak tersedia"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.student?.email || "Email tidak tersedia"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(
                          submission as unknown as {
                            assignment?: { title?: string };
                          }
                        ).assignment?.title || "Tugas tidak tersedia"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(
                          submission as unknown as {
                            assignment?: { course?: { name?: string } };
                          }
                        ).assignment?.course?.name || "Course tidak tersedia"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.submitted_at
                        ? new Date(submission.submitted_at).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Tanggal tidak tersedia"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.file_path ? (
                        <button
                          onClick={() =>
                            handleDownloadFile(
                              submission.file_path!,
                              submission.file_name || "file"
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          📎 Download
                        </button>
                      ) : (
                        <span className="text-gray-500">Tidak ada file</span>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/lecturer/submissions/${submission.id}/grade`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Beri Nilai
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Tidak ada submission
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {submissions.length === 0
                ? "Belum ada submission yang masuk."
                : "Tidak ada submission yang sesuai filter."}
            </p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
