"use client";

import React, { useState } from "react";
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

export function AwardInputForm() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const FormSchema = z.object({
    name: z.string().min(2, { message: "Award name must be at least 2 characters." }),
    presentedBy: z.string().nonempty({ message: "Presented By is required." }),
    date: z.string().nonempty({ message: "Date is required." }),
    image: z.instanceof(File).optional(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      presentedBy: "",
      date: "",
      image: ""
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('name', data.name);
    formData.append('presentedBy', data.presentedBy);
    formData.append('date', data.date);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/awards`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        toast({
          variant: '',
          title: "Award added successfully",
        });
        form.reset();
        router.push("/admin/manage-awards/manage");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Award Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. AUM Growth Excellence Award" {...field} className="border border-gray-400" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Presented By */}
          <FormField
            control={form.control}
            name="presentedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Presented By</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ICICI Prudential AMC" {...field} className="border border-gray-400" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Award Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="border border-gray-400"
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
              <FormLabel className="font-semibold">Upload Award Image</FormLabel>
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
                  className="border border-gray-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]" type="submit">
          {!loading ? 'Submit' : 'Uploading...'}
        </Button>
      </form>
    </Form>
  );
}

const AddAward = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className='font-bold text-2xl '>Add New Award</h1>
          <Link href="/admin/manage-awards/manage">
            <Button className="text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]">All Awards</Button>
          </Link>
        </div>

        <AwardInputForm />
        <Toaster />
      </div>
    </DefaultLayout>
  );
};

export default AddAward;
