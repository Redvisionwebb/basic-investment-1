"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const router = useRouter();
  const cardRef = useRef(null);

  // Handle login submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Attempt login
      const res = await signIn("credentials", {
        username, // matches backend
        password,
        redirect: false,
      });

      if (res?.error) {
        // Show toast and set error state
        toast.error("Invalid username or password ❌");
        return;
      }

      // Fetch session to determine role
      const session = await getSession();
      const role = session?.user?.role;

      toast.success("Login successful 🎉");

      // Role-based redirect after a short delay
      setTimeout(() => {
        if (role === "devadmin") {
          router.push("/devadmin");
        } else if (role === "normaladmin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong 🚨");
    } finally {
      setLoading(false);
    }
  }


  // Handle forgot password submit
  async function handleForgotPassword(e) {
    e.preventDefault();
    setForgotLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: forgotEmail }),
      });

      const data = await res.json();
      console.log(data)
      if (data.ok) {
        toast.success(
          `Password reset link sent to ${data.maskedEmail} ✅`
        );
        setForgotModalOpen(false);
        setForgotEmail("");
      } else {
        toast.error(data.error || "Failed to send reset link ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong 🚨");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen relative w-full overflow-hidden font-[Poppins] bg-black">
      {/* Background spheres */}
      <div
        className="sphere absolute w-[250px] h-[250px] top-[10%] left-[25%] rounded-full opacity-80 animate-[float_15s_infinite_ease-in-out]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, var(--rv-admin-bg-color) 0%, var(--rv-admin-bg-color) 100%)",
        }}
      />
      <div
        className="sphere absolute w-[180px] h-[180px] bottom-[15%] right-[15%] rounded-full opacity-80 animate-[float_15s_infinite_ease-in-out]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #00ffcc 0%, #0099ff 100%)",
          animationDelay: "3s",
        }}
      />
      <div
        className="sphere absolute w-[120px] h-[120px] top-[80%] left-[20%] rounded-full opacity-80 animate-[float_15s_infinite_ease-in-out]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #ffcc00 0%, #ff6600 100%)",
          animationDelay: "6s",
        }}
      />

      <div
        ref={cardRef}
        className="relative z-10 w-[90%] max-w-[450px] p-6 rounded-2xl border border-white/10 shadow-[0_0px_20px_rgba(31,38,135,0.2)] bg-black/30 backdrop-blur-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-[var(--rv-admin-bg-color)] bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-white opacity-80">Sign in to your account</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            {/* Username (labelled as Email) */}
            <div>
              <div className="flex items-center mb-1 text-white opacity-80 text-sm">
                <FaEnvelope className="mr-2" />
                <label htmlFor="username">Username</label>
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-full px-5 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition"
                placeholder="Enter your username"
                required
              />
            </div>


            {/* Password */}
            <div>
              <div className="flex items-center mb-1 text-white opacity-80 text-sm">
                <FaLock className="mr-2" />
                <label htmlFor="password">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full px-5 py-3 pr-10 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-white text-sm opacity-80 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 mr-2 rounded border border-white/30 bg-transparent checked:bg-gradient-to-r checked:from-[var(--rv-admin-bg-color)] checked:to-[var(--rv-admin-bg-color)]"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-white text-sm opacity-80 cursor-pointer hover:opacity-100 hover:text-[var(--rv-admin-bg-color)] transition"
            >
              Forgot password?
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full  bg-[var(--rv-admin-bg-color)] cursor-pointer text-white font-semibold tracking-wider hover:translate-y-[-2px] shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 
                   0 0 5.373 0 12h4zm2 
                   5.291A7.962 7.962 0 014 12H0c0 
                   3.042 1.135 5.824 3 
                   7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </>
            ) : (
              "LOGIN"
            )}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 bg-white/50 flex justify-center items-center z-50">
          <div className="bg-black p-6 rounded-2xl w-[90%] max-w-md relative">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-3 right-3 text-white text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">
              Forgot Password
            </h2>
            <form
              className="space-y-4"
              onSubmit={handleForgotPassword}
            >
              <div>
                <label className="text-white opacity-80 text-sm mb-1 block">
                  Enter your email or username
                </label>
                <input
                  type="text"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-full px-5 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition"
                  placeholder="Email or Username"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[var(--rv-admin-bg-color)] to-[var(--rv-admin-bg-color)] text-white font-semibold tracking-wider hover:translate-y-[-2px] shadow-lg transition"
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default LoginPage;
