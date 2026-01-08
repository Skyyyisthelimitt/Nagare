"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    icon?: JSX.Element;
    onClick?: () => void;
    active?: boolean;
  }[];
  className?: string;
}) => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border-2 border-black dark:border-white rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <button
            key={`link-${idx}`}
            onClick={() => navItem.onClick?.()}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-2 text-black dark:hover:text-neutral-300 hover:text-neutral-500 transition-colors px-4 py-2 rounded-full",
              navItem.active && "border-2 border-black dark:border-white"
            )}
          >
            {navItem.icon && <span>{navItem.icon}</span>}
            <span className="text-sm font-medium">{navItem.name}</span>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
