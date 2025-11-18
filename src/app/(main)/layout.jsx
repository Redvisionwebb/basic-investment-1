import Colortheme from "@/components/colorTheme/colortheme";
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import QRCode from "@/components/qrCode/qrcode";
import SocialMediaSidebar from "@/components/socialMedia";
import Tickers from "@/components/tickers";
import WebPopup from "@/components/webpopup";
import { getArn, getServiceData, getSiteData, getSocialMedia } from "@/lib/functions";

export default async function Layout({ children }) {

    const services = await getServiceData();
    const siteData = await getSiteData();
    const socialMedia = await getSocialMedia();
    const arnData = await getArn();

    return (
        <div>
             <Tickers />
            <NavBar services={services} />
            {children}
            <Footer services={services} siteData={siteData} socialMedia={socialMedia} arnData={arnData} />
            <WebPopup />
               <SocialMediaSidebar sitedata={siteData} />
      <QRCode siteData={siteData} />
            <Colortheme />
        </div>
    );
}