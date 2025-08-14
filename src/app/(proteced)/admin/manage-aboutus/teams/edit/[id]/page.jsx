"use client";
import React, { useEffect, useState } from "react";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import Link from "next/link";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  designation: z.string().min(1, "Designation is required."),
  experience: z.coerce.number().optional(),
  description: z.string().min(1, "Description is required."),
  image: z.instanceof(File).optional(),
  socialMedia: z.array(
    z.object({
      name: z.string().optional(),
      link: z.string().url("Invalid URL").optional(),
    })
  ).optional(),
});

export function InputForm({ postId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      designation: "",
      experience: 0,
      description: "",
      socialMedia: [{ name: "", link: "" }],
    },
  });

  // Fetch data
  useEffect(() => {
    if (postId) {
      axios.get(`/api/teams/${postId}`)
        .then(res => {

          const data = res.data.teamMember;
          console.log(data)
          form.setValue("name", data.name);
          form.setValue("designation", data.designation);
          form.setValue("experience", data.experience || 0);
          form.setValue("description", data.description);
          form.setValue("socialMedia", data.socialMedia || [{ name: "", link: "" }]);
          setPreviousImage(data.image?.url);
        })
        .catch(err => console.error("Fetch error:", err));
    }
  }, [postId]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("designation", data.designation);
    formData.append("experience", String(data.experience));
    formData.append("description", data.description);
    formData.append("socialMedia", JSON.stringify(data.socialMedia));
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const res = await axios.put(`/api/teams/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast({ title: "Team member updated successfully." });
        router.push("/admin/manage-aboutus/teams/manage");
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 rounded px-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="designation" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Designation</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="experience" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Experience (in years)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField name="description" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <JoditEditor value={field.value} onBlur={field.onBlur} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="image" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Image</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedImage(file);
                  field.onChange(file);
                }
              }} />
            </FormControl>
            <FormMessage />
            {previousImage && (
              <img src={previousImage} alt="Previous" className="mt-2 w-40 rounded border" />
            )}
          </FormItem>
        )} />

        {/* Social Media Section */}
        {form.watch("socialMedia")?.map((_, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <FormField name={`socialMedia.${index}.name`} control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <FormControl><Input {...field} placeholder="LinkedIn, Twitter..." /></FormControl>
              </FormItem>
            )} />
            <FormField name={`socialMedia.${index}.link`} control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl><Input {...field} placeholder="https://..." /></FormControl>
              </FormItem>
            )} />
          </div>
        ))}

        <Button type="submit" className="text-white bg-[var(--primary)]">
          {loading ? "Updating..." : "Update Member"}
        </Button>
      </form>
    </Form>
  );
}

const EditTeam = () => {
  const param = useParams();
  const postId = param.id;

  return (
    <DefaultLayout>
      <div className="flex justify-between mb-7">
        <h1 className="text-2xl font-bold text-gray-700">Edit Team Member</h1>
        <Link href="/admin/manage-aboutus/teams/manage">
          <Button className="text-white bg-[var(--primary)]">All Team Members</Button>
        </Link>
      </div>
      <InputForm postId={postId} />
      <Toaster />
    </DefaultLayout>
  );
};

export default EditTeam;
