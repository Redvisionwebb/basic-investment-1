"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

const FormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  status: z.boolean().optional(),
  image: z.any().optional(),
});

export function WebPopupForm({ popupId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      status: false,
    },
  });

  // 🧭 Fetch existing popup data
  useEffect(() => {
    if (popupId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups/${popupId}`)
        .then((res) => {
          const { title, image, status } = res.data.popup;
          form.setValue("title", title);
          form.setValue("status", status);
          setPreviousImage(image?.url);
          setStatus(status);
        })
        .catch((err) => {
          console.error("Error fetching popup:", err);
          toast.error("Failed to fetch popup details ❌");
        });
    }
  }, [popupId]);

  const onSubmit = async (data) => {
    setLoading(true);
    form.clearErrors();

    try {
      // 🧩 Validate image size (max 1MB)
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
      formData.append("status", status);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups/${popupId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(response)

      if (response.status === 200) {
        toast.success("✅ Web Popup updated successfully!");
        router.push("/admin/manage-popups/manage");
      } else {
        toast.error("Unexpected server response ❌");
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
            toast.error(data?.message || "Image too large (max 1MB).");
          } else {
            toast.error(
              data?.message || "Something went wrong while updating popup."
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
      <ToastContainer position="top-right" autoClose={3000} />
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
              <FormItem>
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
          <div>
            <FormLabel className="font-semibold">Active Status</FormLabel>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                checked={status}
                onChange={(e) => {
                  setStatus(e.target.checked);
                  form.setValue("status", e.target.checked);
                }}
              />
              <span>{status ? "Active" : "Inactive"}</span>
            </div>
          </div>

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
                {previousImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Previous Image:</p>
                    <img
                      src={previousImage}
                      alt="Previous"
                      className="max-w-sm rounded border-gray-400 border h-auto w-40"
                    />
                  </div>
                )}
              </FormItem>
            )}
          />

          {/* Submit Button */}
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
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}

const EditWebPopup = () => {
  const params = useParams();
  const popupId = params.id;

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl">Edit Web Popup</h1>
          <Link href="/admin/manage-popups/manage">
            <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]">
              All Popups
            </Button>
          </Link>
        </div>
        <WebPopupForm popupId={popupId} />
      </div>
    </DefaultLayout>
  );
};

export default EditWebPopup;
