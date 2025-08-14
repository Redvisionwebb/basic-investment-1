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
        designation: z.string().nonempty({ message: "designation is required." }),
        auther_url: z.string().optional(),
    });
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            image: "",
            designation:"",
            auther_url:""
        },
    });
    const onSubmit = async (data) => {
        setLoading(true)
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('title', data.title);
        formData.append('designation', data.designation);
        formData.append('auther_url', data.auther_url);

        try {
            const response = await axios.post('/api/homebanner/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                toast({
                    variant: '',
                    title: "Data uploaded successfully",
                    // description: "There was a problem with your request.",
                });
                form.reset();
                router.push("/admin/manage-homebanner/manage")
                setSelectedImage(null);
            } else {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An unexpected error occurred.", error);
        }
        finally { setLoading(false) }
    };

    // Sample categories; replace with your actual categories
    // const categories = ["Technology", "Health", "Education", "Entertainment", "Lifestyle"];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 rounded px-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Username Field */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-gray-700">Banner Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="title" {...field} aria-label="title" className="border border-gray-500" />
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
                                <FormLabel className="font-semibold text-gray-700">Designation</FormLabel>
                                <FormControl>
                                    <Input placeholder="designation" {...field} aria-label="designation" className="border border-gray-500" />
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
                                <FormLabel className="font-semibold text-gray-700">Auther Url</FormLabel>
                                <FormControl>
                                    <Input placeholder="Auther Url" {...field} aria-label="auther_url" className="border border-gray-500" />
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
                            <FormLabel className="font-semibold text-gray-700">Upload Image</FormLabel>
                            <FormControl>
                                <Input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setSelectedImage(file);
                                        field.onChange(file); // Update react-hook-form with selected file
                                    }
                                }} aria-label="Image" className="border border-gray-500" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="text-white bg-[var(--primary)]" type="submit">{!loading ? 'Submit' : 'Loading...'}</Button>
            </form>
        </Form>
    );
}

const AddPost = () => {
    return (
        <DefaultLayout>
            <div className="flex justify-between">
                <h1 className='font-bold text-gray-700 text-2xl mb-7'>Add New Home  Banner</h1>
                <Link href="/admin/manage-homebanner/manage">
                    <Button className="text-white bg-[var(--primary)]">All Home  Banner</Button>
                </Link>
            </div>
            <div className='p-5 bg-gray-100 rounded '>
                <InputForm />
                <Toaster />
            </div>
        </DefaultLayout>
    )
}


export default AddPost;