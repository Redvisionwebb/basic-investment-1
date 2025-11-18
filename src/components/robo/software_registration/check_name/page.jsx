"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// ✅ PAN validation schema
const kycSchema = z.object({
  pan_number: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN number")
    .length(10, "PAN must be 10 characters"),
});

const CheckKyc = ({ roboUser,onSuccess }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      pan_number: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    setError(null);

    const formData = {
      arn_id: roboUser?.arnId,
      pan_number: values.pan_number.toUpperCase(), // ensure PAN is uppercase
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo/registration/get-client-name-by-pan`, formData);
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
      if (response.data.status === 1) {
        const { name, dob } = response.data.data;
        const encryptedName = CryptoJS.AES.encrypt(name, secretKey).toString();
        const encryptedDob = CryptoJS.AES.encrypt(dob, secretKey).toString();
        const encryptedPan = CryptoJS.AES.encrypt(formData.pan_number, secretKey).toString();

        localStorage.setItem("client_name", encryptedName);
        localStorage.setItem("client_dob", encryptedDob);
        localStorage.setItem("client_pan", encryptedPan);

        if (onSuccess) onSuccess();
      } else {
        const encryptedPanNew = CryptoJS.AES.encrypt(formData.pan_number, secretKey).toString();
        localStorage.setItem("client_pan", encryptedPanNew);
        onSuccess();
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section w-full flex items-center justify-center">
      <Card className="w-full max-w-xl border-none shadow-none " style={{ background: 'var(--rv-bg-gradient)' }}>
        <CardHeader>
          {/* <h1 className="text-2xl font-bold text-center text-black">Register Now</h1> */}
           <h2 className="font-bold">Register Now</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">
                      PAN NO
                    </label>
              <input
                type="text"
                {...register("pan_number")}
                maxLength={10}
                placeholder="Enter your PAN"
                className="w-full outline-none rounded px-3 py-3 text-sm bg-white"
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              {errors.pan_number && (
                <p className="text-sm text-red-500">{errors.pan_number.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[var(--rv-primary)] py-4"
              disabled={loading}
              variant="default"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckKyc;
