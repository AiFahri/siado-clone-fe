import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import type { AssignmentSubmission, Assignment } from "@/types/assignment";
import { lecturerApi, handleApiError } from "@/Utils/api";
import { fileStorage } from "@/Utils/supabase";

interface GradeForm {
  grade: string;
  feedback: string;
}

export default function GradeSubmission() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(
    null
  );
  const [formData, setFormData] = useState<GradeForm>({
    grade: "",
    feedback: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSubmission = useCallback(async () => {
    if (!submissionId) return;

    try {
      setIsLoading(true);

      const assignments = await lecturerApi.assignments.getAll();
      let foundSubmission: AssignmentSubmission | null = null;

      const validAssignments = assignments.filter(
        (assignment: Assignment) => !Array.isArray(assignment) && assignment.id
      );

      if (validAssignments.length > 0) {
        const submissionPromises = validAssignments.map(
          async (assignment: Assignment) => {
            try {
              const submissions = await lecturerApi.assignments.getSubmissions(
                assignment.id!
              );
              const rawSubmission = submissions.find(
                (s: AssignmentSubmission) => s.id === parseInt(submissionId)
              );

              if (rawSubmission) {
                return {
                  submission: {
                    ...rawSubmission,
                    student: rawSubmission.student,
                    file_path: rawSubmission.file_path,
                    file_name: rawSubmission.file_name,
                    submitted_at: rawSubmission.submitted_at,
                    content: rawSubmission.content,
                  } as AssignmentSubmission,
                  assignment,
                  found: true,
                };
              }
              return { submission: null, assignment, found: false };
            } catch {
              return { submission: null, assignment, found: false };
            }
          }
        );

        const submissionResults = await Promise.allSettled(submissionPromises);

        for (const result of submissionResults) {
          if (result.status === "fulfilled" && result.value.found) {
            foundSubmission = result.value.submission;
            (
              foundSubmission as unknown as { assignment: Assignment }
            ).assignment = result.value.assignment;
            break;
          }
        }
      }

      if (foundSubmission) {
        setSubmission(foundSubmission);

        if (
          foundSubmission.grade !== null &&
          foundSubmission.grade !== undefined
        ) {
          setFormData({
            grade: foundSubmission.grade.toString(),
            feedback: foundSubmission.feedback || "",
          });
        }
      } else {
        setErrors({ general: "Submission tidak ditemukan" });
      }
    } catch (err) {
      setErrors({ general: handleApiError(err) });
    } finally {
      setIsLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId, fetchSubmission]);

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

    if (!formData.grade.trim()) {
      newErrors.grade = "Nilai wajib diisi";
    } else {
      const grade = parseFloat(formData.grade);
      if (isNaN(grade) || grade < 0 || grade > 100) {
        newErrors.grade = "Nilai harus berupa angka antara 0-100";
      }
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = "Feedback wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !submissionId) {
      return;
    }

    setIsSubmitting(true);

    try {
      await lecturerApi.assignments.gradeSubmission(parseInt(submissionId), {
        grade: parseFloat(formData.grade),
        feedback: formData.feedback,
      });

      alert("Nilai berhasil disimpan!");
      navigate(-1);
    } catch (error) {
      setErrors({ general: handleApiError(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadFile = async () => {
    if (!submission?.file_path) return;

    try {
      const blob = await fileStorage.downloadFile(submission.file_path);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = submission.file_name || "submission";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert("Gagal mengunduh file");
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 80) return "text-green-600";
    if (grade >= 70) return "text-blue-600";
    if (grade >= 60) return "text-yellow-600";
    return "text-red-600";
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

  if (!submission) {
    return (
      <DashboardLayout title="Pengumpulan Tidak Ditemukan">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Pengumpulan tidak ditemukan</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Kembali
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Beri Nilai Pengumpulan">
      <Head title="Beri Nilai - Dosen" />

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Pengumpulan dari {submission.student?.name}
              </h2>
              <p className="text-gray-600">{submission.student?.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Dikumpulkan:{" "}
                {new Date(submission.submitted_at || "").toLocaleDateString(
                  "id-ID",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </p>
            </div>
            {submission.grade !== null && submission.grade !== undefined && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Nilai Saat Ini:</p>
                <p
                  className={`text-2xl font-bold ${getGradeColor(
                    submission.grade
                  )}`}
                >
                  {submission.grade}
                </p>
              </div>
            )}
          </div>

          {submission.content && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Konten Pengumpulan:
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {submission.content}
                </p>
              </div>
            </div>
          )}

          {submission.file_path && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                File Lampiran:
              </h3>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 18h12V6l-4-4H4v16zm8-14l2 2h-2V4z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {submission.file_name}
                  </p>
                  <p className="text-xs text-gray-500">Klik untuk mengunduh</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownloadFile}
                >
                  Download
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {submission.grade !== null && submission.grade !== undefined
              ? "Edit Nilai"
              : "Beri Nilai"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <Input
              label="Nilai (0-100)"
              name="grade"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.grade}
              onChange={handleChange}
              error={errors.grade}
              required
              placeholder="Masukkan nilai antara 0-100"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.feedback ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Berikan feedback untuk mahasiswa..."
                required
              />
              {errors.feedback && (
                <p className="mt-1 text-sm text-red-600">{errors.feedback}</p>
              )}
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Nilai"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
