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
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FormSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    image: z.instanceof(File).optional(),
});

export function AboutUsForm({ aboutId }) {
    const router = useRouter();
    const editor = useRef(null);
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previousImage, setPreviousImage] = useState(null);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
        },
    });

    useEffect(() => {
        if (aboutId) {
            axios.get(`/api/aboutus/${aboutId}`)
                .then(response => {
                    const { title, description, image } = response.data.about;
                    form.setValue('title', title);
                    setDescription(description);
                    setPreviousImage(image?.url);
                })
                .catch(error => {
                    console.error("Error fetching About Us data:", error);
                });
        }
    }, [aboutId]);

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', description);
        if (selectedImage) formData.append('image', selectedImage);

        try {
            const response = await axios.put(`/api/aboutus/${aboutId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                toast({ title: `About Us updated successfully` });
                form.reset();
                router.push("/admin/manage-aboutus/about-us/manage");
            } else {
                toast({
                    variant: "destructive",
                    title: "Update failed",
                    description: "Something went wrong.",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 rounded px-7">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-gray-700">Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} aria-label="Title" className="border border-gray-500" />
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
                            <FormLabel className="font-semibold text-gray-700">Upload Image</FormLabel>
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
                                    className="border border-gray-500"
                                />
                            </FormControl>
                            <FormMessage />
                            {previousImage && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">Previous Image:</p>
                                    <img src={previousImage} alt="Previous" className="max-w-sm rounded border h-auto w-40" />
                                </div>
                            )}
                        </FormItem>
                    )}
                />

                <div>
                    <FormLabel className="font-semibold text-gray-700">Description</FormLabel>
                    <JoditEditor
                        ref={editor}
                        value={description}
                        tabIndex={1}
                        onBlur={newContent => setDescription(newContent)}
                        onChange={() => { }}
                    />
                </div>

                <Button className="text-white bg-[var(--primary)]" type="submit">
                    {!loading ? 'Update' : 'Updating...'}
                </Button>
            </form>
        </Form>
    );
}

const EditAboutUs = () => {
    const param = useParams();
    const aboutId = param.id;

    return (
        <DefaultLayout>
            <div className="flex justify-between">
                <h1 className='font-bold text-gray-700 text-2xl mb-7'>
                    Edit About Us
                </h1>
                <Link href="/admin/manage-aboutus/about-us/manage">
                    <Button className="text-white bg-[var(--primary)]">All Entries</Button>
                </Link>
            </div>
            <AboutUsForm aboutId={aboutId} />
            <Toaster />
        </DefaultLayout>
    );
};

export default EditAboutUs;
