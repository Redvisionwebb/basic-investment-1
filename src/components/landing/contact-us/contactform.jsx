"use client";

import { useState } from "react";
import axios from "axios";
import styles from "./ContactForm.module.css";

export default function ContactForm({
  sitedata,
  title = "Send us a message",
  buttonText = "Begin My Investment",
}) {
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

    const emailContent =
      "We’re excited to help you reach your financial goals.";

    const emailData = {
      to: formData.email,
      subject: "Thank You for Your Enquiry!",
      text: `Dear ${formData.username},\n\nWe sincerely appreciate your interest and the time you took to fill out our enquiry form. We have received your details, and our team will be in touch with you soon.\n\n${emailContent}`,
    };

    const senderData = {
      to: sitedata?.email || "support@yourcompany.com",
      subject: "New Enquiry Received",
      text: `New Enquiry:\n\nName: ${formData.username}\nMobile: ${formData.mobile}\nEmail: ${formData.email}\nServices: ${formData.services}\nMessage: ${formData.message}\n\n${emailContent}`,
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
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.title}>{title}</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <input
            name="username"
            type="text"
            placeholder="Name"
            className={styles.input}
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            name="mobile"
            type="text"
            placeholder="Phone"
            className={styles.input}
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="email"
          type="email"
          placeholder="Email"
          className={styles.input}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Message"
          rows="4"
          className={styles.textarea}
          value={formData.message}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Sending..." : buttonText}
        </button>
      </form>

      {submitted && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Thank You!</h2>
            <p>
              Thank you for connecting with us. We&lsquo;ll reach out to you
              shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className={styles.modalButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
