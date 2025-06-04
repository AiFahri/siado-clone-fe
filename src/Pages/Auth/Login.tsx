import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Head from "@/Components/Common/Head";
import Button from "@/Components/Common/Button";
import Input from "@/Components/Common/Input";
import Card from "@/Components/Common/Card";
import FullPageLoader from "@/Components/UI/LoadingSpinner";

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Login gagal",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head title="Masuk - Siado" />

      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="/favicon.ico" alt="Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Masuk ke Akun Anda
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistem Akademik Dosen
          </p>
        </div>

        <Card className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
              placeholder="dosen@ub.ac.id"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
              placeholder="123123123"
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Masuk..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Masukkan kredensial yang valid untuk mengakses sistem, bisa
              menggunakan akun admin atau dosen.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
