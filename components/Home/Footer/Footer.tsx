import React from "react";
import Image from "next/image";
import logo from "@/../public/assets/images/logo.png";
import { FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="relative mt-[120px] overflow-hidden pb-[80px]">
      <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 opacity-[0.05] z-0">
        <Image
          src={logo}
          alt="watermark logo"
          className="w-[500px] md:w-[900px] h-auto object-contain"
        />
      </div>

      <div className="relative z-10">
        <div className="flex  flex-col md:flex-row gap-[120px] ">
          <div className="flex flex-col gap-[32px] ">
            <Image src={logo} alt="logo" width={190} height={39} />
            <p className="text-[#B3B3B3] text-[16px] font-[400] leading-[24px]">
              Incentivized Web3 AI study companion
            </p>
            <div className="gap-[10px] flex items-center">
              <div className="flex items-center justify-center rounded-full border bg-[#00FF80] border-[#2E3033] w-[40px] h-[40px]">
                <FaDiscord color="black" size={20} />
              </div>
              <div className="flex items-center justify-center rounded-full border bg-[#00FF80] border-[#2E3033] w-[40px] h-[40px]">
                <FaXTwitter color="black" size={20} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="text-[#E0E0E0] font-bold leading-[24px] text-[16px]">
              Quick Links
            </p>
            <p className="text-[#B3B3B3] leading-[30px] font-[400] text-[20px] cursor-pointer">
              How it works
            </p>
            <p className="text-[#B3B3B3] leading-[30px] font-[400] text-[20px] cursor-pointer">
              Features
            </p>
            <p className="text-[#B3B3B3] leading-[30px] font-[400] text-[20px] cursor-pointer">
              Testimonial
            </p>
            <p className="text-[#B3B3B3] leading-[30px] font-[400] text-[20px] cursor-pointer">
              FAQ&apos;s
            </p>
          </div>
        </div>

        <div className="hidden md:block ">
        <div className="flex flex-row justify-between mt-[90px] mb-[40px]">
          <p className="text-[#B3B3B3] text-[20px] font-medium leading-[30px]">
            © 2025 EDULEARN. All rights reserved.
          </p>

          <div className="flex items-center gap-[24px]">
            <p className="text-[#B3B3B3] text-[20px] font-medium leading-[30px]">
              Terms
            </p>
            <p className="text-[#B3B3B3] text-[20px] font-medium leading-[30px]">
              Privacy Policy
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
