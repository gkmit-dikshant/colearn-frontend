import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router";

function Signup() {
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
          <form className="space-y-6">
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
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verify OTP
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  placeholder="Enter 6-digit OTP"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  className="sm:w-auto w-full bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800"
                >
                  Verify OTP
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Didn’t receive it? Check your inbox or request a new code.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 text-sm font-medium"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6">
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
              className="mt-6 w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-2"
            >
              <FaGoogle />
              Continue with Google
            </button>
          </div>
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
