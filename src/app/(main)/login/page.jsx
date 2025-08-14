"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import ForgotPasswordModal from "@/components/Forgotpassword";
import styles from "./LoginPage.module.css";


const LoginPage = () => {
  const router = useRouter();

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("CLIENT");

  const [siteData, setSiteData] = useState({ siteUrl: "", callbackUrl: "" });

  const [provider, setProvider] = useState({
    username: "",
    password: "",
    loginFor: "CLIENT",
    siteUrl: "",
    callbackUrl: "",
  });

  // Fetch site data on mount
  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const res = await axios.get("/api/admin/site-settings");
        // console.log(res)
        if (res.status === 200 && res.data[0]) {
          setProvider((prev) => ({
            ...prev,
            siteUrl: res?.data[0]?.siteurl,
            callbackUrl: res?.data[0]?.callbackurl,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch site settings", error);
      }
    };

    fetchSiteData();
  }, []);

  // console.log(provider)
  // Update loginFor when role changes
  useEffect(() => {
    setProvider((prev) => ({
      ...prev,
      loginFor: selectedRole === "ADMIN" ? "ARN" : selectedRole,
    }));
  }, [selectedRole]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://redvisionweb.com/api/login/arn-login", provider);
      if (res.data.status === true) {
        router.push(res.data.url);
      } else {
        setError(res.data.msg);
      } 
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-[60px]">
      <div className={`max-w-screen-xl mx-auto min-h-[500px] grid grid-cols-1 md:grid-cols-12 rounded-2xl overflow-hidden bg-white ${styles.loginContainer}`}>

        {/* Left Section: 7 Columns */}
        <div
          className={`${styles.loginSection} md:col-span-7`}
        >
          <div className={styles.overlayBox}>
            <h2 className={styles.subtitle}>
              AMFI Registered Mutual Fund Distributor
            </h2>
            <h1 className={styles.mainTitle}>
              Every Investment <br />
              A Step Closer to Your <u>Dreams</u>
            </h1>
            <h2 className={styles.tagline}>
              Together, let's create the life you deserve.
            </h2>
            <p className={styles.loginPrompt}>
              Don’t have an account?
            </p>
            <Link href="/contact-us" className={styles.createLink}>
              Create account →
            </Link>
          </div>
        </div>

        {/* Right Section: 5 Columns */}
        <div className="md:col-span-5 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h3 className="text-center text-lg font-semibold mb-6">Login to your account</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="CLIENT">Client</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option>
                <option value="BROKER">Broker</option>
                <option value="BRANCH">Branch</option>
              </select>
              <input
                type="text"
                placeholder="Username"
                value={provider.username}
                onChange={(e) => setProvider({ ...provider, username: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                value={provider.password}
                onChange={(e) => setProvider({ ...provider, password: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <div className="flex justify-end items-end text-xs text-gray-600">
                <button type="button" onClick={() => setShowForgotModal(true)} className="text-black underline">
                  Forgot your password?
                </button>
              </div>
              {error && <div className="text-red-600 text-xs">{error}</div>}
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            {/* Forgot Password Modal */}
            <ForgotPasswordModal
              isOpen={showForgotModal}
              onClose={() => setShowForgotModal(false)}
              logintype={selectedRole === "ADMIN" ? "ARN" : selectedRole}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;


