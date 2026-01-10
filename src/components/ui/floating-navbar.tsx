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
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto bg-white dark:bg-black border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] rounded-2xl z-[5000] p-2 items-center justify-center space-x-2",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <button
            key={`link-${idx}`}
            onClick={() => navItem.onClick?.()}
            className={cn(
              "relative flex items-center space-x-2 px-6 py-2 rounded-xl transition-all duration-200 border-2 border-transparent",
              "hover:translate-y-[-1px] hover:translate-x-[-1px]",
              navItem.active 
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]" 
                : "text-neutral-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900"
            )}
          >
            {navItem.icon && <span className="[&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[2.5]">{navItem.icon}</span>}
            <span className="text-sm font-black uppercase tracking-wider">{navItem.name}</span>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
