"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const Card = ({ i, link, name, description, range, targetScale, progress }) => {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  })
  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])//image zoom out animation
  const scale = useTransform(progress, range, [1, targetScale])//stacking effect
  return (
    <div ref={container} className='h-screen flex items-center justify-center sticky top-0 mx-auto '>
      {/* <motion.div className="box1 text-white mt-5 px-16 py-5 rounded-xl " style={{ scale, backgroundColor: color, top: `calc(-5vh + ${i * 25}px)` }}> */}
      <motion.div className='bg-gradient-to-br from-[#fbd037] via-[#eec326] to-[#7e4e2a] flex justify-between items-center gap-x-20  box1 mt-5 px-16 py-5 shadow-2xl ring-1 ring-[#fbd037] relative rounded-3xl p-12' style={{ scale, top: `calc(-5vh + ${i * 40}px)` }}>
        <div>
          <div>
            <h2 className="text-6xl max-w-xl text-start text-[#7e4e2a]">{name}</h2>
          </div>
          <div className="my-12 text-zinc-950 max-w-xl rounded-lg">
            <p className="text-2xl text-start mb-3">{description}</p>
          </div>
          <Link href={link}>
            <button className="bg-[#7e4e2a] hover:bg-[#5a361a] text-white px-10 py-5 rounded-full font-bold mb-10">
              Know More &rarr;
            </button>
          </Link>
        </div>
        <div>
          <div className="imgContainer relative w-[100%] h-full rounded-3xl overflow-hidden p-5">
            <motion.div style={{ scale: imageScale }} className='w-full h-full'>
              <Image src={`/hero.png`} alt='image' className='object-cover' width={400} height={300} />
            </motion.div>
          </div>
        </div>
      </motion.div>
      {/* </motion.div> */}
      {/* <motion.div className='card flex flex-col relative h-[500px] w-[1000px] rounded-3xl p-12' style={{ scale, backgroundColor: color, top: `calc(-5vh + ${i * 25}px)` }}>
        <h2 className='text-center m-0 text-xl'></h2>
        <div className='flex h-full mt-12 gap-12'>
          <div className='desc w-[40%] relative top-[10%]'>
            <p className='text-base first-letter:text-2xl'>{description}</p>
            <span className='flex items-center gap-1'>
              <Link href={link} target='_blank' className='text-xs underline cursor-pointer'>See more</Link>
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z" fill="black" />
              </svg>
            </span>
          </div>
          <div className="imgContainer relative w-[60%] h-full rounded-3xl overflow-hidden">
            <motion.div style={{ scale: imageScale }} className='w-full h-full'>
              <Image fill src={`/images/${src}`} alt='image' className='object-cover' />
            </motion.div>
          </div>
        </div>
      </motion.div> */}
    </div>
  )
}

export default Card