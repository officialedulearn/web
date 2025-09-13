import React from 'react'
import Image from 'next/image'
import edulearn from "@/../public/assets/icons/edulearn.png"
import annie from "@/../public/assets/annie.jpg"

type Props = {}

const Sidebar = (props: Props) => {
  return (
    <div className='rounded-[20px] flex flex-col justify-between bg-cover bg-center bg-no-repeat p-[40px] gap-[60px]' style={{backgroundImage: 'url(/onboarding.png)'}}>
        <div className='flex flex-col gap-[32px]'>
          <Image src={edulearn} width={150} height={31} alt='edulearn logo' />

          <div className="flex flex-col gap-[24px]">
            <p className='text-[48px] font-[500] leading-[52px] tracking-[-1px] text-white'>
              Join thousands leveling up daily.
            </p>

            <p className='opacity-[0.7] text-[16px] font-[400] leading-[22px] text-[#E4DBDB]'>
              From quick challenges to deep dives, EduLearn's community of learners is growing together — one badge at a time.
            </p>
          </div>
        </div>

        <div className='rounded-[20px] bg-white/10 flex flex-col gap-[16px] p-[24px]'>
          <p className='text-[16px] leading-[24px] font-[400] text-[#F0E6E6]'>
            I was struggling with math until I discovered EduLearn. The AI-powered quizzes helped me identify my weaknesses and focus on the areas where I needed the most improvement. It's like having a personal trainer for my brain!
          </p>

          <div className='flex items-center gap-[12px]'>
            <Image src={annie} width={40} height={40} alt='annie logo' className='rounded-full'/>

            <div className='flex flex-col gap-[4px]'>
              <p className='text-[14px] font-[600] leading-[20px] text-white'>Annie B.</p>
              <p className='text-[12px] font-[400] leading-[16px] text-[#A29999]'>Student</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Sidebar