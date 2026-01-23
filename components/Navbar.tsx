"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group animate-entrance">
          <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md group-hover:border-orange-500">
             <Image 
               src="/logo.png" 
               alt="Bago App Logo" 
               width={40} 
               height={40} 
               className="object-contain p-0.5"
             />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-tight text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-orange-500">BAGO APP</span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
