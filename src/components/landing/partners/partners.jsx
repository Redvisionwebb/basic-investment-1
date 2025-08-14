"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./partnerOne.css"; // Importing the CSS styles
import Image from "next/image";

const PartnerOneSlider = ({ ourPartners }) => {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
        arrows: false,
        dots: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <div className="partner-section-one bg-[var(--rv-white)]">
            <div className="container-fluid p-0">
                <Slider {...settings} className="partner-slider-one">
                    {ourPartners?.map((logo, index) => (
                        <div key={index} className="partner-slide-item-one grayscale hover:grayscale-0">
                            <Image
                                src={`https://redvisionweb.com/${logo.logo}`}
                                alt={logo.logoname}
                                className="rounded"
                                width={200}
                                height={200}
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default PartnerOneSlider;
