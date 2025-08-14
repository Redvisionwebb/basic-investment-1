"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
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

// Jodit Editor
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FormSchema = z.object({
  title: z.string().nonempty({ message: "Title is required." }),
  description: z.string().nonempty({ message: "Description is required." }),
  image: z.any().optional(),
});

export function InputForm() {
  const router = useRouter();
  const editor = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { setValue } = form;

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.post("/api/aboutus", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast({ title: "Success", description: "About Us entry created." });
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-aboutus/about-us/manage");
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to submit." });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-7">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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

        {/* Image Upload */}
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
        <Button className="text-white bg-[var(--primary)]" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

const AddAboutUsPost = () => (
  <DefaultLayout>
    <div className="flex justify-between">
      <h1 className="font-bold text-gray-700 text-2xl mb-7">Add About Us</h1>
      <Link href="/admin/manage-aboutus/about-us/manage">
        <Button className="text-white bg-[var(--primary)]">Manage About Us</Button>
      </Link>
    </div>
    <div className="p-5 bg-gray-100 rounded">
      <InputForm />
      <Toaster />
    </div>
  </DefaultLayout>
);

export default AddAboutUsPost;
