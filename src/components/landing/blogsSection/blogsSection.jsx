"use client";
import React from "react";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./blogSection.css"

import { format } from 'date-fns';
import { IoPlay } from "react-icons/io5";

export default function BlogSection({ blogs }) {
    const settings = {
        arrows: false,
        // dots: true,              // Shows navigation dots
        infinite: true,          // Infinite scrolling
        speed: 500,              // Transition speed
        slidesToShow: 3,         // Show one slide at a time
        slidesToScroll: 1,       // Scroll one slide at a time
        autoplay: true,          // Autoplay the slider
        autoplaySpeed: 3000,     // Speed of autoplay
    };
    return (
        <div className="blog-section-one">
            <div className="max-w-screen-xl mx-auto p-0">
                <Slider {...settings} className="blog-one-slider">
                    {blogs.map((item, index) => (
                        <div className="blog-box-one" key={index}>
                            <div className="blog-image-one">
                                <img src={item?.image?.url} alt="blog-image" />
                            </div>
                            <div className="blog-details-one">
                                <div className="blog-meta-one">
                                    <a href="blog-details.html" className="blog-date-one">18 November 2024</a>
                                </div>
                                <h4 className="blog-title-one">
                                    <a href="blog-details.html">{item?.posttitle}</a>
                                </h4>
                                <div className="blog-author-one">
                                    <img src="/blogSection/blog-author-1.png" alt="" />
                                    <a href="blog-details.html"><span>by </span> Admin</a>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* <div className="blog-box-one">
                        <div className="blog-image-one">
                            <img src="/blogSection/blog-2.jpg" alt="blog-image" />
                            <a href="blog-details.html" className="btn-link">
                                <img src="/blogSection/arrow-link.svg" alt="icon" />
                            </a>
                        </div>
                        <div className="blog-details-one">
                            <div className="blog-meta-one">
                                <a href="blog-details.html" className="blog-date-one">18 November 2024</a>
                                <a href="blog-details.html" className="blog-tag-one">work</a>
                            </div>
                            <h4 className="blog-title-one">
                                <a href="blog-details.html">A Business Consulting That Can Produce Anything.</a>
                            </h4>
                            <div className="blog-author-one">
                                <img src="/blogSection/blog-author-2.png" alt="author-image" />
                                <a href="blog-details.html"><span>by </span> Mari Smith</a>
                            </div>
                        </div>
                    </div>
                    <div className="blog-box-one">
                        <div className="blog-image-one">
                            <img src="/blogSection/blog-3.jpg" alt="blog-image" />
                            <a href="blog-details.html" className="btn-link">
                                <img src="/blogSection/arrow-link.svg" alt="icon" />
                            </a>
                        </div>
                        <div className="blog-details-one">
                            <div className="blog-meta-one">
                                <a href="blog-details.html" className="blog-date-one">18 November 2024</a>
                                <a href="blog-details.html" className="blog-tag-one">Analysis</a>
                            </div>
                            <h4 className="blog-title-one">
                                <a href="blog-details.html">New Consulting For All Kind Offer Business Finance</a>
                            </h4>
                            <div className="blog-author-one">
                                <img src="/blogSection/blog-author-3.png" alt="author-image" />
                                <a href="blog-details.html"><span>by </span> Peeter Park</a>
                            </div>
                        </div>
                    </div>
                    <div className="blog-box-one">
                        <div className="blog-image-one">
                            <img src="/blogSection/blog-1.jpg" alt="blog-image" />
                            <a href="blog-details.html" className="btn-link">
                                <img src="/blogSection/blogSection/arrow-link.svg" alt="icon" />
                            </a>
                        </div>
                        <div className="blog-details-one">
                            <div className="blog-meta-one">
                                <a href="blog-details.html" className="blog-date-one">18 November 2024</a>
                                <a href="blog-details.html" className="blog-tag-one">Marketing</a>
                            </div>
                            <h4 className="blog-title-one">
                                <a href="blog-details.html">Business development strategies with Saga</a>
                            </h4>
                            <div className="blog-author-one">
                                <img src="/blogSection/blog-author-1.png" alt="author-image" />
                                <a href="blog-details.html"><span>by </span> Shama Hyder</a>
                            </div>
                        </div>
                    </div> */}
                </Slider>
            </div>
        </div>
    );
}