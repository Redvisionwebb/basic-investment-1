"use client"
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

function WebPopup() {
    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState(false);
    const [content, setContent] = useState("");
    const fetchPopup = async () => {
        const res = await axios.get("/api/webpopups");
        setContent(res.data[0])
    };

    const fetchPopupStatus = async () => {
        const res = await axios.get("/api/webpopups");
        const status = res?.data[0]?.status;
        setStatus(status)
    };

    useEffect(() => {
        fetchPopupStatus();
    }, []);

    useEffect(() => {
        fetchPopup();
    }, []);

    useEffect(() => {
        const popupShown = localStorage.getItem('popupShown');
        if (!popupShown) {
            setModalOpen(true); // Show the modal if not shown before
        }
    }, []);

    const onClose = () => {
        setModalOpen(false);
    };

    const onCommit = () => {
        setModalOpen(false);

        // Save state to localStorage to prevent showing again
        localStorage.setItem('popupShown', 'true');
    };

    return (
        <>
            {status && modalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg
                                        className="h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            {content && (
                                <div
                                    className=""
                                >
                                    <h1>
                                        {content.title}
                                    </h1>
                                    <div className='flex items-center justify-center p-3'>
                                        <Image src={content?.image?.url} width={200} height={200} alt='image' />
                                    </div>
                                </div>
                            )}
                            {/* Body content */}
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={onCommit}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    OK
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default WebPopup;
