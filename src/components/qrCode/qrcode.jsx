"use client";
import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode } from "lucide-react";

export default function QRCodePopup() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);
  const url = "https://www.redvisiontechnologies.com/";

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="fixed bottom-8 right-6 z-30">
      {/* Small QR Button */}
      <div
        onClick={() => setOpen(true)}
        className="w-[60px] h-[60px] border border-[var(--rv-primary)]  text-[var(--rv-primary)] cursor-pointer rounded-full flex items-center justify-center shadow-lg p-2"
      >
        {/* <QRCodeCanvas
          value={url}
          size={40}
          bgColor="#baee30" // chhote QR ko fancy rakh lo
          fgColor="#000000"
          level="H"
        /> */}
         <QrCode size={50}/>
      </div>

      {/* Popup QR */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 bg-white border border-[var(--rv-primary)] rounded-xl shadow-2xl p-6 z-50 space-y-2"
          >
            <p className="text-center  text-base">
              [ Scan this QR ] <br />
              Download App
            </p>
            <QRCodeCanvas
              value={url}
              size={150}
              bgColor="#ffffff"
              fgColor="#000000" 
              level="H"
            />
           
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
