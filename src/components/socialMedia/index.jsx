"use client";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function SocialMediaSidebar({ sitedata }) {
  return (
    <div className={`fixed bottom-44 right-4 z-30`}>
      <ul className="flex flex-col space-y-3">
        <motion.li
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <Link
            href={`http://wa.me/${sitedata?.whatsAppNo}`}
            target="_blank"
            className="text-white p-3 block bg-[#6BB543] transition rounded-full"
          >
            <FaWhatsapp size={35} />
          </Link>
        </motion.li>
      </ul>
    </div>
  );
}
