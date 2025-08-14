import React from 'react';
import styles from './Heading.module.css';

export default function HomeHeading({ title, center = false, className = "" }) {
  return (
    <h2
      className={` font-bold leading-snug mb-10 ${center ? "text-center" : ""} ${className} ${styles.heading}`}
      dangerouslySetInnerHTML={{ __html: title }}
    />
  );
}
