"use client";
import React, { useState } from "react";

interface Project {
  title: string;
  description: string;
  stack: string[];
  link: string;
  image: string;
}

const projectList: Project[] = [
  {
    title: "Online Food Ordering Website",
    description:
      "An advanced online food ordering platform with animated UI, admin panel, and personalized recommendations.",
    stack: ["MERN Stack", "Tailwind CSS"],
    link: "https://github.com/yourusername/online-food-ordering",
    image: "smart-restaurant-project.png",
  },
  {
    title: "Lung Cancer Analysis",
    description:
      "A platform leveraging machine learning models to predict lung cancer risk, featuring a robust backend API.",
    stack: ["MERN Stack", "Python"],
    link: "https://github.com/yourusername/lung-cancer-analysis",
    image: "lung-cancer-analysis-project.png",
  },
  {
    title: "SightCall: Video Calling Website",
    description:
      "A video calling platform with real-time communication using WebRTC and a clean UI.",
    stack: ["MERN Stack", "Socket.IO", "WebRTC", "Tailwind CSS"],
    link: "https://github.com/yourusername/sightcall",
    image: "khudka-project.png",
  },

  {
    title: "Personal Portfolio",
    description:
      "A responsive and visually appealing personal portfolio showcasing projects, skills, and contact information, built with Next.js and TypeScript.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://github.com/yourusername/portfolio-project",
    image: "portfolio-project.png",
  },
  {
    title: "Netflix Clone",
    description:
      "A Netflix-inspired platform that allows users to browse and stream movies and TV shows with a sleek and responsive UI.",
    stack: ["MERN Stack"],
    link: "https://github.com/yourusername/netflix-clone",
    image: "netflix-project.png",
  },
  {
    title: "Snake Game",
    description:
      "A classic Snake game built with HTML, CSS, and JavaScript. Navigate the snake to eat food and grow while avoiding the game boundaries.",
    stack: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/yourusername/snake-game",
    image: "snake-game-project.png",
  },
  {
    title: "Movies Search Website",
    description:
      "A movie search website using a public API. Users can search for movies, view details, and explore movie information.",
    stack: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/yourusername/movies-search-website",
    image: "movies-search.png",
  },
  {
    title: "e-Dukaan",
    description:
      "An e-commerce platform built with EJS and Tailwind CSS. Allows users to browse products, read reviews, and manage their cart.",
    stack: ["EJS", "Tailwind CSS", "Express", "MongoDB"],
    link: "https://github.com/yourusername/e-dukaan",
    image: "e-dukaan-project.png",
  },

  {
    title: "Gem Portal",
    description:
      "A price comparison tool for gems and jewelry using React for the frontend and Python for web scraping. Compares prices across various websites.",
    stack: ["React", "Tailwind CSS", "Python", "Web Scraping"],
    link: "https://github.com/yourusername/gem-portal",
    image: "gem-portal.png",
  },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="flex flex-col bg-gradient-to-r my-10 from-blue-600/5 to-blue-300/5 hover:from-blue-600/20 hover:to-blue-300/20 md:w-[25vw] w-3/4 items-stretch rounded-lg shadow-lg transition-all duration-300 hover:bg-[#000319]/80 hover:shadow-2xl hover:scale-105">
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        <div className="aspect-w-16 h-[24vh] md:h-[12vh] lg:h-[30vh]  p-4 ">
          <img
            className="object-cover w-full  rounded-t-lg"
            src={project.image}
            alt={project.title}
          />
        </div>
      </a>
      <div className="px-4 pb-2 flex flex-col  justify-stretch items-stretch">
        <a href={project.link} target="_blank" rel="noopener noreferrer">
          <h3 className="text-xl font-bold text-white mb-2 hover:underline">
            {project.title}
          </h3>
        </a>
        <p className="  text-white mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-2 ">
          {project.stack.map((tech, i) => (
            <span key={i} className="text-xs text-white">
              {tech}
            </span>
          ))}
        </div>
        <div>
          <a
            href={project.link}
            className="bg-blue-400/50"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="w-[8vh]"
              src="https://pluspng.com/img-png/github-logo-png-github-logos-and-usage-github-800x665.png"
              alt=""
            />
          </a>
        </div>
      </div>
    </div>
  );
};

const ProjectList: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projectList.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projectList.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col h-[100vh] justify-center item-center" >
     
      <div className="text-center px-4 ">
        <h2 className="text-3xl lg:text-4xl font-bold pt-16 text-cyan-200 mb-4">
          My Projects
        </h2>
        <p className=" text-[3vw]  md:text-base lg:px-32 text-justify text-gray-300 leading-relaxed ">
          These projects showcase my technical skills and experience through
          real-world applications. Each project includes a brief description and
          links to the code repository and live demo. They demonstrate my
          ability to tackle complex challenges, work across various
          technologies, and effectively manage projects from start to finish.
        </p>
      </div>
      <div className="lg:w-5/6 justify-end  mb-2 lg:mx-auto md:mx-10 sm:mx-2 relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {projectList.map((project, i) => (
              <div className="min-w-full " key={i}>
                <div className="flex justify-center ">
                  <div className="scale-90 hidden sm:block">
                    <ProjectCard project={projectList[i]} />
                  </div>

                  <ProjectCard
                    project={projectList[(i + 1) % projectList.length]}
                  />

                  <div className="scale-90 hidden sm:block">
                    <ProjectCard
                      project={
                        projectList[
                          (i + 2 + projectList.length) % projectList.length
                        ]
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg"
          onClick={prevSlide}
        >
          &#10094;
        </button>
        <button
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg"
          onClick={nextSlide}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default ProjectList;
