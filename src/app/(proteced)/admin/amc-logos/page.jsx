"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import Loader from "@/components/admin/common/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AmcsLogo = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalPurpose, setModalPurpose] = useState("");
  const [category, setCategory] = useState("");
  const [amcsLogoData, setAmcsLogoData] = useState({
    logoname: "",
    logourl: "",
    logo: "",
    logocategory: "",
    id: ""
  });
  const [packageData, setAllCategory] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [logoCategory, setLogoCategory] = useState("");
  const [allAmcsLogos, setAllAmcsLogos] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const toggleModal = (purpose) => {
    setModalPurpose(purpose);
    setShowModal((prevState) => !prevState);
  };

  const closeModal = () => setShowModal(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-category`);

      const data = await res.json();
      setAllCategory(data);
      if (data.length > 0 && !logoCategory) {
        setLogoCategory(data[0]._id); // Set initial logo category
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLogos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-logos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryID: logoCategory || "", // Only include if logoCategory exists
        }),
      });

      const data = await res.json();
      setAllAmcsLogos(data.data); // Make sure to access `data.data` as returned from backend
    } catch (error) {
      console.error("Error fetching AMC logos:", error);
    } finally {
      setLoading(false);  // stop loader
    }
  };

  useEffect(() => {
    if (logoCategory) {
      fetchAllLogos();
    }
  }, [logoCategory]);


  useEffect(() => {
    fetchCategories();
  }, [category]);



  const handleAddCategory = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category/`, { category });
      if (response.status === 201) {
        toast("Category added successfully.");
        setCategory("");
        fetchCategories();
        fetchAllLogos();
      } else {
        fetchCategories()
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
    setShowModal(false);
  };

  const handleStatusChange = async (id, addisstatus) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-logos/change-status/${id}`, { addisstatus: !addisstatus });
      if (response.status === 200) {
        toast.success("Status updated successfully.");
        fetchAllLogos();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleAddAmcsLogo = async () => {
    try {
      const formData = new FormData();
      formData.append("logoname", amcsLogoData.logoname);
      formData.append("logourl", amcsLogoData.logourl);
      formData.append("logo", amcsLogoData.logo);
      formData.append("logocategory", amcsLogoData.logocategory);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        toast.success("AMCS logo added successfully.");
        setAmcsLogoData({
          logoname: "",
          logourl: "",
          logo: "",
          logocategory: "",
          id: ''
        });
        fetchCategories();
        fetchAllLogos();
      }
    } catch (error) {
      console.error("Error adding AMCS logo:", error);
      alert("An unexpected error occurred.");
    }
    closeModal();
  };

  const handleEditAmcsLogo = async (id) => {
    try {
      const formData = new FormData();
      formData.append("logoname", amcsLogoData.logoname);
      formData.append("logourl", amcsLogoData.logourl);
      formData.append("logo", amcsLogoData.logo);
      formData.append("logocategory", amcsLogoData.logocategory);
      const response = await axios.put(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-logo/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        toast.success("AMCS logo edited successfully.");
        setAmcsLogoData({
          logoname: "",
          logourl: "",
          logo: "",
          logocategory: "",
          id: ""
        });
        fetchCategories();
        fetchAllLogos();
      }
    } catch (error) {
      console.error("Error adding AMCS logo:", error);
      alert("An unexpected error occurred.");
    }
    setShowEditModal(false);
  };

  const handleDeleteAmcLogo = async (id) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-logo/${id}`);
      if (response.status === 201) {
        toast.success("Category deleted successfully.");
        fetchAllLogos();
      } else {
        alert(response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleEditModelOpen = async (id) => {
    setShowEditModal(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/amc-logo/${id}`);
      if (response.status === 200) {
        setAmcsLogoData({
          logoname: response.data.logoname,
          logourl: response.data.logourl,
          logo: response.data.logo,
          logocategory: response.data.logocategory,
          id: response.data._id
        });
        fetchCategories();
        fetchAllLogos();
      }
    } catch (error) {
      console.error("Error adding AMCS logo:", error);
      alert("An unexpected error occurred.");
    }
  }

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <div className="w-full flex flex-col gap-5">
          {/* Header */}
          <div className="bg-white p-3 rounded-md">
            <div className="flex flex-col gap-2">
              <h5 className="font-bold">All Amcs Logo</h5>
              <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
                {packageData.map((item, index) => (
                  <div className="mx-1" key={index}>
                    <button
                      className={`w-full p-2 rounded-md
                    ${logoCategory === item._id
                          ? "bg-[var(--rv-admin-bg-color)] hover:bg-[var(--rv-admin-bg-color)] text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-black"
                        }`}
                      onClick={() => setLogoCategory(item._id)}
                    >
                      {item.title}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader />
            </div>
          ) : showCategories ? (
            <TableThree
              packageData={packageData}
              onDelete={fetchCategories}
              allamcslogodata={allAmcsLogos}
            />
          ) : (
            <div className="">
              <div className="max-w-full grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                {allAmcsLogos.filter((logo) => logo.logocategory == logoCategory).length === 0 ? (
                  <div>No Data Found</div>
                ) : (
                  allAmcsLogos
                    .filter((logo) => logo.logocategory == logoCategory)
                    .map((item, index) => (
                      <div
                        key={index}
                        className={`rounded-[10px] border-2 ${item.addisstatus ? "border-green-500" : "border-red-500"
                          } bg-white p-2 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-4 text-center flex flex-col items-center`}
                      >
                        <div className="flex items-center justify-center gap-3 mb-3 w-full">
                          <button
                            className={`flex justify-center rounded-md w-10 h-10 items-center font-medium text-2xl text-white ${item.addisstatus ? "bg-green-500" : "bg-red-500"
                              }`}
                            type="button"
                            onClick={() => handleStatusChange(item._id, item.addisstatus)}
                          >
                            {item.addisstatus ? <FaEye /> : <FaEyeSlash />}
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
            </div>
          )}
        </div>
      </DefaultLayout>
    </>
  );
};

export default AmcsLogo;
