"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";

const AmcsLogo = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalPurpose, setModalPurpose] = useState(""); // Track modal purpose
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
    try {
      const res = await fetch("/api/amc-category");

      const data = await res.json();
      setAllCategory(data);
      if (data.length > 0 && !logoCategory) {
        setLogoCategory(data[0]._id); // Set initial logo category
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  console.log(packageData)

  const fetchAllLogos = async () => {
    try {
      const res = await fetch("/api/amc-logos", {
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
      const response = await axios.post("/api/category/", { category });
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
    console.log(id, addisstatus)
    try {
      const response = await axios.put(`/api/amc-logos/change-status/${id}`, { addisstatus: !addisstatus });
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
      const response = await axios.post("/api/amc-logo", formData, {
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
      const response = await axios.put(`/api/amc-logo/${id}`, formData, {
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
      const response = await axios.delete(`/api/amc-logo/${id}`);
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
      const response = await axios.get(`/api/amc-logo/${id}`);
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
        <div className="w-full max-w-full rounded-[10px] dark:shadow-card">

          <div className="bg-white dark:bg-gray-dark px-5 py-4 rounded mb-5">
            <div className="flex justify-between">
              <h5 className="font-bold">All Amcs Logo</h5>
              <div className="flex gap-x-2">
                {packageData.map((item, index) => (
                  <div className="mx-1" key={index}>
                    {console.log(item.title)}
                    <button className="text-white px-3 py-1 bg-[--rv-primary] rounded" onClick={() => setLogoCategory(item._id)}>
                      {item.title}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {showCategories ? <TableThree packageData={packageData} onDelete={fetchCategories} allamcslogodata={allAmcsLogos} />
            : (
              <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
                <div className="max-w-full grid lg:grid-cols-5 md:grid-cols-3 grid-cols-5 gap-5">
                  {allAmcsLogos.filter((logo) => logo.logocategory == logoCategory).length == 0 ? (
                    <div>No Data Found</div>
                  )
                    :
                    allAmcsLogos.filter((logo) => logo.logocategory == logoCategory).map((item, index) => (
                      <div className={`rounded-[10px] border-2 ${item.status ? 'border-green' : 'border-red-500'} bg-white p-2 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-4 text-center flex flex-col items-center`} key={index}>
                        <div className="flex justify-end gap-3 mb-3">
                          <button
                            className={`flex justify-center rounded-[7px] px-3 py-[7px] font-medium ${item.addisstatus ? "bg-green-500 text-white" : "bg-red-500 text-black"
                              }`}
                            type="button"
                            onClick={() => handleStatusChange(item._id, item.addisstatus)}
                          >
                            {item.addisstatus ? (
                              <svg
                                className="fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.99935 6.87492C8.27346 6.87492 6.87435 8.27403 6.87435 9.99992C6.87435 11.7258 8.27346 13.1249 9.99935 13.1249C11.7252 13.1249 13.1243 11.7258 13.1243 9.99992C13.1243 8.27403 11.7252 6.87492 9.99935 6.87492ZM8.12435 9.99992C8.12435 8.96438 8.96382 8.12492 9.99935 8.12492C11.0349 8.12492 11.8743 8.96438 11.8743 9.99992C11.8743 11.0355 11.0349 11.8749 9.99935 11.8749C8.96382 11.8749 8.12435 11.0355 8.12435 9.99992Z"
                                  fill=""
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M9.99935 2.70825C6.23757 2.70825 3.70376 4.96175 2.23315 6.8723L2.20663 6.90675C1.87405 7.3387 1.56773 7.73652 1.35992 8.20692C1.13739 8.71064 1.04102 9.25966 1.04102 9.99992C1.04102 10.7402 1.13739 11.2892 1.35992 11.7929C1.56773 12.2633 1.87405 12.6611 2.20664 13.0931L2.23316 13.1275C3.70376 15.0381 6.23757 17.2916 9.99935 17.2916C13.7611 17.2916 16.2949 15.0381 17.7655 13.1275L17.792 13.0931C18.1246 12.6612 18.431 12.2633 18.6388 11.7929C18.8613 11.2892 18.9577 10.7402 18.9577 9.99992C18.9577 9.25966 18.8613 8.71064 18.6388 8.20692C18.431 7.73651 18.1246 7.33868 17.792 6.90673L17.7655 6.8723C16.2949 4.96175 13.7611 2.70825 9.99935 2.70825ZM3.2237 7.63475C4.58155 5.87068 6.79132 3.95825 9.99935 3.95825C13.2074 3.95825 15.4172 5.87068 16.775 7.63475C17.1405 8.10958 17.3546 8.3933 17.4954 8.71204C17.627 9.00993 17.7077 9.37403 17.7077 9.99992C17.7077 10.6258 17.627 10.9899 17.4954 11.2878C17.3546 11.6065 17.1405 11.8903 16.775 12.3651C15.4172 14.1292 13.2074 16.0416 9.99935 16.0416C6.79132 16.0416 4.58155 14.1292 3.2237 12.3651C2.85821 11.8903 2.64413 11.6065 2.50332 11.2878C2.37171 10.9899 2.29102 10.6258 2.29102 9.99992C2.29102 9.37403 2.37171 9.00993 2.50332 8.71204C2.64413 8.3933 2.85821 8.10958 3.2237 7.63475Z"
                                  fill=""
                                />
                              </svg>
                            ) : (
                              <Image src={"/icons/eyehide.svg"} width={20} height={20} alt="icon" className="text-white" />
                            )}
                          </button>
                        </div>
                        <div className="my-4">
                          {item.logo && typeof item?.logo !== "string" ? (
                            <Image
                              src={URL.createObjectURL(item.logo)} // Generate a temporary URL for File
                              width={150}
                              height={100}
                              alt="Uploaded Logo"
                            />
                          ) : (
                            <Image
                              src={`https://redvisionweb.com${item.logo}` || "/placeholder-image.jpg"} // Use string or fallback placeholder
                              width={150}
                              height={100}
                              alt="Logo"
                            />
                          )}
                        </div>
                        <p className="font-semibold">{item.logoname}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          }
        </div >
      </DefaultLayout>
    </>
  );
};

export default AmcsLogo;
