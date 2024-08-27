"use client";

import * as React from "react";
import { FaHome, FaUser, FaProjectDiagram, FaEnvelope } from "react-icons/fa";

// import { TextGenerateEffect } from "./ui/text-generate-effect";
import MagicButton from "./MagicButton";
import { Spotlight } from "./ui/spotlight";
import { FloatingNav } from "./floating-navbar";
import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "next-themes";
import Image from "next/image";

const Hero = () => {
  const { theme } = useTheme(); // Access the current theme
  const [mounted, setMounted] = React.useState(false);

  // Ensure client-only logic runs after the initial render
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render the component until the client-side has mounted
  if (!mounted) return null;

  // Navigation items for FloatingNav
  const navItems = [
    { name: "Home", link: "#home", icon: <FaHome /> },
    { name: "About", link: "#about", icon: <FaUser /> },
    { name: "Projects", link: "#projects", icon: <FaProjectDiagram /> },
    { name: "Contact", link: "#contact", icon: <FaEnvelope /> },
  ];

  return (
    <div className="pb-20 pt-20 h-screen relative flex justify-center items-center" id="home">
      <FloatingNav navItems={navItems} /> {/* Add FloatingNav here */}
      {/* Spotlight effect */}
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill={theme === "light" ? "purple" : "white"}
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      {/* Background grid */}
      <div
        className={`h-screen w-full absolute top-0 left-0 flex items-center justify-center 
        ${theme === "light" ? "dark:bg-gray-100 dark:bg-grid-black/[0.2] bg-blue-200 bg-grid-white/[0.15]" : "dark:bg-black-100 dark:bg-grid-white/[0.02]"}`}
      >
        {/* Radial gradient for the container to give a faded look */}
        <div
          className={`absolute pointer-events-none inset-0 flex items-center justify-center 
          ${theme === "light" ? "bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,gray)]" : "dark:bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"}`}
        />
      </div>

    

      {/* Intro */}
      <div className="flex justify-center items-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className={`uppercase tracking-widest text-xs text-center ${theme === "light" ? "text-gray-700" : "text-blue-100"} max-w-80`}>
            Crafting Innovative Web Solutions with MERN Stack
          </p>

          {/* <TextGenerateEffect
            words="Building Cutting-Edge Experiences Through Code"
            className={`text-center text-[40px] md:text-5xl lg:text-6xl ${theme === "light" ? "text-black" : "text-white"}`}
          />
 */}
          <p className={`py-4 text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl ${theme === "light" ? "text-gray-800" : "text-white"}`}>
            Hi! I&apos;m <span className="font-bold dark:text-blue-200 text-blue-900 text-xl md:text-2xl lg:text-3xl">Varsha Sharma</span>, a Web Developer with a passion for
            creating dynamic applications.
          </p>
          <Image src="/robot.png" className="w-[40vw] md:w-[30vw] lg:w-[12vw]" alt="Programmer" />

          <a href="#portfolio">
            <MagicButton
              title="Explore My Projects"
              position="right"
            />
          </a>
        </div>
      </div>
      {/* grid */}
      
    </div>
  );
};

export default Hero;
