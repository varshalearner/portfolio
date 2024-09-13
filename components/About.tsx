"use client";
// AboutMe.tsx
import Image from 'next/image';
import React from "react";

const AboutMe: React.FC = () => {
  return (
    <section id="about" className="p-8 sm:p-16 lg:p-28 min-h-screen bg-blue-50 dark:bg-black-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 lg:mb-6">
            About Me
          </h2>
          <p className="text-base sm:text-lg text-gray-700 font-semibold dark:text-blue-300 mb-6 lg:mb-8">
            Discover more about me, my skills, and what I’m passionate about!
          </p>
        </div>

        {/* Main Content */}
        <div className="flex  flex-col-reverse lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12">
          {/* Text and Tech Stack Section */}
          <div className="w-full lg:w-[60%]">
            {/* Bio */}
            <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 mb-4 lg:mb-6">
              I’m <span className="font-bold text-blue-600 dark:text-blue-200">Varsha Sharma (varshalearner)</span>, a dedicated web developer with solid skills in the MERN stack, and I enjoy creating innovative web applications. I’m looking for a role in a company where I can use my technical skills and problem-solving abilities to work on projects. I’m eager to learn and grow while helping the company succeed.
            </p>

            {/* Skills & Technologies */}
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 lg:mb-4">
              Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "MERN Stack",
                "JavaScript",
                "HTML",
                "Tailwind CSS",
                "Node.js",
                "Express",
                "MongoDB",
                "React",
                "Python",
                "DSA",
                "Git",
                "GitHub",
              ].map((tech, index) => (
                <span
                  key={index}
                  className="md:bg-blue-500 bg-blue-500/50 text-white px-3 md:py-1 rounded-full text-xs sm:text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div className="relative  w-[50%] sm:w-[60%] lg:w-[30%] aspect-w-1 aspect-h-1 border-4 dark:border-black border-blue-100 rounded-full dark:bg-blue-800 bg-white">
            <Image
              src="/profile.png"
              alt="Profile Picture of Varsha Sharma"
              className="shadow-lg object-cover rounded-full"
              width={1000}
              height={1000}
              
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
