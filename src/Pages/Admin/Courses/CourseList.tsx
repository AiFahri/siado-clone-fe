import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import type { Course } from "@/types";
import { adminApi, handleApiError, clearApiCache } from "@/Utils/api";

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      clearApiCache("admin-courses");
      setIsLoading(true);
      setError("");

      const courseData = await adminApi.courses.getAll();

      const coursesArray = Array.isArray(courseData) ? courseData : [];

      const enrichedCourses = await Promise.all(
        coursesArray.map(async (course: Course) => {
          try {
            const [lecturers, students] = await Promise.all([
              adminApi.courses.getLecturers(course.id).catch(() => []),
              adminApi.courses.getEnrolledStudents(course.id).catch(() => []),
            ]);

            return {
              ...course,
              lecturers: Array.isArray(lecturers) ? lecturers : [],
              students_count: Array.isArray(students) ? students.length : 0,
            };
          } catch {
            return {
              ...course,
              lecturers: [],
              students_count:
                ((course as unknown as Record<string, unknown>)
                  .students_count as number) || 0,
            };
          }
        })
      );

      setCourses(enrichedCourses);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = Array.isArray(courses)
    ? courses.filter((course) => {
        return (
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.description &&
            course.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      })
    : [];

  const handleDeleteCourse = async (courseId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus course ini?")) {
      try {
        await adminApi.courses.delete(courseId);
        setCourses((prev) => prev.filter((course) => course.id !== courseId));
      } catch (err) {
        alert(handleApiError(err));
      }
    }
  };

  return (
    <DashboardLayout title="Manajemen Course">
      <Head title="Manajemen Course - Admin" />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <p className="text-gray-600">Kelola semua course dalam sistem</p>
        </div>
        <Link to="/admin/courses/create">
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
            Tambah Course
          </Button>
        </Link>
      </div>

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
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </Card>
      )}

      <Card className="mb-6">
        <Input
          label="Cari Course"
          placeholder="Cari berdasarkan nama, kode, atau deskripsi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </Card>
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600">{course.code}</p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <Link
                    to={`/admin/courses/${course.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{course.credits || 3} SKS</span>
                <span>{course.students_count || 0} mahasiswa</span>
              </div>

              <div className="border-t pt-4 flex-1">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Dosen Pengampu:
                </p>
                <div className="h-16 overflow-hidden">
                  {course.lecturers && course.lecturers.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {course.lecturers.slice(0, 3).map((lecturer) => (
                        <span
                          key={lecturer.id}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {lecturer.name}
                        </span>
                      ))}
                      {course.lecturers.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          +{course.lecturers.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      Belum ada dosen yang ditugaskan
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <Link
                  to={`/admin/courses/${course.id}/lecturers`}
                  className="text-xs text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Kelola Dosen
                </Link>
                <Link
                  to={`/admin/courses/${course.id}/students`}
                  className="text-xs text-green-600 hover:text-green-900 font-medium"
                >
                  Kelola Mahasiswa
                </Link>
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Tidak ada course
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat course baru.
                </p>
                <div className="mt-6">
                  <Link to="/admin/courses/create">
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
                      Tambah Course
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
