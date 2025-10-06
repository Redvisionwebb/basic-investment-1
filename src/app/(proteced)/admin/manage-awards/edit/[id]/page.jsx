"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import Image from "next/image";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Award name must be at least 2 characters." }),
  presentedBy: z.string().nonempty({ message: "Presented By is required." }),
  date: z.string().nonempty({ message: "Date is required." }),
  image: z.instanceof(File).optional(),
});

export function AwardEditForm({ awardId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      presentedBy: "",
      date: "",
    },
  });

  // Fetch award data if editing
  useEffect(() => {
    if (awardId) {
      axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/awards/${awardId}`)
        .then(response => {
          const { name, presentedBy, date, image } = response.data.award;
          form.setValue("name", name);
          form.setValue("presentedBy", presentedBy);
          form.setValue("date", date?.substring(0, 10)); // Format date
          setPreviousImage(image?.url);
        })
        .catch(error => {
          console.error("Error fetching award data:", error);
        });
    }
  }, [awardId]);

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("presentedBy", data.presentedBy);
    formData.append("date", data.date);
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/awards/${awardId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast({
          title: "Award updated successfully",
        });
        form.reset();
        router.push("/admin/manage-awards/manage");
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Update request failed.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Unexpected error",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">Award Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. AUM Excellence Award" {...field} className="border border-gray-500" />
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
                <FormLabel className="font-semibold text-gray-700">Presented By</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ICICI Prudential AMC" {...field} className="border border-gray-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">Award Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="border border-gray-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">Upload Award Image</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedImage(file);
                    field.onChange(file);
                  }
                }} className="border border-gray-500" />
              </FormControl>
              <FormMessage />
              {previousImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Previous Image:</p>
               <Image src={previousImage}
                    width={100}
                    height={100} alt="Previous" className="w-40 border rounded" />
                </div>
              )}
            </FormItem>
          )}
        />

        <Button className="text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]" type="submit">
          {!loading ? 'Update Award' : 'Updating...'}
        </Button>
      </form>
    </Form>
  );
}

const EditAward = () => {
  const params = useParams();
  const awardId = params.id;

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <h1 className='font-bold text-2xl'>Edit Award</h1>
        <Link href="/admin/manage-awards/manage">
          <Button className="text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]">All Awards</Button>
        </Link>
      </div>
      <AwardEditForm awardId={awardId} />
      <Toaster />
      </div>
    </DefaultLayout>
  );
};

export default EditAward;
