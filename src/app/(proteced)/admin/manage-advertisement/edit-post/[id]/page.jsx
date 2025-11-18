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
    link: z.string().nonempty({ message: "Link is required." }),
    image: z.instanceof(File).optional(),
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
            link: "",
        },
    });

    // Fetch the post data if editing
    useEffect(() => {
        if (postId) {
            axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/advertisement/${postId}`)
                .then(response => {
                    const { link, image } = response.data.advertisement;
                    form.setValue('link', link);
                    setPreviousImage(image?.url);
                })
                .catch(error => {
                    console.error("Error fetching post data:", error);
                });
        }
    }, [postId]);

const onSubmit = async (data) => {
    setLoading(true);

    // Image validation (optional, max 1MB)
    if (selectedImage && selectedImage.size > 1024 * 1024) {
        toast({
            variant: "destructive",
            title: "Image too large",
            description: "Please select an image smaller than 1MB.",
        });
        setLoading(false);
        return;
    }

    const formData = new FormData();
    if (selectedImage) formData.append("image", selectedImage);
    formData.append("link", data.link);

    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/advertisement/${postId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 200) {
            toast({ title: "✅ Advertisement updated successfully" });
            form.reset();
            setSelectedImage(null);
            router.push("/admin/manage-advertisement/manage");
        } else {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            });
        }
    } catch (error) {
        console.error("Error:", error);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">link</FormLabel>
                                <FormControl>
                                    <Input placeholder="link" {...field} aria-label="link" className="border border-gray-400" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

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
                                        field.onChange(file);
                                    }
                                }} aria-label="Image" className="border border-gray-400" />
                            </FormControl>
                            <FormMessage />
                            {previousImage && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">Previous Image:</p>
                                    <img src={previousImage} alt="Previous Image" className="max-w-sm rounded border border-gray-400 h-auto w-40" />
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
                    <Link href="/admin/manage-advertisement/manage">
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