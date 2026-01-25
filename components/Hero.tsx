"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';

const HEADLINES = [
  "Know the Requirements.",
  "Understand the Process.",
  "Avoid Hassle.",
  "BAGO APP"
];

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  logo: string;
  logoBg: string;
  btnColor: string;
  btnHover: string;
  btnTextColor: string;
  link: string;
  category: string;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    id: "sss",
    title: "SSS Membership",
    description: "Benefits & Registration",
    logo: "/logos/sss.svg",
    logoBg: "bg-blue-50",
    btnColor: "bg-blue-600",
    btnHover: "hover:bg-blue-700",
    btnTextColor: "text-white",
    link: "/?agency=SSS#generator",
    category: "Social Security"
  },
  {
    id: "pagibig",
    title: "Pag-IBIG Fund",
    description: "Loans & Contributions",
    logo: "/logos/pagibig.svg",
    logoBg: "bg-yellow-50",
    btnColor: "bg-yellow-400",
    btnHover: "hover:bg-yellow-500",
    btnTextColor: "text-blue-900",
    link: "/?agency=PAG-IBIG#generator",
    category: "Social Security"
  },
  {
    id: "philhealth",
    title: "PhilHealth Services",
    description: "Membership & Benefits",
    logo: "/logos/philhealth.svg",
    logoBg: "bg-green-50",
    btnColor: "bg-green-600",
    btnHover: "hover:bg-green-700",
    btnTextColor: "text-white",
    link: "/?agency=PhilHealth#generator",
    category: "Social Security"
  },
  {
    id: "psa-id",
    title: "National ID",
    description: "Get Your PhilSys ID",
    logo: "/logos/psa.svg",
    logoBg: "bg-gray-50",
    btnColor: "bg-gray-100 dark:bg-gray-700",
    btnHover: "hover:bg-gray-200 dark:hover:bg-gray-600",
    btnTextColor: "text-gray-700 dark:text-white",
    link: "/?agency=PSA%20(National%20ID)#generator",
    category: "Identity"
  },
  {
    id: "lto",
    title: "LTO Services",
    description: "License & Registration",
    logo: "/logos/lto.svg",
    logoBg: "bg-blue-50",
    btnColor: "bg-blue-800",
    btnHover: "hover:bg-blue-900",
    btnTextColor: "text-white",
    link: "/?agency=LTO%20(Driver%E2%80%99s%20License%2FCar)#generator",
    category: "Legal"
  },
  {
    id: "nbi",
    title: "NBI Clearance",
    description: "Online Application",
    logo: "/logos/nbi.svg",
    logoBg: "bg-amber-50",
    btnColor: "bg-amber-700",
    btnHover: "hover:bg-amber-800",
    btnTextColor: "text-white",
    link: "/?agency=NBI%20(Clearance)#generator",
    category: "Legal"
  },
  {
    id: "dswd",
    title: "DSWD Assistance",
    description: "Aid & Social Services",
    logo: "/logos/dswd.svg",
    logoBg: "bg-red-50",
    btnColor: "bg-red-600",
    btnHover: "hover:bg-red-700",
    btnTextColor: "text-white",
    link: "/?agency=DSWD#generator",
    category: "Welfare"
  },
  {
    id: "dfa",
    title: "DFA Passport",
    description: "Appointment & Renewal",
    logo: "/logos/dfa.svg",
    logoBg: "bg-indigo-50",
    btnColor: "bg-indigo-900",
    btnHover: "hover:bg-indigo-950",
    btnTextColor: "text-white",
    link: "/?agency=DFA%20(Passport)#generator",
    category: "Identity"
  },
  {
    id: "bir",
    title: "BIR Services",
    description: "TIN & Tax Filing",
    logo: "/logos/bir.svg",
    logoBg: "bg-cyan-50",
    btnColor: "bg-cyan-600",
    btnHover: "hover:bg-cyan-700",
    btnTextColor: "text-white",
    link: "/?agency=BIR%20(TIN%2FTax)#generator",
    category: "Finance"
  },
  {
    id: "psa-cert",
    title: "PSA Serbilis",
    description: "Birth/Marriage Certs",
    logo: "/logos/psa.svg",
    logoBg: "bg-teal-50",
    btnColor: "bg-teal-500",
    btnHover: "hover:bg-teal-600",
    btnTextColor: "text-white",
    link: "/?agency=PSA%20(Birth%20Cert)#generator",
    category: "Identity"
  },
  {
    id: "pnp",
    title: "PNP Clearance",
    description: "Police Clearance",
    logo: "/logos/pnp.svg",
    logoBg: "bg-blue-50",
    btnColor: "bg-blue-600",
    btnHover: "hover:bg-blue-700",
    btnTextColor: "text-white",
    link: "/?agency=PNP#generator",
    category: "Legal"
  },
  {
    id: "prc",
    title: "PRC Services",
    description: "Licensure Exams",
    logo: "/logos/prc.svg",
    logoBg: "bg-yellow-50",
    btnColor: "bg-yellow-600",
    btnHover: "hover:bg-yellow-700",
    btnTextColor: "text-white",
    link: "/?agency=PRC#generator",
    category: "Professional"
  },
  {
    id: "comelec",
    title: "COMELEC",
    description: "Voter Registration",
    logo: "/logos/comelec.svg",
    logoBg: "bg-red-50",
    btnColor: "bg-red-600",
    btnHover: "hover:bg-red-700",
    btnTextColor: "text-white",
    link: "/?agency=COMELEC#generator",
    category: "Identity"
  },
  {
    id: "philpost",
    title: "PhilPost",
    description: "Postal ID Services",
    logo: "/logos/philpost.svg",
    logoBg: "bg-orange-50",
    btnColor: "bg-orange-600",
    btnHover: "hover:bg-orange-700",
    btnTextColor: "text-white",
    link: "/?agency=PhilPost#generator",
    category: "Identity"
  },
  {
    id: "barangay",
    title: "Barangay Services",
    description: "Clearance & Cedula",
    logo: "/logos/barangay.svg",
    logoBg: "bg-gray-100",
    btnColor: "bg-gray-600",
    btnHover: "hover:bg-gray-700",
    btnTextColor: "text-white",
    link: "/?agency=Barangay#generator",
    category: "Local"
  },
  {
    id: "dole",
    title: "DOLE Services",
    description: "Labor & Employment",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Department_of_Labor_and_Employment_(DOLE).svg",
    logoBg: "bg-yellow-50",
    btnColor: "bg-yellow-600",
    btnHover: "hover:bg-yellow-700",
    btnTextColor: "text-white",
    link: "/?agency=DOLE#generator",
    category: "Labor"
  },
  {
    id: "tesda",
    title: "TESDA",
    description: "Skills & Training",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Technical_Education_and_Skills_Development_Authority_(TESDA).svg",
    logoBg: "bg-blue-50",
    btnColor: "bg-blue-600",
    btnHover: "hover:bg-blue-700",
    btnTextColor: "text-white",
    link: "/?agency=TESDA#generator",
    category: "Education"
  },
  {
    id: "csc",
    title: "Civil Service",
    description: "Exams & Eligibility",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Civil_Service_Commission.svg",
    logoBg: "bg-red-50",
    btnColor: "bg-red-700",
    btnHover: "hover:bg-red-800",
    btnTextColor: "text-white",
    link: "/?agency=CSC#generator",
    category: "Government"
  },
  {
    id: "dti",
    title: "DTI Business",
    description: "Business Registration",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Department_of_Trade_and_Industry_(DTI).svg",
    logoBg: "bg-blue-50",
    btnColor: "bg-blue-800",
    btnHover: "hover:bg-blue-900",
    btnTextColor: "text-white",
    link: "/?agency=DTI#generator",
    category: "Business"
  },
  {
    id: "bi",
    title: "Bureau of Immigration",
    description: "Visas & Travel",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Bureau_of_Immigration_PH_2022.png",
    logoBg: "bg-green-50",
    btnColor: "bg-green-700",
    btnHover: "hover:bg-green-800",
    btnTextColor: "text-white",
    link: "/?agency=Bureau%20of%20Immigration#generator",
    category: "Travel"
  },
  {
    id: "owwa",
    title: "OWWA",
    description: "OFW Welfare",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Overseas_Workers_Welfare_Administration_(OWWA)_-_Philippines.svg",
    logoBg: "bg-teal-50",
    btnColor: "bg-teal-600",
    btnHover: "hover:bg-teal-700",
    btnTextColor: "text-white",
    link: "/?agency=OWWA#generator",
    category: "Welfare"
  },
  {
    id: "denr",
    title: "DENR",
    description: "Environment & Land",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_of_the_Department_of_Environment_and_Natural_Resources.svg",
    logoBg: "bg-green-50",
    btnColor: "bg-green-800",
    btnHover: "hover:bg-green-900",
    btnTextColor: "text-white",
    link: "/?agency=DENR#generator",
    category: "Environment"
  },
  {
    id: "gsis",
    title: "GSIS",
    description: "Gov't Insurance",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Government_Service_Insurance_System_(Philippines)_(logo).svg",
    logoBg: "bg-blue-50",
    btnColor: "bg-blue-700",
    btnHover: "hover:bg-blue-800",
    btnTextColor: "text-white",
    link: "/?agency=GSIS#generator",
    category: "Social Security"
  },
  {
    id: "doh",
    title: "DOH",
    description: "Health Services",
    logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Department_of_Health_(DOH)_PHL.svg",
    logoBg: "bg-green-50",
    btnColor: "bg-green-600",
    btnHover: "hover:bg-green-700",
    btnTextColor: "text-white",
    link: "/?agency=DOH#generator",
    category: "Health"
  }
];

