import LoginImage from "@/assets/login.svg";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    if (!password) return "Please enter your new password.";
    if (password.length < 6)
      return "Password must be at least 6 characters long.";
    if (!confirmPassword) return "Please confirm your password.";
    if (confirmPassword !== password) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    const secretCode = "sdasdasd"; // This should be passed securely
    const formData = new FormData();
    formData.append("code", secretCode);
    formData.append("password", password);
    formData.append("type", "update-password");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/post-data",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.result) {
        setSuccessMessage("Password has been updated successfully.");
      } else {
        setError("Password not updated.");
      }
    } catch (error) {
      setError(
        "An error occurred while sending the reset link. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={LoginImage}
          alt="Login Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
            <div className="flex flex-col items-center gap-5 mb-8">
              <h1 className="text-[#0044A3] text-lg font-bold">
                Application Tracking System
              </h1>
              <h2 className="text-[#0044A3] text-lg font-bold">
                Set a New Password
              </h2>
              <h3 className="text-[#0044A3] text-sm font-normal text-center">
                Please enter your new password below. Make sure it is strong and
                you can remember it.
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <Label className="text-[#0044A3] sm:w-[30%]">
                  New Password
                </Label>
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
                <Label className="text-[#0044A3] sm:w-[30%]">
                  Confirm Password
                </Label>
                <Input
                  name="c_password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  maxLength={250}
                  placeholder="Confirm your password"
                  className="sm:w-[70%] placeholder:text-[12px] px-4 py-2 border rounded-md"
                />
              </div>
              {error && (
                <div className="text-red-500 text-[12px] mb-2 text-center">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="text-green-500 text-[12px] mb-2 text-center">
                  {successMessage}
                </div>
              )}
              <div className="flex flex-row gap-6 justify-center mb-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-blue-950 text-white"
                >
                  {submitting ? "Updating..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
