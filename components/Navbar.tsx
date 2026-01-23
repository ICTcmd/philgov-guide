"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Mail, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="bg-gov-blue text-white shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
             <Image 
               src="/logo.png" 
               alt="Bago City Logo" 
               width={40} 
               height={40} 
               className="object-contain p-0.5"
             />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-tight">GovGuide PH</span>
            <span className="text-[10px] font-medium opacity-90 uppercase tracking-wider">Bago City</span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-blue-800 rounded-full transition-colors hidden sm:flex">
            <User className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-blue-800 rounded-full transition-colors hidden sm:flex">
            <Mail className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="p-2 hover:bg-blue-800 rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
