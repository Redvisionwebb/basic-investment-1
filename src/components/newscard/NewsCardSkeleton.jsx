import React from "react";

export default function NewsCardSkeleton() {
    return (
        <div className="">
            <div className="bg-white border border-gray-200 rounded-lg shadow relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/40 to-transparent animate-[shimmer_2s_infinite]" />

                <div className="w-full h-52 bg-gray-300 rounded-t-lg"></div>

                <div className="absolute top-2 left-2 w-20 h-6 bg-gray-400 rounded-full border-2 border-white"></div>

                <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );
}
