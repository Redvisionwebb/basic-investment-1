import Footer from "@/components/footer/footer";
import InnerBanner from "@/components/innerBanner/InnerBanner";
import NavBar from "@/components/navbar/navbar";
import { getArn, getServiceData, getSiteData, getSocialMedia } from "@/lib/functions";
import Image from "next/image";
import Link from "next/link";


export default async function NotFound() {

  const services = await getServiceData();
  const siteData = await getSiteData();
  const socialMedia = await getSocialMedia();
  const arnData = await getArn();

  return (
    <>
      <div className="">
        <NavBar services={services} />
        <InnerBanner title={"Page Not Found"} />
        <div className="w-full py-16 p-4 flex flex-col items-center justify-center">
          <div className='flex items-center justify-center max-w-2xl gap-5 flex-col text-center'>
            <Image src={'/images/notfound/notfound.svg'} width={600} height={400} />
            <h2 className="">
              Oops, you&apos;ve lost in space </h2>
            <p>The page you are looking for doesn&apos;t exist. It may have been moved or removed altogether. Please try searching for some other page, or return to the website&apos;s homepage to find what you&apos;re looking for.</p>
            <div>
              <Link href="/" className={`btn btn-primary`}>
                Back To Home
              </Link>
            </div>
          </div>
        </div>
        <Footer services={services} siteData={siteData} socialmedialinks={socialMedia} arnData={arnData} />
      </div>
    </>
  );
}