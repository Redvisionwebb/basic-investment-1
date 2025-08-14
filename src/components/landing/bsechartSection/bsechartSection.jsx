"use client";
import React, { useEffect, useState } from "react";
import styles from './bsechartSection.module.css'
import SectionHeading from "../../sectionHeading/sectionHeading";
import axios from "axios";
import { BseReturnChart } from "@/components/charts/bseReturnChart";

export default function BseChartSection() {
    const [graphData, setGraphData] = useState([]);
    const endDate = new Date();
    const fetchGraphData = async () => {
        try {
            const response = await axios.post("https://wealthelite.in/eliteN/bse-schemes/get-sensex-data", {
                startDate: "1997-01-01",
                endDate: endDate.toISOString().split('T')[0],
            });
            if (response.status === 200) {
                const data = response.data.data;
                setGraphData(data);
            }
        } catch (error) {
            console.error("Error fetching graph data:", error);
        }
    };

    useEffect(() => {
        fetchGraphData();
    }, []);

    return (
        <div className="max-w-screen-xl mx-auto py-[30px] md:py-[60px] px-3 md:px-0">
            <div className={styles.consultationContainer}>
                {/* Heading and Description */}
                <div className={styles.imageContainer}>
                    <SectionHeading title="What Early Investing Can Do" variant="light" align="center" />
                    <p className="mt-3 max-w-4xl text-lg mx-auto text-center">
                        Equity market has outperformed all other investment avenues
                    </p>
                </div>

                {/* Chart and Info Section */}
                <div className="flex flex-col lg:flex-row gap-4 mt-14">
                    <div className="w-full lg:w-1/2">
                        <BseReturnChart data={graphData} />
                    </div>
                    <div className="w-full lg:w-1/2 bg-gradient-to-br from-[var(--rv-primary)] via-[var(--rv-primary)] to-[var(--rv-third)] rounded-xl p-4 text-white">
                        <div className="grid grid-cols-12 items-center mb-3">
                            <div className="col-span-1">
                                <svg
                                    version="1.1"
                                    id="fi_190411_3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 507.2 507.2"
                                    style={{ fill: 'var(--rv-secondary)' }}
                                    xmlSpace="preserve"
                                    className="w-7"
                                >
                                    <circle cx="253.6" cy="253.6" r="253.6" />
                                    <g>
                                        <path
                                            style={{ fill: "#FFFFFF" }}
                                            d="M260,310.4c11.2,11.2,11.2,30.4,0,41.6l-23.2,23.2c-11.2,11.2-30.4,11.2-41.6,0L93.6,272.8
                                            c-11.2-11.2-11.2-30.4,0-41.6l23.2-23.2c11.2-11.2,30.4-11.2,41.6,0L260,310.4z"
                                        />
                                        <path
                                            style={{ fill: "#FFFFFF" }}
                                            d="M348.8,133.6c11.2-11.2,30.4-11.2,41.6,0l23.2,23.2c11.2,11.2,11.2,30.4,0,41.6l-176,175.2
                                            c-11.2,11.2-30.4,11.2-41.6,0l-23.2-23.2c-11.2-11.2-11.2-30.4,0-41.6L348.8,133.6z"
                                        />
                                    </g>
                                </svg>
                            </div>
                            <h4 className="mt-4 col-span-11">Equity (Sensex TRI) has delivered the highest long-term returns at 14.43% CAGR, proving its strength as a wealth creator.</h4>
                        </div>
                        <div className="grid grid-cols-12 items-center gap-2 mb-3">
                            <svg
                                version="1.1"
                                id="fi_190411_3"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                viewBox="0 0 507.2 507.2"
                                style={{ fill: 'var(--rv-secondary)' }}
                                xmlSpace="preserve"
                                className="w-7 max-w-1/2"
                            >
                                <circle cx="253.6" cy="253.6" r="253.6" />
                                <g>
                                    <path
                                        style={{ fill: "#FFFFFF" }}
                                        d="M260,310.4c11.2,11.2,11.2,30.4,0,41.6l-23.2,23.2c-11.2,11.2-30.4,11.2-41.6,0L93.6,272.8
                                            c-11.2-11.2-11.2-30.4,0-41.6l23.2-23.2c11.2-11.2,30.4-11.2,41.6,0L260,310.4z"
                                    />
                                    <path
                                        style={{ fill: "#FFFFFF" }}
                                        d="M348.8,133.6c11.2-11.2,30.4-11.2,41.6,0l23.2,23.2c11.2,11.2,11.2,30.4,0,41.6l-176,175.2
                                            c-11.2,11.2-30.4,11.2-41.6,0l-23.2-23.2c-11.2-11.2-11.2-30.4,0-41.6L348.8,133.6z"
                                    />
                                </g>
                            </svg>
                            <h4 className="mt-2 col-span-11"> It has outperformed all traditional investment avenues like gold, PPF, and fixed deposits by a wide margin.
                            </h4>
                        </div>
                        <div className="grid grid-cols-12 items-center gap-2">
                            <svg
                                version="1.1"
                                id="fi_190411_3"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                viewBox="0 0 507.2 507.2"
                                style={{ fill: 'var(--rv-secondary)' }}
                                xmlSpace="preserve"
                                className="w-7"
                            >
                                <circle cx="253.6" cy="253.6" r="253.6" />
                                <g>
                                    <path
                                        style={{ fill: "#FFFFFF" }}
                                        d="M260,310.4c11.2,11.2,11.2,30.4,0,41.6l-23.2,23.2c-11.2,11.2-30.4,11.2-41.6,0L93.6,272.8
                                            c-11.2-11.2-11.2-30.4,0-41.6l23.2-23.2c11.2-11.2,30.4-11.2,41.6,0L260,310.4z"
                                    />
                                    <path
                                        style={{ fill: "#FFFFFF" }}
                                        d="M348.8,133.6c11.2-11.2,30.4-11.2,41.6,0l23.2,23.2c11.2,11.2,11.2,30.4,0,41.6l-176,175.2
                                            c-11.2,11.2-30.4,11.2-41.6,0l-23.2-23.2c-11.2-11.2-11.2-30.4,0-41.6L348.8,133.6z"
                                    />
                                </g>
                            </svg>
                            <h4 className="mt-2 col-span-11">Investing in equities helps beat inflation and grow real wealth over time — essential for long-term financial goals.</h4>
                        </div>
                    </div>
                </div>
                <h4 className="text-center my-8 text-[var(--rv-primary)]">Sensex Data from Inception to Present Date: A Comprehensive Overview</h4>
            </div>
        </div>
    );
}