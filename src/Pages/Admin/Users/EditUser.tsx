import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/Components/Layout/DashboardLayout";
import Head from "@/Components/Common/Head";
import Card from "@/Components/Common/Card";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import type { User } from "@/types";
import { adminApi, handleApiError } from "@/Utils/api";

interface EditUserForm {
  name: string;
  email: string;
  password: string;
  role: "student" | "lecturer";
}

export default function EditUser() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<EditUserForm>({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const users = await adminApi.users.getAll();
      const userData = Array.isArray(users)
        ? users.find((u) => u.id === parseInt(userId))
        : null;

      if (userData) {
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          password: "",
          role: userData.role as "student" | "lecturer",
        });
      }
    } catch (err) {
      setErrors({ general: handleApiError(err) });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);
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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (!formData.role) {
      newErrors.role = "Role wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !userId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: Partial<User> & { password?: string } = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      await adminApi.users.update(parseInt(userId), updateData);

      alert("User berhasil diupdate!");
      navigate("/admin/users");
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

  if (!user) {
    return (
      <DashboardLayout title="User Tidak Ditemukan">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">User tidak ditemukan</p>
            <Button onClick={() => navigate("/admin/users")} className="mt-4">
              Kembali ke Daftar User
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit User">
      <Head title="Edit User - Admin" />

      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
            <p className="text-gray-600">Update informasi user</p>
          </div>

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
              placeholder="Masukkan email"
            />

            <Input
              label="Password Baru (Opsional)"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Kosongkan jika tidak ingin mengubah password"
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
                {isSubmitting ? "Menyimpan..." : "Update User"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • Password bersifat opsional - kosongkan jika tidak ingin mengubah
            </p>
            <p>• Email harus unik dan belum digunakan user lain</p>
            <p>• Perubahan role akan mempengaruhi akses user ke sistem</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
