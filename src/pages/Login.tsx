import LoginImage from "@/assets/login.svg";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // You missed this import!

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Basic Validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("The email address you entered is invalid. Please try again.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    // try {
    //   setSubmitting(true);

    //   const formData = new FormData();
    //   formData.append("email", email);
    //   formData.append("password", password);
    //   formData.append("type", "check-login");

    //   const response = await axios.post(
    //     "http://127.0.0.1:8000/post-data",
    //     formData,
    //     {
    //       headers: { "Content-Type": "multipart/form-data" },
    //     }
    //   );

    //   if (response.data.result) {
    //     const data = response.data;
    //     const user = data.data;
    //     // const token = user.token;
    //     const token = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJqYW5lLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTY1MDAwMDAwMH0.";

    //     Cookies.set("token", token, { expires: 1 });
    //     Cookies.set("user", JSON.stringify(user), { expires: 1 });
    //     window.location.href = "/";
    //   } else {
    //     setError("Invalid login credentials. Please try again.");
    //   }
    // } catch (error: any) {
    //   console.error("Login Error:", error);
    //   if (error.response && error.response.data?.message) {
    //     setError(error.response.data.message);
    //   } else {
    //     setError("An unexpected error occurred. Please try again later.");
    //   }
    // } finally {
    //   setSubmitting(false);
    // }

    const user = {
      id: "1bd9799a-0773-495e-90fa-a6635ee6b562",
      firstName: "Sivanathan",
      lastName: "T",
      email: email,
      phoneNumber: "9809876878",
      role: (email=="manager@mailinator.com") ? "manager":"recruiter",
      profile: "https://i.pravatar.cc/301",
    };
    const token =
      "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJqYW5lLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTY1MDAwMDAwMH0.";

    Cookies.set("token", token, { expires: 1 });
    Cookies.set("user", JSON.stringify(user), { expires: 1 });
    window.location.href = "/";
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={LoginImage}
          alt="Login"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
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
                  <Label className="text-[#0044A3] sm:w-[30%]">
                    Email Address
                  </Label>
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
                    Forgot Password?
                  </a>
                </div>

                {error && (
                  <div className="text-center text-red-500 text-[12px] mb-2">
                    {error}
                  </div>
                )}

                <div className="flex flex-row gap-6 justify-center mb-1">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-blue-950 text-white"
                  >
                    {submitting ? "Logging in..." : "Log In"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
