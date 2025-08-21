"use client";

import SectionHeading from "@/components/sectionHeading/sectionHeading";
import { motion } from "framer-motion";
import Image from "next/image";

const AboutHero = () => {
  return (
    <section className="main-section">
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
              src="/images/about/about.png"
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
          />

          <p className="text-xl">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate
            velit esse molestie consequat, vel illum dolore eu feugiat nulla
            facilisis at vero eros et accumsan et iusto odio dignissim qui
            blandit praesent luptatum zzril delenit augue duis dolore te feugait
            nulla facilisi.
          </p>

          <p className="text-xl">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
