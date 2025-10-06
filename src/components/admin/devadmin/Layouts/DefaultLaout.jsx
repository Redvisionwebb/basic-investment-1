"use client";
import React from "react";
import Sidebar from "@/components/admin/devadmin/Sidebar";
import Header from "@/components/admin/devadmin/Header";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

const LayoutContent = ({ children }) => {
    const { sidebarOpen, isMobile } = useSidebar();

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div
                className={`
          flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isMobile ? "w-full" : sidebarOpen ? "ml-0" : "ml-0"}`}>
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-100 p-4">{children}</main>
            </div>
        </div>
    );
};

export default function DefaultLayout({ children }) {
    return (
        <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
    );
}