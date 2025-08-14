"use client";

import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ name: "", link: "", description: "", imageSrc: "", children: [] });

    const fetchServices = async () => {
        try {
            const response = await axios.get('/api/services');
            if (response.status === 200) {
                if (response.data && Array.isArray(response.data)) {
                    setServices(response.data);
                } else {
                    console.error("Invalid data format:", response.data);
                    alert("Failed to fetch services. Please try again.");
                }
            } else {
                console.error("Failed to fetch services:", response.data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleAddSingleService = () => {
        setServices([...services, { ...newService, children: [] }]);
        setNewService({ name: "", link: "", description: "", imageSrc: "", children: [] });
    };

    const handleAddNestedService = (index) => {
        const updatedServices = [...services];
        updatedServices[index].children.push({ name: "", link: "", description: "", imageSrc: "" });
        setServices(updatedServices);
    };

    const handleUpdateService = (index, key, value) => {
        const updatedServices = [...services];
        updatedServices[index][key] = value;
        setServices(updatedServices);
    };

    const handleUpdateNestedService = (parentIndex, childIndex, key, value) => {
        const updatedServices = [...services];
        updatedServices[parentIndex].children[childIndex][key] = value;
        setServices(updatedServices);
    };

    const handleSaveServices = async () => {
        try {
            const response = await axios.post('/api/services', { services });
            if (response.status === 201) {
                toast.success("Services saved successfully.");
            } else {
                console.error("Failed to save services:", response.data);
                alert("Failed to save services. Please try again.");
            }
        } catch (error) {
            console.error("Error saving services:", error);
            alert("An error occurred while saving services. Please try again.");
        }
    };

    const handleRemoveService = (index) => {
        const updatedServices = services.filter((_, i) => i !== index);
        setServices(updatedServices);
    };

    const handleRemoveNestedService = (parentIndex, childIndex) => {
        const updatedServices = [...services];
        updatedServices[parentIndex].children = updatedServices[parentIndex].children.filter((_, i) => i !== childIndex);
        setServices(updatedServices);
    };

    return (
        <DefaultLayout>
            <ToastContainer />
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Manage Services</h1>

                {/* Add Single Service */}
                <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Add Single Service</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Service Name"
                            className="border p-3 rounded-lg"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Service Link"
                            className="border p-3 rounded-lg"
                            value={newService.link}
                            onChange={(e) => setNewService({ ...newService, link: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            className="border p-3 rounded-lg"
                            value={newService.imageSrc}
                            onChange={(e) => setNewService({ ...newService, imageSrc: e.target.value })}
                        />
                        <textarea
                            placeholder="Service Description"
                            className="border p-3 rounded-lg col-span-2"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        />
                    </div>
                    <button
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        onClick={handleAddSingleService}
                    >
                        Add Service
                    </button>
                </div>

                {/* Services List */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Services List</h2>
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-6 mb-6 rounded-lg shadow-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Service Name"
                                    className="border p-3 rounded-lg"
                                    value={service.name}
                                    onChange={(e) => handleUpdateService(index, "name", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Service Link"
                                    className="border p-3 rounded-lg"
                                    value={service.link}
                                    onChange={(e) => handleUpdateService(index, "link", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    className="border p-3 rounded-lg"
                                    value={service.imageSrc}
                                    onChange={(e) => handleUpdateService(index, "imageSrc", e.target.value)}
                                />
                                <textarea
                                    placeholder="Service Description"
                                    className="border p-3 rounded-lg col-span-2"
                                    value={service.description}
                                    onChange={(e) => handleUpdateService(index, "description", e.target.value)}
                                />
                            </div>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                onClick={() => handleRemoveService(index)}
                            >
                                Remove Service
                            </button>

                            {/* Nested Services */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">Nested Services</h3>
                                {service.children.map((child, childIndex) => (
                                    <div key={childIndex} className="bg-gray-100 p-4 mb-4 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Nested Service Name"
                                                className="border p-3 rounded-lg"
                                                value={child.name}
                                                onChange={(e) =>
                                                    handleUpdateNestedService(index, childIndex, "name", e.target.value)
                                                }
                                            />
                                            <input
                                                type="text"
                                                placeholder="Nested Service Link"
                                                className="border p-3 rounded-lg"
                                                value={child.link}
                                                onChange={(e) =>
                                                    handleUpdateNestedService(index, childIndex, "link", e.target.value)
                                                }
                                            />
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                className="border p-3 rounded-lg"
                                                value={child.imageSrc}
                                                onChange={(e) =>
                                                    handleUpdateNestedService(index, childIndex, "imageSrc", e.target.value)
                                                }
                                            />
                                            <textarea
                                                placeholder="Nested Service Description"
                                                className="border p-3 rounded-lg col-span-2"
                                                value={child.description}
                                                onChange={(e) =>
                                                    handleUpdateNestedService(index, childIndex, "description", e.target.value)
                                                }
                                            />
                                        </div>
                                        <button
                                            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            onClick={() => handleRemoveNestedService(index, childIndex)}
                                        >
                                            Remove Nested Service
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                    onClick={() => handleAddNestedService(index)}
                                >
                                    Add Nested Service
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Save Button */}
                <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mt-6"
                    onClick={handleSaveServices}
                >
                    Save All Services
                </button>
            </div>
        </DefaultLayout>
    );
};

export default AdminServices;
