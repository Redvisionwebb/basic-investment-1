import Image from "next/image";
import styles from "./Blogs.module.css";
import Link from "next/link";
import { FaCalendar } from "react-icons/fa";

const BlogCard = ({ post }) => {

    const dateObj = new Date(
        typeof post.updatedAt === "string"
            ? post.updatedAt
            : post.updatedAt?.$date || Date.now()
    );
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("en-US", { month: "short" });
    const year = dateObj.getFullYear();

    return (
        <Link href={`/blogs/${post.slug}`} className={styles.blogCard}>
            <div className={styles.blogCardContent}>
                <span className={styles.dateTag}>
                    <div className="flex gap-2 alin">
                        <FaCalendar className="mb-1" />
                        <span className="block text-sm font-bold">{day}</span>
                        <p className="text-sm">
                            {month} {year}
                        </p>
                    </div>
                </span>
                <h3>{post.posttitle}</h3>
                <p>{post.description}</p>
                <div className={styles.readMore}>
                    <span>→</span>
                </div>
            </div>
            <div className={styles.blogCardImage}>
                <Image
                    src={post.image.url}
                    alt={post.posttitle}
                    width={300}
                    height={200}
                    className="object-cover w-full h-full rounded-r-lg"
                />
            </div>
        </Link>
    );
};

export default BlogCard;
