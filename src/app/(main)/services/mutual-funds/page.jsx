import React from "react";
import Link from "next/link";
import InnerBanner from "@/components/innerBanner/InnerBanner";

export const metadata = {
  title: "Mutual Funds",
  description:
    "Mutual Funds are a powerful investment tool that offer diversification, professional management, and wealth creation opportunities tailored to every investor profile.",
};

export default function MutualFundsLanding() {
  return (
    <>
      <InnerBanner pageName="Mutual Funds" />
      <section className="main-section bg-white">
        <div className="max-w-screen-xl mx-auto">
          {/* Heading */}
          <h1 className="font-extrabold text-center text-[var(--rv-primary)] mb-3">Mutual Funds</h1>

          {/* Subheading */}
          <h2 className="text-gray-700 font-medium mb-6 text-center">Your gateway to smart, goal-based investing</h2>

          {/* Introduction */}
          <p className="mb-4 text-lg text-gray-800">
            Mutual Funds pool money from multiple investors and invest in a diversified portfolio of stocks, bonds, or other assets. Managed by experienced fund managers, they are ideal for investors seeking returns with reduced risk through diversification.
          </p>

          {/* Description */}
          <p className="mb-8 text-lg text-gray-800">
            Whether you're a beginner looking to start a SIP or a seasoned investor planning asset allocation, Mutual Funds offer a structured path to long-term wealth creation, tailored to different financial goals, risk appetites, and investment horizons.
          </p>

          {/* Types of Mutual Funds */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Types of Mutual Funds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Equity Funds</h4>
                <p>Invest primarily in stocks. Suitable for long-term investors seeking capital appreciation.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Debt Funds</h4>
                <p>Invest in fixed-income instruments like bonds and government securities. Ideal for stability and steady income.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Hybrid Funds</h4>
                <p>Blend of equity and debt, these funds aim to balance risk and return efficiently.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Liquid Funds</h4>
                <p>Short-term investments with high liquidity and low risk — perfect for emergency funds and surplus parking.</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Key Features</h3>
            <ul className="space-y-4 text-gray-800">
              <li>
                <strong>✔ Professional Fund Management:</strong> Experts manage your money with research-backed strategies.
              </li>
              <li>
                <strong>✔ Diversification:</strong> Spread risk across multiple assets and sectors for stable returns.
              </li>
              <li>
                <strong>✔ Systematic Investment Plans (SIPs):</strong> Start small and build wealth gradually through disciplined investing.
              </li>
              <li>
                <strong>✔ High Liquidity:</strong> Most open-ended mutual funds can be redeemed quickly at NAV.
              </li>
              <li>
                <strong>✔ Transparent & Regulated:</strong> Governed by SEBI, offering regular disclosures and safety.
              </li>
            </ul>
          </div>

          {/* Conclusion and CTA */}
          <div className="bg-[var(--rv-forth)] p-6 rounded-xl shadow-sm">
            <p className="text-lg text-gray-800 mb-4">
              Mutual Funds offer flexibility, convenience, and the potential to grow your wealth over time. Let us help you choose the right fund to match your goals and risk profile.
            </p>
            <Link href="/contact-us" className="btn2">
              Start Investing in Mutual Funds
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
