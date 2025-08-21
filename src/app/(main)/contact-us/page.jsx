import ContactReusableForm from "@/components/landing/contactSectionPage/Contactreusableform";
import InnerBanner from "@/components/innerBanner/InnerBanner";
import { getSiteData } from "@/lib/functions";
import { MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import style from "./Contactus.module.css";
import SectionHeading from "@/components/sectionHeading/sectionHeading";

export default async function ContactUs() {
  const sitedata = await getSiteData();

  return (
    <div>
      <InnerBanner title="Contact Us" />

      <div className="px-4">
        <div className={`max-w-screen-xl mx-auto section`}>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 w-full bg-[var(--rv-bg-primary-light)] p-5 md:p-8 rounded-xl">
              <h2>Get in Touch With Us</h2>
              <p className="text-lg">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.</p>
              <ContactReusableForm sitedata={sitedata} />
            </div>


            <div className="md:w-1/2 flex flex-col gap-8 justify-between w-full">
              <div>
                <h2 className="">
                  Need Any Help?
                </h2>
                <p className="text-lg">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
                  nonummy nibh euismod tincidunt.
                </p>
              </div>
              <div className="flex gap-5 flex-wrap justify-between items-center">
                <div className="flex flex-col gap-3">
                  <div className="bg-[var(--rv-primary)] flex items-center justify-center w-14 h-14 rounded-full shadow-lg">
                    <Phone className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--rv-primary)]">Call Us</h3>
                    <Link
                      href={`tel:${sitedata.mobile}`}
                      className="hover:underline text-gray-700 block"
                    >
                      {sitedata.mobile}
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="bg-[var(--rv-primary)] flex items-center justify-center w-14 h-14 rounded-full shadow-lg">
                    <Mail className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--rv-primary)]">Mail Us</h3>
                    <Link
                      href={`mailto:${sitedata.email}`}
                      className="hover:underline text-gray-700 block"
                    >
                      {sitedata.email}
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="bg-[var(--rv-primary)] flex items-center justify-center w-14 h-14 rounded-full shadow-lg">
                    <MapPin className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--rv-primary)]">
                      Visit Our Office
                    </h3>
                    <a
                      href={sitedata.mapurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-gray-700 block"
                    >
                      {sitedata.address}
                    </a>
                  </div>
                </div>
              </div>
              <div className="w-full h-96  overflow-hidden shadow-md">
                <iframe
                  src={sitedata?.iframe}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}     