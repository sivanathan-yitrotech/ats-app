import LoginImage from "@/assets/login.svg";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

export default function ForgerPassword() {
  const [email, setEmail] = useState("");
  const [error, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error messages on every submit attempt
    setErrors("");
    setSuccessMessage(""); // Reset success message

    // Validation
    let valid = true;

    if (!email) {
      setErrors("Please enter your email address.");
      return false;
    } else {
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrors(
          "The email address you entered is invalid. Please try again."
        );
        return false;
      }
    }

    if (valid) {
      try {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("email", email);
        formData.append("type", "reset-password");

        const response = await axios.post(
          "http://127.0.0.1:8000/post-data",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.result) {
          setSuccessMessage(
            "A reset link has been sent to your email address."
          );
        } else {
          setErrors("No account found with that email address.");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrors(
            "An error occurred while sending the reset link. Please try again later."
          );
        } else {
          setErrors("An unexpected error occurred.");
        }
      } finally {
        setSubmitting(false);
      }
    }
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
            <div className="flex flex-col items-center gap-5 mb-8">
              <h1 className="text-[#0044A3] text-lg font-bold">
                Application Tracking System
              </h1>
              <h2 className="text-[#0044A3] text-lg font-bold">
                Forgot Your Password?
              </h2>
              <h3 className="text-[#0044A3] text-sm font-normal text-center">
                Enter your email address below, and we'll send you a link to
                reset your password.
              </h3>
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
              <div className="text-center text-[#0044A3] mt-2">
                {error && (
                  <div className="text-red-500 text-[12px] mb-2">{error}</div>
                )}
                {successMessage && (
                  <div className="text-green-500 text-[12px] mb-2">
                    {successMessage}
                  </div>
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
                  disabled={submitting}
                  className="bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-blue-950 text-white"
                >
                  {submitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
