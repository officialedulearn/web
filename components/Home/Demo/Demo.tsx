"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "@/../public/assets/images/edulearn.png";
import playIcon from "@/../public/assets/icons/play.png";

const Demo = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="mt-[280px] md:mt-[200px] sm:mt-[150px] gap-[64px] md:gap-[40px] sm:gap-[32px] flex flex-col items-center">
      <Image className="w-[80px] h-[76px] sm:w-[60px] sm:h-[57px]" src={logo} alt="EduLearn Logo" />

      <div className="relative w-full max-w-[1200px] h-auto aspect-video rounded-xl overflow-hidden mx-4">
        <video
          className="w-full h-full object-cover"
          src="https://syvlfqtwjnnhohajuhhg.supabase.co/storage/v1/object/public/project%20media/EduLearn-2%20(1).mp4"
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
              <Image src={playIcon} className="w-[120px] h-[120px] sm:w-[80px] sm:h-[80px]" alt="play" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demo;
