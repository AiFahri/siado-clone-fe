import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FullPageLoader } from "@/Components/UI/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "lecturer";
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    const redirectPath =
      user?.role === "admin" ? "/admin/dashboard" : "/lecturer/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
