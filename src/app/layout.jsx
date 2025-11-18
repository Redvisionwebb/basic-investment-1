import { Poppins, Jost } from "next/font/google";
import "./globals.css";
import RenewalPopup from "@/components/renewalPopup";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getAnalytics, getSiteData } from "@/lib/functions";

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

export default async function RootLayout({ children }) {
     const analytics = await getAnalytics();
  const gaId = analytics?.googleAnalyticsId;
  const clarityId = analytics?.microsoftClarityId;
  return (
    <html lang="en">
        <head>
        {/* ✅ Server-side Google Analytics */}
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}

        {/* ✅ Server-side Microsoft Clarity */}
        {clarityId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityId}");
              `,
            }}
          />
        )}
      </head>
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
