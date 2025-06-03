import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Input from "@/Components/Common/Input";
import type { Course } from "@/types";
import { handleApiError } from "@/Utils/api";
import { getGlobalCourses, getGlobalStats } from "@/Utils/globalStore";

export default function LecturerCourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [courseData, statsData] = await Promise.all([
        getGlobalCourses(),
        getGlobalStats(),
      ]);

      const coursesArray = Array.isArray(courseData) ? courseData : [];
      const totalStudents = statsData.total_students || 0;
      const avgStudentsPerCourse =
        coursesArray.length > 0
          ? Math.round(totalStudents / coursesArray.length)
          : 0;

      setCourses(
        coursesArray.map((course: Course) => ({
          ...course,
          students_count: course.students_count || avgStudentsPerCourse,
          students: [],
        }))
      );
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

  return (
    <DashboardLayout title="Mata Kuliah Saya">
      <Head title="Mata Kuliah Saya - Dosen" />

      <div className="mb-6">
        <p className="text-gray-600">Kelola Mata Kuliah yang Anda ampu</p>
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
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </Card>
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-600">{course.code}</p>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {course.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {course.credits || 3}
                  </p>
                  <p className="text-xs text-gray-600">SKS</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {course.students_count || 0}
                  </p>
                  <p className="text-xs text-gray-600">Mahasiswa</p>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to={`/lecturer/courses/${course.id}`}
                  className="block w-full text-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Lihat Detail
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/lecturer/courses/${course.id}/assignments`}
                    className="text-center px-3 py-2 bg-blue-50 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Tugas
                  </Link>
                  <Link
                    to={`/lecturer/courses/${course.id}/materials`}
                    className="text-center px-3 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-md hover:bg-green-100 transition-colors"
                  >
                    Materi
                  </Link>
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Belum ada course
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Anda belum ditugaskan ke course manapun. Hubungi admin untuk
                  penugasan course.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
