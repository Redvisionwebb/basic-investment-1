import SectionHeading from '../Heading/sectionheading';
import BlogCard from './blog-cards';
import styles from './Blogs.module.css';

const BlogSection = ({ blogs }) => {
    return (
        <section className={`${styles.BlogSection} main-section`}>
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top-left cell: Heading */}
                    <SectionHeading
                        maintitle="Latest Blogs"
                        title="Insights & Updates"
                        subtitle="Stay informed with the latest trends in the financial world."
                        theme="primary"
                        align={false}
                    />

                    {/* Blog Cards */}
                    {blogs.slice(0, 3).map((post) => (
                        <BlogCard key={post._id} post={post} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;