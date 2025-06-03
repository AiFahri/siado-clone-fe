import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import type { Course } from "@/types";
import { lecturerApi, handleApiError } from "@/Utils/api";

interface CreateAssignmentForm {
  title: string;
  description: string;
  due_date: string;
  course_id: string;
}

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState<CreateAssignmentForm>({
    title: "",
    description: "",
    due_date: "",
    course_id: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoadingCourses(true);
      const courseData = await lecturerApi.getCourses();
      setCourses(courseData);
      if (courseData.length === 1) {
        setFormData((prev) => ({
          ...prev,
          course_id: courseData[0].id.toString(),
        }));
      }
    } catch (err) {
      setErrors({ general: handleApiError(err) });
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Judul tugas wajib diisi";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi tugas wajib diisi";
    }

    if (!formData.due_date) {
      newErrors.due_date = "Tanggal deadline wajib diisi";
    } else {
      const dueDate = new Date(formData.due_date);
      const now = new Date();
      if (dueDate <= now) {
        newErrors.due_date = "Tanggal deadline harus di masa depan";
      }
    }

    if (!formData.course_id) {
      newErrors.course_id = "Course wajib dipilih";
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
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
      };

      await lecturerApi.assignments.create(
        parseInt(formData.course_id),
        assignmentData
      );

      alert("Tugas berhasil dibuat!");
      navigate("/lecturer/assignments");
    } catch (error) {
      setErrors({ general: handleApiError(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  };

  return (
    <DashboardLayout title="Buat Tugas Baru">
      <Head title="Buat Tugas - Dosen" />

      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <Input
              label="Judul Tugas"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              placeholder="Masukkan judul tugas"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course <span className="text-red-500">*</span>
              </label>
              {isLoadingCourses ? (
                <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
              ) : (
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.course_id ? "border-red-300" : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Pilih Course</option>
                  {Array.isArray(courses) &&
                    courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                </select>
              )}
              {errors.course_id && (
                <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Jelaskan detail tugas yang harus dikerjakan mahasiswa"
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                min={getMinDate()}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.due_date ? "border-red-300" : "border-gray-300"
                }`}
                required
              />
              {errors.due_date && (
                <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
              )}
            </div>

            {/* <FileUpload
              label="Lampiran (Opsional)"
              description="Upload file pendukung untuk tugas ini"
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              acceptedTypes={[
                ...fileValidation.fileTypes.documents,
                ...fileValidation.fileTypes.images,
                ...fileValidation.fileTypes.archives,
              ]}
              maxSizeMB={10}
              currentFile={
                attachmentFile
                  ? {
                      name: attachmentFile.name,
                      size: attachmentFile.size,
                    }
                  : undefined
              }
              error={errors.attachment}
            /> */}

            <div className="flex items-center justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/lecturer/assignments")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Tugas"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
