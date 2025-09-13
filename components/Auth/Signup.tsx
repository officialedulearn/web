"use client"
import Image from 'next/image'
import React from 'react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import mail from "@/../public/assets/icons/mail.png"
import mailDark from "@/../public/assets/icons/dark/mail.png"

type Props = {}

interface FormData {
  name: string;
  email: string;
  referralCode: string;
  username: string;
}

const Signup = (props: Props) => {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState<FormData>({
      name: '',
      email: '',
      referralCode: '',
      username: ''
    })

    const handleInputChange = (field: keyof FormData, value: string) => {
      let sanitizedValue = value;

      if (field === 'email') {
        sanitizedValue = value.trim().toLowerCase();
      } else if (field === 'username') {
        sanitizedValue = value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
      } else if (field === 'referralCode') {
        sanitizedValue = value.trim().toUpperCase();
      }

      setFormData({ ...formData, [field]: sanitizedValue });
    };
  return (
    <div className='w-[500px]'>
        <div className='flex flex-col items-center gap-[28px]'>
            <div className='flex items-center justify-center mb-2'>
                <Image 
                    src="/assets/icons/LOGO.png" 
                    alt='EduLearn Logo' 
                    width={42} 
                    height={40} 
                    className='dark:hidden'
                    priority
                />
                <Image 
                    src="/assets/icons/LOGO1.png" 
                    alt='EduLearn Logo' 
                    width={42} 
                    height={40} 
                    className='dark:inline hidden'
                    priority
                />
            </div>
            <div className="flex flex-col">
                <p className='text-[#2D3C52] dark:text-[#E0E0E0] leading-[42px] font-[700] text-[24px]'>
                    {isLogin ? 'Welcome back!' : 'Create your account'}
                </p>

                <p className='text-[#61728C] dark:text-[#B3B3B3] text-[18px] leading-[26px] text-center font-medium opacity-[0.7]'>
                    {isLogin ? 'Login to continue your journey' : 'Lets get started, your Web3 AI tutor awaits'}
                </p>
            </div>
        </div>

        <div className='mt-[48px] space-y-[24px]'>
            {!isLogin && (
                <div>
                    <div className='mb-[8px]'>
                        <label className='text-[#61728C] dark:text-[#B3B3B3] font-[Satoshi] text-[16px] font-medium leading-[24px]'>
                            Name
                        </label>
                    </div>
                    <div className='relative w-full max-w-full'>
                        <input 
                            placeholder='Full Name'
                            type='text'
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className='w-full max-w-full rounded-[8px] h-[40px] dark:bg-[#131313] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] py-[10px] pl-[16px] pr-[16px] gap-[8px] text-[#2D3C52] dark:text-[#E0E0E0] focus:outline-none focus:ring-0 focus:border-[#EDF3FC] dark:focus:border-[#2E3033]'
                        />
                    </div>
                </div>
            )}

            <div>
                <div className='mb-[8px]'>
                    <label className='text-[#61728C] dark:text-[#B3B3B3] font-[Satoshi] text-[16px] font-medium leading-[24px]'>
                        Email
                    </label>
                </div>
                <div className='relative w-full max-w-full'>
                    <input 
                        placeholder='Email'
                        type='email'
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className='w-full max-w-full rounded-[8px] h-[40px] dark:bg-[#131313] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] py-[10px] pl-[16px] pr-[44px] gap-[8px] text-[#2D3C52] dark:text-[#E0E0E0] focus:outline-none focus:ring-0 focus:border-[#EDF3FC] dark:focus:border-[#2E3033]'
                    />
                    <div className='absolute right-[16px] top-1/2 transform -translate-y-1/2 flex items-center justify-center'>
                        <Image src={mail} alt='Mail Icon' width={22} height={22} className='dark:hidden'/>
                        <Image src={mailDark} alt='Mail Icon' width={22} height={22} className='dark:inline hidden'/>
                    </div>
                </div>
            </div>

            {!isLogin && (
                <>
                    <div>
                        <div className='mb-[8px]'>
                            <label className='text-[#61728C] dark:text-[#B3B3B3] font-[Satoshi] text-[16px] font-medium leading-[24px]'>
                                Referral Code (Optional)
                            </label>
                        </div>
                        <div className='relative w-full max-w-full'>
                            <input 
                                placeholder='Referral Code'
                                type='text'
                                value={formData.referralCode}
                                onChange={(e) => handleInputChange('referralCode', e.target.value)}
                                className='w-full max-w-full rounded-[8px] h-[40px] dark:bg-[#131313] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] py-[10px] pl-[16px] pr-[16px] gap-[8px] text-[#2D3C52] dark:text-[#E0E0E0] focus:outline-none focus:ring-0 focus:border-[#EDF3FC] dark:focus:border-[#2E3033]'
                            />
                        </div>
                    </div>

                    <div>
                        <div className='mb-[8px]'>
                            <label className='text-[#61728C] dark:text-[#B3B3B3] font-[Satoshi] text-[16px] font-medium leading-[24px]'>
                                X Username (Optional)
                            </label>
                        </div>
                        <div className='relative w-full max-w-full'>
                            <input 
                                placeholder='@username'
                                type='text'
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className='w-full max-w-full rounded-[8px] h-[40px] dark:bg-[#131313] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] py-[10px] pl-[16px] pr-[16px] gap-[8px] text-[#2D3C52] dark:text-[#E0E0E0] focus:outline-none focus:ring-0 focus:border-[#EDF3FC] dark:focus:border-[#2E3033]'
                            />
                        </div>
                    </div>
                </>
            )}

            <button className=' gap-[12px] rounded-[8px] py-[10px] px-[24px] bg-[#000] text-[#00FF80] dark:text-[#000] dark:bg-[#00FF80] text-[16px] leading-[24px] font-[700] mt-[40px] w-full'>
                {isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <div className='flex items-center justify-center mt-[40px] text-center gap-2'>
                <p className='text-[#61728C] dark:text-[#B3B3B3] leading-[24px] text-[16px] font-[400]'>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p> 
                <p 
                    className="text-[#2D3C52] dark:text-[#E0E0E0] underline underline-offset-[6px] decoration-solid decoration-1 decoration-[#2D3C52] dark:decoration-[#E0E0E0] cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                </p>
            </div>
        </div>
    </div>
  )
}

export default Signup