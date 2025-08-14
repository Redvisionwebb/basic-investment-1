"use client";
import React from "react";
import { useRouter } from "next/navigation";

const ECommerce = ({ session }) => {
    const router = useRouter();
    const user = session;
    if (!user) {
        router.push("/signin");
    }
    return (
        <>
            <h1 className="text-2xl text-center">Admin Dashboard</h1>
            {/* <DataStatsOne /> */}
        </>
    );
};

export default ECommerce;
