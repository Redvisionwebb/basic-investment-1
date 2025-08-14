"use client";
import InnerBanner from '@/components/innerBanner/InnerBanner';
import styles from '../footerpage.module.css'

export default function ImportantLinks() {


    return (
        <div className={`${styles.footerpage} `}>
            <InnerBanner pageName={"Important Links"} />

            <div className="max-w-screen-xl mx-auto main-section">
                <div>
                    <h5>Here are some essential links for investors:</h5>
                    <ul>
                        <li>Association of Mutual Funds in India (AMFI): Provides information on mutual funds, including NAVs, fund performance, and investor education. <a href="https://www.amfiindia.com/" target="_blank"><b><u>AMFI Website</u></b></a></li>
                        <li>Securities and Exchange Board of India (SEBI): The regulatory body for securities markets in India, offering guidelines, circulars, and investor protection information. <a href="https://www.sebi.gov.in/" target="_blank"><b><u>SEBI Website</u></b></a></li>
                        <li>Registrar and Transfer Agent (RTA): <a href="https://www.camsonline.com" target="_blank"><b><u>https://www.camsonline.com</u></b></a> / <a href="https://mfs.kfintech.com" target="_blank"><u><b>https://mfs.kfintech.com</b></u></a></li>

                        <li>CDSL/NSDL (Depositories): <a href="https://www.cdslindia.com" target="_blank"><u><b>https://www.cdslindia.com</b></u></a> / <a href="https://nsdl.co.in/related/wrld.php" target="_blank"><u><b>https://nsdl.co.in/related/wrld.php</b></u> </a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
