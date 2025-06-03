import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import type { Assignment } from "@/types/assignment"; 
import type { Course } from "@/types";
import { lecturerApi, handleApiError } from "@/Utils/api";

export default function CourseAssignments() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const fetchData = async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      setError("");

      const courses = await lecturerApi.getCourses();
      let coursesArray: Course[] = [];
      if (Array.isArray(courses)) {
        coursesArray = courses as Course[];
      } else if (courses && "data" in courses) {
        coursesArray = (courses as { data: Course[] }).data;
      }

      const courseData = coursesArray.find((c) => c.id === parseInt(courseId));
      setCourse(courseData || null);

      const assignmentsData = await lecturerApi.assignments.getByCourse(
        parseInt(courseId)
      );
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?") || !courseId) {
      return;
    }

    try {
      await lecturerApi.assignments.delete(parseInt(courseId), assignmentId);
      setAssignments((prev) =>
        prev.filter((assignment) => assignment.id !== assignmentId)
      );
      alert("Tugas berhasil dihapus!");
    } catch (err) {
      alert("Gagal menghapus tugas: " + handleApiError(err));
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Memuat...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout title="Course Tidak Ditemukan">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Course tidak ditemukan</p>
            <Button onClick={() => window.history.back()} className="mt-4">
              Kembali
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Tugas - ${course.name}`}>
      <Head title={`Tugas ${course.name} - Dosen`} />

      <Card className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {course.name}
            </h2>
            <p className="text-gray-600 mb-4">{course.code}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{course.credits ?? 3} SKS</span>
              <span>{course.students_count ?? 0} Mahasiswa</span>
            </div>
          </div>
          <Link
            to={`/lecturer/assignments/create?courseId=${courseId}`}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
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
          </Link>
        </div>
      </Card>

      {error && (
        <Card className="bg-red-50 border-red-200 mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                  {assignment.title}
                </h3>
              </div>

              <div className="mb-4 h-16 flex-1">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Belum ada tugas
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat tugas pertama untuk course ini.
                </p>
                <div className="mt-6">
                  <Link
                    to={`/lecturer/assignments/create?courseId=${courseId}`}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                  >
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
