'use client';
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

// Jodit Editor
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export function InputForm() {
  const router = useRouter();
  const editor = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { setValue } = form;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/aboutus`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success("About Us entry created successfully ✅");
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-aboutus/about-us/manage");
      } else {
        toast.error("Failed to submit ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white">
          {/* Title */}
          <div className="w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} className="border border-gray-400 w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <div className="w-full">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Description</FormLabel>
                  <FormControl>
                    <JoditEditor
                      ref={editor}
                      value={field.value}
                      onBlur={(newContent) => setValue("description", newContent)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Submitting...
              </>
            ) : "Submit"}
          </Button>
        </form>
      </Form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

const AddAboutUsPost = () => (
  <DefaultLayout>
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">Add About Us</h1>
        <Link href="/admin/manage-aboutus/about-us/manage">
          <Button className="text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]">Manage About Us</Button>
        </Link>
      </div>
      <InputForm />
    </div>
  </DefaultLayout>
);

export default AddAboutUsPost;
