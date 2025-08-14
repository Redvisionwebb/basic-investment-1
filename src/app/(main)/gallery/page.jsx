"use client";
import BlogCards from '@/components/landing/blogCards/blogCards';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Gallery = () => {
    const [images, setImages] = useState([]);

    const fetchData = async () => {
        const res = await axios.get("/api/gallery");
        if (res.status === 200) {
            setImages(res.data);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="md:px-40 my-10">
            {/* Grid for 3 images per row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images?.map((item, index) => (
                    <div key={index} className="rounded-xl overflow-hidden">
                        <Image
                            src={item?.image?.url}
                            alt={`Gallery Image ${index + 1}`}
                            layout="responsive"
                            width={200}
                            height={160}
                            className="rounded-xl"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
