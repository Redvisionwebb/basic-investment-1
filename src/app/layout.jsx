import { Poppins, Jost } from "next/font/google";
import "./globals.css";
import RenewalPopup from "@/components/renewalPopup";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteData } from "@/lib/functions";

// Load Poppins
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "700", "900"],
});

// Load Jost
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "500", "600", "700"],
});


export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const siteData = await getSiteData();
  
  return {
    title: {
      default: siteData?.websiteName || "",
      template: `%s - ${siteData?.websiteName || ""}`,
    },
    description:
      siteData?.websiteName || "",
    openGraph: {
      title: siteData?.websiteName || "",
      description: siteData?.description || "",
      type: "website",
      locale: "en_IN",
      siteName: siteData?.websiteName || "",
      url: siteData?.callbackurl || "",
      // images: ["https://100takka.com/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: siteData?.websiteName || "",
      description: siteData?.description || "",
    },
    authors: [siteData?.websiteName || ""] || [],
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${jost.variable} `}
      >
        <SubscriptionProvider>
          <SpeedInsights />
          <RenewalPopup />
          <div className="bg-white">{children}</div>
        </SubscriptionProvider>
      </body>
    </html>
  );
}
