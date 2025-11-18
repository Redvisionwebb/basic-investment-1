"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import HomeHeading from "../heading/heading";

const TestimonialSlider = ({ testimonials = [],sitedata }) => {
  const ShapeOne = () => (
    <svg width="211" height="133" viewBox="0 0 211 133">
      <path d="M0 133C0 133 16.7 17 211 0H0V133Z" fill="currentColor" />
    </svg>
  );

  const ShapeTwo = () => (
    <svg width="196" height="310" viewBox="0 0 196 310">
      <path
        d="M96 310C96 310 -48 165 169 7C169 7 -62 59 17 310H96Z"
        fill="currentColor"
      />
      <path
        d="M196 310C196 310 -4 165 196 0C196 0 -53 136 96 310H196Z"
        fill="#fffbfc"
      />
    </svg>
  );

  return (
    <div className="section bg-[var(--rv-bg-white)]">
      <section className="px-4">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-2 md:gap-8">
          <HomeHeading title={`What Our Client Says <br/> About Our <br/> ${sitedata?.websiteName}`} center="true" />

          <Swiper
            className="!w-full"
            modules={[Autoplay]}
            autoplay={{ delay: 3000 }}
            // pagination={{ clickable: true }}
            spaceBetween={30}
            breakpoints={{
              0: { slidesPerView: 1 }, // mobile
              768: { slidesPerView: 2 }, // md screen = 2 cards
            }}
          >
            {testimonials.map((item, i) => (
              <SwiperSlide key={i} className="!h-auto">
                <div
                  className="
                    relative p-6  shadow-lg transition-all duration-300 
                    bg-white hover:bg-[var(--rv-secondary)]
                    hover:text-white
                    group w-full min-h-[250px]
                  "
                >
                  {/* Background Shapes */}
                  <div className="absolute inset-0">
                    <span className="absolute left-0 top-0 opacity-30 text-[var(--rv-secondary)] group-hover:opacity-80">
                      <ShapeOne />
                    </span>
                    <span className="absolute left-0 bottom-0 opacity-30 text-[var(--rv-secondary)] group-hover:opacity-80">
                      <ShapeTwo />
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative flex flex-col md:flex-row gap-6 z-10">
                    {/* Avatar */}
                    <div className="relative w-[300px]">
                      <img
                        src={item.image.url}
                        alt="avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                      />
                    </div>

                    <div>
                      <p
                        className={`mb-4 leading-relaxed opacity-80 group-hover:opacity-100`}
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />

                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{item.author},</h3>
                        <span className="text-[var(--rv-secondary)] group-hover:text-white">
                          {item.designation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default TestimonialSlider;
