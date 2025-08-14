"use client";
import React, { useRef, useEffect, useState } from "react";
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
  const editor = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousImage, setPreviousImage] = useState(null);

  const FormSchema = z.object({
    title: z
      .string()
      .min(2, { message: "Title must be at least 2 characters." }),
    videoUrl: z.string().nonempty({ message: "videoUrl is required." }),
    image: z.instanceof(File).optional(),
    embedUrl: z.string().optional(),
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

  // Fetch the post data if editing
  useEffect(() => {
    if (postId) {
      axios
        .get(`/api/video-admin/${postId}`)
        .then((response) => {
          const { title, videoUrl, image, embedUrl } = response?.data?.video;
          form.setValue("title", title);
          form.setValue("videoUrl", videoUrl);
          form.setValue("embedUrl", embedUrl);
          setPreviousImage(image?.url);
        })
        .catch((error) => {
          console.error("Error fetching Video data:", error);
        });
    }
  }, [postId]);

  const onSubmit = async (data) => {
    // console.log("data");
    setLoading(true);
    const formData = new FormData();

    formData.append("image", selectedImage);
    formData.append("title", data.title);
    formData.append("videoUrl", data.videoUrl);
    formData.append("embedUrl", data.embedUrl);

    try {
      let response;
      response = await axios.put(`/api/video-admin/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        toast({
          variant: "",
          title: `video Updated successfully`,
        });
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
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 rounded px-7"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Username Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Title"
                    {...field}
                    aria-label="title"
                    className="border border-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Designation Field */}
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">
                  Video Url
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="videoUrl"
                    {...field}
                    aria-label="videoUrl"
                    className="border border-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="embedUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">
                  Embed Url
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="embedUrl"
                    {...field}
                    aria-label="embedUrl"
                    className="border border-gray-500"
                  />
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
              <FormLabel className="font-semibold text-gray-700">
                Upload Image
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedImage(file);
                      field.onChange(file); // Update react-hook-form with selected file
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
        <Button className="text-white bg-[var(--primary)] " type="submit">
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
      <div className="py-10 px-10">
        <div className="flex justify-between">
          <h1 className="font-bold text-gray-700 text-2xl mb-7">Edit Video</h1>
          <Link href="/admin/manage-Video/manage">
            <Button className="text-white bg-[var(--primary)]">
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
