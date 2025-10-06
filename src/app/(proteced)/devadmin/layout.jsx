"use client"
import React, { useEffect, useState } from "react";
import Loader from "../../../components/admin/common/Loader";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const router = useRouter();
  // const pathname = usePathname();
  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
      setLoading(false);
      if (sessionData?.user?.role === "normaladmin") {
        router.push("/admin");
      }
    };
    fetchSession();
  }, [router]);
 
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
 
  return (
    <div>
      {loading ? <Loader /> : children}
    </div>
  );
}