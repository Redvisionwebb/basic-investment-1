import React from "react";
import Link from "next/link";
import InnerBanner from "@/components/innerBanner/InnerBanner";

export const metadata = {
  title: "Fixed Deposits",
  description:
    "Fixed Deposits offer guaranteed returns, capital safety, and flexible tenures—making them a trusted choice for conservative investors seeking steady income.",
};

export default function FixedDepositsLanding() {
  return (
    <>
      <InnerBanner pageName="Fixed Deposits" />
      <section className="main-section bg-white">
        <div className="max-w-screen-xl mx-auto">
          {/* Heading */}
          <h1 className="font-extrabold text-center text-[var(--rv-primary)] mb-3">Fixed Deposits</h1>

          {/* Subheading */}
          <h2 className="text-gray-700 font-medium mb-6 text-center">Safe. Stable. Secure Returns.</h2>

          {/* Introduction */}
          <p className="mb-4 text-lg text-gray-800">
            Fixed Deposits (FDs) are one of the safest and most popular investment options in India, offering guaranteed returns over a fixed period. Ideal for risk-averse investors, FDs ensure capital preservation along with predictable interest income.
          </p>

          {/* Description */}
          <p className="mb-8 text-lg text-gray-800">
            Whether you're planning for a short-term goal or looking to park surplus funds securely, FDs offer the flexibility of choosing tenures, payout modes, and interest types. Corporate and Bank FDs are available to suit various return expectations and liquidity needs.
          </p>

          {/* Types of FDs */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Types of Fixed Deposits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Bank Fixed Deposits</h4>
                <p>Offered by public and private sector banks, insured and backed by RBI regulations.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Corporate Fixed Deposits</h4>
                <p>Issued by NBFCs and corporates, typically offering higher interest rates than banks.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Cumulative Deposits</h4>
                <p>Interest is compounded and paid at maturity — ideal for long-term compounding.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h4 className="font-bold mb-2">Non-Cumulative Deposits</h4>
                <p>Interest is paid out monthly, quarterly, or annually — suitable for regular income.</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-10">
            <h3 className="font-semibold text-[var(--rv-primary)] mb-4">Key Features</h3>
            <ul className="space-y-4 text-gray-800">
              <li>
                <strong>✔ Capital Safety:</strong> Your principal remains secure throughout the tenure.
              </li>
              <li>
                <strong>✔ Guaranteed Returns:</strong> Earn fixed interest irrespective of market fluctuations.
              </li>
              <li>
                <strong>✔ Flexible Tenure:</strong> Choose investment periods from a few months to several years.
              </li>
              <li>
                <strong>✔ Liquidity Options:</strong> Premature withdrawal is possible (with applicable penalties).
              </li>
              <li>
                <strong>✔ Senior Citizen Benefits:</strong> Additional interest rates available for senior investors.
              </li>
            </ul>
          </div>

          {/* Conclusion and CTA */}
          <div className="bg-[var(--rv-forth)] p-6 rounded-xl shadow-sm">
            <p className="text-lg text-gray-800 mb-4">
              Fixed Deposits are a simple, reliable way to grow your wealth without taking unnecessary risks. Secure your savings and earn steady income with the right FD strategy.
            </p>
            <Link href="/contact-us" className="btn2">
              Invest in Fixed Deposits Today
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
