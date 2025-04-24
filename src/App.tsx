import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

// This is the main App component that includes routing.
const App = () => {
  return (
    <Router>
      <Routes>
        {Cookie.get("user") ? (
          <>
            {/* Routes for authenticated users */}
            <Route
              path="/"
              element={<Layout content={Dashboard} isRaw={true} />}
            />
            <Route
              path="/dashboard"
              element={<Layout content={Dashboard} isRaw={true} />}
            />
            <Route
              path="/users"
              element={<Layout content={Users} isRaw={false} />}
            />
            <Route
              path="/job-title"
              element={<Layout content={JobTitle} isRaw={false} />}
            />
            <Route
              path="/client"
              element={<Layout content={Client} isRaw={false} />}
            />
            <Route
              path="/job-posting"
              element={<Layout content={JobPosting} isRaw={false} />}
            />
            <Route
              path="/candidates-status"
              element={<Layout content={CandidatesStatus} isRaw={false} />}
            />
            <Route
              path="/invoices"
              element={<Layout content={Invoices} isRaw={false} />}
            />
            <Route
              path="/assigned-positions"
              element={<Layout content={AssignedPositions} isRaw={false} />}
            />
            <Route
              path="/interviews"
              element={<Layout content={Interviews} isRaw={false} />}
            />
            <Route
              path="/candidates"
              element={<Layout content={Candidates} isRaw={false} />}
            />
          </>
        ) : (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </>
        )}

        {/* Catch-all route for 404 pages */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
