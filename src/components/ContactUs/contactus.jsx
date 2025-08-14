'use client';
import { useState } from "react";
import { Button } from "../ui/button";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import axios from "axios";

export function ContactUs({ sitedata }) {
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emailContent = "We’re excited to help you reach your financial goals.";
    const emailData = {
      to: formData.email,
      subject: 'Thank You for Your Enquiry!',
      text: `Dear ${formData.username},\n\nWe sincerely appreciate your interest and the time you took to fill out our enquiry form. We have received your details, and our team will be in touch with you soon.\n\n${emailContent}`,
    };

    const senderData = {
      to: sitedata?.email || "support@alpha72wealth.com",
      subject: 'New Enquiry Received',
      text: `New Enquiry from Contact Us:\n\nUser Name: ${formData.username}\nEmail: ${formData.email}\nMobile: ${formData.mobile}\nMessage: ${formData.message}\n\n${emailContent}`,
    };

    try {
      const res = await axios.post("/api/leads",formData );
      console.log(res)
      // console.log(res)
     
      if (res.status === 201) {
        await axios.post("/api/email", emailData);
        await axios.post("/api/email", senderData);
  
        setSubmitted(true);
        setFormData({ username: "", mobile: "", email: "", message: "" });
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSubmitted(false);
  };

  return (
    <div className="md:py-12 py-4 relative">
      <section className="max-w-5xl mx-auto p-8 bg-white flex flex-col md:flex-row gap-8">
        {/* Left Section */}
        <div className="md:w-1/2">
          <h2 className="topheading text-[#0E314D]">GET STARTED</h2>
          <h2 className="subheading text-[#0E314D] mb-4">
            Schedule a call to achieve your financial goals
          </h2>
          <div className="em_bar">
            <div className="em_bar_bg" />
          </div>
          <p className="text-black text-lg">
            Unlock expert insights and personalized strategies to grow your wealth.
          </p>
          <ul className="mt-4 space-y-2 text-gray-700 text-lg">
            <li className="flex gap-2"><IoMdCheckmarkCircleOutline className="text-3xl text-[#0E314D]" /><p>Talk to an expert about your goals</p></li>
            <li className="flex gap-2"><IoMdCheckmarkCircleOutline className="text-3xl text-[#0E314D]" /><p>Detailed portfolio review</p></li>
            <li className="flex gap-2"><IoMdCheckmarkCircleOutline className="text-3xl text-[#0E314D]" /><p>Get a tailored plan for your goals</p></li>
          </ul>
        </div>

        {/* Right Section - Form */}
        <div className="md:w-1/2 border border-[#C59F4A] rounded-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 justify-center items-center">
            <input
              name="username"
              type="text"
              placeholder="Name"
              className="w-full border border-[#C59F4A] p-3 rounded-md"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              name="mobile"
              type="text"
              placeholder="Mobile"
              className="w-full border border-[#C59F4A] p-3 rounded-md"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full border border-[#C59F4A] p-3 rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              rows="4"
              className="w-full border border-[#C59F4A] p-3 rounded-md"
              value={formData.message}
              onChange={handleChange}
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#C59F4A] text-white sm:text-lg md:text-lg font-bold px-4 py-2 rounded-lg hover:bg-[#a07d3e] transition-all w-[50%] cursor-pointer"
            >
              {loading ? "Sending..." : "Free Consultancy"}
            </Button>
          </form>
        </div>
      </section>

      {/* Modal Popup */}
      {submitted && (
        <div className="fixed inset-0 bg-[#0e314da3] bg-opacity-50 flex items-center justify-center z-50 transition-all">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-semibold text-[#0E314D] mb-4">Thank You!</h2>
            <p className="text-gray-700 mb-6">Thank you for connecting with us. We'll reach out to you shortly.</p>
            <Button onClick={closeModal} className="bg-[#C59F4A] text-white px-6 py-2 rounded-lg hover:bg-[#a07d3e]">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
