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

const FormSchema = z.object({
    posttitle: z.string().min(2, { message: "Post title must be at least 2 characters." }),
    metatitle: z.string().nonempty({ message: "Meta Title is required." }),
    description: z.string().nonempty({ message: "Description is required." }),
    image: z.instanceof(File).optional(),
    category: z.string().nonempty({ message: "Please select a category." }),
});

export function InputForm() {
    const router = useRouter();
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            posttitle: "",
            metatitle: "",
            description: "",
            keywords: "",
        },
    });

    const onSubmit = async (data) => {
        setLoading(true)
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('posttitle', data.posttitle);
        formData.append('metatitle', data.metatitle);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('keywords', data.keywords);
        formData.append('content', content);

        try {
            const response = await axios.post('/api/blogs/', formData, {
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
                router.push("/admin/manage-posts/manage")
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
            alert("An unexpected error occurred.");
        }
        finally { setLoading(false) }
    };

    // Sample categories; replace with your actual categories
    // const categories = ["Technology", "Health", "Education", "Entertainment", "Lifestyle"];
    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/category/");
            if (response.status === 200) {
                setCategories(response.data)
            }
        }
        catch (error) {
            console.log(error)
        }

    }

    React.useEffect(() => { fetchCategories(); }, [])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 rounded px-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Username Field */}
                    <FormField
                        control={form.control}
                        name="posttitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-gray-700">Post Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Post Title" {...field} aria-label="Post Title" className="border border-gray-500" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Mobile Field */}
                    <FormField
                        control={form.control}
                        name="metatitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-gray-700">Meta Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Meta Title" {...field} aria-label="Meta Title" className="border border-gray-500" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description Field */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-gray-700">Post Description</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Description" {...field} aria-label="Description" className="border border-gray-500" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Post Keyword Field */}
                    <FormField
                        control={form.control}
                        name="keywords"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-gray-700">Post Keyword</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Keywords" {...field} aria-label="Keywords" className="border border-gray-500" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category Selection */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-gray-700">Select Category</FormLabel>
                                <FormControl>
                                    <select {...field} className="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                        <option value="">Select a category</option>
                                        {categories && categories?.map((category, index) => (
                                            <option key={index} value={category._id}>{category.title}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                </div>
                <JoditEditor
                    ref={editor}
                    value={content}
                    tabIndex={1}
                    onBlur={newContent => setContent(newContent)}
                    onChange={newContent => { }}
                />
                <Button className="text-white bg-[var(--primary)]" type="submit">{!loading ? 'Submit' : 'Loading...'}</Button>
            </form>
        </Form>
    );
}

const AddPost = () => {
    return (
        <DefaultLayout>
            <div className="">
                <div className="flex justify-between">
                    <h1 className='font-bold text-gray-700 text-2xl mb-7'>Add New Post</h1>
                    <Link href="/admin/manage-posts/manage">
                        <Button className="text-white bg-[var(--primary)]" >All Post</Button>
                    </Link>
                </div>
                <div className='p-5 bg-gray-100 rounded '>
                    <InputForm />
                    <Toaster />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default AddPost;