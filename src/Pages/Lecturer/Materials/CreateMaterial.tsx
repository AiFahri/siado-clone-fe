import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import type { Course } from "@/types";
import { lecturerApi, handleApiError } from "@/Utils/api";

interface CreateMaterialForm {
  title: string;
  content: string;
}

export default function CreateMaterial() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CreateMaterialForm>({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      const courses = await lecturerApi.getCourses();
      const courseData = Array.isArray(courses)
        ? courses.find((c) => c.id === parseInt(courseId))
        : null;

      setCourse(courseData || null);
    } catch (err) {
      console.error("Error fetching course:", err);
      setErrors({ general: handleApiError(err) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Judul materi wajib diisi";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Konten materi wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !courseId) {
      return;
    }

    setIsSubmitting(true);

    try {
      await lecturerApi.materials.create(parseInt(courseId), {
        title: formData.title,
        content: formData.content,
      });

      alert("Materi berhasil dibuat!");
      navigate(`/lecturer/courses/${courseId}/materials`);
    } catch (error) {
      console.error("Error creating material:", error);
      setErrors({ general: handleApiError(error) });
    } finally {
      setIsSubmitting(false);
    }
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
            <Button
              onClick={() => navigate("/lecturer/courses")}
              className="mt-4"
            >
              Kembali ke Daftar Course
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tambah Materi">
      <Head title="Tambah Materi - Dosen" />

      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Tambah Materi Baru
            </h2>
            <p className="text-gray-600">
              {course.code} - {course.name}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <Input
              label="Judul Materi"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              placeholder="Masukkan judul materi"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konten Materi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.content ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Tulis konten materi pembelajaran di sini..."
                required
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Anda dapat menggunakan format teks biasa. Konten akan
                ditampilkan kepada mahasiswa.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  navigate(`/lecturer/courses/${courseId}/materials`)
                }
              >
                Batal
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Materi"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Tips Membuat Materi
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Gunakan judul yang jelas dan deskriptif</p>
            <p>• Susun konten secara terstruktur dan mudah dipahami</p>
            <p>• Sertakan contoh atau ilustrasi jika diperlukan</p>
            <p>• Pastikan konten sesuai dengan tujuan pembelajaran course</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
