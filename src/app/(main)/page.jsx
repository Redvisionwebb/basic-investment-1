import Homepage from "@/components/landing/hero-section/heroSection";
import DiffrentFunds from "@/components/landing/diffrent-funds/diffrentfunds";
import { ContactUs } from "@/components/landing/contact-us/contactus";
import {
  getAddisLogos,
  getLatestBlogs,
  getServiceData,
  getSiteData,
  getSocialMedia,
  getStatsData,
  getTeams,
  getTestimonials,
} from "@/lib/functions";
import WhatsAppBot from "@/components/chatbot/whatsapp";
import AwardsSection from "@/components/landing/awardsSection/awardSection";
import TrustedSection from "@/components/landing/trustedSection/trustedSection";
import ToolsSection from "@/components/landing/toolsSection/toolsSection";
import ServicesSection from "@/components/landing/serviceSection/serviceSection";
import ComparePlansSection from "@/components/landing/comparePlan/compareSection";
import TeamSection from "@/components/landing/teamSection/teamSection";
import TopTaxSavingFunds from "@/components/MutalfundSection/TopPerformanceFund/page";
import QRCodePopup from "../../components/qrCode/qrcode";
import Newspage from "@/components/newscard/newspage";
import TestimonialSlider from "@/components/landing/testimonials/page";
import AppSectionNew from "@/components/app-section/page";

export default async function Page({ children }) {
  const sitedata = await getSiteData();
  const testimonial = await getTestimonials();
  const ourPartners = await getAddisLogos();
  const socialMedia = await getSocialMedia();
  const services = await getServiceData();
  const aboutteamdata = await getTeams();
  const stats = await getStatsData();

  return (
    <div className=" flex flex-col">
      <main>
        <Homepage statsdata={stats} />
        <AwardsSection />
        <TrustedSection />
        <ToolsSection />
        <TopTaxSavingFunds />
        {/* top performing */}
        <ServicesSection services={services} />
        <ComparePlansSection />
        <AppSectionNew siteData={sitedata} />
        <TeamSection aboutteamdata={aboutteamdata} />
        <DiffrentFunds />
        <TestimonialSlider testimonials={testimonial} sitedata={sitedata} />
        <Newspage />
        <ContactUs services={services} sitedata={sitedata} />
        <QRCodePopup />
      </main>
    </div>
  );
}
