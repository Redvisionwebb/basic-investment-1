import React from 'react'
import InnerBanner from '@/components/innerBanner/InnerBanner'
import styles from './AboutUs.module.css'
import AboutHero from './AboutHero'
import AboutAllContent from './AboutAllContent'
import { getAboutus, getAddisLogos, getMissionVission, getTeams } from '@/lib/functions'

const page = async () => {
    const about = await getAboutus()
  const missionvision = await getMissionVission()
  const team = await getTeams();
  const partners = await getAddisLogos()
  return (
    <div className={styles.aboutPage}>
      <InnerBanner
        title="About Us"
      />
      <div className='section'>
        <AboutHero about={about} />
        <AboutAllContent missionvision={missionvision} team={team} partners={partners} />
      </div>
    </div>
  )
}

export default page;