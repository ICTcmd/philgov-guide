"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { LOADING_MESSAGES, AGENCY_ACTIONS } from '@/lib/constants';
import LocationPicker from './LocationPicker';
import ResultCard from './ResultCard';
import RecentSearches from './RecentSearches';
import LoadingSkeleton from './LoadingSkeleton';
import { ThemeToggle } from './ThemeToggle';
import { Image as ImageIcon, X, Mic } from 'lucide-react';

type GenerateResponse = {
  result?: string;
  error?: string;
};

export default function Generator() {
  const [agency, setAgency] = useState('DFA (Passport)');
  const [action, setAction] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('taglish');
  const [isListening, setIsListening] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState<null | 'gps' | 'ip' | 'manual' | 'map'>(null);
  const [recentSearches, setRecentSearches] = useState<Array<{ agency: string, action: string, date: number }>>([]);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [geoLoading, setGeoLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const detectViaIP = async () => {
    try {
      const ipRes = await fetch('https://ipapi.co/json/');
      const ipData = await ipRes.json();
      const city = ipData.city || '';
      const region = ipData.region || ipData.province || ipData.country_name || '';
      const composed = [city, region].filter(Boolean).join(', ');
      if (composed) {
        setLocation(composed);
        setError(null);
        setDetectionMethod('ip');
        return composed;
      } else {
        setError("Unable to detect location via IP. Please type your city manually.");
        return null;
      }
    } catch {
      setError("Unable to detect location. Please type your city manually.");
      return null;
    }
  };

  const autoFillLocation = async () => {
    if (!termsAccepted) {
      setShowTerms(true);
      return null;
    }

    setGeoLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      const ipLoc = await detectViaIP();
      setGeoLoading(false);
      return ipLoc;
    }

    try {
      const precise = await new Promise<{ latitude: number; longitude: number; accuracy: number }>((resolve, reject) => {
        let best: { latitude: number; longitude: number; accuracy: number } | null = null;
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            const acc = pos.coords.accuracy || 9999;
            const cur = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: acc };
            if (!best || cur.accuracy < best.accuracy) best = cur;
            if (cur.accuracy < 50) {
              navigator.geolocation.clearWatch(id);
              resolve(cur);
            }
          },
          (err) => {
            navigator.geolocation.clearWatch(id);
            reject(err);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
        );
        setTimeout(() => {
          navigator.geolocation.clearWatch(id);
          if (best) {
            resolve(best);
          } else {
            reject(new Error("Location timeout"));
          }
        }, 10000);
      });

      const { latitude, longitude } = precise;
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&zoom=14&lat=${latitude}&lon=${longitude}`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'BagoApp/1.0',
            'Accept': 'application/json'
          }
        });
        const data = await res.json();
        const a = data?.address || {};
        const city = a.city || a.municipality || a.town || a.village || a.city_district || '';
        const province = a.province || a.state || a.region || '';
        const composed = [city, province].filter(Boolean).join(', ');
        
        if (composed) {
          setLocation(composed);
          setDetectionMethod('gps');
          return composed;
        } else {
          const loc = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setLocation(loc);
          setDetectionMethod('gps');
          return loc;
        }
      } catch {
        const loc = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        setLocation(loc);
        setDetectionMethod('gps');
        return loc;
      }
    } catch (e) {
      console.warn("GPS failed, using IP fallback", e);
      const ipLoc = await detectViaIP();
      return ipLoc;
    } finally {
      setGeoLoading(false);
    }
  };

  // Auto-select agency from URL query param
  useEffect(() => {
    const agencyParam = searchParams.get('agency');
    if (agencyParam) {
      // Decode URI component just in case, though searchParams.get usually handles it
      setAgency(decodeURIComponent(agencyParam));
      
      // Optional: Auto-scroll to generator if param exists (handles direct link visits)
      const element = document.getElementById('generator');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    } else {
      setLoadingMsgIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  const addToRecent = (newAgency: string, newAction: string) => {
    const newItem = { agency: newAgency, action: newAction, date: Date.now() };
    setRecentSearches(prev => {
      const filtered = prev.filter(item => !(item.agency === newAgency && item.action === newAction));
      const updated = [newItem, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const storedTerms = typeof window !== 'undefined' ? window.localStorage.getItem('termsAccepted') : null;
    if (storedTerms === 'true') setTermsAccepted(true);
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('termsAccepted', String(termsAccepted));
    }
  }, [termsAccepted]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size too large (max 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceInput = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-PH';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAction(transcript);
      };
      
      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const handleGenerate = async (overrideAction?: string, overrideLocation?: string) => {
    const currentAction = typeof overrideAction === 'string' ? overrideAction : action;
    const currentLocation = typeof overrideLocation === 'string' ? overrideLocation : location;
    const trimmedAction = currentAction.trim();
    if (!trimmedAction) {
      setError("Please tell us what you need to do (e.g. \"Renew passport\").");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions before generating a guide.");
      return;
    }

    const payload = {
      agency,
      action: trimmedAction,
      location: currentLocation,
      language,
      image,
    };

    setLoading(true);
    setResult("");
    setError(null);
    setIsMock(false);
    
    // Auto-scroll to result area start
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      let data: GenerateResponse | null = null;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse JSON from /api/generate', e);
      }

      if (!response.ok) {
        const message = data?.error || `Server error (status ${response.status})`;
        setError(message);
        return;
      }

      if (data?.error) {
        setError(data.error);
        return;
      }

      if (!data || !data.result) {
        setError("Invalid response from server");
        return;
      }

      let finalResult = data.result;
      let extractedQuestions: string[] = [];

      // 1. Primary: Look for hidden <<<FOLLOWUPS>>> block
      const followUpMatch = finalResult.match(/<<<FOLLOWUPS>>>([\s\S]*?)<<<END_FOLLOWUPS>>>/);
      if (followUpMatch) {
        extractedQuestions = followUpMatch[1].trim().split('\n').filter(q => q.trim().length > 0);
        // Remove the follow-up block from the displayed result
        finalResult = finalResult.replace(/<<<FOLLOWUPS>>>[\s\S]*?<<<END_FOLLOWUPS>>>/, '').trim();
      }

      // 2. Fallback: Look for "Follow-up Questions" header (Visible Text)
      // Matches **❓ Follow-up Questions:** or similar, and captures everything after it
      if (extractedQuestions.length === 0) {
        // Updated regex to support Emoji variations (❓, ?, ❓) and loose formatting
        const fallbackMatch = finalResult.match(/(?:[\?❓].*Follow-up Questions|Questions|Tanong|Mga Tanong).*?(:)?([\s\S]*)$/i);
        if (fallbackMatch) {
           const rawText = fallbackMatch[2];
           // Extract lines that look like questions (start with number or bullet)
           const questions = rawText
             .split('\n')
             .map(line => line.replace(/^\d+\.|•|-/, '').trim())
             .filter(line => line.length > 5 && line.includes('?'));
           
           if (questions.length > 0) {
             extractedQuestions = questions;
             // Remove the whole section from the result to avoid duplication
             finalResult = finalResult.replace(fallbackMatch[0], '');
           }
        }
      }

      setResult(finalResult);
      setFollowUps(extractedQuestions);

      addToRecent(agency, trimmedAction);
      setIsMock(typeof data.result === 'string' && data.result.startsWith('[MOCK MODE'));
    } catch (error) {
      console.error('Error generating content:', error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="generator" className="bg-transparent dark:bg-transparent py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="max-w-screen-md mx-auto text-center mb-8 relative">
        <div className="absolute top-0 right-0 hidden md:block">
           <ThemeToggle />
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
           <div className="relative w-20 h-20 md:w-24 md:h-24">
             <Image 
              src="/logo.png" 
              alt="Bago App Logo" 
              fill 
              className="object-contain drop-shadow-md"
              priority
            />
           </div>
           <h2 className="text-5xl md:text-6xl tracking-tight font-extrabold text-blue-900 dark:text-white">
            BAGO APP
          </h2>
        </div>
        <p className="mb-4 font-light text-gray-500 sm:text-xl dark:text-gray-400">
          Select a service or ask a question to get your instant guide.
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {/* Input Section */}
        <div className="w-full space-y-5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <RecentSearches 
            searches={recentSearches} 
            onSelect={(a, act) => { setAgency(a); setAction(act); }} 
          />

          <div>
            <label htmlFor="agency-select" className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
              Select Agency
            </label>
            <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                id="agency-select"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-shadow"
              >
                <option value="DFA (Passport)">DFA (Passport)</option>
                <option value="LTO (Driver’s License/Car)">LTO (Driver’s License)</option>
                <option value="BIR (TIN/Tax)">BIR (Tax/TIN)</option>
                <option value="PSA (Birth Cert)">PSA (Birth Certificate)</option>
                <option value="PSA (National ID)">PSA (National ID)</option>
                <option value="SSS">SSS</option>
                <option value="PhilHealth">PhilHealth</option>
                <option value="PAG-IBIG">PAG-IBIG</option>
                <option value="NBI (Clearance)">NBI Clearance</option>
                <option value="PhilPost">PhilPost</option>
                <option value="COMELEC">COMELEC</option>
                <option value="PNP">PNP</option>
                <option value="PRC">PRC</option>
                <option value="DSWD">DSWD</option>
                <option value="Barangay">Barangay Services</option>
                <option value="DOLE">DOLE</option>
                <option value="TESDA">TESDA</option>
                <option value="CSC">CSC (Civil Service)</option>
                <option value="DTI">DTI</option>
                <option value="Bureau of Immigration">Bureau of Immigration</option>
                <option value="OWWA">OWWA</option>
                <option value="DENR">DENR</option>
                <option value="GSIS">GSIS</option>
                <option value="DOH">DOH</option>
              </select>
            </div>
            <div className="w-1/3">
               <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-shadow"
               >
                 <option value="taglish">Taglish 🇵🇭</option>
                 <option value="english">English 🇺🇸</option>
                 <option value="tagalog">Tagalog (Pure)</option>
                 <option value="cebuano">Cebuano (Bisaya)</option>
               </select>
            </div>
            </div>
          </div>

          {/* Dynamic Quick Actions for Selected Agency */}
          {AGENCY_ACTIONS[agency] && (
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                Available Services for {agency.split('(')[0].trim()}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {AGENCY_ACTIONS[agency].map((act) => (
                  <button
                    key={act}
                    onClick={async () => { setAction(act); const loc = await autoFillLocation(); handleGenerate(act, loc || undefined); }}
                    className="text-left text-xs md:text-sm px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-sm font-medium text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-brand-primary"
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="action-input" className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
              Or type a specific concern:
            </label>
            <div className="relative">
              <input
                id="action-input"
                type="text"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-3 pr-12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-shadow"
                placeholder="e.g. Renew passport, Apply for TIN, Lost ID"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400'}`}
                title="Voice Input"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            {isListening && <p className="text-xs text-red-500 mt-1 ml-1">Listening...</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
              Or Upload a Photo (Optional)
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-all">
                {image ? (
                  <div className="relative w-full h-full p-2">
                    <img src={image} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    <button 
                      onClick={(e) => { e.preventDefault(); setImage(null); }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (MAX. 5MB)</p>
                  </div>
                )}
                <input id="dropzone-file" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <LocationPicker
            location={location}
            setLocation={setLocation}
            detectionMethod={detectionMethod}
            setDetectionMethod={setDetectionMethod}
            setError={setError}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            agency={agency}
            geoLoading={geoLoading}
            autoFillLocation={autoFillLocation}
            showTerms={showTerms}
            setShowTerms={setShowTerms}
          />

          <button
            onClick={() => handleGenerate()}
            disabled={loading || !action.trim()}
            className={`w-full relative text-white bg-brand-primary hover:bg-brand-secondary focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-base px-5 py-3.5 mr-2 mb-2 dark:bg-brand-primary dark:hover:bg-brand-secondary focus:outline-none dark:focus:ring-blue-900 shadow-lg btn-hover-effect overflow-hidden ${
              (loading || !action.trim()) ? 'opacity-90 cursor-wait' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="animate-pulse">{LOADING_MESSAGES[loadingMsgIndex]}</span>
              </div>
            ) : (
              'Get My Guide'
            )}
          </button>
          
          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div ref={resultRef} className="scroll-mt-24 transition-all duration-500 ease-in-out">
           {loading ? (
             <LoadingSkeleton />
           ) : (
              <div className="space-y-6">
                <ResultCard 
                  result={result} 
                  agency={agency} 
                  action={action} 
                  isMock={isMock} 
                />
                
                {followUps.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-100 dark:border-gray-700">
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                       <span className="bg-blue-100 text-blue-700 p-1 rounded-lg">❓</span> 
                       You might also ask...
                     </h3>
                     <div className="flex flex-wrap gap-3">
                       {followUps.map((q, idx) => (
                         <button
                           key={idx}
                           onClick={() => { setAction(q); handleGenerate(q); }}
                           className="text-left text-sm px-4 py-3 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 btn-hover-effect dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600"
                         >
                           {q}
                         </button>
                       ))}
                     </div>
                  </div>
               )}
             </div>
           )}
        </div>
      </div>
    </section>
  );
}
