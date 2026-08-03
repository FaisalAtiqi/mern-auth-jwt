import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RequestVerificationEmail from "./pages/RequestVerificationEmail";
import { Toaster } from "sonner";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import GuestLayout from "./layouts/GuestLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

function App() {
  return (
    <>
      <Routes>
        {/* Protected app routes (requires auth) */}
        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Guest-only routes (redirect to home if logged in) */}
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Public auth-related routes (accessible regardless of login state) */}
        <Route path="/email/verify/:code?" element={<VerifyEmail />} />
        <Route
          path="/email/verify/request"
          element={<RequestVerificationEmail />}
        />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset" element={<ResetPassword />} />
      </Routes>

      <Toaster position="top-center" />
    </>
  );
}

export default App;
