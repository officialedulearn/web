"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "@/../public/assets/logo.png";
type Props = {};

const Demo = (props: Props) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="mt-20 gap-[64px] flex flex-col items-center">
      <Image src={logo} alt="EduLearn Logo" />

      <div className="relative w-[1200px] h-[702px] rounded-xl overflow-hidden">

        <video
          className="w-full h-full object-cover"
          src="https://www.example.com/video.mp4"
          autoPlay={playing}
          controls={playing}
          muted={!playing}
        />

        {!playing && (
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center">
            <button
              onClick={() => setPlaying(true)}
              className="text-[#00ff88] text-7xl hover:scale-110 transition-transform"
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demo;
