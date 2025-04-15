import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setErrors] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset error messages on every submit attempt
    setErrors("");

    // Validation
    let valid = true;

    if (!email) {
      setErrors("Please enter your email address.");
      return false;
      valid = false;
    } else {
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrors(
          "The email address you entered is invalid. Please try again."
        );
        return false;
        valid = false;
      }
    }

    if (valid) {
      console.log(email);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-5 mb-8">
          <h1 className="text-[#0044A3] text-lg font-bold">
            Application Tracking System
          </h1>
          <h2 className="text-[#0044A3] text-lg font-bold">
            Forgot Your Password?
          </h2>
          <h3 className="text-[#0044A3] text-sm font-normal text-center">
            Enter your email address below, and we'll send you a link to reset
            your password.
          </h3>
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
          <div className="text-center text-[#0044A3] mt-2">
            {error && (
              <div className="text-red-500 text-[12px] mb-2">{error}</div>
            )}
          </div>
          <div className="flex flex-row gap-6 justify-center mb-4">
            <Button
              onClick={() => navigate("/")}
              type="button"
              className="bg-white rounded-[3px] cursor-pointer hover:bg-neutral-300 border-1 border-[#64748B] text-[#64748B]"
            >
              Back to Login
            </Button>
            <Button
              type="submit"
              className="bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-blue-950 text-white"
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
