"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiSettings } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { RiImageAddLine } from "react-icons/ri";

const COLOR_VARIABLES = [
  "--rv-primary",
  "--rv-secondary",
  "--rv-primary-light",
  "--rv-secondary-light",
  "--rv-primary-dark",
  "--rv-secondary-dark",
];

const COLOR_LABELS = {
  "--rv-primary": "Primary Color",
  "--rv-primary-light": "Primary Light Color",
  "--rv-primary-dark": "Primary Dark Color",
  "--rv-secondary": "Secondary Color",
  "--rv-secondary-light": "Secondary Light Color",
  "--rv-secondary-dark": "Secondary Dark Color",
};

const Colortheme = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [colors, setColors] = useState({});
  const defaultLogo = "/logo.webp";
  const [logoPreview, setLogoPreview] = useState(defaultLogo);
  const fileInputRef = useRef(null); // hidden input ka reference

  useEffect(() => {
    if (isOpen) {
      const storedLogo = localStorage.getItem("custom-logo");
      setLogoPreview(storedLogo || defaultLogo);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const root = getComputedStyle(document.documentElement);
      const loaded = {};

      COLOR_VARIABLES.forEach((variable) => {
        const val = root.getPropertyValue(variable).trim();
        loaded[variable] = val || "#000000";

        // Add this
        const bgVar = variable.replace("--rv-", "--rv-bg-");
        const bgVal = root.getPropertyValue(bgVar).trim();
        loaded[bgVar] = bgVal || "#000000";
      });

      setColors(loaded);
    }
  }, [isOpen]);

  const handleColorChange = (variable, hexValue) => {
    const bgVariable = variable.replace("--rv-", "--rv-bg-");

    document.documentElement.style.setProperty(variable, hexValue);
    document.documentElement.style.setProperty(bgVariable, hexValue);

    setColors((prev) => ({
      ...prev,
      [variable]: hexValue,
      [bgVariable]: hexValue,
    }));
  };


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
    };
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 z-50 backdrop-blur-2xl"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isOpen ? 0 : "100%" }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.4 }}
          className="fixed top-0 right-0 h-full md:w-96 bg-white shadow-2xl z-50 p-6 border-[var(--rv-primary)] border-l"
        >
          <div className="flex items-center justify-between gap-5 mb-4">
            <h2 className="text-xl font-bold">Theme Settings</h2>
            <FaTimes
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {COLOR_VARIABLES.map((variable) => (
              <div key={variable} className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  {COLOR_LABELS[variable]}
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors[variable] || "#000000"}
                    onChange={(e) => handleColorChange(variable, e.target.value)}
                    className="w-16 h-10 p-0 border rounded"
                  />
                  <input
                    type="text"
                    value={colors[variable] || "#000000"}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                        handleColorChange(variable, newColor);
                      }
                    }}
                    className="w-full h-10 px-3 border rounded text-sm font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Upload Logo</label>

            <div className="flex items-center gap-2">
              <div
                className="w-full h-28 border-2 border-dashed rounded p-2 bg-white relative flex items-center justify-center flex-col gap-1 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {logoPreview === defaultLogo ? (
                  <div className="flex flex-col items-center justify-center gap-1 text-gray-500">
                    <RiImageAddLine size={24} />
                    <p className="text-sm">Add Logo</p>
                  </div>
                ) : (
                  <Image
                    src={logoPreview}
                    alt="Logo Preview"
                    fill
                    className="object-contain p-2"
                  />
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64 = reader.result;
                    localStorage.setItem("custom-logo", base64);
                    setLogoPreview(base64);
                    window.dispatchEvent(new Event("logo-updated"));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />

            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  localStorage.removeItem("custom-logo");
                  setLogoPreview(defaultLogo);
                  window.dispatchEvent(new Event("logo-updated"));
                }}
                className="bg-white text-black px-6 py-2 mt-4 rounded-full font-bold hover:bg-gray-100 transition border border-black/10  after:bg-[var(--rv-primary)] after:w-full hover:text-white after:h-full after:absolute after:bottom-0 after:-left-full hover:after:left-0 hover:after:duration-500 overflow-hidden after:-z-10 z-10 after:transition-all hover:after:w-full relative"
              >
                Reset to Default Logo
              </button>
            </div>
          </div>

          <div
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-1/2 -translate-y-1/2 right-full w-14 h-14 flex items-center justify-center rounded-l-2xl bg-[#fff] backdrop-blur-lg border-[var(--rv-primary)] border-l border-b border-t cursor-pointer"
          >
            <FiSettings
              size={30}
              className={`text-[var(--rv-primary)] transition-transform ${isOpen ? "animate-spin" : ""
                }`}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Colortheme;
