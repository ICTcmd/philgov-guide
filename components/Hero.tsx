import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-emerald-50 to-slate-50 dark:from-slate-950 dark:to-slate-950 relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-24 lg:px-12">
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image 
              src="/logo.png" 
              alt="Bago City Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-extrabold font-display tracking-tight leading-none text-emerald-900 md:text-5xl lg:text-6xl dark:text-white">
          Government Requirements Made <span className="text-emerald-600 dark:text-emerald-400">Easy</span>
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          No more confusion. Get clear, step-by-step guides for SSS, PhilHealth, DFA, and more in seconds. Walang hassle!
        </p>
        <p className="mb-8 text-sm text-gray-500 sm:px-16 xl:px-48 dark:text-gray-400 italic">
          Disclaimer: BAGO APP is a guide only. We do not process documents or applications directly.
        </p>
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <Link href="#generator" className="inline-flex justify-center items-center py-4 px-6 text-base font-bold text-center text-white rounded-lg bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-900 shadow-lg hover:shadow-xl transition-all">
            Get My Guide
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </Link>
          <Link href="#features" className="inline-flex justify-center items-center py-4 px-6 text-base font-medium text-center text-gray-900 rounded-lg border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-all">
            How It Works
          </Link> 
        </div>
      </div>
    </section>
  );
}
