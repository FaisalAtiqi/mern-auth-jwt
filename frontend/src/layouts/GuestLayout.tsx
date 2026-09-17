import PageLoader from "@/components/common/PageLoader";
import { useCurrentUser } from "@/providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function GuestLayout() {
  const { isLoading, user } = useCurrentUser();

  if (isLoading) {
    return <PageLoader />;
  }

  // If the user is already logged in, redirect them to the home page.
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default GuestLayout;
