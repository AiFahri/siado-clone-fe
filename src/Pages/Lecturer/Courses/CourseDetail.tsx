import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import type { Course } from "@/types";
import { handleApiError } from "@/Utils/api";
import { getGlobalCourses, getGlobalStudents } from "@/Utils/globalStore";

interface Student {
  id: number;
  name: string;
  email: string;
}

interface CourseDetailData extends Course {
  students_count: number;
  students: Student[];
}

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseDetailData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const fetchCourseDetail = async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      setError("");

      // ULTIMATE OPTIMIZATION: Global store prevents duplicate calls!
      const [courses, studentData] = await Promise.all([
        getGlobalCourses(),
        getGlobalStudents(parseInt(courseId)),
      ]);

      const coursesArray = Array.isArray(courses) ? courses : [];
      const courseData = coursesArray.find((c) => c.id === parseInt(courseId));

      if (courseData) {
        const enrichedCourse: CourseDetailData = {
          ...courseData,
          students_count: studentData.count || 0,
          students: studentData.students || [],
        };

        setCourse(enrichedCourse);
        setStudents(studentData.students || []);
      } else {
        setError("Course tidak ditemukan");
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <DashboardLayout title={`Detail ${course.name}`}>
      <Head title={`Detail ${course.name} - Dosen`} />

      {/* Error Display */}
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

      {/* Course Header */}
      <Card className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {course.name}
            </h2>
            <p className="text-lg text-gray-600 mb-4">{course.code}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {course.credits || 3}
                </p>
                <p className="text-sm text-gray-600">SKS</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {course.students_count}
                </p>
                <p className="text-sm text-gray-600">Mahasiswa</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {filteredStudents.length}
                </p>
                <p className="text-sm text-gray-600">Ditampilkan</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 ml-6">
            <Link
              to={`/lecturer/courses/${course.id}/assignments`}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Kelola Tugas
            </Link>
            <Link
              to={`/lecturer/courses/${course.id}/materials`}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Kelola Materi
            </Link>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Mahasiswa ({course.students_count})
            </h3>
          </div>

          <div className="mb-4">
            <Input
              label="Cari Mahasiswa"
              placeholder="Cari berdasarkan nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Mahasiswa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Aktif
                      </span>
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {students.length === 0
                ? "Belum ada mahasiswa"
                : "Tidak ada mahasiswa yang sesuai pencarian"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {students.length === 0
                ? "Belum ada mahasiswa yang terdaftar di course ini."
                : "Coba ubah kata kunci pencarian Anda."}
            </p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
