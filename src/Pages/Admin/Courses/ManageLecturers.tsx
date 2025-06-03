import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import type { Course, User } from "@/types";
import { adminApi, handleApiError } from "@/Utils/api";

export default function ManageLecturers() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [allLecturers, setAllLecturers] = useState<User[]>([]);
  const [assignedLecturers, setAssignedLecturers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

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

      const [courseData, users, assignedData] = await Promise.all([
        adminApi.courses.getById(parseInt(courseId)),
        adminApi.users.getAll(),
        adminApi.courses.getLecturers(parseInt(courseId)),
      ]);

      setCourse(courseData);

      const lecturers = Array.isArray(users)
        ? users.filter((user: User) => user.role === "lecturer")
        : (users as { data: User[] })?.data?.filter(
            (user: User) => user.role === "lecturer"
          ) || [];

      setAllLecturers(lecturers);
      setAssignedLecturers(Array.isArray(assignedData) ? assignedData : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignLecturer = async (lecturerId: number) => {
    if (!courseId) return;

    setIsAssigning(lecturerId);
    try {
      await adminApi.courses.assignLecturer(parseInt(courseId), lecturerId);

      const assignedData = await adminApi.courses.getLecturers(
        parseInt(courseId)
      );
      setAssignedLecturers(Array.isArray(assignedData) ? assignedData : []);

      alert("Dosen berhasil ditambahkan ke course!");
    } catch (err) {
      console.error("Error assigning lecturer:", err);
      alert("Gagal menambahkan dosen: " + handleApiError(err));
    } finally {
      setIsAssigning(null);
    }
  };

  const handleRemoveLecturer = async (lecturerId: number) => {
    if (!courseId) return;

    if (!confirm("Apakah Anda yakin ingin menghapus dosen dari course ini?")) {
      return;
    }

    setIsRemoving(lecturerId);
    try {
      await adminApi.courses.removeLecturer(parseInt(courseId), lecturerId);

      const assignedData = await adminApi.courses.getLecturers(
        parseInt(courseId)
      );
      setAssignedLecturers(Array.isArray(assignedData) ? assignedData : []);

      alert("Dosen berhasil dihapus dari course!");
    } catch (err) {
      console.error("Error removing lecturer:", err);
      alert("Gagal menghapus dosen: " + handleApiError(err));
    } finally {
      setIsRemoving(null);
    }
  };

  const isLecturerAssigned = (lecturerId: number) => {
    return assignedLecturers.some((lecturer) => lecturer.id === lecturerId);
  };

  const getUnassignedLecturers = () => {
    return allLecturers.filter((lecturer) => !isLecturerAssigned(lecturer.id));
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
    <DashboardLayout title="Kelola Dosen">
      <Head title="Kelola Dosen - Admin" />

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Kelola Dosen - {course.name}
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Dosen yang Mengajar ({assignedLecturers.length})
          </h3>

          {assignedLecturers.length > 0 ? (
            <div className="space-y-3">
              {assignedLecturers.map((lecturer) => (
                <div
                  key={lecturer.id}
                  className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {lecturer.name}
                      </p>
                      <p className="text-xs text-gray-500">{lecturer.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveLecturer(lecturer.id)}
                    isLoading={isRemoving === lecturer.id}
                    disabled={isRemoving === lecturer.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {isRemoving === lecturer.id ? "Menghapus..." : "Hapus"}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Belum ada dosen
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tambahkan dosen untuk mengajar course ini.
              </p>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Dosen Tersedia ({getUnassignedLecturers().length})
          </h3>

          {getUnassignedLecturers().length > 0 ? (
            <div className="space-y-3">
              {getUnassignedLecturers().map((lecturer) => (
                <div
                  key={lecturer.id}
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {lecturer.name}
                      </p>
                      <p className="text-xs text-gray-500">{lecturer.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAssignLecturer(lecturer.id)}
                    isLoading={isAssigning === lecturer.id}
                    disabled={isAssigning === lecturer.id}
                  >
                    {isAssigning === lecturer.id
                      ? "Menambahkan..."
                      : "Tambahkan"}
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
                Semua dosen sudah ditambahkan
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tidak ada dosen lain yang tersedia untuk ditambahkan.
              </p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
