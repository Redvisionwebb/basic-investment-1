"use client";

import React, { useEffect, useRef, useState } from "react";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { FaSpinner } from "react-icons/fa";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AdminServices = () => {
  const editor = useRef(null);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ question: "", answer: "" });

  // states
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/faqs`
      );
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

  const handleAddSingleService = async () => {
    if (!newService.question.trim() || !newService.answer.trim()) {
      toast.error("Please fill both question and answer.");
      return;
    }
    try {
      setAdding(true);
      setServices([...services, { ...newService }]);
      setNewService({ question: "", answer: "" });
      toast.success("Faq added locally!");
    } finally {
      setAdding(false);
    }
  };

  const handleSaveServices = async () => {
    try {
      setSaving(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/faqs`,
        { services }
      );
      if (response.status === 201) {
        toast.success("Faqs saved successfully.");
      }
    } catch (error) {
      console.error("Error saving", error);
      toast.error("An error occurred while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // delete confirm
  const handleRemoveService = (index) => {
    setDeleteIndex(index);
    setShowConfirm(true);
  };
  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteIndex(null);
  };
  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setLoading(true);
      const updatedServices = services.filter((_, i) => i !== deleteIndex);
      setServices(updatedServices);
      setLoading(false);
      setShowConfirm(false);
      setDeleteIndex(null);
      toast.success("Faq deleted successfully.");
    }
  };

  const handleServiceAnswerChange = (index, value) => {
    const updatedServices = [...services];
    updatedServices[index].answer = value;
    setServices(updatedServices);
  };

  return (
    <DefaultLayout>
      <ToastContainer />
      <div className="flex flex-col items-start w-full gap-5">
        {/* Add New FAQ */}
        <div className="flex flex-col items-start w-full gap-5">
          <h1 className="text-2xl font-bold ">FAQs</h1>

          <div className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white">
            <div className="grid grid-cols-1 gap-4 w-full">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-black/80 text-sm">
                  Questions
                </label>
                <input
                  type="text"
                  placeholder="Question"
                  className="border p-2 border-gray-400 flex h-10 w-full rounded-md text-sm 
                  placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] 
                  focus-visible:ring-neutral-600 transition duration-400"
                  value={newService.question}
                  onChange={(e) =>
                    setNewService({ ...newService, question: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-black/80 text-sm">
                  Answer
                </label>
                <JoditEditor
                  ref={editor}
                  value={newService.answer}
                  tabIndex={1}
                  onChange={(newContent) =>
                    setNewService({ ...newService, answer: newContent })
                  }
                />
              </div>
            </div>
            <button
              className="text-sm text-white bg-[#2367f8] px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              onClick={handleAddSingleService}
              disabled={adding}
            >
              {adding ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4" />
                  Adding...
                </>
              ) : (
                "Add Faq"
              )}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col items-start w-full gap-5">
          <h2 className="text-2xl font-semibold">List</h2>
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-start w-full gap-5 rounded-md p-3 bg-white"
            >
              <div className="grid grid-cols-1 gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-black/80 text-sm">
                    Questions
                  </label>
                  <input
                    type="text"
                    placeholder="Question"
                    className="border p-2 border-gray-400 flex h-10 w-full rounded-md text-sm 
                    placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] 
                    focus-visible:ring-neutral-600 transition duration-400"
                    value={service.question}
                    onChange={(e) => {
                      const updatedServices = [...services];
                      updatedServices[index].question = e.target.value;
                      setServices(updatedServices);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-black/80 text-sm">
                    Answer
                  </label>
                  <JoditEditor
                    value={service.answer}
                    tabIndex={1}
                    onChange={(newContent) =>
                      handleServiceAnswerChange(index, newContent)
                    }
                  />
                </div>
              </div>
              <button
                className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg"
                onClick={() => handleRemoveService(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          className="text-sm text-white bg-[#2367f8] px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          onClick={handleSaveServices}
          disabled={saving}
        >
          {saving ? (
            <>
              <FaSpinner className="animate-spin h-4 w-4" />
              Saving...
            </>
          ) : (
            "Save All"
          )}
        </button>
      </div>

      {/* Delete confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this FAQ?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4" />
                    Deleting...
                  </>
                ) : (
                  "OK"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default AdminServices;
