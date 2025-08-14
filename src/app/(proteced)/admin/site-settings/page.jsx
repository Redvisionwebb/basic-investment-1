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
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import ArnList from "@/components/admin/Arn";
import SocialMediaTable from "@/components/admin/SocialMedia/SocialMedialist";

export function InputForm() {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // console.log(selectedImage)

  const form = useForm({
    defaultValues: {
      id: "",
      name: "",
      websiteName: "",
      email: "",
      alternateEmail: "",
      mobile: "",
      whatsAppNo:"",
      alternateMobile: "",
      address: "",
      address: "",
      iframe: "",
      mapurl: "",
      websiteDomain: "",
      callbackurl:"",
      appsappleurl:"",
      appsplaystoreurl:"",
      siteurl:"",
      description:""
    },
  });

  const onSubmit = async (data) => {
   
    setLoading(true);
    try {
        if (selectedImage) {
            formData.append('image', selectedImage);
          }
      
          // console.log(data)
      const response = await axios.post("/api/admin/site-settings/", data);
      if (response.status === 201) {
        toast({
          variant: "",
          title: "Data uploaded successfully",
        });
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

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/admin/site-settings");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3"></div>
        <div className="grid grid-cols-2 gap-3">
          {/* Username Field */}
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
                    className="border-2 border-gray-500"
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
                    className="border-2 border-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
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
                    className="border-2 border-gray-500"
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
                    className="border-2 border-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mobile Field */}
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
                    className="border-2 border-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



          {/* Mobile Field */}
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
                    className="border-2 border-gray-500"
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
                    className="border-2 border-gray-500"
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
                    className="border-2 border-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
           {/* Twitter Field */}
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
                    className="border-2 border-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

           {/* Map URL Field */}
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
                  className="border-2 border-gray-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        

         {/* Map URL Field */}
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
                  className="border-2 border-gray-500"
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
                  className="border-2 border-gray-500"
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
                  className="border-2 border-gray-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        {/* Address Field */}
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
                  className="border-2 border-gray-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Map URL Field */}
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
                  className="border-2 border-gray-500"
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
                  className="border-2 border-gray-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="bg-[var(--primary)] text-white hover:bg-black">
          Submit
        </Button>
      </form>
    </Form>
  );
}

const AddPost = () => {
  return (
    <DefaultLayout>
      <div className="">
        <div className="flex justify-between">
          <h1 className="font-bold text-gray-700 text-2xl mb-7">
            Site Settings
          </h1>
        </div>
        <div className="p-5 bg-gray-100 rounded ">
          <InputForm />
          <Toaster />
        </div>
      </div>
      <div className="">
        <div className="p-5 bg-gray-100 rounded ">
          <ArnList/>
          <Toaster />
        </div>
      </div>
    <div className="">
        <div className="p-6 bg-gray-100 rounded ">
          <SocialMediaTable/>
          <Toaster />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddPost;
