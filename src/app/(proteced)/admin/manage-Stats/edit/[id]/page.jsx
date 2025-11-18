"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import Link from "next/link";

// Validation schema
const StatsSchema = z.object({
  title: z.string().transform((val) => val || ""),
  subtitle: z.string().transform((val) => val || ""),
  description: z.string().transform((val) => val || ""),
  statsNumber: z.string().transform((val) => val || ""),
  image: z.any().optional(),
});

export function StatsForm({ statId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(StatsSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      statsNumber: "",
    },
  });

  // Fetch existing stats
  useEffect(() => {
    if (statId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/stats/${statId}`)
        .then((res) => {
          const data = res?.data?.stat || {};
          form.setValue("title", data.title ?? "");
          form.setValue("subtitle", data.subtitle ?? "");
          form.setValue("description", data.description ?? "");
          form.setValue("statsNumber", data.statsNumber ?? "");
          setPreviousImage(data?.image?.url ?? null);
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [statId, form]);

const onSubmit = async (data) => {
  setLoading(true);
  form.clearErrors(); // clear previous inline errors

  try {
    // 🧩 Client-side validation for large images (optional but recommended)
    if (selectedImage && selectedImage.size > 1024 * 1024) { // 1MB limit
      form.setError("image", {
        type: "manual",
        message: "Image size exceeds more than 1MB.",
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
    formData.append("title", data.title || "");
    formData.append("subtitle", data.subtitle || "");
    formData.append("description", data.description || "");
    formData.append("statsNumber", data.statsNumber || "");
    if (selectedImage) formData.append("image", selectedImage);

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/stats/${statId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.status === 200) {
      toast({ title: "✅ Stat updated successfully." });
      router.push("/admin/manage-Stats/manage");
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    console.error("❌ Error:", error);

    // ✅ Handle Axios errors gracefully
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { status, data } = error.response;

        // 🟥 400 - Bad Request (e.g., image too large)
        if (status === 400) {
          form.setError("image", {
            type: "manual",
            message: "Image size exceeds more than 1MB.",
          });

          toast({
            variant: "destructive",
            title: "Upload Error",
            description:
              data?.message || "Image size exceeds more than 1MB.",
          });
        } else {
          // 🟠 Other backend error
          toast({
            variant: "destructive",
            title: `Error ${status}`,
            description:
              data?.message || "Something went wrong while updating the stat.",
          });
        }
      } else {
        // 🌐 Network or CORS issue
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "Unable to reach the server. Please try again later.",
        });
      }
    } else {
      // 🟡 Unexpected JS error
      toast({
        variant: "destructive",
        title: "Unexpected Error",
        description: error.message || "An unknown error occurred.",
      });
    }
  } finally {
    setLoading(false);
  }
};


  const renderInputField = (name, label, placeholder = "") => (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className="border border-gray-400"
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 p-4 bg-white rounded-md w-full"
      >
        {renderInputField("title", "Title")}
        {renderInputField("subtitle", "Subtitle")}
        {renderInputField("description", "Description")}
        {renderInputField("statsNumber", "Stats Number", "e.g. 500+ Clients")}

        <FormField
          name="image"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Upload Image</FormLabel>
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
              {previousImage && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Previous Image:</p>
                  <img
                    src={previousImage}
                    alt="Previous"
                    className="max-w-sm rounded border h-auto w-40"
                  />
                </div>
              )}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="text-white bg-[#2367f8] hover:bg-[#2367f8]"
        >
          {loading ? "Updating..." : "Update Stats"}
        </Button>
      </form>
    </Form>
  );
}

const EditStats = () => {
  const param = useParams();
  const statId = param.id;

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Stats</h1>
          <Link href="/admin/manage-Stats/manage">
            <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]">
              All Stats
            </Button>
          </Link>
        </div>
        <StatsForm statId={statId} />
        <Toaster />
      </div>
    </DefaultLayout>
  );
};

export default EditStats;
