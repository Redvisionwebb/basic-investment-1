import FundCategoryTabs from "@/components/FundCategoryTabs/page";
import InnerBanner from "@/components/innerBanner/InnerBanner";

export default function MarketUpdate() {

  return (
    <>
      <InnerBanner title="Fund Performance" />
      <div className="section">
        <div className="max-w-screen-xl mx-auto px-4">
          <FundCategoryTabs />
        </div>
      </div>
    </>
  );
}