const CATEGORIES = ["All", "Social Security", "Identity", "Legal", "Finance", "Welfare", "Professional", "Local", "Labor", "Education", "Government", "Business", "Travel", "Health", "Environment"];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HEADLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredCards = SERVICE_CARDS.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="bg-orange-50 dark:bg-slate-950 pt-10 pb-16">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:px-12">
        
        {/* Main Headline - Animated Slideshow */}
        <div className="h-[140px] md:h-[180px] w-full flex items-center justify-center mb-8 overflow-hidden relative">
          {HEADLINES[index] === "BAGO APP" ? (
             <div key={index} className="flex items-center justify-center gap-3 md:gap-5 animate-slide-up-fade px-4">
               <div className="w-16 h-16 md:w-24 md:h-24 relative flex-shrink-0">
                 <Image 
                   src="/logos/bago-logo.png" 
                   alt="Bago City Logo" 
                   fill
                   className="object-contain"
                   priority
                 />
               </div>
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-black italic text-orange-500 drop-shadow-sm">
                 BAGO APP
               </h1>
             </div>
          ) : (
            <h1 key={index} className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-black dark:text-white animate-slide-up-fade text-center px-4 tracking-tight leading-tight">
              {HEADLINES[index]}
            </h1>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-4xl mx-auto mb-12 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-white focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 shadow-sm" 
              placeholder="Search for an agency or service (e.g., SSS, Passport, NBI)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  // Auto-scroll with explicit offset calculation for better mobile reliability
                  setTimeout(() => {
                    const element = document.getElementById('service-cards');
                    if (element) {
                      const offset = 100; // Adjust for sticky navbar
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.scrollY - offset;
                      
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }, 300); // Increased delay to ensure render completes
                }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Popular Service Cards Preview (Filtered) */}
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left max-w-6xl mx-auto mt-8">
            {filteredCards.map((card) => (
              <div key={card.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                <div className={`w-16 h-16 mb-4 ${card.logoBg} rounded-lg flex items-center justify-center p-2`}>
                   <Image src={card.logo} alt={`${card.title} Logo`} width={48} height={48} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{card.title}</h3>
                <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">{card.description}</p>
                <Link 
                  href={card.link} 
                  className={`mt-auto text-sm font-semibold ${card.btnTextColor} ${card.btnColor} ${card.btnHover} px-6 py-2 rounded-full btn-hover-effect transition-colors`}
                >
                  View Guide ›
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No services found matching your search.</p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
              className="mt-4 text-orange-500 hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
