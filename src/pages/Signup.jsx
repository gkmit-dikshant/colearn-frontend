import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import authService from "../api/auth";

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setIsSubmitting(true);
    try {
      const response = await authService.signup(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.bio.trim() ? formData.bio.trim() : "",
      );
      setStep("verify");
      setInfo(response?.message || "OTP sent successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign up. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setIsVerifying(true);
    try {
      const response = await authService.verifyOtp(
        formData.email.trim(),
        otp.trim(),
      );
      if (response?.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
      }
      if (response?.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }
      window.dispatchEvent(new Event("auth:change"));
      setInfo("Account verified. Redirecting...");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const resetToForm = () => {
    setStep("form");
    setOtp("");
    setInfo("");
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Sign Up</h1>
          <p className="text-sm text-gray-600">
            Create an account to get started
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-8">
          {step === "form" && (
            <form className="space-y-6" onSubmit={handleSignup}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400"
                  placeholder="Name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 pr-14 border border-gray-300 rounded focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 text-xs font-medium text-gray-600 hover:text-gray-900"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bio <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400"
                  placeholder="Tell others a bit about you (optional)"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {info && <p className="text-sm text-green-600">{info}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 text-sm font-medium disabled:opacity-70"
              >
                {isSubmitting ? "Sending OTP..." : "Sign Up"}
              </button>
            </form>
          )}

          {step === "verify" && (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <p className="text-sm text-gray-700 mb-1">
                  Enter the 6-digit OTP sent to
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {formData.email}
                </p>
                <button
                  type="button"
                  onClick={resetToForm}
                  className="mt-2 text-xs text-gray-600 underline"
                >
                  Use a different email
                </button>
              </div>

              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/[^0-9]/g, ""))
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400 tracking-[0.4em]"
                  placeholder="••••••"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Didn’t receive it? Check spam or request another code.
                </p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {info && <p className="text-sm text-green-600">{info}</p>}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 text-sm font-medium disabled:opacity-70"
              >
                {isVerifying ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>
          )}

          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="mt-6 w-full border border-gray-300 text-gray-700 py-2 px-4 rounded text-sm font-medium flex items-center justify-center gap-2 disabled:bg-gray-50"
            >
              <FaGoogle />
              Continue with Google
            </button>
          </div> */}
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
