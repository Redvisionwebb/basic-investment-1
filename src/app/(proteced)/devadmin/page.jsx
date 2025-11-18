
import ECommerce from "@/components/admin/Dashboard";
import React from "react";
import { authOptions } from "@/lib/next-auth";
import { getServerSession } from "next-auth";
import DefaultLayout from "@/components/admin/devadmin/Layouts/DefaultLaout";
import { getActiveServicesCount, getAllLeadsCount, getAwardsCount, getBlogsCount, getFaqsCount, getTestimonialsCount } from "@/lib/functions";



export default async function Home() {
  const session = await getServerSession(authOptions);
    const leadscount=await getAllLeadsCount();
    const activeServicescount=await getActiveServicesCount();
    const awardscount=await getAwardsCount();
    const faqscount=await getFaqsCount();
    const testiomonialscount=await getTestimonialsCount()
    const blogscount = await getBlogsCount();
  return (
    <>
      <DefaultLayout>
        <ECommerce session={session} blogscount={blogscount} testiomonialscount={testiomonialscount} faqscount={faqscount} leadscount={leadscount} activeServicescount={activeServicescount} awardscount={awardscount} />
      </DefaultLayout>
    </>
  );
}
