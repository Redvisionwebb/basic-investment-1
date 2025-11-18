"use client";

import React, { useState } from "react";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePasswordPage = () => {
    
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/change-password`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.ok) {
        // toast.success("✅ Password changed successfully");
        reset();
          toast.success("✅ Password changed successfully", {
        onClose: () => {
          // Redirect only after toast is fully closed
          router.push("/admin");
        },
        autoClose: 3000, // optional: shorter toast duration (3s)
      });
      } else {
        toast.error(response.data.error || "❌ Failed to change password");
      }
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error.response?.data?.error || "❌ Server Error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaLock /> Change Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-black/90 mb-1">
              Old Password
            </label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                {...register("oldPassword", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none pr-10"
                placeholder="Enter old password"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showOld ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-black/90 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                {...register("newPassword", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNew ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-black/90 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2367f8] hover:bg-[#2367f8]/90 text-white font-medium py-2 rounded-lg transition-all"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </DefaultLayout>
  );
};

export default ChangePasswordPage;
