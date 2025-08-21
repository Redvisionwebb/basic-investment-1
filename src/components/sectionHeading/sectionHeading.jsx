import styles from "./SectionHeading.module.css";
export default function SectionHeading({ title, heading, title1 ,variant = "light", align = "center" }) {
    return (
        <div className={`${align === "start" ? "text-start" : "text-center"}`}>
            <h3
                className={`text-anime-style-2 ${variant === "dark" ? styles.headingDark : styles.headingLight}`}
            >
                {heading}
            </h3>
            <h3
                className={`text-anime-style-1 ${variant === "dark" ? styles.titleDark : styles.titleLight}`}
            >
                {title}
            </h3>
            <h1
                className={`text-3xl md:text-5xl sm:text-4xl`}
            >
                {title1}
            </h1>
        </div>
    );
}