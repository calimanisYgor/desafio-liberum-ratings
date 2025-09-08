import { Layout } from "@/components/Layout";
import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: ("admin" | "user")[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore.getState();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Layout />
    </>
  );
};
