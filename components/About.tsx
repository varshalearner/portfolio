"use client";
// AboutMe.tsx
import Image from 'next/image';

import React from "react";

const AboutMe: React.FC = () => {
  return (
    <section id="about" className="p-28 h-[100vh] bg-gray-100 dark:bg-black-100">
      <div className="container h-full mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            About Me
          </h2>
          <p className="text-lg text-gray-700  font-semibold dark:text-blue-300 mb-8">
            Discover more about me, my skills, and what I’m passionate about!
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col text-justify lg:flex-row items-center lg:items-start justify-center gap-12">
          {/* Text and Tech Stack Section */}
          <div className="lg:w-[60vw]">
            {/* Bio */}
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              I’m <span className="font-bold text-blue-200  ">Varsha Sharma (varshalearner)</span> a dedicated web developer with solid skills in the MERN stack, and I enjoy creating innovative web applications. I’m looking for a role in a company where I can use my technical skills and problem-solving abilities to work on projects. I’m eager to learn and grow while helping the company succeed.
            </p>

            {/* Skills & Technologies */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* Individual Skill Badges */}
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
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div className="lg:w-[30vw] border-4 flex border-black rounded-full border-spacing-10 bg-blue-800 justify-center">
            <Image
              src="profile.png" // Ensure the image is placed in the public folder or adjust the path accordingly
              alt="Profile Picture of Varsha Sharma"
              className="shadow-lg object-cover"
            
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
