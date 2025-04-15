import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import axios from "axios";
import Config from "@/config.json";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (!email) {
      setError("Please enter your email address.");
      return; // return early to avoid further execution
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("The email address you entered is invalid. Please try again.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // // Make the API call if validation passes
    // axios.post(Config.api_endpoint + "/auth/login", { email, password })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       const token = response.data.token;
    //       const user = response.data.user;
    //       Cookies.set("token", token, { expires: 1 });
    //       Cookies.set("user", JSON.stringify(user), { expires: 1 });
    //       window.location.href = "/dashboard";
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       // Server responded with an error status
    //       setError(error.response.data.message);
    //     } else if (error.request) {
    //       // No response from the server
    //       setError("No response from server. Please try again later.");
    //     } else {
    //       // Other errors
    //       setError("An error occurred. Please try again.");
    //     }
    //   });
    const user = {
      id: 1,
      role: "manager",
      name: "Manager",
      email: "manager@mailinator.com",
      phone_number: "9834234234",
    };
    Cookies.set(
      "token",
      "UGo7Klyjp5Ag96agHfH61axCsE7FacQGgerKSRumVevTHUM0BjE9sWUVPQ01GZJT",
      { expires: 1 }
    );
    Cookies.set("user", JSON.stringify(user), { expires: 1 });
    window.location.href = "/";
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setError(""); // clear error message
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-5 mb-8">
          <h1 className="text-[#0044A3] text-lg font-bold">
            Application Tracking System
          </h1>
          <h2 className="text-[#0044A3] text-lg font-bold">
            Login to Your Account
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <Label className="text-[#0044A3] sm:w-[30%]">Email Address</Label>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={250}
              placeholder="Enter your email address"
              className="sm:w-[70%] placeholder:text-[12px] px-4 py-2 border rounded-md"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <Label className="text-[#0044A3] sm:w-[30%]">Password</Label>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={250}
              placeholder="Enter your password"
              className="sm:w-[70%] placeholder:text-[12px] px-4 py-2 border rounded-md"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <Label className="text-[#0044A3] sm:w-[30%]"></Label>
            <a
              onClick={() => navigate("/forget-password")}
              className="text-[12px] text-[#0044A3] cursor-pointer underline"
            >
              Forget Password?
            </a>
          </div>
          <div className="text-center text-[#0044A3] mt-2">
            {error && (
              <div className="text-red-500 text-[12px] mb-2">{error}</div>
            )}
          </div>
          <div className="flex flex-row gap-6 justify-center mb-4">
            <Button
              type="button"
              className="bg-white rounded-[3px] cursor-pointer hover:bg-neutral-300 border-1 border-[#64748B] text-[#64748B]"
              onClick={handleReset} // used handleReset function here
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-blue-950 text-white"
            >
              Log In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
