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
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
// Dynamically import JoditEditor with SSR disabled

export function InputForm() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isIframe, setIsIframe] = useState(false); // <-- checkbox state

    const FormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  videoUrl: z.string().optional(),
  image: z
    .any()
    .refine((file) => {
      if (!file) return true;
      return file instanceof File;
    }, { message: "Invalid file input" })
    .optional(),
  embedUrl: z.string().optional(),
});


    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            videoUrl: "",
            image: "",
            embedUrl: ""
        },
    });

    const onSubmit = async (data) => {
        console.log(data)
        setLoading(true);

        if (!isIframe && selectedImage && selectedImage.size > 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "Image too large",
                description: "Please select an image smaller than 1MB.",
            });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        if (!isIframe) {
            if (selectedImage) formData.append("image", selectedImage);
            formData.append("videoUrl", data.videoUrl);
        } else {
            formData.append("embedUrl", data.embedUrl);
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/video-admin`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.status === 201) {
                toast({ title: "✅ Data uploaded successfully" });
                form.reset();
                setSelectedImage(null);
                router.push("/admin/manage-Video/manage");
            } else {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: "destructive",
                title: "Unexpected error",
                description: "Something went wrong. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white">
                {/* Checkbox for Iframe */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isIframe}
                        onChange={(e) => setIsIframe(e.target.checked)}
                        id="iframeCheckbox"
                        className="h-4 w-4"
                    />
                    <label htmlFor="iframeCheckbox" className="font-semibold">Iframe URL</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    {/* Title Field */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Add Video Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Title" {...field} aria-label="Title" className="border border-gray-400" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isIframe ? (
                        // Show Embed URL only when Iframe is checked
                        <FormField
                            control={form.control}
                            name="embedUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Add Embed Url</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Embed URL" {...field} aria-label="embedUrl" className="border border-gray-400" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        // Show Video URL and Image only when Iframe is unchecked
                        <>
                            <FormField
                                control={form.control}
                                name="videoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Add Video Url</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Url" {...field} aria-label="VideoUrl" className="border border-gray-400" />
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
                        </>
                    )}
                </div>

                <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]" type="submit">
                    {!loading ? 'Submit' : 'Loading...'}
                </Button>
            </form>
        </Form>
    );
}


const AddVideo = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                    <h1 className='font-bold text-2xl'>Add New Video</h1>
                    <Link href="/admin/manage-Video/manage">
                        <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]">All Video </Button>
                    </Link>
                </div>
                <div className=''>
                    <InputForm />
                    <Toaster />
                </div>
            </div>
        </DefaultLayout>
    )
}


export default AddVideo;