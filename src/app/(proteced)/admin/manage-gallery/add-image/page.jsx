"use client";
import React, { useState, useEffect } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

// ✅ Validation schema
const FormSchema = z.object({
  image: z.instanceof(File).optional(),
  category: z.string().nonempty({ message: "Please select a category." }),
});

export function InputForm() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: null,
      category: "",
    },
  });

  // ✅ Fetch gallery categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallerycategory`);
      if (res.status === 200) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Form submission
  const onSubmit = async (data) => {
    // Client-side validation
    if (!selectedImage) {
      form.setError("image", { message: "Please select an image." });
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Please select an image before submitting.",
      });
      return;
    }

    if (selectedImage.size > 1 * 1024 * 1024) {
      form.setError("image", { message: "Image size must be under 1 MB." });
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Image size exceeds 1 MB limit.",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("category", data.category);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        toast({
          title: "Upload successful",
          description: "Image uploaded successfully!",
        });
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-gallery/manage");
      }
    } catch (error) {
      const apiMessage =
        error?.response?.data?.error ||
        "Something went wrong while uploading.";

      // Inline + toast error
      form.setError("root", { type: "manual", message: apiMessage });
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: apiMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 rounded px-7"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ✅ Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">
                  Select Category
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ✅ Image Upload Field */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">
                  Upload Image
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedImage(file);
                        field.onChange(file);
                      }
                    }}
                    className="border border-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ✅ Submit button */}
        <Button
          className="text-white bg-[var(--rv-primary)]"
          type="submit"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Submit"}
        </Button>

        {/* ✅ Inline form error message */}
        {form.formState.errors.root && (
          <p className="text-sm text-red-500">
            {form.formState.errors.root.message}
          </p>
        )}
      </form>
    </Form>
  );
}

const AddPost = () => {
  return (
    <DefaultLayout>
      <div>
        <div className="flex justify-between">
          <h1 className="font-bold text-gray-700 text-2xl mb-7">
            Add New Gallery Image
          </h1>
          <Link href="/admin/manage-gallery/manage">
            <Button className="text-white bg-[var(--rv-primary)]">
              All Gallery Images
            </Button>
          </Link>
        </div>

        <div className="p-5 bg-gray-100 rounded">
          <InputForm />
          <Toaster />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddPost;
