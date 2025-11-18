"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
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
import Link from "next/link";

// ✅ Schema — all fields optional
const FormSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  statsNumber: z.string().optional(),
  image: z.any().optional(),
});

const StatsForm = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      statsNumber: "",
      image: "",
    },
  });

const onSubmit = async (data) => {
  setLoading(true);
  form.clearErrors(); // clear any previous form errors

  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.subtitle) formData.append("subtitle", data.subtitle);
  if (data.description) formData.append("description", data.description);
  if (data.statsNumber) formData.append("statsNumber", data.statsNumber.toString());
  if (selectedImage) formData.append("image", selectedImage);

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/stats`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (res.status === 201) {
      toast({ title: "✅ Stats added successfully!" });
      form.reset();
      setSelectedImage(null);
      router.push("/admin/manage-Stats/manage");
    } else {
      throw new Error("Failed to submit");
    }
  } catch (error) {
    console.log("❌ Error:", error);

    // handle axios-specific error
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { status, data } = error.response;

        // 400 error: likely file too large or invalid input
        if (status === 400) {
          form.setError("image", {
            type: "manual",
            message: "Image size exceeds more than 1MB.",
          });

          toast({
            variant: "destructive",
            title: "Upload Error",
            description: data?.message || "Image size exceeds more than 1MB.",
          });
        } else {
          // Generic error
          toast({
            variant: "destructive",
            title: `Error ${status}`,
            description:
              data?.message || "Something went wrong while submitting the form.",
          });
        }
      } else {
        // No response (network or CORS)
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "Unable to connect to the server. Please try again.",
        });
      }
    } else {
      // Non-Axios error fallback
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
        className="flex flex-col gap-5 bg-white p-4 rounded-md shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} className="border border-gray-400" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subtitle" {...field} className="border border-gray-400" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="statsNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stats Number</FormLabel>
                <FormControl>
                  <Input  placeholder="Enter number" {...field} className="border border-gray-400" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} className="border border-gray-400" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="border border-gray-400"
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

        <Button
          type="submit"
          disabled={loading}
          className="text-white bg-[#2367f8] hover:bg-[#2367f8]"
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

const AddStats = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Add Stats</h1>
          <Link href="/admin/manage-Stats/manage">
            <Button className="bg-[#2367f8] text-white hover:bg-[#2367f8]">
              All Stats
            </Button>
          </Link>
         
        </div>
        <StatsForm />
        <Toaster />
      </div>
    </DefaultLayout>
  );
};

export default AddStats;
