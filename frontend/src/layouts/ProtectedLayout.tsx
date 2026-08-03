import PageLoader from "@/components/common/PageLoader";
import { UserMenu } from "@/components/UserMenu";
import { useCurrentUser } from "@/providers/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedLayout() {
  const { isLoading, user, isError } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !user) {
    // Send them to login, and tell login exactly where they are right now
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed bottom-4 left-4 z-50">
        <UserMenu user={user} />
      </div>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default ProtectedLayout;
