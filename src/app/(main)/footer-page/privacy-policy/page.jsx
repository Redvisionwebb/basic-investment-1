"use client";
import InnerBanner from "@/components/innerBanner/InnerBanner";
import { footerData } from "@/data/footer";
import axios from "axios";
import React, { useEffect, useState } from "react";
 
export default function PrivacyPolicy() {
    const [data, setData] = useState('');
    const [mainData, setMainData] = useState("");
    const fetchdata = async () => {
        const data = await fetch("/api/admin/site-settings");
        if (data.ok) {
            const maindata = await data.json();
            setMainData(maindata[0])
        }
    };
    const fetchPolicy = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_DATA_API}/api/open-apis/privacy-policy?apikey=${process.env.NEXT_PUBLIC_API_KEY}`);
            if (response.status === 200 && response.data && response.data[0]) {
                const data = response.data[0];
                setData(data.pvp);
            } else {
                console.error("Invalid data format:", response.data);
                alert("Failed to fetch services. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            alert("An error occurred while fetching services. Please try again.");
        }
    };
    useEffect(() => { fetchPolicy(); }, []);
    useEffect(() => { fetchdata(); }, []);
 
    function createMarkup() {
        const highlightedText = data
            .replace(/Your Company name/gi, `<mark style="background-color: white; font-size: 16px; font-weight: 500;">${mainData?.websiteName}</mark>`)
            .replace(/Company Email/gi, `<mark style="background-color: white; font-size: 16px; font-weight: 500;">${mainData?.email}</mark>`)
            .replace(/What we collect/gi, '<br><mark style="background-color: white; font-size: 20px"><br/>What we collect</mark> <br/>')
            .replace(/Name and contact details/gi, '<br><mark style="background-color: white; font-size: 20px"><br/>Name and contact details</mark><br/>')
            .replace(/Collection Use of image data/gi, '<br><mark style="background-color: white; font-size: 20px"><br/>Collection Use of image data</mark><br/><br/>')
            .replace(/Use of location data/gi, '<br><mark style="background-color: white; font-size: 20px"><br/>Use of location data</mark><br/>')
            .replace(/Security/, '<br><mark style="background-color: white; font-size: 20px"><br/>Security</mark><br/>')
            .replace(/Links to other websites/, '<br><mark style="background-color: white; font-size: 20px"><br/>Links to other websites</mark><br/>')
            .replace(/Controlling your personal information/gi, '<br><mark style="background-color: white; font-size: 20px"><br/>Controlling your personal information</mark><br/>')
            .replace(/Security certificates/gi, '<br><mark style="background-color: white; font-size: 20px"><br/>Security certificates</mark><br/>')
        return { __html: highlightedText };
    }
 
    return (
        <div className="">
            <InnerBanner title={"Privacy Policy"} />
            <div className="section">
                <div className="text-gray-700 mx-auto max-w-7xl">
                    <p dangerouslySetInnerHTML={createMarkup()} />
                </div>
            </div>
        </div>
    );
}