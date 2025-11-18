"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AmcsLogo = () => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [packageData, setAllCategory] = useState([]);
  const [logoCategory, setLogoCategory] = useState("");
  const [allAmcsLogos, setAllAmcsLogos] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [adminUrl, setAdminUrl] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingLogos, setLoadingLogos] = useState(false);

  // 🟩 Fetch Categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-category`);
      const data = await res.json();
      setAllCategory(data);
      if (data.length > 0 && !logoCategory) {
        setLogoCategory(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // 🟩 Fetch AMC Logos
  const fetchAllLogos = async () => {
    setLoadingLogos(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-logos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryID: logoCategory || "" }),
      });

      const data = await res.json();
      setAllAmcsLogos(data.data || []);
    } catch (error) {
      console.error("Error fetching AMC logos:", error);
    } finally {
      setLoadingLogos(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [category]);

  useEffect(() => {
    if (logoCategory) {
      fetchAllLogos();
    }
  }, [logoCategory]);

  // 🟩 Handle Status Change
  const handleStatusChange = async (id, addisstatus) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-logos/change-status/${id}`,
        { addisstatus: !addisstatus }
      );
      if (response.status === 200) {
        toast.success("Status updated successfully.");
        fetchAllLogos();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status.");
    }
  };

  // 🟩 Handle Save Admin URL
  const handleSaveAdminUrl = async () => {
    if (!selectedId) return;
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-logos/change-status/${selectedId}`, {
        adminlogourl: adminUrl,
      });
      if (response.status === 200) {
        toast.success("Admin URL updated successfully.");
        setShowUrlModal(false);
        setAdminUrl("");
        fetchAllLogos();
      }
    } catch (error) {
      console.error("Error updating admin URL:", error);
      toast.error("Error updating admin URL.");
    }
  };

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <div className="w-full flex flex-col gap-5">
          {/* Header */}
          <div className="bg-white p-3 rounded-md">
            <div className="flex flex-col gap-2">
              <h5 className="font-bold">All AMCs Logo</h5>

              {/* 🟦 Category Buttons / Skeleton */}
              {loadingCategories ? (
                <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3 mt-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-md bg-gray-200 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
                  {packageData.map((item, index) => (
                    <div className="mx-1" key={index}>
                      <button
                        className={`w-full p-2 rounded-md ${
                          logoCategory === item._id
                            ? "bg-[#2367f8] text-white"
                            : "bg-gray-200 text-black hover:bg-gray-300"
                        }`}
                        onClick={() => setLogoCategory(item._id)}
                      >
                        {item.title}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 🟩 AMC Logos Grid / Skeleton */}
          <div className="">
            {loadingLogos ? (
              <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[10px] border-2 bg-white p-4 animate-pulse h-52 flex flex-col justify-center items-center"
                  >
                    <div className="w-32 h-20 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-full grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                {allAmcsLogos.filter((logo) => logo.logocategory == logoCategory).length === 0 ? (
                  <div>No Data Found</div>
                ) : (
                  allAmcsLogos
                    .filter((logo) => logo.logocategory == logoCategory)
                    .map((item, index) => (
                      <div
                        key={index}
                        className={`rounded-[10px] border-2 ${
                          item.addisstatus ? "border-green-500" : "border-red-500"
                        } bg-white p-2 shadow-1 text-center flex flex-col items-center`}
                      >
                        <div className="flex justify-end gap-3 mb-3 w-full">
                          <button
                            className={`flex justify-center rounded-md w-10 h-10 items-center font-medium text-2xl text-white ${
                              item.addisstatus ? "bg-green-500" : "bg-red-500"
                            }`}
                            type="button"
                            onClick={() => handleStatusChange(item._id, item.addisstatus)}
                          >
                            {item.addisstatus ? <FaEye /> : <FaEyeSlash />}
                          </button>
                          <button
                            className="px-3 py-1 rounded bg-blue-500 text-white"
                            onClick={() => {
                              setSelectedId(item._id);
                              setAdminUrl(item.adminlogourl || "");
                              setShowUrlModal(true);
                            }}
                          >
                            🔗
                          </button>
                        </div>

                        <div className="my-4">
                          {item.logo && typeof item.logo !== "string" ? (
                            <Image
                              src={URL.createObjectURL(item.logo)}
                              width={150}
                              height={100}
                              alt="Uploaded Logo"
                            />
                          ) : (
                            <Image
                              src={`https://redvisionweb.com${item.logo}` || "/placeholder-image.jpg"}
                              width={150}
                              height={100}
                              alt="Logo"
                            />
                          )}
                        </div>
                        <p className="font-semibold">{item.logoname}</p>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      </DefaultLayout>

      {/* 🟨 Modal for Admin URL */}
      {showUrlModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Update Admin URL</h3>
            <input
              type="text"
              value={adminUrl}
              onChange={(e) => setAdminUrl(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              placeholder="Enter Admin URL"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setShowUrlModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleSaveAdminUrl}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AmcsLogo;
