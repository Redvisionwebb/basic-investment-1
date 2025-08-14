"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from 'gsap';
import { projects } from "@/data/projects";
import Card from "@/components/landing/card";
import { useScroll } from "framer-motion";
import axios from "axios";

export default function ServiceCards() {
  const [services, setServices] = useState([]);
  const fetchservice = async () => {
    const res = await axios.get("/api/services");
    if (res.status === 200) {
      const data = res.data;
      setServices(data)
    }
  };
  useEffect(() => { fetchservice(); }, []);
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    // GSAP animation for cards coming from the bottom to the top
    gsap.utils.toArray(".card").forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 200, opacity: 0, zIndex: 0 },
        {
          y: 0,
          opacity: 1,
          zIndex: i, // Adjust z-index for overlap effect
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%", // Start animation when the card enters the viewport
            end: "top 30%",
            scrub: true,
          },
        }
      );
    });
  }, []);

  return (
    <div>
      {
        services?.map((project, index) => {
          const targetScale = 1 - ((projects.length - index) * 0.08);
          return (
            <div key={index} className="cardContainer sticky top-0 z-[1000 - index] ">
              <Card
                i={index}
                {...project}
                progress={scrollYProgress}
                range={[index * 0.15, 0.9]}
                targetScale={targetScale}
              />
            </div>
          );
        })
      }
    </div>
  );
}
