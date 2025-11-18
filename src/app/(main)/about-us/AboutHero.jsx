"use client";

import SectionHeading from "@/components/sectionHeading/sectionHeading";
import { motion } from "framer-motion";
import Image from "next/image";

const AboutHero = ({ about }) => {
  return (
    <section className="">
      <div className="relative z-10 h-fit max-w-screen-xl px-4 mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-10">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className=" "
        >
          <div className="md:w-[30rem] md:h-[30rem] rounded-xl overflow-hidden">
            <Image
              src={about[0]?.image?.url ||"/images/about/about.png"}
              alt="Team hands stacked in unity"
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 items-start"
        >
          <SectionHeading
            align="start"
            title1="Driven by Knowledge, Built on Trust"
            heading={about[0].title}
          />

          <p className="text-xl"
            dangerouslySetInnerHTML={{ __html: about[0]?.description||"" }}>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
