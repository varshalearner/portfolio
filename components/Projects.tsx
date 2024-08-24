import React from "react";

interface Project {
  title: string;
  description: string;
  stack: string[];
  link: string;
  image: string;
}

const projects: Project[] = [
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
  // Add more projects here...
];

const Projects: React.FC = () => {
  return (
    <div className="projects-container">
      <h2 className="text-3xl font-bold text-center mb-10">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <img
                className="p-8 rounded-t-lg"
                src={project.image}
                alt={project.title}
              />
            </a>
            <div className="px-5 pb-5">
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {project.title}
                </h5>
              </a>
              <p className="text-gray-700 dark:text-gray-400 mb-4">
                {project.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-sm bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
