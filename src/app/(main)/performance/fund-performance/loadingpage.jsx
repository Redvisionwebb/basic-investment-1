"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageLoading() {
    return (
        <div className="">
            {/* Skeleton for categories */}
            <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-5 mb-5">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="px-3 py-3 bg-white border border-gray-300 rounded shadow flex flex-col items-center"
                    >
                        <Skeleton className="w-16 h-16 mb-5" />
                        <Skeleton className="w-20 h-5" />
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-1 grid-cols-1 gap-5">
                {/* Skeleton for search bar and schemes */}
                <div className="col-span-1">
                    <Skeleton className="w-full h-10 mb-3" />
                    {Array.from({ length: 10 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="w-full h-10 mb-2"
                        />
                    ))}
                </div>

                {/* Skeleton for performance table */}
                <div className="col-span-3">
                    <Skeleton className="w-full h-10 mb-5" />
                    <div className="overflow-hidden border border-gray-300 rounded">
                        <Skeleton className="w-full h-8 bg-gray-100" />
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton key={index} className="w-full h-8 border-b mb-3" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
