"use client";
import Image from 'next/image';

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ThemeToggleButton from "./ThemeToggleButton";
import { FaBars, FaTimes } from "react-icons/fa";

// Utility function to debounce the scroll event handler
const debounce = (func: Function, wait: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), wait);
  };
};

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = document.documentElement.scrollTop;

      if (currentScrollTop < window.innerHeight / 20) {
        setVisible(true);
      } else if (currentScrollTop > lastScrollTop) {
        setVisible(false);
      } else {
        setVisible(true);

        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        const newTimeout = setTimeout(() => {
          setVisible(false);
        }, 2000);
        setScrollTimeout(newTimeout);
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    const debouncedHandleScroll = debounce(handleScroll, 50);

    window.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [lastScrollTop, scrollTimeout]);

  return (
    <div className="relative">
      <div
        className={cn(
          "fixed top-0 inset-x-0 mx-auto dark:lg:bg-black/[0.5] lg:bg-white/[0.5] z-[5000] px-8 py-6 items-center space-x-4 transition-transform duration-300",
          className,
          visible || hovered ? "translate-y-0" : "-translate-y-full"
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
          <div className="w-[4vw] flex absolute top-2">
          <Image src="vs-logo.png" alt="" />
          <h2 className=" whitespace-nowrap flex items-center font-semibold italic text-xl ">Varsha Sharma</h2>
        </div>
        {/* Desktop View */}
        <div className="hidden lg:flex items-center justify-center ">
  {navItems.map((navItem, idx) => (
    <Link
      key={idx}
      href={navItem.link}
      className={cn(
        "relative flex items-center space-x-1 text-neutral-600 dark:text-neutral-50 dark:hover:text-blue-300 hover:text-black group hover:font-bold"
      )}
    >
      <span className="block sm:hidden">{navItem.icon}</span>
      <span className="hidden sm:px-2 sm:block text-sm group-hover:scale-105 transition-transform duration-300">
        {navItem.name}
      </span>

      {/* Underline animation */}
      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-500 scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-300"></span>
    </Link>
  ))}
</div>


        {/* Hamburger Menu Button */}
        <button
          className="lg:hidden absolute top-4 right-4 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>

        {/* Single Mode Toggle Button */}
        <div className="absolute top-4 right-16 lg:right-4">
          <ThemeToggleButton />
        </div>
      </div>

      {/* Background Blur Effect */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[4000] lg:hidden"
          onClick={() => setMenuOpen(false)} // Close menu when clicking outside
        />
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed top-0 right-0 text-6xl bottom-0 bg-white dark:bg-black/[0.9] w-full max-w-sm transition-transform duration-300 z-[5001]",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full py-6 space-y-4">
          {navItems.map((navItem, idx) => (
            <Link
              key={idx}
              href={navItem.link}
              className="text-neutral-600 dark:text-neutral-50 dark:hover:text-neutral-300 hover:text-neutral-500 flex items-center"
              onClick={() => setMenuOpen(false)} // Close menu on item click
            >
              <div className="flex gap-4 items-center">
                <div className="sm:hidden">{navItem.icon}</div>
                <div className="text-sm">{navItem.name}</div>
              </div>
            </Link>
          ))}
        </div>
        {/* Close Button in Mobile Menu */}
        <button
          className="absolute top-4 right-4 p-2"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <FaTimes className="text-2xl" />
        </button>
      </div>
    </div>
  );
};
