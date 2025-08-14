
import ECommerce from "@/components/admin/Dashboard";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import React from "react";
import { authOptions } from "@/lib/next-auth";
import { getServerSession } from "next-auth";


export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <>
      <DefaultLayout>
        <ECommerce session={session} />
      </DefaultLayout>
    </>
  );
}
