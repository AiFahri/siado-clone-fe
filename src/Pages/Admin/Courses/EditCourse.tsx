import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import type { Course } from "@/types";
import { adminApi, handleApiError } from "@/Utils/api";

interface EditCourseForm {
  name: string;
  code: string;
  credits: string;
}

export default function EditCourse() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<EditCourseForm>({
    name: "",
    code: "",
    credits: "3",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;

    try {
      setIsLoading(true);
      const courseData = await adminApi.courses.getById(parseInt(courseId));
      setCourse(courseData);

      setFormData({
        name: courseData.name || "",
        code: courseData.code || "",
        credits: courseData.credits?.toString() || "3",
      });
    } catch (err) {
      setErrors({ general: handleApiError(err) });
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, fetchCourse]);
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

    if (!formData.name.trim()) {
      newErrors.name = "Nama course wajib diisi";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Kode course wajib diisi";
    }

    if (!formData.credits) {
      newErrors.credits = "SKS wajib diisi";
    } else {
      const credits = parseInt(formData.credits);
      if (isNaN(credits) || credits < 1 || credits > 6) {
        newErrors.credits = "SKS harus berupa angka antara 1-6";
      }
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
      const courseData = {
        name: formData.name,
        code: formData.code,
        credits: parseInt(formData.credits),
      };

      await adminApi.courses.update(parseInt(courseId), courseData);

      alert("Course berhasil diupdate!");
      navigate("/admin/courses");
    } catch (error) {
      setErrors({ general: handleApiError(error) });
    } finally {
      setIsSubmitting(false);
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
            <Button onClick={() => navigate("/admin/courses")} className="mt-4">
              Kembali ke Daftar Course
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Course">
      <Head title="Edit Course - Admin" />

      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Edit Course</h2>
            <p className="text-gray-600">Update informasi course</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <Input
              label="Nama Course"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="Masukkan nama course"
            />

            <Input
              label="Kode Course"
              name="code"
              value={formData.code}
              onChange={handleChange}
              error={errors.code}
              required
              placeholder="Contoh: IF301"
            />

            <Input
              label="SKS (Satuan Kredit Semester)"
              name="credits"
              type="number"
              value={formData.credits}
              onChange={handleChange}
              error={errors.credits}
              required
              placeholder="3"
              min="1"
              max="6"
            />

            <div className="flex items-center justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/admin/courses")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Update Course"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <svg
                className="w-5 h-5 text-yellow-600 mr-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Backend API Belum Tersedia
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Fitur edit course memerlukan endpoint PATCH
                  /api/admin/courses/{"{id}"} di backend Laravel. Silakan
                  tambahkan route dan controller method untuk update course.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
