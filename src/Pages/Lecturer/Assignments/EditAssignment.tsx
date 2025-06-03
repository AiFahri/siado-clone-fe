import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import type { Assignment } from "@/types/assignment";
import { lecturerApi, handleApiError } from "@/Utils/api";

interface EditAssignmentForm {
  title: string;
  description: string;
  due_date: string;
}

export default function EditAssignment() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState<EditAssignmentForm>({
    title: "",
    description: "",
    due_date: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssignment = useCallback(async () => {
    if (!assignmentId) return;

    try {
      setIsLoading(true);
      const assignmentData = await lecturerApi.assignments.getById(
        parseInt(assignmentId)
      );
      setAssignment(assignmentData);

      setFormData({
        title: assignmentData.title || "",
        description: assignmentData.description || "",
        due_date: assignmentData.due_date
          ? assignmentData.due_date.slice(0, 16)
          : "",
      });
    } catch (err) {
      setErrors({ general: handleApiError(err) });
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId, fetchAssignment]);

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
      newErrors.title = "Judul tugas wajib diisi";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi tugas wajib diisi";
    }

    if (!formData.due_date) {
      newErrors.due_date = "Deadline wajib diisi";
    } else {
      const dueDate = new Date(formData.due_date);
      const now = new Date();
      if (dueDate <= now) {
        newErrors.due_date = "Deadline harus di masa depan";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !assignmentId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
      };

      await lecturerApi.assignments.update(parseInt(assignmentId), updateData);

      alert("Tugas berhasil diupdate!");
      navigate("/lecturer/assignments");
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

  if (!assignment) {
    return (
      <DashboardLayout title="Tugas Tidak Ditemukan">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Tugas tidak ditemukan</p>
            <Button
              onClick={() => navigate("/lecturer/assignments")}
              className="mt-4"
            >
              Kembali ke Daftar Tugas
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Tugas">
      <Head title="Edit Tugas - Dosen" />

      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Edit Tugas</h2>
            <p className="text-gray-600">Update informasi tugas</p>
          </div>

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
                Deskripsi Tugas <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Jelaskan detail tugas yang harus dikerjakan mahasiswa..."
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <Input
              label="Deadline"
              name="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={handleChange}
              error={errors.due_date}
              required
            />

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
                {isSubmitting ? "Menyimpan..." : "Update Tugas"}
              </Button>
            </div>
          </form>
        </Card>

        {assignment && (
          <Card className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Informasi Tugas
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Course:</span>{" "}
                {assignment.course?.name || "Tidak diketahui"}
              </p>
              <p>
                <span className="font-medium">Dibuat:</span>{" "}
                {new Date(assignment.created_at || "").toLocaleDateString(
                  "id-ID"
                )}
              </p>
              <p>
                <span className="font-medium">Terakhir diupdate:</span>{" "}
                {new Date(assignment.updated_at || "").toLocaleDateString(
                  "id-ID"
                )}
              </p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
