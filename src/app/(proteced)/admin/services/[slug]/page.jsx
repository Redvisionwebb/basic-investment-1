"use client";

import React from "react";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminServices = () => {
    return (
        <DefaultLayout>
            <ToastContainer />
            <h2 className="text-xl font-semibold mb-4">Select Services</h2>
        </DefaultLayout>
    );
};

export default AdminServices;
