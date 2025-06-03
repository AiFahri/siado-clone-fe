import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import { adminApi, handleApiError } from "@/Utils/api";

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "lecturer" | "student";
}

export default function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateUserForm>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "student",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      newErrors.name = "Nama wajib diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Konfirmasi password tidak cocok";
    }

    if (!formData.role) {
      newErrors.role = "Role wajib dipilih";
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
      await adminApi.users.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      alert("User berhasil dibuat!");
      navigate("/admin/users");
    } catch (error) {
      console.error("Error creating user:", error);
      setErrors({ general: handleApiError(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Tambah User Baru">
      <Head title="Tambah User - Admin" />

      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <Input
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="Masukkan nama lengkap"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="user@example.com"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.role ? "border-red-300" : "border-gray-300"
                }`}
                required
              >
                <option value="student">Mahasiswa</option>
                <option value="lecturer">Dosen</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="Minimal 6 karakter"
            />

            <Input
              label="Konfirmasi Password"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              error={errors.password_confirmation}
              required
              placeholder="Ulangi password"
            />

            <div className="flex items-center justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/admin/users")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan User"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Informasi Role
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mr-3 mt-0.5">
                Dosen
              </span>
              <span>
                Dapat mengelola course yang diampu, membuat tugas, dan menilai
                pengumpulan mahasiswa
              </span>
            </div>
            <div className="flex items-start">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mr-3 mt-0.5">
                Mahasiswa
              </span>
              <span>
                Dapat mengakses course yang diikuti, mengumpulkan tugas, dan
                melihat nilai
              </span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
