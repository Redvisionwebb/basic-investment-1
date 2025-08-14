import React from "react";
import Link from "next/link";
import InnerBanner from "@/components/innerBanner/InnerBanner";

export const metadata = {
  title: "Portfolio Management Services (PMS)",
  description:
    "Portfolio Management Services (PMS) offer tailored investment solutions for high-net-worth individuals (HNIs). With expert portfolio structuring, risk management, and active monitoring, PMS enables you to optimize returns while aligning with your financial goals.",
};

export default function PMSLanding() {
  return (
    <>
      <InnerBanner pageName="Portfolio Management Services" />
      <section className="main-section bg-white">
        <div className="max-w-screen-xl mx-auto">
          {/* Heading */}
          <h1 className="font-extrabold text-center text-[var(--rv-primary)] mb-3">Portfolio Management Services (PMS)</h1>

          {/* Subheading */}
          <h2 className="text-gray-700 font-medium mb-6 text-center">Customized wealth solutions for discerning investors</h2>

          {/* Introduction */}
          <p className="mb-4 text-lg text-gray-800">
            Portfolio Management Services (PMS) are tailored investment solutions for high-net-worth individuals (HNIs) seeking personalized strategies and professional oversight. PMS portfolios are actively managed by experienced fund managers who align investments with your financial goals, risk tolerance, and time horizon.
          </p>

          {/* Description */}
          <p className="mb-8 text-lg text-gray-800">
            Unlike mutual funds, PMS offers more flexibility, control, and transparency. You get a dedicated portfolio that reflects your preferences, backed by in-depth research, dynamic asset allocation, and performance monitoring.
          </p>

          {/* Types of PMS */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Popular PMS Strategies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Equity Growth</h4>
                <p>Focuses on capital appreciation through high-conviction stock picking across sectors.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Value Investing</h4>
                <p>Invests in fundamentally strong companies available at undervalued prices.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Multi-Asset Allocation</h4>
                <p>Diversifies across equities, debt, gold, and other asset classes to manage risk.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Thematic/Concentrated Portfolios</h4>
                <p>Focuses on emerging themes or sectors such as ESG, digital, consumption, etc.</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Key Benefits</h3>
            <ul className="space-y-4 text-gray-800">
              <li>
                <strong>✔ Custom Portfolio:</strong> Tailored to your objectives and investment profile.
              </li>
              <li>
                <strong>✔ Active Management:</strong> Managed by seasoned professionals with constant portfolio review.
              </li>
              <li>
                <strong>✔ Transparency:</strong> Regular performance reporting and online access.
              </li>
              <li>
                <strong>✔ Tax Efficiency:</strong> Direct holding structure offers better capital gain planning.
              </li>
              <li>
                <strong>✔ Higher Investment Threshold:</strong> Ideal for investors seeking high-ticket, personalized advisory.
              </li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="bg-[var(--rv-forth)] p-6 rounded-xl shadow-sm">
            <p className="text-lg text-gray-800 mb-4">
              Looking for a tailored approach to investing? Let our team help you craft a PMS strategy aligned to your long-term financial goals.
            </p>
            <Link href="/contact-us" className="btn2">
              Start Your PMS Journey
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
