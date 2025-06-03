import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import type { User } from "@/types";
import { adminApi, handleApiError } from "@/Utils/api";

interface CreateCourseForm {
  name: string;
  code: string;
  credits: string;
  lecturer_ids: number[];
}

export default function CreateCourse() {
  const navigate = useNavigate();
  const [lecturers, setLecturers] = useState<User[]>([]);
  const [formData, setFormData] = useState<CreateCourseForm>({
    name: "",
    code: "",
    credits: "3",
    lecturer_ids: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLecturers, setIsLoadingLecturers] = useState(true);

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      setIsLoadingLecturers(true);
      const users = await adminApi.users.getAll();
      const lecturerUsers = Array.isArray(users)
        ? users.filter((user) => user.role === "lecturer")
        : [];
      setLecturers(lecturerUsers);
    } catch (err) {
      console.error("Error fetching lecturers:", err);
      setErrors({ general: handleApiError(err) });
    } finally {
      setIsLoadingLecturers(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLecturerToggle = (lecturerId: number) => {
    setFormData((prev) => ({
      ...prev,
      lecturer_ids: prev.lecturer_ids.includes(lecturerId)
        ? prev.lecturer_ids.filter((id) => id !== lecturerId)
        : [...prev.lecturer_ids, lecturerId],
    }));
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🚀 Submitting course form data:", formData);

      const courseData = {
        name: formData.name,
        code: formData.code,
        credits: parseInt(formData.credits),
      };

      console.log("📤 Course data to be sent:", courseData);

      const course = await adminApi.courses.create(courseData);
      console.log("✅ Course created successfully:", course);

      if (formData.lecturer_ids.length > 0 && course.id) {
        await Promise.all(
          formData.lecturer_ids.map((lecturerId) =>
            adminApi.courses.assignLecturer(course.id, lecturerId)
          )
        );
      }

      alert("Course berhasil dibuat!");
      navigate("/admin/courses");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Tambah Course Baru">
      <Head title="Tambah Course - Admin" />

      <div className="max-w-2xl mx-auto">
        <Card>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosen Pengampu (Opsional)
              </label>
              {isLoadingLecturers ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-200 h-12 rounded"></div>
                  ))}
                </div>
              ) : lecturers.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                  {lecturers.map((lecturer) => (
                    <label
                      key={lecturer.id}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.lecturer_ids.includes(lecturer.id)}
                        onChange={() => handleLecturerToggle(lecturer.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {lecturer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lecturer.email}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Belum ada dosen yang tersedia
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Pilih dosen yang akan mengampu course ini. Anda dapat
                menambah/mengurangi dosen nanti.
              </p>
            </div>

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
                {isSubmitting ? "Menyimpan..." : "Simpan Course"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Informasi Course
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <strong>Kode Course:</strong> Gunakan format yang konsisten,
              contoh: IF301, CS101, dll.
            </div>
            <div>
              <strong>Dosen Pengampu:</strong> Anda dapat menambahkan beberapa
              dosen untuk satu course. Dosen yang dipilih akan dapat mengakses
              course ini.
            </div>
            <div>
              <strong>SKS:</strong> Satuan Kredit Semester, biasanya antara 1-6
              SKS per course.
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
