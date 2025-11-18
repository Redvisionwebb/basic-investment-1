"use client";
import React, { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

export function InputForm({ postId }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousImage, setPreviousImage] = useState(null);
  const [embedEntered, setEmbedEntered] = useState(false);

  const FormSchema = z.object({
    title: z
      .string()
      .min(2, { message: "Title must be at least 2 characters." })
      .optional(),
    videoUrl: z.string().optional(),
    embedUrl: z.string().optional(),
    image: z.union([z.instanceof(File), z.string()]).optional(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      videoUrl: "",
      image: "",
      embedUrl: "",
    },
  });

  // Fetch existing data if editing
  useEffect(() => {
    if (postId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/video-admin/${postId}`)
        .then((response) => {
          const { title, videoUrl, image, embedUrl } = response?.data?.video;
          form.setValue("title", title || "");
          form.setValue("videoUrl", videoUrl || "");
          form.setValue("embedUrl", embedUrl || "");
          setPreviousImage(image?.url || null);

          setEmbedEntered(embedUrl && embedUrl.trim() !== "");
        })
        .catch((error) => {
          console.error("Error fetching video data:", error);
          toast({
            variant: "destructive",
            title: "Failed to load video",
            description: "Could not fetch video data.",
          });
        });
    }
  }, [postId]);

  // Watch embedUrl to toggle other fields
  useEffect(() => {
    const subscription = form.watch((value) => {
      setEmbedEntered(value.embedUrl && value.embedUrl.trim() !== "");
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmitForm = async (data) => {
    setLoading(true);

    // Prevent empty submission
    if (
      (!data.embedUrl || data.embedUrl.trim() === "") &&
      !data.title &&
      !data.videoUrl &&
      !selectedImage
    ) {
      toast({
        variant: "destructive",
        title: "Nothing to update",
        description: "Please enter at least one field before submitting.",
      });
      setLoading(false);
      return;
    }

    // Validate image size
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

    // Append all fields; server will prioritize
    if (data.embedUrl && data.embedUrl.trim() !== "") {
      formData.append("embedUrl", data.embedUrl.trim());
    }
    if (data.title) formData.append("title", data.title);
    if (data.videoUrl) formData.append("videoUrl", data.videoUrl);
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/video-admin/${postId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast({ title: "✅ Video updated successfully" });
        form.reset();
        setSelectedImage(null);
        router.push("/admin/manage-Video/manage");
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
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {/* Embed URL Field */}
          {embedEntered && (
            <FormField
              control={form.control}
              name="embedUrl"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-semibold">Embed URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter embed URL"
                      {...field}
                      aria-label="embedUrl"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Regular Fields */}
          {!embedEntered && (
            <>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Title"
                        {...field}
                        aria-label="title"
                        className="border border-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Video URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter video URL"
                        {...field}
                        aria-label="videoUrl"
                        className="border border-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
                    {previousImage && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Previous Image:</p>
                        <img
                          src={previousImage}
                          alt="Previous Image"
                          className="max-w-sm rounded border h-auto w-40"
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <Button
          className="text-white bg-[#2367f8] hover:bg-[#2367f8]"
          type="submit"
          disabled={loading}
        >
          {!loading ? "Submit" : "Loading..."}
        </Button>
      </form>
    </Form>
  );
}

const EditVideo = () => {
  const param = useParams();
  const postId = param.id;

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl">Edit Video</h1>
          <Link href="/admin/manage-Video/manage">
            <Button className="text-white bg-[#2367f8] hover:bg-[#2367f8]">
              All Posts
            </Button>
          </Link>
        </div>
        <InputForm postId={postId} />
        <Toaster />
      </div>
    </DefaultLayout>
  );
};

export default EditVideo;
