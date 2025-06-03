import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import type { Course } from "@/types";
import { lecturerApi, handleApiError } from "@/Utils/api";

interface Material {
  id: number;
  title: string;
  content: string;
  course_id: number;
  created_at: string;
  updated_at: string;
}

export default function MaterialList() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

      const [courseData, materialsData] = await Promise.all([
        lecturerApi
          .getCourses()
          .then((courses) =>
            Array.isArray(courses)
              ? courses.find((c) => c.id === parseInt(courseId))
              : null
          ),
        lecturerApi.materials.getByCourse(parseInt(courseId)),
      ]);

      setCourse(courseData || null);
      setMaterials(Array.isArray(materialsData) ? materialsData : []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    if (
      !confirm("Apakah Anda yakin ingin menghapus materi ini?") ||
      !courseId
    ) {
      return;
    }

    try {
      await lecturerApi.materials.delete(parseInt(courseId), materialId);
      setMaterials((prev) =>
        prev.filter((material) => material.id !== materialId)
      );
      alert("Materi berhasil dihapus!");
    } catch (err) {
      alert("Gagal menghapus materi: " + handleApiError(err));
    }
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Link to="/lecturer/courses">
              <Button className="mt-4">Kembali ke Daftar Course</Button>
            </Link>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Materi - ${course.name}`}>
      <Head title={`Materi ${course.name} - Dosen`} />

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Materi Course</h1>
            <p className="text-gray-600">
              {course.code} - {course.name}
            </p>
          </div>
          <Link to="/lecturer/courses">
            <Button variant="secondary">Kembali ke Course</Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-600 mb-4 sm:mb-0">
            Kelola materi pembelajaran untuk course ini
          </p>
          <Link to={`/lecturer/courses/${courseId}/materials/create`}>
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
              Tambah Materi
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
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
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800"
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
          label="Cari Materi"
          placeholder="Cari berdasarkan judul atau konten..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <div className="space-y-4">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <Card
              key={material.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {material.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {material.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    Dibuat:{" "}
                    {new Date(material.created_at).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to={`/lecturer/courses/${courseId}/materials/${material.id}/edit`}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteMaterial(material.id)}
                    className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-md hover:bg-red-100 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
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
                Belum ada materi
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Mulai dengan menambahkan materi pembelajaran untuk course ini.
              </p>
              <div className="mt-6">
                <Link to={`/lecturer/courses/${courseId}/materials/create`}>
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
                    Tambah Materi
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
