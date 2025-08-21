import React from 'react'
import InnerBanner from '@/components/innerBanner/InnerBanner'
import styles from './AboutUs.module.css'
import AboutHero from './AboutHero'
import AboutAllContent from './AboutAllContent'

const page = () => {
  return (
    <div className={styles.aboutPage}>
      <InnerBanner
        title="About Us"
      />
      <AboutHero />
      <AboutAllContent />
    </div>
  )
}

export default page;