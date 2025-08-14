import { Poppins, Jost } from "next/font/google";
import "./globals.css";
import RenewalPopup from "@/components/renewalPopup";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  return {
    title: {
      default: "RedVision GLobal Tech",
      template: `%s - RedVision GLobal Tech`,
    },
    description: "RedVision GLobal Tech",
    openGraph: {
      title: "RedVision GLobal Tech",
      description: "RedVision GLobal Tech",
      type: "website",
      locale: "en_IN",
      siteName: "RedVision GLobal Tech",
      url: "http://mockup.com",
    },
    twitter: {
      card: "summary_large_image",
      title: "RedVision GLobal Tech",
      description: "RedVision GLobal Tech",
    },
    authors: ["RedVision GLobal Tech"],
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
