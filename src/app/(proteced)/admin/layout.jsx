"use client"
import Loader from "@/components/admin/common/Loader";
import React, { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div>
      {loading ? <Loader /> : children}
    </div>
  );
}
