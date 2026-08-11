import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUser } from "@/features/auth/auth.utils";

const AdminRoute = () => {
  const token = getToken();
  const user = getUser();

  if (!token || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;