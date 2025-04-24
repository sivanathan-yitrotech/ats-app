import LoginImage from "@/assets/login.svg";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={LoginImage}
          alt="Image"
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
                    Forget Password?
                  </a>
                </div>

                <div className="flex flex-row gap-6 justify-center mb-1">
                  <Button
                    type="submit"
                    className="bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-blue-950 text-white"
                  >
                    Log In
                  </Button>
                </div>
                <div className="text-center text-[#0044A3] mt-1">
                  {error && (
                    <div className="text-red-500 text-[12px] mb-1">{error}</div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
