"use client";
import React, { useState } from "react";
import "./contactUs.css";
import Image from "next/image";
import SectionHeading from "../../sectionHeading/sectionHeading";
import axios from "axios";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import ContactReusableForm from "./Contactreusableform";
import { IoCall, IoLocationSharp, IoMail } from "react-icons/io5";
import Link from "next/link";
import HomeHeading from "../heading/heading";


export default function ContactUsFormSection({ sitedata }) {

  return (
    <div className='main-section'>
      <div className="">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 items-center">
            {/* Left Section */}
            <div className="col-span-2">
              <div className="contact-left-one">
                <HomeHeading
                  title="Let’s Start Your Financial Journey"
                  subtitle="Contact Us"
                  description="Reach out to our expert team for personalized investment solutions, legacy planning, or any financial queries. We’re here to help — every step of the way."
                />

                <ul className="contact-details-one animate fadeInUp wow" data-wow-duration="1500ms" data-wow-delay="600ms">
                  <li>
                    <IoLocationSharp size={25} className="text-[var(--rv-primary)]" />
                    <Link target="_blank" href={sitedata?.mapurl}>{sitedata?.address}</Link>
                  </li>
                  <li>
                    <IoMail size={25} className="text-[var(--rv-primary)]" />
                    <Link href={`mailto:${sitedata?.email}`}>{sitedata?.email}</Link>
                  </li>
                  <li>
                    <IoCall size={25} className="text-[var(--rv-primary)]" />
                    <Link href={`tel:+91${sitedata?.mobile}`}>+91 {sitedata?.mobile}</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Section (Contact Form) */}
            <div className="col-span-3">
              <div className="contact-form-one animate fadeInRight wow" data-wow-duration="1500ms">
                <ContactReusableForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
