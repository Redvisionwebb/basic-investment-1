import React from "react";
import Link from "next/link";
import InnerBanner from "@/components/innerBanner/InnerBanner";

export const metadata = {
  title: "Equity Funds",
  description:
    "Equity mutual funds invest primarily in stocks and aim for long-term capital growth. Ideal for wealth creation, these funds cater to investors with a higher risk appetite and longer investment horizons.",
};

export default function EquityFundsLanding() {
  return (
    <>
      <InnerBanner pageName="Equity Funds" />
      <section className="main-section bg-white">
        <div className="max-w-screen-xl mx-auto">
          {/* Heading */}
          <h1 className="font-extrabold text-center text-[var(--rv-primary)] mb-3">Equity Funds</h1>

          {/* Subheading */}
          <h2 className="text-gray-700 font-medium mb-6 text-center">Long-term growth through equity investing</h2>

          {/* Introduction */}
          <p className="mb-4 text-lg text-gray-800">
            Equity mutual funds invest predominantly in stocks of publicly listed companies. These funds aim for long-term capital appreciation by tapping into the growth potential of the equity markets.
          </p>

          {/* Description */}
          <p className="mb-8 text-lg text-gray-800">
            Suitable for investors with a medium to high risk appetite, equity funds offer a powerful vehicle for wealth creation over time. They can be sector-specific, diversified, or focused on particular market capitalizations — like large-cap, mid-cap, or small-cap.
          </p>

          {/* Types of Equity Funds */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Types of Equity Funds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Large-Cap Funds</h4>
                <p>Invest in well-established companies with stable returns and lower volatility.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Mid-Cap Funds</h4>
                <p>Target mid-sized companies with high growth potential and moderate risk.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Small-Cap Funds</h4>
                <p>Focus on emerging businesses with high growth prospects but higher risk.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">ELSS (Tax Saving Funds)</h4>
                <p>Offer tax benefits under Section 80C with a lock-in period of 3 years.</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Key Features</h3>
            <ul className="space-y-4 text-gray-800">
              <li>
                <strong>✔ Capital Growth:</strong> Designed for long-term wealth creation.
              </li>
              <li>
                <strong>✔ Professionally Managed:</strong> Fund managers actively select quality stocks.
              </li>
              <li>
                <strong>✔ High Liquidity:</strong> Open-ended funds can be redeemed anytime at NAV.
              </li>
              <li>
                <strong>✔ Diversification:</strong> Spread across sectors and market caps to reduce risk.
              </li>
              <li>
                <strong>✔ Tax Efficiency:</strong> ELSS funds offer dual benefits of growth and tax savings.
              </li>
            </ul>
          </div>

          {/* Conclusion and CTA */}
          <div className="bg-[var(--rv-forth)] p-6 rounded-xl shadow-sm">
            <p className="text-lg text-gray-800 mb-4">
              Equity funds are a dynamic choice for long-term investors. Build your wealth through expert-managed exposure to the stock market.
            </p>
            <Link href="/contact-us" className="btn2">
              Start Investing in Equity Funds
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
