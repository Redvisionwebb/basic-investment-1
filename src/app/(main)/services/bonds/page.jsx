import React from "react";
import Link from "next/link";
import InnerBanner from "@/components/innerBanner/InnerBanner";

export const metadata = {
  title: "Bonds",
  description:
    "Bonds offer a secure and steady investment avenue, ideal for investors seeking predictable returns with lower risk. Discover how bonds can enhance your financial stability and diversify your portfolio.",
};

export default function BondsLanding() {
  return (
    <>
      <InnerBanner pageName="Bonds" />
      <section className="main-section bg-white">
        <div className="max-w-screen-xl mx-auto">
          {/* Heading */}
          <h1 className="font-extrabold text-center text-[var(--rv-primary)] mb-3">Bonds</h1>

          {/* Subheading */}
          <h2 className="text-gray-700 font-medium mb-6 text-center">Steady returns with lower risk</h2>

          {/* Introduction */}
          <p className="mb-4 text-lg text-gray-800">
            Bonds are fixed-income instruments that offer predictable interest payouts over a specified term. They’re ideal for conservative investors seeking capital preservation and steady income.
          </p>

          {/* Description */}
          <p className="mb-8 text-lg text-gray-800">
            By investing in bonds, you lend your money to governments or corporations in return for regular interest and repayment at maturity. Bonds can play a crucial role in balancing risk and stability in a diversified portfolio.
          </p>

          {/* Types of Bonds */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Types of Bonds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Government Bonds</h4>
                <p>Issued by central or state governments, offering high safety with fixed returns.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Corporate Bonds</h4>
                <p>Issued by companies to raise capital, offering higher yields than government bonds.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Tax-Free Bonds</h4>
                <p>Provide tax-free interest income, ideal for high-income investors seeking tax efficiency.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">54EC Capital Gain Bonds</h4>
                <p>Exempt long-term capital gains under Section 54EC if invested within 6 months of sale.</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Key Features</h3>
            <ul className="space-y-4 text-gray-800">
              <li>
                <strong>✔ Fixed Returns:</strong> Earn regular interest payments with minimal volatility.
              </li>
              <li>
                <strong>✔ Capital Preservation:</strong> Ideal for risk-averse investors seeking stability.
              </li>
              <li>
                <strong>✔ Portfolio Diversification:</strong> Reduce equity exposure risk with debt allocation.
              </li>
              <li>
                <strong>✔ Tax Benefits:</strong> Certain bonds offer tax exemptions under sections like 54EC.
              </li>
              <li>
                <strong>✔ Liquidity:</strong> Select bonds are tradable in the secondary market.
              </li>
            </ul>
          </div>

          {/* Conclusion and CTA */}
          <div className="bg-[var(--rv-forth)] p-6 rounded-xl shadow-sm">
            <p className="text-lg text-gray-800 mb-4">
              Bonds offer the perfect balance of security and income. Add them to your portfolio for consistent performance and peace of mind.
            </p>
            <Link href="/contact-us" className="btn2">
              Start Investing in Bonds
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
