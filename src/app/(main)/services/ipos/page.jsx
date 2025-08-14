import React from "react";
import Link from "next/link";
import InnerBanner from "@/components/innerBanner/InnerBanner";

export const metadata = {
  title: "Initial Public Offerings (IPOs)",
  description:
    "Participate in the exciting journey of companies going public through IPOs. Gain early access to growth opportunities and diversify your portfolio with promising businesses.",
};

export default function IPOsLanding() {
  return (
    <>
      <InnerBanner pageName="Initial Public Offerings (IPOs)" />
      <section className="main-section bg-white">
        <div className="max-w-screen-xl mx-auto">
          {/* Heading */}
          <h1 className="font-extrabold text-center text-[var(--rv-primary)] mb-3">Initial Public Offerings (IPOs)</h1>

          {/* Subheading */}
          <h2 className="text-gray-700 font-medium mb-6 text-center">Early access to potential market leaders</h2>

          {/* Introduction */}
          <p className="mb-4 text-lg text-gray-800">
            IPOs offer investors a unique opportunity to invest in a company at the beginning of its public journey. By subscribing to an IPO, you can become a part of a company’s growth story from the ground up.
          </p>

          {/* Description */}
          <p className="mb-8 text-lg text-gray-800">
            Companies launch IPOs to raise capital by offering their shares to the public for the first time. As an investor, IPOs can offer attractive valuations, early entry, and significant long-term returns — especially when backed by strong fundamentals.
          </p>

          {/* Types of IPO Investors */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Investor Categories in IPOs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Retail Individual Investors (RIIs)</h4>
                <p>Investors applying for less than ₹2 lakhs. Allotment is often on a lottery basis.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">High Net-worth Individuals (HNIs)</h4>
                <p>Investors applying for more than ₹2 lakhs. Allotment is proportionate to funds applied.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Qualified Institutional Buyers (QIBs)</h4>
                <p>Includes mutual funds, banks, insurance companies — with separate reserved quota.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Anchor Investors</h4>
                <p>Institutional investors invited before IPO opens, to boost confidence and price discovery.</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Key Benefits of Investing in IPOs</h3>
            <ul className="space-y-4 text-gray-800">
              <li>
                <strong>✔ Early Access:</strong> Get shares before they’re listed on the stock exchange.
              </li>
              <li>
                <strong>✔ Potential Upside:</strong> Benefit from listing gains and long-term appreciation.
              </li>
              <li>
                <strong>✔ Transparent Process:</strong> Regulated and monitored by SEBI with full disclosures.
              </li>
              <li>
                <strong>✔ Allotment Flexibility:</strong> Various categories to suit retail and institutional investors.
              </li>
              <li>
                <strong>✔ Digital Application:</strong> Easy ASBA-based online IPO application process.
              </li>
            </ul>
          </div>

          {/* Conclusion and CTA */}
          <div className="bg-[var(--rv-forth)] p-6 rounded-xl shadow-sm">
            <p className="text-lg text-gray-800 mb-4">
              IPOs can be a great gateway to participate in India’s capital markets and unlock wealth-building opportunities. Get expert support for analysis, timing, and application.
            </p>
            <Link href="/contact-us" className="btn2">
              Explore Upcoming IPOs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
