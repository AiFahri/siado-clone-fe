import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import type { Course, User } from "@/types";
import { adminApi, handleApiError } from "@/Utils/api";

export default function ManageStudents() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState<number | null>(null);
  const [isUnenrolling, setIsUnenrolling] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const fetchData = useCallback(async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      setError("");

      const [courseData, users] = await Promise.all([
        adminApi.courses.getById(parseInt(courseId)),
        adminApi.users.getAll(),
      ]);

      setCourse(courseData);

      const students = Array.isArray(users)
        ? users.filter((user) => user.role === "student")
        : [];

      setAllStudents(students);

      try {
        const enrolledData = await adminApi.courses.getEnrolledStudents(
          parseInt(courseId)
        );
        setEnrolledStudents(Array.isArray(enrolledData) ? enrolledData : []);
      } catch {
        setEnrolledStudents([]);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId, fetchData]);

  const handleEnrollStudent = async (studentId: number) => {
    if (!courseId) return;

    setIsEnrolling(studentId);
    try {
      await adminApi.courses.enrollStudent(parseInt(courseId), studentId);

      await fetchData();

      alert("Mahasiswa berhasil didaftarkan ke course!");
    } catch (err) {
      alert("Gagal mendaftarkan mahasiswa: " + handleApiError(err));
    } finally {
      setIsEnrolling(null);
    }
  };

  const handleUnenrollStudent = async (studentId: number) => {
    if (!courseId) return;

    if (
      !confirm(
        "Apakah Anda yakin ingin mengeluarkan mahasiswa dari course ini?"
      )
    ) {
      return;
    }

    setIsUnenrolling(studentId);
    try {
      await adminApi.courses.unenrollStudent(parseInt(courseId), studentId);

      await fetchData();

      alert("Mahasiswa berhasil dikeluarkan dari course!");
    } catch (err) {
      alert("Gagal mengeluarkan mahasiswa: " + handleApiError(err));
    } finally {
      setIsUnenrolling(null);
    }
  };

  const isStudentEnrolled = (studentId: number) => {
    return enrolledStudents.some((student) => student.id === studentId);
  };

  const getFilteredStudents = (enrolled: boolean) => {
    const students = enrolled
      ? enrolledStudents
      : allStudents.filter((student) => !isStudentEnrolled(student.id));

    if (!searchTerm) return students;

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (!course) {
    return (
      <DashboardLayout title="Course Tidak Ditemukan">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Course tidak ditemukan</p>
            <Button onClick={() => navigate("/admin/courses")} className="mt-4">
              Kembali ke Daftar Course
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Kelola Mahasiswa">
      <Head title="Kelola Mahasiswa - Admin" />

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Kelola Mahasiswa - {course.name}
              </h2>
              <p className="text-gray-600">{course.code}</p>
              <p className="text-sm text-gray-500 mt-1">{course.description}</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/courses")}
            >
              Kembali
            </Button>
          </div>
        </Card>

        {error && (
          <Card className="bg-red-50 border-red-200">
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

        <Card>
          <Input
            label="Cari Mahasiswa"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Mahasiswa Terdaftar ({getFilteredStudents(true).length})
          </h3>

          {getFilteredStudents(true).length > 0 ? (
            <div className="space-y-3">
              {getFilteredStudents(true).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUnenrollStudent(student.id)}
                    isLoading={isUnenrolling === student.id}
                    disabled={isUnenrolling === student.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {isUnenrolling === student.id
                      ? "Mengeluarkan..."
                      : "Keluarkan"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
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
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Belum ada mahasiswa
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Daftarkan mahasiswa untuk mengikuti course ini.
              </p>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Mahasiswa Tersedia ({getFilteredStudents(false).length})
          </h3>

          {getFilteredStudents(false).length > 0 ? (
            <div className="space-y-3">
              {getFilteredStudents(false).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleEnrollStudent(student.id)}
                    isLoading={isEnrolling === student.id}
                    disabled={isEnrolling === student.id}
                  >
                    {isEnrolling === student.id
                      ? "Mendaftarkan..."
                      : "Daftarkan"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Semua mahasiswa sudah terdaftar
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tidak ada mahasiswa lain yang tersedia untuk didaftarkan.
              </p>
            </div>
          )}
        </Card>

        <Card>
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <svg
                className="w-5 h-5 text-green-600 mr-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
