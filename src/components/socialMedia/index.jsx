"use client";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./social.module.css"
export default function SocialMediaSidebar({sitedata}) {
  // console.log(sitedata)
  return (
    <div className={`${styles.social_midia_f}`}>
      <ul className="flex flex-col space-y-3">
        <li>
          <Link href={`http://wa.me/${sitedata?.whatsAppNo}`} target="_blank" className="text-white p-3 block bg-[#6BB543] transition  rounded-full">
            <FaWhatsapp size={30} />
          </Link>
        </li>
      </ul>
    </div>
  );
}
