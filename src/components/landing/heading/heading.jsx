import React from 'react';
import styles from './Heading.module.css';

export default function HomeHeading({ title, center = false, className = "" }) {
  return (
    <h2
      className={` font-bold leading-snug  ${center ? "text-center" : ""} ${className} ${styles.heading}`}
      dangerouslySetInnerHTML={{ __html: title }}
    />
  );
}
