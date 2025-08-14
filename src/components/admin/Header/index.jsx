"use client";
import Link from "next/link";
import Image from "next/image";
import DropdownUser from "./DropdownUser";
import { useEffect, useState } from "react";

const Header = (props) => {
  console.log(props.sidebarOpen);
  const [siteData, setSiteData] = useState([]);
  const fetchSitedata = async () => {
    const res = await fetch("/api/admin/site-settings");
    const data = await res.json();
    setSiteData(data[0]);
  };
  useEffect(() => {
    fetchSitedata();
  }, []);
  return (
    <header className="sticky top-0 z-40 flex w-full border-b border-stroke bg-[var(--rv-primary)] dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-4 py-5 shadow-2 md:px-5 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-dark-3 dark:bg-dark-2 lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm delay-[0] bg-black duration-200 ease-in-out ${props.sidebarOpen &&
                    "!w-full delay-300"}`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0  bg-black rounded-sm delay-150 duration-200 ease-in-out ${props.sidebarOpen &&
                    "delay-400 !w-full"}`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0  bg-black rounded-sm delay-200 duration-200 ease-in-out ${props.sidebarOpen &&
                    "!w-full delay-500"}`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm delay-300  bg-black duration-200 ease-in-out ${props.sidebarOpen &&
                    "!h-0 !delay-[0]"}`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full  bg-black rounded-sm duration-200 ease-in-out ${props.sidebarOpen &&
                    "!h-0 !delay-200"}`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block ml-4 flex-shrink-0 lg:hidden" href="/">
            <Image
              width={150}
              height={100}
              src={"/logo.webp"}
              alt="Logo"
            />
          </Link>
        </div>

        <div className="hidden xl:block">
          <div>
            <h1 className="mb-0.5 text-heading-5 font-bold text-white">
              Dashboard
            </h1>
            <p className="font-medium text-white">{siteData?.title}</p>
          </div>
        </div>

        <div className="flex items-center justify-normal gap-2 2xsm:gap-4 lg:w-full lg:justify-between xl:w-auto xl:justify-normal">
          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
