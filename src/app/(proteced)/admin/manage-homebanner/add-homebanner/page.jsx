"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export function InputForm() {
  const router = useRouter();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const FormSchema = z.object({
    title: z.string().nonempty({ message: "Title is required." }),
    image: z.instanceof(File).optional(),
    designation: z.string().nonempty({ message: "Designation is required." }),
    auther_url: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      image: "",
      designation: "",
      auther_url: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    form.clearErrors();

    try {
      // Frontend file size validation
      if (selectedImage && selectedImage.size > 1024 * 1024) {
        form.setError("image", {
          type: "manual",
          message: "Image size exceeds 1MB.",
        });
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload an image smaller than 1MB.",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      if (selectedImage) formData.append("image", selectedImage);
      formData.append("title", data.title);
      formData.append("designation", data.designation);
      if (data.auther_url) formData.append("auther_url", data.auther_url);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/homebanner/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        toast({ title: "✅ Data uploaded successfully" });
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-homebanner/manage");
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("❌ Error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response;

          // Handle 5 banner limit
          if (status === 400 && data?.error === "Cannot add more than 5 home banners.") {
            toast({
              variant: "destructive",
              title: "Limit Reached",
              description: data.error,
            });
          }
          // Existing 400 validation errors
          else if (status === 400 && data?.error?.includes("File size")) {
            form.setError("image", {
              type: "manual",
              message: data.error,
            });
            toast({
              variant: "destructive",
              title: "Upload Error",
              description: data.error,
            });
          } else {
            toast({
              variant: "destructive",
              title: `Error ${status}`,
              description: data?.message || "Something went wrong while uploading the banner.",
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Network Error",
            description: "Unable to reach the server. Please try again later.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Unexpected Error",
          description: error.message || "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Banner Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    aria-label="title"
                    className="border border-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Designation</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Designation"
                    {...field}
                    aria-label="designation"
                    className="border border-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auther_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Auther URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Auther URL"
                    {...field}
                    aria-label="auther_url"
                    className="border border-gray-400"
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
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedImage(file);
                      field.onChange(file);
                    }
                  }}
                  aria-label="Image"
                  className="border border-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="text-white bg-[#2367f8] hover:bg-[#2367f8]"
          type="submit"
        >
          {!loading ? "Submit" : "Loading..."}
        </Button>
      </form>
    </Form>
  );
}

const AddPost = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl">Add New Home Banner</h1>
          <Link href="/admin/manage-homebanner/manage">
            <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]">
              All Home Banners
            </Button>
          </Link>
        </div>
        <InputForm />
        <Toaster />
      </div>
    </DefaultLayout>
  );
};

export default AddPost;
