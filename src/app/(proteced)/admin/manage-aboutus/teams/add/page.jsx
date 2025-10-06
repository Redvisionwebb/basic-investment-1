"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import Link from "next/link";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

// ✅ Fixed Schema
const FormSchema = z.object({
  name: z.string().nonempty("Name is required."),
  designation: z.string().nonempty("Designation is required."),
  experience: z.coerce.number().min(0, "Experience must be a positive number."),
  description: z.string().nonempty("Description is required."),
  image: z.any().optional(), // Fixed file handling
  socialMedia: z
    .array(
      z.object({
        name: z.optional(),
        link: z.optional(),
      })
    )
    .optional(),
});

const TeamForm = () => {
  const editor = useRef(null);
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      designation: "",
      experience: 0,
      description: "",
      image: "",
      socialMedia: [{ name: "", link: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialMedia",
  });

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("designation", data.designation);
    formData.append("experience", data.experience.toString());
    formData.append("description", data.description); // use synced field
    if (selectedImage) formData.append("image", selectedImage);
    formData.append("socialMedia", JSON.stringify(data.socialMedia));

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/teams`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast({ title: "Team member added successfully!" });
        form.reset();
        setDescription("");
        setSelectedImage(null);
        router.push("/admin/manage-aboutus/teams/manage");
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong while submitting the form.",
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} className="border border-gray-400" />
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
                  <Input placeholder="Enter designation" {...field} className="border border-gray-400" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Experience (Years)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Years of experience" {...field} className="border border-gray-400" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Description</FormLabel>
                <JoditEditor
                  ref={editor}
                  value={description}
                  onBlur={(newContent) => {
                    setDescription(newContent);
                    form.setValue("description", newContent); // Sync JoditEditor with form
                  }}
                />
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
                <Input
                  type="file"
                  accept="image/*"
                  className="border border-gray-400"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImage(file);
                      field.onChange(file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-5 w-full items-start">
          <FormLabel className="font-semibold">Social Media Links</FormLabel>
          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center w-full">
              <FormField
                control={form.control}
                name={`socialMedia.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Platform (e.g., LinkedIn)" {...field} className="border border-gray-400" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socialMedia.${index}.link`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="URL" {...field} className="border border-gray-400" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-600 hover:bg-red-600 text-white mt-1"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => append({ name: "", link: "" })}
            className="text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]"
          >
            + Add Social Link
          </Button>
        </div>

        {/* Show validation errors for debugging */}
        {Object.entries(form.formState.errors).map(([key, err]) => (
          <p key={key} className="text-red-600 text-sm">
            {key}: {err?.message}
          </p>
        ))}

        <Button type="submit" className="text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]">
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

const AddPost = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Add Team Member</h1>
          <Link href="/admin/manage-aboutus/teams/manage">
            <Button className="text-white bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)]">All Team Members</Button>
          </Link>
        </div>
        <TeamForm />
        <Toaster />
      </div>
    </DefaultLayout>
  );
};

export default AddPost;
