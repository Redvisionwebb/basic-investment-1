"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ForgotPasswordModal from "@/components/Forgotpassword";
import styles from "./LoginPage.module.css";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";

const LoginPageModule = ({ roboUser, sitedata, login }) => {
  const router = useRouter();

  const [desk, setDesk] = useState(
    login?.name || login?.loginitems[0].login_desk
  ); // dynamic desk
  const [roles, setRoles] = useState(login?.loginitems || []); // dynamic roles
  const [selectedRole, setSelectedRole] = useState(
    login?.loginitems[0].login_value
  ); // active role

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [provider, setProvider] = useState({
    username: "",
    password: "",
    loginFor: login?.loginitems[0].login_value,
    siteUrl: sitedata?.siteurl,
    callbackUrl: sitedata?.callbackurl,
    pcode: [],
    amount: [],
    arn_no: "",
  });

  // Fetch desk + roles dynamically

  useEffect(() => {
    const storedData = localStorage.getItem("investmentData");
    if (storedData) {
      const parsed = JSON.parse(storedData);

      const pcodeArray = parsed.funds.map((f) => f?.pcode);
      const amountArray = parsed.funds.map((f) => f?.allocationAmount);

      setProvider((prev) => ({
        ...prev,
        arn_no: parsed.arnnumber,
        pcode: pcodeArray,
        amount: amountArray,
      }));
    }
  }, []);

  // Update provider.loginFor when selected role changes
  useEffect(() => {
    if (selectedRole) {
      setProvider((prev) => ({
        ...prev,
        loginFor: selectedRole === "ADMIN" ? "ADVISOR" : selectedRole,
      }));
    }
  }, [selectedRole]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        desk === "ARN" ? "/api/login/arn-login" : "/api/login/ifa-login";

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${endpoint}`,
        provider
      );

      if (res.data.status === true) {
        toast.success("Login successful 🎉");

        const payloadStr = localStorage.getItem("riskProfilePayload");
        if (payloadStr) {
          try {
            const payload = JSON.parse(payloadStr);

            // ✅ Attach dynamic clientId from login response
            payload.clientId = res.data.clientId;

            await axios.post(
              `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo/set-client-answer`,
              payload,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: false, // Ensure no cross-site cookie issue
              }
            );

            // ✅ Mark payload as completed
            payload.apiCallStatus = "completed";
            localStorage.setItem(
              "riskProfilePayload",
              JSON.stringify(payload)
            );

            toast.success("Risk profile uploaded successfully ✅");
          } catch (err) {
            console.error("❌ Error sending risk profile payload:", err);
            toast.error("Error uploading risk profile data.");
          }
        }


        router.push(res.data.url);
      } else {
        toast.error(res.data.msg || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.loginPage}>
      <div className={`max-w-screen-xl mx-auto  section`}>
        <div className="flex flex-col md:flex-row items-center gap-10 w-full h-full">
          {/* Left Image/Content */}
          <div
            className={`${styles.bg} flex flex-col gap-5 items-end justify-end p-10 md:w-1/2 w-full h-full`}
          >
            <div className="max-w-lg">
              <h1 className="text-[var(--rv-bg-primary)]">
                Sign In to Explore All Features and Account Benefits
              </h1>
            </div>
            <Image src={"/images/login/image.svg"} alt="image" width={400} height={300} />
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 w-full flex items-center justify-start h-full">
            <div className={`p-6 rounded-xl md:p-8 bg-[var(--rv-primary-light)]`}>
              <div className="flex flex-col gap-4">
                <h2 className="font-bold">Login into Your Account</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Dynamic Roles */}
                  <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-2 overflow-hidden">
                    {roles.map((role) => (
                      <button
                        key={role._id || role.login_value}
                        type="button"
                        onClick={() => setSelectedRole(role.login_value)}
                        className={`px-2 py-2 text-sm rounded-md font-medium transition-all duration-300 ${
                          selectedRole === role.login_value
                            ? "bg-[var(--rv-primary)] text-white"
                            : "text-[var(--rv-primary)] border border-[var(--rv-primary)]"
                        }`}
                      >
                        {role.login_name}
                      </button>
                    ))}
                  </div>

                  {/* Username */}
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
                      className="w-full outline-none rounded px-3 py-3 text-sm bg-white"
                    />
                  </div>

                  {/* Password */}
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
                      className="w-full outline-none rounded px-3 py-3 text-sm bg-white"
                    />
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end items-end text-xs text-gray-800">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="underline"
                    >
                      Forgot your password?
                    </button>
                  </div>

                  {/* Error Message */}
                  {/* {error && <div className="text-red-600 text-xs">{error}</div>} */}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-[var(--rv-primary)] text-white font-semibold py-3 rounded disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  
            {roboUser && (
              <div className="text-center flex flex-col space-y-3">
                <p>Don't have an account</p>
                <Link href="/registration">
                  <button className="w-full bg-[var(--rv-primary)] text-white font-semibold py-3 rounded disabled:opacity-60">Sign Up</button>
                </Link>
              </div>
            )}
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
      </div>
    </div>
  );
};

export default LoginPageModule;
