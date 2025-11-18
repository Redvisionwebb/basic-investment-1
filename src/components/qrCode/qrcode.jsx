"use client";
import { QrCode } from "lucide-react";
import styles from "./qrcode.module.css";
import Image from "next/image";
import { FaApple, FaGooglePlay } from "react-icons/fa"; // icons for app store & play store
import Link from "next/link";

export default function QRCode({ siteData }) {
  return (
    <div className={styles.qr}>
      <ul className="flex flex-col space-y-3">
        <li className={styles.qrItem}>
          <div
            className={styles.qrLink}
          >
            <div
              onClick={() => setOpen(true)}
              className="w-[60px] h-[60px] bg-white mix-blend-difference border-[var(--rv-primary)] border text-[var(--rv-primary)] cursor-pointer rounded-full flex items-center justify-center shadow-lg p-2"
            >
              {/* <QRCodeCanvas
          value={url}
          size={40}
          bgColor="#baee30" // chhote QR ko fancy rakh lo
          fgColor="#000000"
          level="H"
        /> */}
              <QrCode size={50} />
            </div>
            {/* Popover box */}
            <div className={styles.qrBox}>
              <p className="text-center font-semibold text-sm">Scan to Download <br />
                {siteData?.websiteName} App</p>
              <Image
                src="/app-qr.png"
                alt="QR Code"
                width={150}
                height={100}
              />
              {(siteData?.appsappleurl || siteData?.appsplaystoreurl) && (
                <div className="flex items-center justify-center gap-4 mt-4">
                  {siteData?.appsappleurl && (
                    <Link
                      href={siteData?.appsappleurl ||""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                    >
                      <FaApple size={20} />
                    </Link>
                  )}
 
                  {siteData?.appsplaystoreurl && (
                    <Link
                      href={siteData?.appsplaystoreurl ||" "}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      <FaGooglePlay size={20} />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
