"use client";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
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
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const FormSchema = z.object({
        title: z.string().nonempty({ message: "title is required." }),
        image: z.instanceof(File).optional(),
    });
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            image: ""
        },
    });
  const onSubmit = async (data) => {
  setLoading(true);

  // Validate image size before submitting
  if (selectedImage && selectedImage.size > 1024 * 1024) {
    toast({
      variant: "destructive",
      title: "File Too Large",
      description: "Image size exceeds 1MB. Please upload a smaller file.",
    });
    setLoading(false);
    return;
  }

  const formData = new FormData();
  if (selectedImage) formData.append("image", selectedImage);
  formData.append("title", data.title);

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/innerpagebanner/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.status === 201) {
      toast({
        title: "✅ Data uploaded successfully",
      });
      form.reset();
      setSelectedImage(null);
      router.push("/admin/manage-innerpagebanner/manage");
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Unexpected server response.",
      });
    }
  } catch (err) {
    console.error("Error uploading inner page banner:", err);

    if (axios.isAxiosError(err)) {
      if (err.response) {
        // Server responded with a status code outside 2xx
        toast({
          variant: "destructive",
          title: `Error ${err.response.status}`,
          description: err.response.data?.message || "Something went wrong on the server.",
        });
      } else {
        // No response from server
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
        description: err.message || "An unexpected error occurred.",
      });
    }
  } finally {
    setLoading(false);
  }
};


    // Sample categories; replace with your actual categories
    // const categories = ["Technology", "Health", "Education", "Entertainment", "Lifestyle"];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    {/* Username Field */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Banner Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="title" {...field} aria-label="title" className="border border-gray-400" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                {/* Image Upload Field */}
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold">Upload Image</FormLabel>
                            <FormControl>
                                <Input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setSelectedImage(file);
                                        field.onChange(file); // Update react-hook-form with selected file
                                    }
                                }} aria-label="Image" className="border border-gray-400" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]" type="submit">{!loading ? 'Submit' : 'Loading...'}</Button>
            </form>
        </Form>
    );
}

const AddPost = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
            <div className="flex justify-between">
                <h1 className='font-bold  text-2xl '>Add New Inner Banner</h1>
                <Link href="/admin/manage-innerpagebanner/manage">
                    <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]">All Inner Banner</Button>
                </Link>
            </div>
                <InputForm />
                <Toaster />
            </div>
        </DefaultLayout>
    )
}


export default AddPost;