"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 border rounded-full bg-gray-200 dark:bg-gray-800 transition flex items-center justify-center"
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-300" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-300" />
      )}
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
};

export default ThemeToggleButton;
