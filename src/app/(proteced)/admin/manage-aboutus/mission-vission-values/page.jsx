"use client";
import React, { useEffect, useRef, useState } from "react";
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
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const FormSchema = z.object({
  mission: z.string().nonempty({ message: "Mission is required." }),
  vision: z.string().nonempty({ message: "Vision is required." }),
  values: z.string().nonempty({ message: "Values are required." }),
});

export function MissionVisionForm() {
  const editor = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mission: "",
      vision: "",
      values: "",
    },
  });

  // Fetch existing data and set it to form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/mission-vision");
        if (response.data) {
          form.reset({
            mission: response.data.mission || "",
            vision: response.data.vision || "",
            values: response.data.values || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch mission/vision:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, [form]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/mission-vision", data);
      if (response.status === 201) {
        toast({
          title: "Mission & Vision saved successfully!",
        });
        form.reset(data); // Reset to submitted values
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
          description: "Failed to save the data.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Server Error",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 rounded px-7"
      >
        <FormField
          control={form.control}
          name="mission"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">
                Mission
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Mission"
                  {...field}
                  className="border border-gray-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vision"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">
                Vision
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Vision"
                  {...field}
                  className="border border-gray-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-700">
                Values
              </FormLabel>
              <FormControl>
                <div className="border border-gray-500 rounded overflow-hidden">
                  <JoditEditor
                    ref={editor}
                    value={field.value}
                    onBlur={(newContent) => field.onChange(newContent)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="text-white bg-[var(--primary)]"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}

const AddMissionVisionPage = () => {
  return (
    <DefaultLayout>
      <div className="flex justify-between">
        <h1 className="font-bold text-gray-700 text-2xl mb-7">
          Add / Update Mission, Vision & Values
        </h1>
      </div>
      <div className="p-5 bg-gray-100 rounded">
        <MissionVisionForm />
        <Toaster />
      </div>
    </DefaultLayout>
  );
};

export default AddMissionVisionPage;
