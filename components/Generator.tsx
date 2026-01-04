"use client";

import { useEffect, useState } from 'react';

export default function Generator() {
  const [agency, setAgency] = useState('DFA (Passport)');
  const [action, setAction] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState<null | 'gps' | 'ip' | 'manual' | 'map'>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapStatus, setMapStatus] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<Array<{ agency: string, action: string, date: number }>>([]);

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

  const presets = [
    { label: 'Renew Passport', agency: 'DFA (Passport)', action: 'Renew passport' },
    { label: 'National ID', agency: 'PSA (National ID)', action: 'Apply for PhilSys ID' },
    { label: 'NBI Clearance', agency: 'NBI (Clearance)', action: 'Apply for NBI Clearance' },
    { label: 'Driver’s License', agency: 'LTO (Driver’s License/Car)', action: 'Apply for Non-Professional Driver’s License' },
    { label: 'Get TIN', agency: 'BIR (TIN/Tax)', action: 'Apply for TIN' },
    { label: 'PhilHealth ID', agency: 'PhilHealth', action: 'Apply for PhilHealth ID' },
    { label: 'SSS Number', agency: 'SSS', action: 'Apply for SSS Number' },
    { label: 'Pag-IBIG ID', agency: 'PAG-IBIG', action: 'Apply for Loyalty Card Plus' },
    { label: 'Postal ID', agency: 'PhilPost', action: 'Apply for Postal ID' },
    { label: 'Police Clearance', agency: 'PNP', action: 'Get Police Clearance' },
    { label: 'Voter’s Cert', agency: 'COMELEC', action: 'Get Voter Certification' },
    { label: 'PRC License', agency: 'PRC', action: 'Renew Professional License' },
    { label: 'DSWD Aid', agency: 'DSWD', action: 'Apply for Financial Assistance / 4Ps' },
  ];
  const agencyLinks: Record<string, { homepage?: string; locator?: string; appointment?: string }> = {
    'DFA (Passport)': { homepage: 'https://dfa.gov.ph/', locator: 'https://consular.dfa.gov.ph/consular-offices/', appointment: 'https://www.passport.gov.ph/' },
    "LTO (Driver’s License/Car)": { homepage: 'https://lto.gov.ph/', locator: 'https://lto.gov.ph/directory-of-offices.html', appointment: 'https://portal.lto.gov.ph/' },
    'BIR (TIN/Tax)': { homepage: 'https://www.bir.gov.ph/', locator: 'https://www.bir.gov.ph/index.php/directory/regional.html' },
    'PSA (Birth Cert)': { homepage: 'https://psa.gov.ph/', locator: 'https://psa.gov.ph/psa-regional-offices', appointment: 'https://www.psahelpline.ph/' },
    'PSA (National ID)': { homepage: 'https://philsys.gov.ph/', locator: 'https://philsys.gov.ph/registration-center/' },
    'SSS': { homepage: 'https://www.sss.gov.ph/', appointment: 'https://member.sss.gov.ph/' },
    'PhilHealth': { homepage: 'https://www.philhealth.gov.ph/', locator: 'https://www.philhealth.gov.ph/about_us/map/' },
    'PAG-IBIG': { homepage: 'https://www.pagibigfund.gov.ph/', locator: 'https://www.pagibigfund.gov.ph/directory.html', appointment: 'https://www.pagibigfund.gov.ph/virtualpagibig/' },
    'NBI (Clearance)': { homepage: 'https://nbi.gov.ph/', appointment: 'https://clearance.nbi.gov.ph/' },
    'PhilPost': { homepage: 'https://www.postalidph.com/', locator: 'https://www.postalidph.com/captured-sites.html' },
    'COMELEC': { homepage: 'https://comelec.gov.ph/', locator: 'https://comelec.gov.ph/?r=ContactInformation/FieldOffices' },
    'PNP': { homepage: 'https://pnp.gov.ph/', appointment: 'https://pnpclearance.ph/' },
    'PRC': { homepage: 'https://www.prc.gov.ph/', appointment: 'https://online.prc.gov.ph/' },
    'DSWD': { homepage: 'https://www.dswd.gov.ph/', locator: 'https://www.dswd.gov.ph/directory-of-officials/' },
  };
  const linkify = (text: string) => {
    const parts = text.split(/\n/);
    return parts.map((line, i) => {
      // Split by bold (**...**) or URLs (http/https or www.)
      const tokens = line.split(/(\*\*.*?\*\*|https?:\/\/\S+|www\.\S+)/g);
      return (
        <p key={i} className="mb-2 min-h-[1.2em]">
          {tokens.map((t, j) => {
            if (t.match(/^(https?:\/\/|www\.)/)) {
              const href = t.startsWith('www.') ? `https://${t}` : t;
              return (
                <a key={j} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline break-all">
                  {t}
                </a>
              );
            } else if (t.startsWith('**') && t.endsWith('**')) {
              return (
                <strong key={j} className="font-bold text-gray-900 dark:text-white">
                  {t.slice(2, -2)}
                </strong>
              );
            }
            return <span key={j}>{t}</span>;
          })}
        </p>
      );
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert("Guide copied to clipboard");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  const downloadText = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `philgov-guide-${agency}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    setError(null);
    setIsMock(false);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agency, action, location }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
        addToRecent(agency, action);
        setIsMock(typeof data.result === 'string' && data.result.startsWith('[MOCK MODE'));
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      } else {
        setError("Unable to detect location via IP. Please type your city manually.");
      }
    } catch {
      setError("Unable to detect location. Please type your city manually.");
    }
  };

  const autoFillLocation = async () => {
    if (!termsAccepted) {
      setShowTerms(true);
      return;
    }

    setGeoLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      await detectViaIP();
      setGeoLoading(false);
      return;
    }

    try {
      const precise = await new Promise<{ latitude: number; longitude: number; accuracy: number }>((resolve, reject) => {
        let best: { latitude: number; longitude: number; accuracy: number } | null = null;
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            const acc = pos.coords.accuracy || 9999;
            const cur = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: acc };
            // Update best if current is better (lower accuracy value is better)
            if (!best || cur.accuracy < best.accuracy) best = cur;
            // If accuracy is good enough (< 50 meters), resolve immediately
            if (cur.accuracy < 50) {
              navigator.geolocation.clearWatch(id);
              resolve(cur);
            }
          },
          (err) => {
            // Don't reject immediately on error, wait for timeout if we have a best guess? 
            // Actually, if watchPosition fails completely, we should reject.
            // But if it's just a timeout error from watchPosition, we might still have 'best'.
            // For now, let's just reject and fall back to IP.
            navigator.geolocation.clearWatch(id);
            reject(err);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
        );
        // Fallback if no high-accuracy position is found within 10 seconds
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
            'User-Agent': 'JuanGuide/1.0',
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
        } else {
          setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          setDetectionMethod('gps');
        }
      } catch {
        // If reverse geocoding fails, show coords
        setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setDetectionMethod('gps');
      }
    } catch (e) {
      console.warn("GPS failed, using IP fallback", e);
      await detectViaIP();
    } finally {
      setGeoLoading(false);
    }
  };

  const refineTypedLocation = async () => {
    if (!location.trim()) {
      setError("Please enter your city or province to refine.");
      return;
    }
    setError(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=ph&limit=1&q=${encodeURIComponent(location)}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const a = data[0]?.address || {};
        const city = a.city || a.town || a.village || a.municipality || '';
        const province = a.province || a.state || a.region || '';
        const composed = [city, province].filter(Boolean).join(', ');
        if (composed) {
          setLocation(composed);
          setDetectionMethod('manual');
        } else {
          setError("Could not refine location. Please ensure the city/province name is correct.");
        }
      } else {
        setError("No matching place found. Try including your province (e.g., Bago City, Negros Occidental).");
      }
    } catch {
      setError("Refinement failed. Please try again or enter manually.");
    }
  };

  type LatLng = { lat: number; lng: number };
  type LeafletMap = { 
    setView: (coords: [number, number], zoom: number) => LeafletMap; 
    on: (event: string, handler: (e: { latlng: LatLng }) => void) => LeafletMap;
    remove: () => void;
  };
  type TileLayer = { addTo: (map: LeafletMap) => TileLayer };
  type Marker = { 
    addTo: (map: LeafletMap) => Marker; 
    setLatLng: (coords: [number, number]) => Marker; 
    on: (event: string, handler: () => void) => Marker; 
    getLatLng: () => LatLng 
  };
  type Leaflet = { 
    map: (id: string | HTMLElement) => LeafletMap; 
    tileLayer: (url: string, opts: { attribution: string }) => TileLayer; 
    marker: (coords: [number, number], opts?: { draggable?: boolean }) => Marker 
  };

  const ensureLeaflet = async () => {
    if (!((window as unknown as { L?: unknown }).L)) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    }
  };

  const openMapPicker = async () => {
    setShowMapPicker(true);
    setMapStatus('Loading map…');
    await ensureLeaflet();
    setTimeout(async () => {
      try {
        const L = (window as unknown as { L: Leaflet }).L;
        const container = document.getElementById('map-container');
        if (!container) return;
        
        // Clean up existing map if any (though difficult without storing instance, usually safe in this modal flow if modal is destroyed)
        // ideally we store map instance in ref, but for now we just init.
        
        const map = L.map('map-container').setView([10.3157, 123.8854], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        let marker: Marker | null = null;
        
        const setMarker = async (lat: number, lon: number) => {
          if (marker) {
            marker.setLatLng([lat, lon]);
          } else {
            marker = L.marker([lat, lon], { draggable: true }).addTo(map);
            marker.on('dragend', async () => {
              if (marker) {
                const m = marker.getLatLng();
                await reversePick(m.lat, m.lng);
              }
            });
          }
          await reversePick(lat, lon);
        };
        const reversePick = async (lat: number, lon: number) => {
          setMapStatus('Refining…');
          try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&zoom=12&lat=${lat}&lon=${lon}`;
            const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
            const data = await res.json();
            const a = data?.address || {};
            const city = a.municipality || a.city || a.town || a.village || a.city_district || '';
            const province = a.province || a.state || a.region || a.county || '';
            const composed = [city, province].filter(Boolean).join(', ');
            if (composed) {
              setLocation(composed);
              setDetectionMethod('map');
              setMapStatus(composed);
            } else {
              setMapStatus(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
            }
          } catch {
            setMapStatus(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
          }
        };
        map.on('click', async (e: { latlng: LatLng }) => {
          await setMarker(e.latlng.lat, e.latlng.lng);
        });
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;
              map.setView([latitude, longitude], 14);
              await setMarker(latitude, longitude);
            },
            () => {}
          );
        }
        setMapStatus('Tap anywhere on the map to set your location.');
      } catch {
        setMapStatus('Failed to load map. Please try again later.');
      }
    }, 50);
  };

  return (
    <section id="generator" className="bg-white dark:bg-gray-900 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="max-w-screen-md mx-auto text-center mb-8">
        <h2 className="mb-4 text-5xl md:text-6xl tracking-tight font-extrabold font-display text-gray-900 dark:text-white">
          JuanGuide
        </h2>
        <p className="mb-4 font-light text-gray-500 sm:text-xl dark:text-gray-400">
          Select a service or ask a question to get your instant guide.
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {/* Input Section */}
        <div className="w-full space-y-5 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-violet-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 mb-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => { setAgency(p.agency); setAction(p.action); }}
                className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-colors dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {p.label}
              </button>
            ))}
          </div>

          {recentSearches.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">Recent</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setAgency(item.agency); setAction(item.action); }}
                    className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100 transition-colors dark:bg-gray-700 dark:text-violet-300 dark:border-gray-600"
                  >
                    <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="truncate max-w-[200px]">{item.action} <span className="opacity-50">({item.agency})</span></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="agency-select" className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
              Select Agency
            </label>
            <div className="relative">
              <select
                id="agency-select"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-shadow"
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
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="action-input" className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
              What do you need to do?
            </label>
            <input
              id="action-input"
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-shadow"
              placeholder="e.g. Renew passport, Apply for TIN, Lost ID"
            />
          </div>

          <div>
            <label htmlFor="location-input" className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
              Where are you located? (City/Province)
            </label>
            <input
              id="location-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={refineTypedLocation}
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-shadow"
              placeholder="e.g. Quezon City, Cebu, Davao (Optional)"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              We&#39;ll use this to help you find the nearest office.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={autoFillLocation}
                disabled={geoLoading}
                className={`text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-200 font-medium rounded-xl text-sm px-4 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 transition-colors ${geoLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {geoLoading ? 'Detecting…' : 'Use my location'}
              </button>
              <button
                onClick={openMapPicker}
                className="text-sm px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
              >
                Pin on map
              </button>
              <button
                onClick={() => setShowTerms(true)}
                className="text-sm text-gray-500 underline hover:text-violet-600 dark:text-gray-400 transition-colors"
              >
                View Terms
              </button>
            </div>
            {detectionMethod && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {detectionMethod === 'gps' && 'Detected via GPS'}
                {detectionMethod === 'ip' && 'Detected via IP (approximate). If incorrect, refine or type manually.'}
                {detectionMethod === 'manual' && 'Location refined from your input.'}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 dark:text-gray-300">
                I agree to Terms & Conditions and allow location access for nearest office suggestions.
              </label>
            </div>
            <div className="mt-4 p-4 rounded-xl border border-violet-100 bg-violet-50 dark:border-gray-700 dark:bg-gray-800/50">
              <p className="text-sm font-bold text-violet-900 dark:text-violet-200">Quick Links</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {agencyLinks[agency]?.homepage && (
                  <a href={agencyLinks[agency].homepage} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-full bg-white text-violet-700 border border-violet-100 hover:bg-violet-50 dark:bg-gray-700 dark:text-violet-300 dark:border-gray-600 transition-colors">
                    Official Site
                  </a>
                )}
                {agencyLinks[agency]?.locator && (
                  <a href={agencyLinks[agency].locator} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-full bg-white text-violet-700 border border-violet-100 hover:bg-violet-50 dark:bg-gray-700 dark:text-violet-300 dark:border-gray-600 transition-colors">
                    Branch Locator
                  </a>
                )}
                {agencyLinks[agency]?.appointment && (
                  <a href={agencyLinks[agency].appointment} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-full bg-white text-violet-700 border border-violet-100 hover:bg-violet-50 dark:bg-gray-700 dark:text-violet-300 dark:border-gray-600 transition-colors">
                    Appointment
                  </a>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !action}
            className={`w-full text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:ring-violet-300 font-bold rounded-xl text-base px-5 py-3.5 mr-2 mb-2 dark:bg-violet-600 dark:hover:bg-violet-700 focus:outline-none dark:focus:ring-violet-800 shadow-lg hover:shadow-xl transition-all ${
              (loading || !action) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Searching...' : 'Get Requirements'}
          </button>
          
          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-xl bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="w-full">
          <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
            Your Simple Guide
          </label>
          <div className="relative h-full flex flex-col">
            {result && (
              <div className="flex justify-end gap-2 mb-2">
                <button
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`${agency} ${action} requirements Philippines ${new Date().getFullYear()}`)}`, '_blank')}
                  className="text-xs font-medium bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 py-1.5 px-3 rounded-lg shadow-sm dark:bg-gray-700 dark:text-violet-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-all flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  Verify Info
                </button>
                <button
                  onClick={copyToClipboard}
                  className="text-xs font-medium bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 py-1.5 px-3 rounded-lg shadow-sm dark:bg-gray-700 dark:text-violet-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-all flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                  Copy
                </button>
                <button
                  onClick={downloadText}
                  className="text-xs font-medium bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 py-1.5 px-3 rounded-lg shadow-sm dark:bg-gray-700 dark:text-violet-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-all flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  Download
                </button>
              </div>
            )}
            <div className="p-6 w-full text-sm text-gray-800 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 min-h-[500px] whitespace-pre-wrap leading-relaxed shadow-inner">
              {result ? linkify(result) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                   <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>
                   <span>Your checklist and office location info will appear here...</span>
                </div>
              )}
            </div>
          </div>
          {isMock && (
             <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
               * Running in Demo Mode. Add your API Key to .env.local for real AI.
             </p>
          )}
        </div>
      </div>


      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Terms & Conditions</h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
              <p>Information is generated to help simplify government requirements. Always verify with official agency websites.</p>
              <p>Location access is used only to suggest the nearest offices. Location data is processed on your device and not stored on our servers.</p>
              <p>Fees and policies change. If unsure, follow the official site or branch locator links.</p>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => { setTermsAccepted(true); setShowTerms(false); }}
                className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2"
              >
                I Agree
              </button>
              <button
                onClick={() => setShowTerms(false)}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showMapPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Select Your Location</h3>
            <div id="map-container" className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"></div>
            <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">{mapStatus}</p>
            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowMapPicker(false)}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm px-4 py-2"
              >
                Close
              </button>
              <button
                onClick={() => setShowMapPicker(false)}
                className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2"
              >
                Use this location
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
