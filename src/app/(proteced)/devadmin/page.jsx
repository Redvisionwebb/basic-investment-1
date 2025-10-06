
import ECommerce from "@/components/admin/Dashboard";
import React from "react";
import { authOptions } from "@/lib/next-auth";
import { getServerSession } from "next-auth";
import DefaultLayout from "@/components/admin/devadmin/Layouts/DefaultLaout";


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
