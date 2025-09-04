import { Suspense } from "react";
import InnerBanner from "@/components/InnerBanner/InnerBanner";
import AllCalculator from "../../calculators/page";


export default function Page() {
  return (
    <div>
      {/* <InnerBanner title="Financial Calculator" />
      <div className="max-w-screen-xl mx-auto main_section">
        <Suspense fallback={<div>Loading calculators...</div>}> */}
          <AllCalculator />
        {/* </Suspense>
      </div> */}
    </div>
  );
}
