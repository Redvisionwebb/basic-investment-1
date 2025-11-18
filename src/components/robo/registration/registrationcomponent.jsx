"use client";
import { useState, useEffect } from "react";
import CheckNamePan from "@/components/robo/software_registration/check_name/page.jsx";
import SoftwareRegistration from "@/components/robo/software_registration/registration/page.jsx";
import Image from "next/image";
import LoginPageModule from "../LoginPage.module.css";
import styles from "../LoginPage.module.css";


export default function RegistrationComponent({ roboUser, sitedata, login }) {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const pan = sessionStorage.getItem("client_pan");
    if (pan) {
      setIsVerified(true);
    }
  }, []);

  return (
    <>
      <div className={styles.loginPage}>
        <div className={`max-w-screen-xl mx-auto  section`}>
          <div className="flex flex-col md:flex-row items-center gap-10  w-full h-full">
            {/* Left Image/Content */}
            <div
              className={`${styles.bg} flex flex-col gap-5 items-end justify-end p-10 md:w-1/2 w-full h-full`}
            >
              <div className="max-w-lg">
                <h1 className="text-[var(--rv-bg-primary)]">
                  Sign In to Explore All Features and Account Benefits
                </h1>
              </div>
              <Image
                src={"/images/login/image.svg"}
                alt="image"
                width={400}
                height={300}
              />
            </div>

            {/* Right Form */}
            <div className="md:w-1/2 w-full flex items-center justify-center h-full">
            <div className={`p-6 rounded-xl md:p-8 bg-[var(--rv-primary-light)] w-full`}>
              {isVerified ? (
                <SoftwareRegistration
                  roboUser={roboUser}
                  sitedata={sitedata}
                  login={login}
                />
              ) : (
                <CheckNamePan
                  roboUser={roboUser}
                  onSuccess={() => setIsVerified(true)}
                />
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
