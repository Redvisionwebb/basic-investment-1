import { Suspense } from "react";
// import InnerBanner from "@/components/InnerBanner/InnerBanner";
import CalculatorTabs from "./CalculatorTabs"; // new client component

export default function Page() {
  return (
    <div>
      {/* <InnerBanner pageName="Financial Calculator" /> */}
      <div className="max-w-screen-xl mx-auto main_section">
        <Suspense fallback={<div>Loading calculators...</div>}>
          <CalculatorTabs />
        </Suspense>
      </div>
    </div>
  );
}
