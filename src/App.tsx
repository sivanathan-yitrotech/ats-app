import Layout from "@/pages/Layout";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import ForgetPassword from "@/pages/ForgetPassword";
import JobTitle from "@/pages/JobTitle";
import Client from "@/pages/Client";
import JobPosting from "@/pages/JobPosting";

const App = () => {
  return <Layout content={JobPosting} />;
};

export default App;
