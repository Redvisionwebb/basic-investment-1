"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Banner from "@/components/banner/banner";
import InnerBanner from "@/components/innerBanner/InnerBanner";

const UsefulLinksPage = () => {
  const [usefulLink, setUsefulLink] = useState([]);
  const fetchLinks = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/useful-links?apikey=${process.env.NEXT_PUBLIC_API_KEY}`
    );
    if (res.ok) {
      const data = await res.json();
      setUsefulLink(data);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  console.log(usefulLink)

  return (
    <div className="">
      <InnerBanner pageName={"Useful Links"} />
      <div className="container mx-auto md:px-20 px-4 py-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usefulLink
            .filter(link => link.title === "Check Your KYC")
            .map((link, index) => (
              <Link href={link.link} key={index} target="_blank" rel="noopener noreferrer">
                <div className="bg-[var(--rv-primary)] text-white border flex align-center   rounded-[var(--rv-radius)] px-10 p-5 text-center hover:shadow-xl transition hover:text-white duration-300 flex flex-col justify-center items-center">
                  <h3 className="text-xl font-semibold m-0 p-0">{link.title}</h3>
                </div>
              </Link>
            ))}
          <Link href={"https://www.bajajfinserv.in/investments/fixed-deposit?PartnerCode=10017707&utm_source=B2B_PRIME1&utm_medium=B2B&utm_campaign=PRIME1"} target="_blank" rel="noopener noreferrer">
            <div className="bg-[var(--rv-primary)] text-white border flex align-center   rounded-[var(--rv-radius)] px-10 p-5 text-center hover:shadow-xl transition hover:text-white duration-300 flex flex-col justify-center items-center">
              <h3 className="text-xl font-semibold m-0 p-0">Bajaj Finance FD</h3>
            </div>
          </Link>
          <Link href={"https://eportal.incometax.gov.in/iec/foservices/#/pre-login/link-aadhaar-status"} target="_blank" rel="noopener noreferrer">
            <div className="bg-[var(--rv-primary)] text-white border flex align-center   rounded-[var(--rv-radius)] px-10 p-5 text-center hover:shadow-xl transition hover:text-white duration-300 flex flex-col justify-center items-center">
              <h3 className="text-xl font-semibold m-0 p-0">Aadhar-Pan Link Status</h3>
            </div>
          </Link>
          <Link href={"https://www.camsonline.com/Investors/Service-requests/GoGreen/Form15G-H"} target="_blank" rel="noopener noreferrer">
            <div className="bg-[var(--rv-primary)] text-white border flex align-center   rounded-[var(--rv-radius)] px-10 p-5 text-center hover:shadow-xl transition hover:text-white duration-300 flex flex-col justify-center items-center">
              <h3 className="text-xl font-semibold m-0 p-0">CAMS 15G/15H</h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UsefulLinksPage;
