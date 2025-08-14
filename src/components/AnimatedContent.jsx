'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';
import 'aos/dist/aos.css';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedContent({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    const animateText = (selector, options) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        const splitText = new SplitType(element, { types: 'words, chars' });
        gsap.from(splitText.chars, options);
      });
    };

    animateText('.text-anime-style-1', {
      duration: 1,
      delay: 0.5,
      x: 20,
      autoAlpha: 0,
      stagger: 0.05,
      scrollTrigger: { trigger: '.text-anime-style-1', start: 'top 85%' },
    });

    animateText('.text-anime-style-2', {
      duration: 1,
      delay: 0.1,
      x: 20,
      autoAlpha: 0,
      stagger: 0.03,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.text-anime-style-2', start: 'top 85%' },
    });
  }, []);

  return <>{children}</>;
}
