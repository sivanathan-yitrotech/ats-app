import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Cookie from "js-cookie";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import JobTitle from "./pages/JobTitle";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Client from "./pages/Client";
import JobPosting from "./pages/JobPosting";
import Invoices from "./pages/Invoices";
import CandidatesStatus from "./pages/CandidatesStatus";
import AssignedPositions from "./pages/AssignedPositions";
import Interviews from "./pages/Interviews";
import Candidates from "./pages/Candidates";

// Component to guard authenticated routes and roles
const AuthenticatedRoute = ({
  element: Element,
  path,
  permission,
  role,
}: {
  element: React.ElementType;
  path: string;
  permission: Record<string, string[]>;
  role?: string;
}) => {
  const userCookie = Cookie.get("user");
  if (!userCookie) {
    // Not authenticated, redirect to login
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userCookie);
  const userRole = user.role;

  // Check permission for the route
  if (permission[userRole]?.includes(path)) {
    return <Element />;
  } else {
    // Unauthorized access - redirect to dashboard or 404 page
    return <Navigate to="/dashboard" replace />;
  }
};

const App = () => {
  // Permissions by role
  const permission = {
    manager: [
      "/dashboard",
      "/client",
      "/job-posting",
      "/candidates",
      "/candidates-status",
      "/interviews",
      "/invoices",
      "/users",
      "/job-title",
    ],
    recruiter: [
      "/dashboard",
      "/assigned-positions",
      "/candidates",
      "/candidates-status",
      "/interviews",
    ],
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            Cookie.get("user") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <AuthenticatedRoute
              element={() => <Layout content={Dashboard} isRaw={true} />}
              path="/dashboard"
              permission={permission}
            />
          }
        />
        <Route
          path="/users"
          element={
            <AuthenticatedRoute
              element={() => <Layout content={Users} isRaw={false} />}
              path="/users"
              permission={permission}
            />
          }
        />
        <Route
          path="/job-title"
          element={
            <AuthenticatedRoute
              element={() => <Layout content={JobTitle} isRaw={false} />}
              path="/job-title"
              permission={permission}
            />
          }
        />
        <Route
          path="/client"
          element={
            <AuthenticatedRoute
              element={() => <Layout content={Client} isRaw={false} />}
              path="/client"
              permission={permission}
            />
          }
        />
        <Route
          path="/job-posting"
          element={
            <AuthenticatedRoute
              element={() => <Layout content={JobPosting} isRaw={false} />}
              path="/job-posting"
              permission={permission}
            />
          }
        />
        <Route
          path="/candidates-status"
          element={
            <AuthenticatedRoute
              element={() => (
                <Layout content={CandidatesStatus} isRaw={false} />
              )}
              path="/candidates-status"
              permission={permission}
            />
          }
        />
        <Route
          path="/invoices"
          element={
            <AuthenticatedRoute
              element={() => <Layout content={Invoices} isRaw={false} />}
              path="/invoices"
              permission={permission}
            />
          }
        />
        <Route
          path="/assigned-positions"
          element={
            <AuthenticatedRoute
              element={() => (
                <Layout content={AssignedPositions} isRaw={false} />
              )}
              path="/assigned-positions"
              permission={permission}
            />
          }
        />
        <Route
          path="/interviews"
          element={
            <AuthenticatedRoute
              element={() => <Layout content={Interviews} isRaw={false} />}
              path="/interviews"
              permission={permission}
            />
          }
        />
        <Route
          path="/candidates"
          element={
            <AuthenticatedRoute
              element={() => <Layout content={Candidates} isRaw={false} />}
              path="/candidates"
              permission={permission}
            />
          }
        />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
