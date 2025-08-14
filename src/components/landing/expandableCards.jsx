"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { ArrowBigLeft, ArrowRight } from "lucide-react";

export default function ExpandableCards() {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 my-40">
      <h2 className="text-lg md:text-5xl mb-4 max-w-3xl mx-auto font-bold text-center">
        Meet our team of Experts / Seniors from Banking / Wealth Management
      </h2>
      <div className="py-20">
        <AnimatePresence>
          {active && typeof active === "object" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 h-full w-full z-10" />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {active && typeof active === "object" ? (
            <div className="fixed inset-0  grid place-items-center z-[100]">
              <motion.button
                key={`button-${active.title}-${id}`}
                layout
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.05,
                  },
                }}
                className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                onClick={() => setActive(null)}>
                <CloseIcon />
              </motion.button>
              <motion.div
                layoutId={`card-${active.title}-${id}`}
                ref={ref}
                className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white sm:rounded-3xl overflow-hidden">
                <motion.div layoutId={`image-${active.title}-${id}`}>
                  <Image
                    priority
                    width={200}
                    height={200}
                    src={active.src}
                    alt={active.title}
                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top" />
                </motion.div>

                <div>
                  <div className="flex justify-between items-start p-4">
                    <div className="">
                      <motion.h3
                        layoutId={`title-${active.title}-${id}`}
                        className="font-bold text-neutral-800">
                        {active.title}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${active.description}-${id}`}
                        className="text-neutral-700">
                        {active.description}
                      </motion.p>
                    </div>

                    <motion.a
                      layoutId={`button-${active.title}-${id}`}
                      href={active.ctaLink}
                      target="_blank"
                      className="px-4 py-3 text-sm rounded-full font-bold bg-[#7e4e2a] text-white">
                      {/* {active.ctaText} */}
                      <ArrowRight size={16} />
                    </motion.a>
                  </div>
                  <div className="pt-4 relative px-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto text-neutral-700 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
                      {typeof active.content === "function"
                        ? active.content()
                        : active.content}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
        <ul className="max-w-screen-xl mx-auto w-full gap-4">
          {cards.map((card, index) => (
            <motion.div
              layoutId={`card-${card.title}-${id}`}
              key={`card-${card.title}-${id}`}
              onClick={() => setActive(card)}
              className="p-7 flex flex-col md:flex-row justify-between items-center hover:bg-gradient-to-br from-[#fbd037] via-[#eec326] to-[#7e4e2a] rounded-2xl cursor-pointer mb-5 ring-1 ring-[#fbd037]">
              <div className="flex gap-4 flex-col md:flex-row ">
                <motion.div layoutId={`image-${card.title}-${id}`}>
                  <Image
                    width={200}
                    height={200}
                    src={card.src}
                    alt={card.title}
                    className="h-40 w-40 md:h-24 md:w-24 rounded-lg object-cover object-top" />
                </motion.div>
                <div className="">
                  <motion.h3
                    layoutId={`title-${card.title}-${id}`}
                    className="font-medium text-gray-800 text-center md:text-left text-2xl">
                    {card.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${card.description}-${id}`}
                    className="text-neutral-700 text-center md:text-left text-xl">
                    {card.description}
                  </motion.p>
                </div>
              </div>
              <motion.button
                layoutId={`button-${card.title}-${id}`}
                className="p-5 rounded-full font-bold bg-gray-100 hover:bg-[#7e4e2a] hover:text-white text-black mt-4 md:mt-0">
                <ArrowRight size={16} />
                {/* {card.ctaText} */}
              </motion.button>
            </motion.div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    (<motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>)
  );
};

const cards = [
  {
    description: "Fintech Visionary & Banking Veteran",
    title: "Nakul Jain",
    src: "/images/pre.jfif",
    ctaText: "Learn More",
    ctaLink: "https://finance.aceternity.com/strategies",
    content: () => {
      return (
        <p>
          With over two decades of experience in banking and fintech, Nakul Jain has been at the forefront of India's digital financial revolution. As the CEO of Paytm Payments Services Ltd.
          <br /> he led transformative initiatives in digital payments. His leadership roles at Standard Chartered, ICICI Bank, and IndusInd Bank demonstrate his deep expertise in customer-centric financial and wealth solutions, banking and digital innovation.
        </p>
      );
    },
  },
  {
    description: "Architect of Financial Inclusion & Growth",
    title: "Saif Khan",
    src: "/images/pre.jfif",
    ctaText: "Explore",
    ctaLink: "https://finance.aceternity.com/wealth-management",
    content: () => {
      return (
        <p>
          A seasoned banking leader with expertise in wealth management and digital financial services, Saif Khan has played a pivotal role in bridging the financial accessibility gap. As the former Chief Growth Officer at PayNearby, he was instrumental in expanding last-mile banking in India.
          <br /><br />
          With leadership experience at Yes Bank, ICICI Bank, IndusInd Bank, and Citibank, his vision is to make wealth creation accessible for all business owners and investors.
        </p>
      );
    },
  },
];

