import ContactReusableForm from "@/components/landing/contactSectionPage/Contactreusableform";
import InnerBanner from "@/components/innerBanner/InnerBanner";
import { getSiteData } from "@/lib/functions";
import { MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import style from "./Contactus.module.css";

export default async function ContactUs() {
  const sitedata = await getSiteData();

  return (
    <div>
      <InnerBanner pageName="Contact Us" />

      <div className={`max-w-screen-xl mx-auto main-section`}>
        <div className={style.gridSection}>
          {/* Left Cards */}
          <div className={style.infoCards}>
            <div className={style.card}>
              <Phone size={32} className={style.icon} />
              <h3>Call Us</h3>
              <Link href={`tel:${sitedata.mobile}`}>{sitedata.mobile}</Link>
            </div>

            <div className={style.card}>
              <Mail size={32} className={style.icon} />
              <h3>Mail Us</h3>
              <Link href={`mailto:${sitedata.email}`}>{sitedata.email}</Link>
            </div>

            <div className={style.card}>
              <MapPin size={32} className={style.icon} />
              <h3>Reach Us</h3>
              <a href={sitedata.mapurl} target="_blank" rel="noopener noreferrer">
                {sitedata.address}
              </a>
            </div>
          </div>

          {/* Right Form */}
          <div className={style.formWrapper}>
            <ContactReusableForm sitedata={sitedata} />
          </div>
        </div>

        {/* Map Iframe */}
        <div className={style.mapWrapper}>
          {/* <iframe
            src={sitedata?.iframe}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
          ></iframe> */}
        </div>
      </div>
    </div>
  );
}     