"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const FeedbackForm = () => {
    const [mainData, setMainData] = useState("");
    const [ids, setIds] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Check if feedback has already been submitted
        const feedbackSubmitted = localStorage.getItem("feedbackSubmitted");
        if (feedbackSubmitted) {
            setIsSubmitted(true);
        } else {
            fetchdata();
        }
    }, []);

    const fetchdata = async () => {
        const data = await fetch("/api/admin/site-settings");
        if (data.ok) {
            const maindata = await data.json();
            setMainData(maindata[0]);
        }
    };

    const fetchids = async () => {
        const data = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/api/feedback/feedbackmailid`);
        if (data.ok) {
            const maindata = await data.json();
            setIds(maindata);
        }
    };

    useEffect(() => { fetchids() }, []);

    const [formData, setFormData] = useState({
        designSatisfaction: "",
        onTimeDelivery: "",
        coordinationSatisfaction: "",
        additionalFeedback: "",
        emojiRating: "😍",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEmojiClick = (rating) => {
        setFormData({ ...formData, emojiRating: rating });
    };

    const getEmojiText = (emoji) => {
        switch (emoji) {
            case "😡":
                return "Very Dissatisfied";
            case "😞":
                return "Dissatisfied";
            case "😐":
                return "Neutral";
            case "😊":
                return "Satisfied";
            case "😍":
                return "Very Satisfied";
            default:
                return "Not Rated";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ids.length) {
            toast.error("No email recipients found.");
            return;
        }

        // Extract email addresses from the array of objects
        const emailRecipients = ids.map(item => item.id);

        // Add the thank-you email ID from environment variables
        const thankYouEmail = process.env.NEXT_PUBLIC_SMTP_MAIL;

        // Combine both lists (avoiding duplicates)
        const allRecipients = [...new Set([...emailRecipients, thankYouEmail])];

        const emailData = {
            user: "Redvision Technology",
            to: allRecipients, // Send to extracted email addresses + thank-you email
            subject: `Feedback`,
            html: `
                <p><strong>${mainData.title} Feedback details are as below:</strong></p>
                <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <th style="background-color: #f2f2f2; text-align: left;">Question</th>
                        <th style="background-color: #f2f2f2; text-align: left;">Response</th>
                    </tr>
                    <tr>
                        <td>Were you satisfied with the website's design and functionality?</td>
                        <td>${formData.designSatisfaction}</td>
                    </tr>
                    <tr>
                        <td>Was the website delivered on time?</td>
                        <td>${formData.onTimeDelivery}</td>
                    </tr>
                    <tr>
                        <td>Were you satisfied with the coordination and communication during the process?</td>
                        <td>${formData.coordinationSatisfaction}</td>
                    </tr>
                    <tr>
                        <td>We would love to listen to anything about our services</td>
                        <td>${getEmojiText(formData.emojiRating)}</td>
                    </tr>
                     <tr>
                        <td>Message</td>
                        <td>${(formData.additionalFeedback)}</td>
                    </tr>
                </table>
                <br>
            `,
        };

        try {
            await axios.post('/api/email/', emailData);
            await axios.get(`${process.env.NEXT_PUBLIC_DATA_API}/api/feedback?designSatisfaction=${formData.designSatisfaction}&onTimeDelivery=${formData.onTimeDelivery}&coordinationSatisfaction=${formData.coordinationSatisfaction}&additionalFeedback=${formData.additionalFeedback}&emojiRating=${formData.emojiRating}&email=${mainData.email}&title=${mainData.title}`);

            toast.success("Feedback sent successfully.");
            localStorage.setItem("feedbackSubmitted", "true");
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error:", error);
            toast.error("An unexpected error occurred.");
        }
    };

    if (isSubmitted) {
        return (
            <div className="relative min-h-screen flex items-center justify-center">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "url('images/feedback/feedback-bg.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: 0.2, // Adjust opacity here
                    }}
                ></div>
                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h1>
                    <p className="text-gray-700">
                        We appreciate your feedback. Your input helps us improve our services.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {/* Background Image with Reduced Opacity */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('images/feedback/feedback-bg.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.2, // Adjust opacity here
                }}
            ></div>

            {/* Form Content */}
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Feedback Form</h1>
                <form onSubmit={handleSubmit}>
                    {/* Emoji Rating */}
                    <div className="mb-4">
                        <p className="text-gray-700 font-medium">
                            How satisfied are you with our services overall?
                        </p>
                        <div className="flex justify-around mt-2">
                            <button
                                type="button"
                                onClick={() => handleEmojiClick("😡")}
                                className={`text-3xl ${formData.emojiRating === "😡" ? "opacity-100" : "opacity-50"
                                    }`}
                            >
                                😡
                            </button>
                            <button
                                type="button"
                                onClick={() => handleEmojiClick("😞")}
                                className={`text-3xl ${formData.emojiRating === "😞" ? "opacity-100" : "opacity-50"
                                    }`}
                            >
                                😞
                            </button>
                            <button
                                type="button"
                                onClick={() => handleEmojiClick("😐")}
                                className={`text-3xl ${formData.emojiRating === "😐" ? "opacity-100" : "opacity-50"
                                    }`}
                            >
                                😐
                            </button>
                            <button
                                type="button"
                                onClick={() => handleEmojiClick("😊")}
                                className={`text-3xl ${formData.emojiRating === "😊" ? "opacity-100" : "opacity-50"
                                    }`}
                            >
                                😊
                            </button>
                            <button
                                type="button"
                                onClick={() => handleEmojiClick("😍")}
                                className={`text-3xl ${formData.emojiRating === "😍" ? "opacity-100" : "opacity-50"
                                    }`}
                            >
                                😍
                            </button>
                        </div>
                    </div>
                    {/* Question 1 */}
                    <div className="mb-4">
                        <p className="text-gray-700 font-medium">
                            Were you satisfied with the websites design and functionality?
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="designSatisfaction"
                                    value="Yes"
                                    className="form-radio text-blue-500"
                                    onChange={handleChange}
                                />
                                <span className="ml-2 text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="designSatisfaction"
                                    value="No"
                                    className="form-radio text-blue-500"
                                    onChange={handleChange}
                                />
                                <span className="ml-2 text-gray-700">No</span>
                            </label>
                        </div>
                    </div>
                    {/* Question 2 */}
                    <div className="mb-4">
                        <p className="text-gray-700 font-medium">
                            Was the website delivered on time?
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="onTimeDelivery"
                                    value="Yes"
                                    className="form-radio text-blue-500"
                                    onChange={handleChange}
                                />
                                <span className="ml-2 text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="onTimeDelivery"
                                    value="No"
                                    className="form-radio text-blue-500"
                                    onChange={handleChange}
                                />
                                <span className="ml-2 text-gray-700">No</span>
                            </label>
                        </div>
                    </div>
                    {/* Question 2 */}
                    <div className="mb-4">
                        <p className="text-gray-700 font-medium">
                            Were you satisfied with the coordination and communication during the process?
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="coordinationSatisfaction"
                                    value="Yes"
                                    className="form-radio text-blue-500"
                                    onChange={handleChange}
                                />
                                <span className="ml-2 text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="coordinationSatisfaction"
                                    value="No"
                                    className="form-radio text-blue-500"
                                    onChange={handleChange}
                                />
                                <span className="ml-2 text-gray-700">No</span>
                            </label>
                        </div>
                    </div>
                    {/* Additional Feedback */}
                    <div className="mb-4">
                        <label
                            htmlFor="additionalFeedback"
                            className="text-gray-700 font-medium block mb-2"
                        >
                            We would love to listen to anything about our services
                        </label>
                        <textarea
                            id="additionalFeedback"
                            name="additionalFeedback"
                            rows="4"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Your feedback..."
                            value={formData.additionalFeedback}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    {/* Submit Button */}
                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
