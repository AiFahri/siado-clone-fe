import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import { LoadingTable } from "@/Components/UI";
import type { Assignment } from "@/types/assignment";
import type { Course } from "@/types";
import { lecturerApi, handleApiError, clearApiCache } from "@/Utils/api";

export default function LecturerAssignmentList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [error, setError] = useState<string>("");
  const fetchData = useCallback(async () => {
    try {
      clearApiCache("assignments");
      clearApiCache("lecturer-courses");
      setIsLoading(true);
      setError("");

      const [assignmentData, courseData] = await Promise.all([
        lecturerApi.assignments.getAll(),
        lecturerApi.getCourses(),
      ]);

      const coursesArray = Array.isArray(courseData) ? courseData : [];

      const enrichedAssignments = Array.isArray(assignmentData)
        ? (assignmentData as unknown as Record<string, unknown>[]).map(
            (assignment: Record<string, unknown>) => {
              const course = coursesArray.find(
                (c) => c.id === assignment.course_id
              );
              return {
                ...assignment,
                course: course || null,
              } as unknown as Assignment;
            }
          )
        : [];

      setAssignments(enrichedAssignments);
      setCourses(coursesArray);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      courseFilter === "all" ||
      assignment.course_id.toString() === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const handleDeleteAssignment = async (assignmentId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      try {
        const assignment = assignments.find((a) => a.id === assignmentId);
        if (!assignment || !assignment.course_id) {
          alert("Tidak dapat menemukan course untuk assignment ini");
          return;
        }

        await lecturerApi.assignments.delete(
          assignment.course_id,
          assignmentId
        );
        setAssignments((prev) =>
          prev.filter((assignment) => assignment.id !== assignmentId)
        );
        alert("Tugas berhasil dihapus!");
      } catch (err) {
        alert("Gagal menghapus tugas: " + handleApiError(err));
      }
    }
  };

  return (
    <DashboardLayout title="Semua Tugas">
      <Head title="Semua Tugas - Dosen" />
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

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <p className="text-gray-600">
            Kelola semua tugas dari course yang Anda ampu
          </p>
        </div>
        <Link to="/lecturer/assignments/create">
          <Button>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Buat Tugas Baru
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Cari Tugas"
            placeholder="Cari berdasarkan judul atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Course
            </label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Semua Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <LoadingTable rows={6} columns={4} />
        ) : filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {assignment.course?.name || "Course tidak diketahui"}
                  </p>
                </div>
              </div>

              <div className="mb-4 h-16">
                <p className="text-gray-700 text-sm line-clamp-3">
                  {assignment.description || "Tidak ada deskripsi"}
                </p>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                <p>
                  <span className="font-medium">Deadline:</span>{" "}
                  {new Date(assignment.due_date).toLocaleDateString("id-ID", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="mt-auto">
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    to={`/lecturer/assignments/${assignment.id}/edit`}
                    className="text-center px-2 py-2 bg-blue-50 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/lecturer/assignments/${assignment.id}/submissions`}
                    className="text-center px-2 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-md hover:bg-green-100 transition-colors"
                  >
                    Nilai
                  </Link>
                  <button
                    onClick={() => handleDeleteAssignment(assignment.id || 0)}
                    className="px-2 py-2 bg-red-50 text-red-700 text-xs font-medium rounded-md hover:bg-red-100 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Belum ada tugas
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat tugas baru untuk course Anda.
                </p>
                <div className="mt-6">
                  <Link to="/lecturer/assignments/create">
                    <Button>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Buat Tugas Baru
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
