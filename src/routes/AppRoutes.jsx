import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "@/shared/components/Loader";
import MainLayout from "@/shared/layouts/MainLayout";

// Auth
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import ProtectedRoute from "@/features/auth/routes/ProtectedRoute";
import AdminRoute from "@/features/auth/routes/AdminRoute";

// Jobs
import Jobs from "@/features/jobs/pages/Jobs";
import JobDetails from "@/features/jobs/pages/JobDetails";

// Applications
import Applications from "@/features/applications/pages/Applications";

// Messaging — one Inbox/ThreadPage pair, reused by both roles via `variant`
import Inbox from "@/features/messaging/pages/Inbox";
import ThreadPage from "@/features/messaging/pages/ThreadPage";

// Profile
import Profile from "@/features/profile/pages/Profile";
import PublicProfile from "@/features/profile/pages/PublicProfile";

// Admin
// Dashboard is lazy-loaded because it pulls in `recharts`, a fairly heavy
// charting library — only admins need it, so regular job seekers never
// download that extra weight.
const Dashboard = lazy(() => import("@/features/admin/pages/Dashboard"));
import AdminJobs from "@/features/admin/pages/Jobs";
import CreateJob from "@/features/admin/pages/CreateJob";
import EditJob from "@/features/admin/pages/EditJob";
import Applicants from "@/features/admin/pages/Applicants";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes WITH Navbar/Layout */}
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route path="/" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Protected (logged-in users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/users/:id" element={<PublicProfile />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/messages" element={<Inbox variant="candidate" />} />
          <Route path="/messages/:id" element={<ThreadPage variant="candidate" />} />
        </Route>

        {/* Admin only — fixed: EditJob now correctly guarded + inside layout */}
        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={
              <Suspense fallback={<Loader label="Loading dashboard..." />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/jobs/create" element={<CreateJob />} />
          <Route path="/admin/jobs/:id/edit" element={<EditJob />} />
          <Route path="/admin/jobs/:id/applicants" element={<Applicants />} />
          <Route path="/admin/messages" element={<Inbox variant="recruiter" />} />
          <Route path="/admin/messages/:id" element={<ThreadPage variant="recruiter" />} />
        </Route>
      </Route>

      {/* Routes WITHOUT Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
