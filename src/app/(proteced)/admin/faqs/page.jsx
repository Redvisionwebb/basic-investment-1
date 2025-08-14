"use client";

import React, { useEffect, useRef, useState } from "react";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AdminServices = () => {
  const editor = useRef(null);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ question: "", answer: "" });

  const fetchServices = async () => {
    try {
      const response = await axios.get("/api/faqs");
      if (response.status === 200) {
        if (response.data && Array.isArray(response.data)) {
          setServices(response.data);
        }
      } else {
        console.error("Failed to fetch faqs:", response.data);
      }
    } catch (error) {
      console.error("Error fetching faqs:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddSingleService = () => {
    setServices([...services, { ...newService }]);
    setNewService({ question: "", answer: "" });
  };

  const handleSaveServices = async () => {
    try {
      const response = await axios.post("/api/faqs", { services });
      if (response.status === 201) {
        toast.success("Faq saved successfully.");
      }
    } catch (error) {
      console.error("Error saving", error);
      alert("An error occurred while saving. Please try again.");
    }
  };

  const handleRemoveService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };
  const handleServiceNameChange = (index, value) => {
    const updatedServices = [...services];
    updatedServices[index].answer = value;
    setServices(updatedServices);
  };
  return (
    <DefaultLayout>
      <ToastContainer />
      <h1 className="text-xl font-bold mb-4">FAQs</h1>
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg font-semibold mb-4">Add FAQs</p>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Question"
            className="border p-3 rounded-lg"
            value={newService.question}
            onChange={(e) =>
              setNewService({ ...newService, question: e.target.value })
            }
          />
          <JoditEditor
            ref={editor}
            value={newService.answer}
            tabIndex={1}
            onChange={(newContent) =>
              setNewService({ ...newService, answer: newContent })
            }
          />
        </div>
        <button
          className="mt-4 text-sm bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          onClick={handleAddSingleService}
        >
          Add Faq
        </button>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">List</h2>
        {services.map((service, index) => (
          <div key={index} className="bg-white p-6 mb-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Question"
                className="border p-3 rounded-lg"
                value={service.question}
                onChange={(e) => {
                  const updatedServices = [...services];
                  updatedServices[index].question = e.target.value;
                  setServices(updatedServices);
                }}
              />

              <JoditEditor
                value={service.answer}
                tabIndex={1}
                onChange={(newContent) =>
                  handleServiceNameChange(index, newContent)
                }
              />
            </div>
            <button
              className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-red-600"
              onClick={() => handleRemoveService(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        className="mt-4 text-sm bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
        onClick={handleSaveServices}
      >
        Save All
      </button>
    </DefaultLayout>
  );
};

export default AdminServices;
