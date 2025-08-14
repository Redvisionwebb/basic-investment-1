"use client";
import React from "react";
import styles from "./TeamSection.module.css";
import HomeHeading from "../heading/heading";

const team = [
  {
    name: "Sumit Keliya",
    designation: "Sr. Web Developer",
    image: "/images/team/member1.png",
  },
  {
    name: "Ashmeet Verma",
    designation: "Project Coordinator",
    image: "/images/team/member2.png",
  },
  {
    name: "Ajay Kushwah",
    designation: "Web Developer",
    image: "/images/team/member3.png",
  },
];

export default function TeamSection({ aboutteamdata }) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.topSection}>
        <div className="max-w-screen-md mx-auto text-center px-4">
          <HomeHeading
            title={`Meet the Experts Who Stand <br /> by You`}
            center="true"
            className="text-white"
          />
          <p className={styles.subtext}>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat.
          </p>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className="max-w-screen-xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <div key={index} className={styles.card}>
              <img src={member.image} alt={member.name} className={styles.image} />
              {/* <img
                src="/images/team/member.jpg"
                alt={member.name}
                className={styles.image}
              /> */}
              <div className={styles.cardContent}>
                <h3>{member.name}</h3>
                <p>{member.designation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
