"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ForgotPasswordModal from "@/components/Forgotpassword";
import styles from "./LoginPage.module.css";
import Image from "next/image";



const LoginPage = () => {
  const router = useRouter();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Client");


  const [provider, setProvider] = useState({
    username: "",
    password: "",
    loginFor: "CLIENT",
    siteUrl: "",
    callbackUrl: "",
  });

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const res = await axios.get("/api/admin/site-settings");
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
  const roles = ["Client", "Employee", "Admin", "Broker", "Branch"];


  return (
    <div className={styles.loginPage}>
      <div className={`max-w-screen-2xl min-h-screen  section`}>
        <div className="flex flex-col md:flex-row items-center gap-10 w-full h-full">
          <div className={`${styles.bg} flex flex-col gap-5 items-end justify-end p-10 md:w-1/2 w-full h-full`}>
            <div className="max-w-lg">
              <h1 className="text-[var(--rv-bg-primary)]">Sign In to Explore All
                Features and Account
                Benefits  </h1>
            </div>
            <Image
              src={'/images/login/image.svg'}
              width={400}
              height={300}
            />
          </div>
          <div className="md:w-1/2 w-full flex items-center justify-start h-full">
            <div className={` p-6 rounded-xl  md:p-8 `}>
              <div className="flex flex-col gap-4">
                <h2 className="font-bold">Login into Your Account</h2>
                <div >
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-3 md:grid-cols-5 w-full gap-2 overflow-hidden">
                      {roles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          className={` px-2 py-2 text-sm rounded-md font-medium transition-all duration-300 
              ${selectedRole === role
                              ? "bg-[var(--rv-primary)] text-white"
                              : " text-[var(--rv-primary)]  border border-[var(--rv-primary)]"
                            }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your username"
                        value={provider.username}
                        onChange={(e) =>
                          setProvider({ ...provider, username: e.target.value })
                        }
                        className="w-full outline-none rounded px-3 py-3 text-sm bg-black/5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={provider.password}
                        onChange={(e) =>
                          setProvider({ ...provider, password: e.target.value })
                        }
                        className="w-full outline-none rounded px-3 py-3 text-sm bg-black/5"
                      />
                    </div>

                    <div className="flex justify-end items-end text-xs text-gray-800">
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className=" underline"
                      >
                        Forgot your password?
                      </button>
                    </div>

                    {error && <div className="text-red-600 text-xs">{error}</div>}

                    <button
                      type="submit"
                      className="w-full bg-[var(--rv-primary)] text-white font-semibold py-3 rounded  disabled:opacity-60"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                </div>
                <ForgotPasswordModal
                  isOpen={showForgotModal}
                  onClose={() => setShowForgotModal(false)}
                  logintype={selectedRole === "ADMIN" ? "ARN" : selectedRole}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


