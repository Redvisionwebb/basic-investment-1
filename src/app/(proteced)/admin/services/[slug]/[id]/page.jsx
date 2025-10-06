"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/admin/common/Loader";
import { FaSpinner } from "react-icons/fa";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AdminServices = () => {
    const { id, slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [savedServices, setSavedServices] = useState([]);
const [saving, setSaving] = useState({});

    // Fetch services
    const fetchSaved = async () => {
        try {
            const res = await axios.get(`/api/admin/services/${id}?version=${slug}`);
            setSavedServices(res.data.data || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaved();
    }, []);

    // Handle editing main fields
    const handleEditField = (srvIdx, field, value) => {
        setSavedServices((prev) => {
            const updated = [...prev];
            updated[srvIdx] = { ...updated[srvIdx], [field]: value };
            return updated;
        });
    };

    // Handle nested edit (features/benefits)
    const handleNestedEditField = (srvIdx, key, idx, field, value) => {
        setSavedServices((prev) => {
            const updated = [...prev];
            const nested = [...(updated[srvIdx][key] || [])];
            nested[idx] = { ...nested[idx], [field]: value };
            updated[srvIdx] = { ...updated[srvIdx], [key]: nested };
            return updated;
        });
    };

    const appendIcon = (formData, key, icon) => {
        if (!icon) return;

        if (icon instanceof File) {
            // New upload
            formData.append(key, icon);
        } else if (typeof icon === "object" && (icon.public_id || icon.url)) {
            // Existing DB icon → send reference
            formData.append(key, icon.public_id || icon.url);
        } else if (typeof icon === "string") {
            // Already a reference string
            formData.append(key, icon);
        } else {
            // Prevent accidental removal
            formData.append(key, "");
        }
    };

    // Save service
  const saveService = async (serviceId, serviceData) => {
    try {
        setSaving((prev) => ({ ...prev, [serviceId]: true })); 

        const formData = new FormData();
        formData.append("serviceId", serviceId);
        formData.append("name", serviceData.name || "");
        formData.append("description", serviceData.description || "");
        formData.append("metaTitle", serviceData.metaTitle || "");
        formData.append("metaDescription", serviceData.metaDescription || "");
        formData.append("metaKeywords", serviceData.metaKeywords || "");

        appendIcon(formData, "icon", serviceData.icon);
        appendIcon(formData, "image", serviceData.image);

        serviceData.features?.forEach((feat, fIdx) => {
            formData.append(`features[${fIdx}][title]`, feat.title || "");
            formData.append(`features[${fIdx}][description]`, feat.description || "");
            appendIcon(formData, `features[${fIdx}][icon]`, feat.icon);
        });

        serviceData.benefits?.forEach((ben, bIdx) => {
            formData.append(`benefits[${bIdx}][title]`, ben.title || "");
            formData.append(`benefits[${bIdx}][description]`, ben.description || "");
            appendIcon(formData, `benefits[${bIdx}][icon]`, ben.icon);
        });

        const res = await axios.put(`/api/admin/services/${serviceId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
            toast.success("Service updated successfully ✅");
            fetchSaved();
        } else {
            toast.error("Failed to update service ❌");
        }
    } catch (err) {
        console.error(err);
        toast.error("Something went wrong while saving service ❌");
    } finally {
        setSaving((prev) => ({ ...prev, [serviceId]: false })); 
    }
};


    // Handle image upload
    const handleImageUpload = (e, idx) => {
        const file = e.target.files[0];
        if (!file) return;
        setSavedServices((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], image: file };
            return updated;
        });
    };

    const handleIconUpload = (e, idx) => {
        const file = e.target.files[0];
        if (!file) return;
        setSavedServices((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], icon: file };
            return updated;
        });
    };

    if (loading) return <Loader />;

    return (
        <DefaultLayout>
            <ToastContainer />
            <div>
                <h1 className="text-2xl font-bold mb-4">Saved Services (Editable)</h1>
                <div className="grid grid-cols-1 gap-6 w-full">
                    {savedServices.map((srv, idx) => (
                        <div key={srv._id} className="flex flex-col gap-5 items-start w-full">

                            <div className="bg-white p-4 rounded-md w-full">
                                <label className="block font-medium text-gray-700 mb-1">
                                    Service Name
                                </label>
                                <input
                                    type="text"
                                    value={srv.name}
                                    onChange={(e) => handleEditField(idx, "name", e.target.value)}
                                    className="w-full border border-gray-300 px-3 py-2 mb-2 rounded"
                                    placeholder="Service Name"
                                />

                                <label className="block mb-1 text-sm">Service Description</label>
                                <div className="mb-2">
                                    <JoditEditor
                                        value={srv.description}
                                        onChange={(val) => handleEditField(idx, "description", val)}
                                    />
                                </div>

                                <label className="block font-medium text-gray-700 mb-1">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={srv.metaTitle || ""}
                                    onChange={(e) => handleEditField(idx, "metaTitle", e.target.value)}
                                    className="w-full border border-gray-300 px-3 py-2 mb-2 rounded"
                                    placeholder="Meta Title"
                                />

                                <label className="block font-medium text-gray-700 mb-1">
                                    Meta Description
                                </label>
                                <textarea
                                    value={srv.metaDescription || ""}
                                    onChange={(e) =>
                                        handleEditField(idx, "metaDescription", e.target.value)
                                    }
                                    className="w-full border border-gray-300 px-3 py-2 mb-2 rounded"
                                    placeholder="Meta Description"
                                />

                                <label className="block font-medium text-gray-700 mb-1">
                                    Meta Keywords
                                </label>
                                <textarea
                                    value={srv.metaKeywords || ""}
                                    onChange={(e) =>
                                        handleEditField(idx, "metaKeywords", e.target.value)
                                    }
                                    className="w-full border border-gray-300 px-3 py-2 mb-2 rounded"
                                    placeholder="Meta Description"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="mb-2">
                                        <label className="block mb-1 font-medium">Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, idx)}
                                            className="w-full border border-gray-300 px-3 py-2 mb-2 rounded"
                                        />
                                        {srv.image && (
                                            <img
                                                src={
                                                    !srv.image instanceof File
                                                        ? URL.createObjectURL(srv.image)
                                                        : !srv.image.status
                                                            ? `${process.env.NEXT_PUBLIC_DATA_API}${srv.image.url}`
                                                            : srv.image.url
                                                }
                                                alt="image"
                                                className="w-16 h-16 object-cover rounded mb-2 border border-gray-300"
                                            />
                                        )}
                                    </div>


                                    <div className="mb-2">
                                        <label className="block mb-1 font-medium">Icon</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleIconUpload(e, idx)}
                                            className="w-full border border-gray-300 px-3 py-2 mb-2 rounded"

                                        />
                                        {srv.icon && (
                                            <img
                                                src={
                                                    !srv.icon instanceof File
                                                        ? URL.createObjectURL(srv.icon) // 👈 Preview for File
                                                        : !srv.icon.status
                                                            ? `${process.env.NEXT_PUBLIC_DATA_API}${srv.icon.url}`
                                                            : srv.icon.url
                                                }
                                                alt="icon"
                                                className="w-16 h-16 object-cover rounded mb-2 border border-gray-300"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>


                            <div className="bg-white p-4 rounded-md w-full">
                                <h4 className="mb-4 font-semibold text-xl">Features</h4>
                                {srv.features?.map((feat, fIdx) => (
                                    <div
                                        key={feat._id || fIdx}
                                        className=""
                                    >
                                        <label className="block font-medium text-gray-700 mb-1">
                                            Feature Title
                                        </label>
                                        <input
                                            type="text"
                                            value={feat.title}
                                            onChange={(e) =>
                                                handleNestedEditField(idx, "features", fIdx, "title", e.target.value)
                                            }
                                            className="w-full border border-gray-300 px-3 py-2 mb-2 rounded"
                                            placeholder="Feature Title"
                                        />

                                        <label className="block font-medium text-gray-700 mb-1">
                                            Feature Description
                                        </label>
                                        <div className="mb-2">
                                            <JoditEditor
                                                value={feat.description}
                                                onChange={(val) =>
                                                    handleNestedEditField(idx, "features", fIdx, "description", val)
                                                }
                                            />
                                        </div>
                                        <label className="block font-medium text-gray-700 mb-1">
                                            Feature Icon
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleNestedEditField(idx, "features", fIdx, "icon", file);
                                                }
                                            }}
                                            className="w-full border border-gray-300 px-3 py-2 mb-2 rounded"
                                        />
                                        {feat.icon && (
                                            <img
                                                src={
                                                    !feat.icon.status
                                                        ? `http://localhost:3001/${feat.icon.url}`
                                                        : `${feat.icon.url}`
                                                }
                                                alt="Feature Icon"
                                                className="w-16 h-16 object-cover rounded mb-2 border border-gray-300"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white p-4 rounded-md w-full">
                                <h4 className="mb-4 font-semibold text-xl">Benefits</h4>
                                {srv.benefits?.map((ben, bIdx) => (
                                    <div
                                        key={ben._id || bIdx}

                                    >
                                        <label className="block font-medium text-gray-700 mb-1">
                                            Benefit Title
                                        </label>
                                        <input
                                            type="text"
                                            value={ben.title}
                                            onChange={(e) =>
                                                handleNestedEditField(idx, "benefits", bIdx, "title", e.target.value)
                                            }
                                            className="w-full border border-gray-300 px-3 py-2 mb-2 rounded"
                                            placeholder="Benefit Title"
                                        />

                                        <label className="block font-medium text-gray-700 mb-1">
                                            Benefit Description
                                        </label>
                                        <div className="mb-2">
                                            <JoditEditor
                                                value={ben.description}
                                                onChange={(val) =>
                                                    handleNestedEditField(idx, "benefits", bIdx, "description", val)
                                                }
                                            />
                                        </div>

                                        <label className="block font-medium text-gray-700 mb-1">
                                            Benefit Icon
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleNestedEditField(idx, "benefits", bIdx, "icon", file);
                                                }
                                            }}
                                            className="w-full border border-gray-300 px-3 py-2 mb-2 rounded"
                                        />
                                        {ben.icon && (
                                            <img
                                                src={
                                                    !ben.icon.status
                                                        ? `${process.env.NEXT_PUBLIC_DATA_API}${ben.icon.url}`
                                                        : `${ben.icon.url}`
                                                }
                                                alt="Benefit Icon"
                                                className="w-16 h-16 object-cover rounded mb-2 border border-gray-300"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => saveService(srv._id, srv)}
                                disabled={saving[srv._id]}
                                className="px-4 py-2 bg-[var(--rv-admin-bg-color)] text-white rounded flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving[srv._id] ? (
                                    <>
                                        <FaSpinner className="animate-spin h-4 w-4" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>

                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default AdminServices;
