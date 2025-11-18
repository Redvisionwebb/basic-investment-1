'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

export function WebPopupForm() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      status: false,
    },
  });

  const { setValue } = form;

  const onSubmit = async (data) => {
    setLoading(true);
    form.clearErrors(); // Clear previous inline errors

    try {
      // 🧩 Frontend image validation
      if (selectedImage && selectedImage.size > 1024 * 1024) {
        form.setError("image", {
          type: "manual",
          message: "Image size exceeds more than 1MB.",
        });
        toast.error("Please upload an image smaller than 1MB.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      formData.append("status", data.status);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("✅ Web Popup created successfully!");
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-popups/manage");
      } else {
        toast.error("Unexpected server response.");
      }
    } catch (error) {
      console.error("❌ Error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            form.setError("image", {
              type: "manual",
              message: "Image size exceeds more than 1MB.",
            });
            toast.error(data?.message || "Image size exceeds more than 1MB.");
          } else {
            toast.error(
              data?.message || "Something went wrong while submitting the form."
            );
          }
        } else {
          toast.error(
            "Unable to reach the server. Please check your internet connection."
          );
        }
      } else {
        toast.error(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white"
        >
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem >
                <FormLabel className="font-semibold">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter popup title"
                    {...field}
                    className="border border-gray-400 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Active Status</FormLabel>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => setValue("status", e.target.checked)}
                    className="h-4 w-4 ml-4 items-center"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Upload Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    className="border border-gray-400 w-full"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedImage(file);
                        field.onChange(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 text-white bg-[#2367f8] hover:bg-[#2367f8]"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

const AddWebPopupPage = () => (
  <DefaultLayout>
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">Add Web Popup</h1>
        <Link href="/admin/manage-popups/manage">
          <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]">
            Manage Web Popups
          </Button>
        </Link>
      </div>
      <WebPopupForm />
    </div>
  </DefaultLayout>
);

export default AddWebPopupPage;
