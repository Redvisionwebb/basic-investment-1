import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getSiteData } from "@/lib/functions";
import Link from "next/link";
import React from "react";
import styles from '../footerpage.module.css'
import InnerBanner from "@/components/innerBanner/InnerBanner";

const PrivacyPage = async () => {
    const sitedata = await getSiteData();
    return (
        <div className={`${styles.footerpage} `}>
            <InnerBanner pageName={"Privacy Policy"} />
            <div className="max-w-screen-xl mx-auto main-section">

                {/* Heading and Subheading */}

                {/* Introduction */}
                <div className="mb-8 mt-8">

                    <p className="text-[16px] text-gray-700">
                        This privacy policy sets out how {sitedata.websiteName}{" "}
                        uses and protects any information that you share when you use this
                        website. {sitedata.websiteName} is committed to ensuring
                        that your privacy is protected at all times. Should we ask you to
                        provide certain information by which you can be identified when
                        using this website, you can be assured that it will only be used
                        in accordance with this privacy statement.
                        {sitedata.websiteName} may change this
                        policy from time to time by updating this page. This policy is
                        effective from June 1, 2018.
                        {sitedata.websiteName} understands
                        that our relationship is strongly built on trust and faith. In
                        Course of using information on this website or availing the
                        services, {sitedata.websiteName} may become privy to the
                        personal information of its customer including information that is
                        of confidential nature. {sitedata.websiteName} is strictly
                        committed to protecting the privacy of its Customer and has taken
                        reasonable measures to protect the confidentiality of the customer
                        information and its transmission through World Wide Web. However
                        it shall not be liable in any manner for disclosure of the
                        confidential information in accordance with this Privacy
                        Commitment or in terms of the agreement if any with the Customer
                        or by reasons beyond its control. We may however be required to
                        disclose your personal information to Government, Judicial bodies,
                        and our Regulators or to any person to whom the Firm is under an
                        obligation to make disclosure under the requirements of any law
                        binding on the Firm or any of its branches, if required. Hyperlink
                        Policy for user Any hyperlink to other Internet sites is at
                        customers own risk. The contents of which and the accuracy of
                        opinions expressed are not verified, monitored or endorsed by{" "}
                        {sitedata.websiteName}, in any way or manner.{" "}
                        {sitedata.websiteName} is not responsible for the setup of
                        any hyperlink from a third party website to{" "}
                        {sitedata.websiteName}
                    </p>
                </div>

                {/* Our Mission and Values */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        What we collect
                    </h2>
                    <p className="text-[16px] text-gray-700 mb-4">
                        We may collect the following information:
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Name and contact details
                    </h2>
                    <p className="text-[16px] text-gray-700 mb-4">
                        We may collect personal information directly from you, such as
                        your name, email address, contact details, or other identifiers,
                        when you register an account, make a purchase, or interact with
                        certain features of the application. <br />
                        Your personal information is used to provide you with access to
                        the application's features and functionalities, personalize your
                        experience, and communicate with you about your account or
                        transactions. <br />
                        We implement industry-standard security measures to protect your
                        personal information from unauthorized access, alteration,
                        disclosure, or destruction. <br />
                        You have the right to control and manage your personal information
                        within the application. You can update your account details,
                        manage your communication preferences, or exercise your rights
                        under applicable data protection laws. <br />
                        You can also choose to delete your account or request the deletion
                        of certain personal information by contacting us through the
                        provided channels or there is an option in app settings page.{" "}
                        <br />
                    </p>
                </div>

                {/* Why Choose Us */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Collection/Use of image data
                    </h2>
                    <p className="text-[16px] text-gray-700">
                        When you grant permission, our application may access your
                        device's camera or photo gallery to enable features that involve
                        capturing, uploading. <br />
                        The images you upload or capture within our application may be
                        used for document verification in Video KYC by the application.{" "}
                        <br />
                        We do not share your image data with third parties unless required
                        by law or necessary to provide the services you have requested.{" "}
                        <br />
                    </p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Use of location data
                    </h2>
                    <p className="text-[16px] text-gray-700">
                        We access your location to verifying your identity and granting
                        access to the application's features and functionalities.
                    </p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Security
                    </h2>
                    <p className="text-[16px] text-gray-700">
                        We are committed to ensuring that your information is secure. In
                        order to prevent unauthorized access or disclosure, we have put in
                        place suitable physical, electronic and managerial procedures to
                        safeguard and secure the information we collect online.
                    </p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Links to other websites
                    </h2>
                    <p className="text-[16px] text-gray-700">
                        Our website may contain links to other websites of interest.
                        However, once you have used these links to leave our site, you
                        should note that we do not have any control over such third-party
                        websites. Therefore, we cannot be responsible for the protection
                        and privacy of any information which you provide whilst visiting
                        such sites. You should exercise caution and look at the privacy
                        statement applicable to the website in question.
                    </p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Controlling your personal information
                    </h2>
                    <p className="text-[16px] text-gray-700">
                        If you believe that any of your information with us is incorrect
                        or incomplete, please email us as soon as possible at{" "}
                        <span className="text-[var(--primary)]">{sitedata.email}</span> We
                        will promptly correct any information found to be incorrect.
                    </p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Security certificates
                    </h2>
                    <p className="text-[16px] text-gray-700">
                        We fully recognize and understand the security implications of
                        being a service provider with whom people trust their money. There
                        are many safeguards we adopt in this regard some of these are
                        technical, and some are structural. <br />
                        When it comes to data security, our goal is to ensure that: Your
                        data is stored safely and securely passwords are one-way encrypted
                        before being stored in the database for high security. <br />
                        All communication with you, or with mutual fund companies and
                        other service providers are encrypted using the highest standards.{" "}
                        <br />
                        Your data is not shared with anyone, unless you have explicitly
                        requested us to do so to fulfil a transaction request. <br />
                        To ensure that we achieve these goals, we have a variety of
                        certifications/trust verifications in place for our firm, both
                        from technical and legal/operational perspectives. All our
                        communications are encrypted by 256-bit encryption, and our data
                        is hosted with top-tier hosting service providers. Also, our data
                        is continuously backed up to ensure continuity of operations.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
