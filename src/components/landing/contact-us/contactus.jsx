"use client";
import { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import styles from "./ContactForm.module.css";

export function ContactUs({ sitedata }) {
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    message: "",
    services: "",
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
      subject: "Thank You for Your Enquiry!",
      text: `Dear ${formData.username},\n\nWe sincerely appreciate your interest and the time you took to fill out our enquiry form. We have received your details, and our team will be in touch with you soon.\n\n${emailContent}`,
    };

    const senderData = {
      to: sitedata?.email || "support@alpha72wealth.com",
      subject: "New Enquiry Received",
      text: `New Enquiry from Contact Us:\n\nUser Name: ${formData.username}\nEmail: ${formData.email}\nMobile: ${formData.mobile}\nMessage: ${formData.message}\nServices Interested: ${formData.services}\n\n${emailContent}`,
    };

    try {
      const res = await axios.post("/api/leads", formData);

      if (res.status === 201) {
        await axios.post("/api/email", emailData);
        await axios.post("/api/email", senderData);

        setSubmitted(true);
        setFormData({
          username: "",
          mobile: "",
          email: "",
          message: "",
          services: "",
        });
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

  const closeModal = () => setSubmitted(false);

  return (
    <section className="max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[450px] overflow-hidden">
        {/* Left Side */}
        <div className="col-span-12 md:col-span-5 bg-[--rv-primary] text-white p-8 flex flex-col justify-between rounded-tr-[200px]">
          <div>
            <h2 className={styles.heading}>
              Start the <br />
              Conversation
            </h2>
            <p className="mt-2">
              From personalized advice to smart tools, our team is ready to help you move forward with clarity and confidence.
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex flex-col gap-2">
              <h4>Send Us Email</h4>
              <div className="flex gap-2 items-center">
                <Mail size={20} />
                <span className="break-all">
                  {sitedata?.email || "webhelp@redvisiontech.com"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4>Call for Inquiry</h4>
              <div className="flex gap-2 items-center">
                <Phone size={20} />
                <span>{sitedata?.mobile || "+91 81090 60608"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4>WhatsApp</h4>
              <div className="flex gap-2 items-center">
                <MessageSquare size={20} />
                <span>{sitedata?.whatsAppNo || "+91 81090 60608"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4>Visit Us</h4>
              <div className="flex gap-2 items-center">
                <MapPin size={20} />
                <span>{sitedata?.address || "Indore"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="col-span-12 md:col-span-7 bg-white p-6 md:p-10">
          <h3 className="font-semibold text-center mb-6">Send us a message</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="username"
                placeholder="Name"
                value={formData.username}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <input
                type="text"
                name="mobile"
                placeholder="Phone"
                value={formData.mobile}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />

            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className={styles.textarea}
            />

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Submitting..." : "Begin My Investment"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Google Map Section */}
      {/* {sitedata?.iframe && (
        <div className="mt-8">
          <iframe
            src={sitedata.iframe}
            className="w-full h-80 rounded-lg"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )} */}

      {/* Thank You Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-[#0e314da3] bg-opacity-50 flex items-center justify-center z-50 transition-all">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-semibold text-[#0E314D] mb-4">
              Thank You!
            </h2>
            <p className="text-gray-700 mb-6">
              Thank you for connecting with us. We’ll reach out to you shortly.
            </p>
            <button
              onClick={closeModal}
              className="bg-[var(--rv-primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--rv-primary-light)]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
