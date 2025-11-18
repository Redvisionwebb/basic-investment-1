"use client";
import React, { useEffect, useState } from "react";
import styles from "./Contact.module.css";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ContactReusableForm({ sitedata, services }) {
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    service: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const router = useRouter();
  // Generate captcha on mount
  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    setCaptcha(randomString);
    setUserCaptcha("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userCaptcha !== captcha) {
      toast.error("Captcha does not match. Please try again.");
      refreshCaptcha();
      return;
    }

    if (loading) return;
    setLoading(true);

    const emaildata = {
      user: formData?.username,
      to: formData?.email,
      subject: "Thank You for Your Enquiry!",
      html: `<h4>Dear ${formData?.username},</h4>
        <p>
          We sincerely appreciate your interest and the time you took to fill out our enquiry form.
          We have received your details, and our team will be in touch with you soon.
        </p>
        <p>If you have any urgent queries, feel free to reach us directly.</p>
        <div class="footer">
          <p>Best Regards,<br />${sitedata?.websiteName} Team</p>
          <p>&copy; ${new Date().getFullYear()} ${
        sitedata?.websiteName
      }. All rights reserved.</p>
        </div>`,
    };

    const senderdata = {
      user: sitedata?.websiteName,
      to: sitedata?.email,
      subject: "New Enquiry",
      html: `
        <p><strong>New Enquiry Details:</strong></p>
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <tr><th>Field</th><th>Details</th></tr>
          <tr><td>User Name</td><td>${formData?.username}</td></tr>
          <tr><td>Email</td><td>${formData?.email}</td></tr>
          <tr><td>Mobile Number</td><td>${formData?.mobile}</td></tr>
          <tr><td>Service</td><td>${formData?.service}</td></tr>
          <tr><td>Message</td><td>${formData?.message}</td></tr>
        </table>
        <br>
        <p>Regards</p>
        <p><strong>${sitedata?.websiteName} Team</strong></p>
      `,
    };

    try {
      // Save Lead
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/leads`,
        formData
      );

      if (res.status === 201) {
        // Send Emails
        await Promise.all([
          axios.post(
            `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email`,
            emaildata
          ),
          axios.post(
            `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email`,
            senderdata
          ),
        ]);

        router.push("/thankyou");

        setFormData({
          username: "",
          mobile: "",
          email: "",
          service: "",
          message: "",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Name"
          className={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className={styles.input}
          required
        />
      </div>

      {/* Service Dropdown */}
      <div className={styles.inputGroup}>
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          className={`${styles.input} text-gray-700`}
          required
        >
          <option value="">Select Service</option>

          {services?.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputGroup}>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Phone"
          className={styles.input}
          required
        />
      </div>

      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
        className={styles.textarea}
        required
      ></textarea>

      <div className="flex items-center gap-3 my-4 md:flex-row flex-col">
        <div className="px-4 py-2 font-bold text-xl bg-gray-200 rounded-md select-none tracking-widest">
          {captcha}
        </div>
        <input
          type="text"
          value={userCaptcha}
          onChange={(e) => setUserCaptcha(e.target.value.toUpperCase())}
          placeholder="Enter Captcha"
          className={styles.input}
          required
        />
        <button
          type="button"
          onClick={refreshCaptcha}
          className="px-3 py-2 bg-gray-300 rounded-md text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="flex items-center justify-center">
        <button
          type="submit"
          className={`${styles.submitButton} `}
          disabled={loading}
        >
          {loading ? (
            "Sending..."
          ) : (
            <>
              <span>S</span>
              <span>e</span>
              <span>n</span>
              <span>d</span>
              <span className="space"></span>
              <span>M</span>
              <span>e</span>
              <span>s</span>
              <span>s</span>
              <span>a</span>
              <span>g</span>
              <span>e</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
