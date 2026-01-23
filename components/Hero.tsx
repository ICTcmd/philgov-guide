import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-slate-50 dark:bg-slate-950 pt-10 pb-16">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:px-12">
        
        {/* Main Headline */}
        <h1 className="mb-6 text-3xl font-extrabold font-display tracking-tight leading-tight text-gov-blue md:text-4xl lg:text-5xl dark:text-blue-400">
          Know the Requirements. <br className="hidden md:block" />
          Understand the Process. Avoid Hassle.
        </h1>
        
        {/* Agency Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 mt-8">
          <Link href="#generator" className="flex items-center justify-between px-6 py-3 bg-gov-blue text-white rounded-lg font-bold shadow-md hover:bg-blue-900 transition-colors min-w-[160px]">
            <span>SSS</span>
            <span className="ml-2">›</span>
          </Link>
          <Link href="#generator" className="flex items-center justify-between px-6 py-3 bg-gov-yellow text-blue-900 rounded-lg font-bold shadow-md hover:bg-yellow-400 transition-colors min-w-[160px]">
            <span>Pag-IBIG</span>
            <span className="ml-2">›</span>
          </Link>
          <Link href="#generator" className="flex items-center justify-between px-6 py-3 bg-gov-green text-white rounded-lg font-bold shadow-md hover:bg-green-800 transition-colors min-w-[160px]">
            <span>PhilHealth</span>
            <span className="ml-2">›</span>
          </Link>
          <Link href="#generator" className="flex items-center justify-between px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg font-bold shadow-sm hover:bg-gray-50 transition-colors min-w-[160px] dark:bg-gray-800 dark:text-white dark:border-gray-700">
            <span>National ID</span>
            <span className="ml-2">›</span>
          </Link>
        </div>

        {/* Popular Service Cards Preview (Static) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left max-w-6xl mx-auto">
          {/* Card 1: SSS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-4 bg-blue-50 rounded-lg flex items-center justify-center">
               {/* Icon Placeholder */}
               <div className="w-10 h-10 bg-gov-blue rounded-md"></div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">SSS Membership</h3>
            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Benefits & Registration</p>
            <Link href="#generator" className="mt-auto text-sm font-semibold text-white bg-gov-blue px-6 py-2 rounded-full hover:bg-blue-900 transition-colors">
              View Guide ›
            </Link>
          </div>

           {/* Card 2: Pag-IBIG */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-4 bg-yellow-50 rounded-lg flex items-center justify-center">
               <div className="w-10 h-10 bg-gov-yellow rounded-md"></div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Pag-IBIG Fund</h3>
            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Loans & Contributions</p>
            <Link href="#generator" className="mt-auto text-sm font-semibold text-blue-900 bg-gov-yellow px-6 py-2 rounded-full hover:bg-yellow-400 transition-colors">
              View Guide ›
            </Link>
          </div>

           {/* Card 3: PhilHealth */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-4 bg-green-50 rounded-lg flex items-center justify-center">
               <div className="w-10 h-10 bg-gov-green rounded-md"></div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">PhilHealth Services</h3>
            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Membership & Benefits</p>
            <Link href="#generator" className="mt-auto text-sm font-semibold text-white bg-gov-green px-6 py-2 rounded-full hover:bg-green-800 transition-colors">
              View Guide ›
            </Link>
          </div>

           {/* Card 4: National ID */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-4 bg-gray-50 rounded-lg flex items-center justify-center">
               <div className="w-10 h-10 bg-gray-400 rounded-md"></div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">National ID</h3>
            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">Get Your PhilSys ID</p>
            <Link href="#generator" className="mt-auto text-sm font-semibold text-gray-700 bg-gray-100 px-6 py-2 rounded-full hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              View Guide ›
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
