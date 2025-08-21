"use client"
import React from 'react'
import SectionHeading from '@/components/landing/homeHeading/SectionHeading'

const AboutTeamSection = () => {
    const teamMembers = [
        { id: 1, image: "/images/team/team1.png", name: "Member’s Name", designation: "Designation",},
        { id: 2, image: "/images/team/team2.png", name: "Member’s Name", designation: "Designation",},
        { id: 3, image: "/images/team/team3.png", name: "Member’s Name", designation: "Designation",},
        { id: 1, image: "/images/team/team1.png", name: "Member’s Name", designation: "Designation",},
        { id: 2, image: "/images/team/team2.png", name: "Member’s Name", designation: "Designation",},
        { id: 3, image: "/images/team/team3.png", name: "Member’s Name", designation: "Designation",},
        { id: 1, image: "/images/team/team1.png", name: "Member’s Name", designation: "Designation",},
        { id: 2, image: "/images/team/team2.png", name: "Member’s Name", designation: "Designation",},
    ];
    return (
        <div className='max-w-screen-xl mx-auto px-4 section flex flex-col gap-5 '>
            <div className="md:flex gap-5 w-full  items-center">
                <div className="md:w-1/3">
                    <SectionHeading
                        label={"OUR TEAM"}
                        heading={`Our awarded speakers & Team mentors`}
                    />
                </div>
                <div className="md:w-2/3">
                    <p>
                        We’re not just another mutual fund platform. We’re a team of real people committed to helping real investors like you make smarter financial decisions. Whether you’re new to investing or planning for long-term goals, we’re here to guide you at every step.
                    </p>
                </div>

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {teamMembers.map((member) => (
                    <div key={member.id} className="text-center shadow-sm group shadow-white rounded-xl overflow-hidden">
                        <div className="w-full overflow-hidden relative">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-top object-cover"
                            />

                            <div className={`absolute p-3 group-hover:bottom-0 w-full -bottom-full transition-all duration-500  left-0 bg-black/40`}>
                                <div className="p-3">
                                    <div>
                                        <h4>{member.name}</h4>
                                        <p>{member.designation}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default AboutTeamSection