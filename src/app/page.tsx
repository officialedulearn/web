import Image from "next/image";
import NavBar from "../../components/Home/NavBar/NavBar";
import Hero from "../../components/Home/Hero/Hero";
import HowItWorks from "../../components/Home/HowItWorks/HowItWorks";
import Features from "../../components/Home/Features/Features";
import Demo from "../../components/Home/Demo/Demo";
import Testemonial from "../../components/Home/Testemonial/Testemonial";
import FAQ from "../../components/Home/FAQ/FAQ";
import CTA from "../../components/Home/CTA/CTA";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="md:px-[86px] px-[16px]">
        <Hero />
        <HowItWorks />
        <Features />
        <Demo />
        <Testemonial />
        <FAQ />
        <CTA />
      </div>
    </>
  );
}
