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
import { ToastContainer, toast } from "react-toastify"; // ✅ react-toastify
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import ArnList from "@/components/admin/Arn";
import SocialMediaTable from "@/components/admin/SocialMedia/SocialMedialist";
import { FaSpinner } from "react-icons/fa";

export function InputForm() {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const form = useForm({
    defaultValues: {
      id: "",
      name: "",
      websiteName: "",
      email: "",
      alternateEmail: "",
      mobile: "",
      whatsAppNo: "",
      alternateMobile: "",
      address: "",
      address: "",
      iframe: "",
      mapurl: "",
      websiteDomain: "",
      callbackurl: "",
      appsappleurl: "",
      appsplaystoreurl: "",
      siteurl: "",
      description: ""
    },
  });

  const onSubmit = async (data) => {

    setLoading(true);
    try {
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings/`, data);

      if (response.status === 201) {
        toast.success("Data uploaded successfully!");
      } else {
        toast.error("Something went wrong while saving data!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected server error occurred!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`);
      if (response.status === 200) {
        const data = response.data[0];
        // Set form values
        form.setValue("id", data?._id || "");
        form.setValue("name", data?.name || "");
        form.setValue("description", data?.description || "");
        form.setValue("websiteName", data?.websiteName || "");
        form.setValue("email", data?.email || "");
        form.setValue("alternateEmail", data?.alternateEmail || "");
        form.setValue("alternateMobile", data?.alternateMobile || "");
        form.setValue("whatsAppNo", data?.whatsAppNo || "");
        form.setValue("mobile", data?.mobile || "");
        form.setValue("address", data?.address || "");
        form.setValue("iframe", data?.iframe || "");
        form.setValue("mapurl", data?.mapurl || "");
        form.setValue("websiteDomain", data?.websiteDomain || "");
        form.setValue("callbackurl", data?.callbackurl || "");
        form.setValue("siteurl", data?.siteurl || "");
        form.setValue("appsplaystoreurl", data?.appsplaystoreurl || "");
        form.setValue("appsappleurl", data?.appsappleurl || "");
        form.setValue("image", data?.image || selectedImage);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Name"
                      {...field}
                      required
                      aria-label="name"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Website Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Website Name"
                      {...field}
                      required
                      aria-label="websiteName"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter Email"
                      {...field}
                      required
                      aria-label="Email"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alternateEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Another Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter Email"
                      {...field}

                      aria-label="alternateEmail"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mobile"
                      {...field}
                      required
                      aria-label="Mobile Number"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alternateMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Mobile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Alternate Mobile"
                      {...field}
                      aria-label="alternateMobile"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsAppNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whats App No</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Whats App No"
                      {...field}
                      aria-label="whatsAppNo"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="description"
                      {...field}
                      required
                      aria-label="description"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="websiteDomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Website Domain</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Website Domain"
                      {...field}
                      aria-label="Enter Website Domain"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="callbackurl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Callback Url</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Callback URL"
                      {...field}
                      aria-label="Callback URL"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="siteurl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site URL</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Site URL"
                      {...field}
                      aria-label="Site URL"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appsplaystoreurl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Playstore Url</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="App Playstore Url"
                      {...field}
                      aria-label="App Playstore Url"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appsappleurl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Ios Url</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="App Ios Url"
                      {...field}
                      aria-label="App Ios Url"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 w-full">

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Address"
                      {...field}
                      required
                      aria-label="Address"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mapurl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map URL</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Map URL"
                      {...field}
                      aria-label="Map URL"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Iframe URL</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Map Iframe URL"
                      {...field}
                      aria-label="Map URL"
                      className="border border-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="text-white bg-[#2367f8] hover:bg-[#1e56d9] flex items-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin h-4 w-4" /> Saving...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

const AddPost = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-5">
        <div className="">
          <h1 className="font-bold text-2xl mb-4">
            Site Settings
          </h1>
          <InputForm />
        </div>
        <div className="">
          <ArnList />
        </div>
        <div className="">
          <SocialMediaTable />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddPost;
