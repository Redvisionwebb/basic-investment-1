import Colortheme from "@/components/colorTheme/colortheme";
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import QRCodePopup from "@/components/qrCode/qrcode";
import WebPopup from "@/components/webpopup";
import { getArn, getServiceData, getSiteData, getSocialMedia } from "@/lib/functions";

export default async function Layout({ children }) {

    const services = await getServiceData();
    const siteData = await getSiteData();
    const socialMedia = await getSocialMedia();
    const arnData = await getArn();

    return (
        <div>
            <NavBar services={services} />
            {children}
            <Footer services={services} siteData={siteData} socialMedia={socialMedia} arnData={arnData} />
            <WebPopup />
            <QRCodePopup />
            <Colortheme />
        </div>
    );
}