"use client";

import { useEffect, useState } from "react";

const DEFAULT_LOGO = "/images/logo.png";

export default function useLogoSrc() {
  const [logoSrc, setLogoSrc] = useState(DEFAULT_LOGO);

  useEffect(() => {
    const storedLogo = localStorage.getItem("custom-logo");
    setLogoSrc(storedLogo || DEFAULT_LOGO);

    const updateLogo = () => {
      const newLogo = localStorage.getItem("custom-logo") || DEFAULT_LOGO;
      setLogoSrc(newLogo);
    };

    window.addEventListener("logo-updated", updateLogo);
    return () => {
      window.removeEventListener("logo-updated", updateLogo);
    };
  }, []);

  return logoSrc;
}
