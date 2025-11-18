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
import { useParams, useRouter } from "next/navigation";
import { DefaultContext } from "react-icons";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FormSchema = z.object({
    title: z.string().nonempty({ message: "title is required." }),
    image: z.instanceof(File).optional(),
    designation: z.string().nonempty({ message: "designation is required." }),
    auther_url: z.string().nonempty({ message: "Auther Url is required." }),

});

export function InputForm({ postId }) {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previousImage, setPreviousImage] = useState(null);
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            designation: "",
            auther_url: ""
        },
    });

    // Fetch the post data if editing
    useEffect(() => {
        if (postId) {
            axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/homebanner/${postId}`)
                .then(response => {
                    const { title, designation, auther_url, image } = response.data.homeBanner;
                    form.setValue('title', title);
                    form.setValue('designation', designation);
                    form.setValue('auther_url', auther_url);
                    setPreviousImage(image?.url);
                })
                .catch(error => {
                    console.error("Error fetching post data:", error);
                });
        }
    }, [postId]);

const onSubmit = async (data) => {
  setLoading(true);
  form.clearErrors(); // clear old inline errors

  try {
    // 🧩 Client-side file size validation (1 MB max)
    if (selectedImage && selectedImage.size > 1024 * 1024) {
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
    if (selectedImage) formData.append("image", selectedImage);
    if (data.title) formData.append("title", data.title);
    if (data.designation) formData.append("designation", data.designation);
    if (data.auther_url) formData.append("auther_url", data.auther_url);

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/homebanner/${postId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response.status === 200) {
      toast({
        title: "✅ Post updated successfully",
      });
      form.reset();
      setSelectedImage(null);
      router.push("/admin/manage-homebanner/manage");
    } else {
      throw new Error("Unexpected response from server");
    }
  } catch (error) {
    console.error("❌ Error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { status, data } = error.response;

        // 🟥 Handle 400 error (image too large, invalid input, etc.)
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
          // 🟠 Other backend errors (500, etc.)
          toast({
            variant: "destructive",
            title: `Error ${status}`,
            description:
              data?.message || "Something went wrong while updating the banner.",
          });
        }
      } else {
        // 🌐 Network or CORS issues
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "Unable to reach the server. Please try again later.",
        });
      }
    } else {
      // 🟡 Non-Axios or unexpected JS errors
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    {/* Username Field */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="title" {...field} aria-label="title" className="border border-gray-400" />
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
                                    <Input placeholder="designation" {...field} aria-label="designation" className="border border-gray-400" />
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
                                <FormLabel className="font-semibold">Auther url</FormLabel>
                                <FormControl>
                                    <Input placeholder="Auther url" {...field} aria-label="auther_url" className="border border-gray-400" />
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
                            {previousImage && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">Previous Image:</p>
                                    <img src={previousImage} alt="Previous Image" className="max-w-sm rounded border h-auto w-40" />
                                </div>
                            )}
                        </FormItem>
                    )}
                />

                <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]" type="submit">{!loading ? 'Submit' : 'Loading...'}</Button>
            </form>
        </Form>
    );
}

const EditPost = () => {
    const param = useParams();
    const postId = param.id
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                    <h1 className='font-bold text-2xl'>
                        Edit Advertisement
                    </h1>
                    <Link href="/admin/manage-homebanner/manage">
                        <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]">All Advertisement</Button>
                    </Link>
                </div>
                <InputForm postId={postId} />
                <Toaster />
            </div>
        </DefaultLayout>
    );
};

export default EditPost;