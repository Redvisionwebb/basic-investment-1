
import InnerBanner from "@/components/innerBanner/InnerBanner";
import FundCategoryTabs from "@/components/FundCategoryTabs/page";

export default function MarketUpdate() {

  return (
    <div className="">
      <InnerBanner title="Fund Performance" subpages="Performance" />
      <div className="px-4">
        <div className="max-w-screen-xl mx-auto section ">
          <FundCategoryTabs />
        </div>
      </div>
    </div>
  );
}