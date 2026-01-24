import React, { useState } from 'react';
import { AGENCY_LINKS } from '@/lib/constants';

interface LocationPickerProps {
  location: string;
  setLocation: (loc: string) => void;
  detectionMethod: 'gps' | 'ip' | 'manual' | 'map' | null;
  setDetectionMethod: (method: 'gps' | 'ip' | 'manual' | 'map' | null) => void;
  setError: (err: string | null) => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  agency: string;
  geoLoading: boolean;
  autoFillLocation: () => Promise<string | null>;
  showTerms: boolean;
  setShowTerms: (show: boolean) => void;
}

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

export default function LocationPicker({
  location,
  setLocation,
  detectionMethod,
  setDetectionMethod,
  setError,
  termsAccepted,
  setTermsAccepted,
  agency,
  geoLoading,
  autoFillLocation,
  showTerms,
  setShowTerms
}: LocationPickerProps) {
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapStatus, setMapStatus] = useState<string>('');

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
        setError("No matching place found. Try including your province (e.g., Bacolod City, Negros Occidental).");
      }
    } catch {
      setError("Refinement failed. Please try again or enter manually.");
    }
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
        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-shadow"
        placeholder="e.g. Quezon City, Cebu, Davao (Optional)"
      />
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        We&#39;ll use this to help you find the nearest office.
      </p>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={autoFillLocation}
          disabled={geoLoading}
          className={`text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-orange-500 dark:hover:bg-orange-600 btn-hover-effect ${geoLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {geoLoading ? 'Detecting…' : 'Use my location'}
        </button>
        <button
          onClick={openMapPicker}
          className="text-sm px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 btn-hover-effect"
        >
          Pin on map
        </button>
        <button
          onClick={() => setShowTerms(true)}
          className="text-sm text-gray-500 underline hover:text-brand-primary dark:text-gray-400 transition-colors"
        >
          View Terms
        </button>
      </div>
      {detectionMethod && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {detectionMethod === 'gps' && 'Detected via GPS'}
          {detectionMethod === 'ip' && 'Detected via IP (approximate). If incorrect, refine or type manually.'}
          {detectionMethod === 'manual' && 'Location refined from your input.'}
          {detectionMethod === 'map' && 'Location selected from map.'}
        </p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <input
          id="terms"
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="w-4 h-4 border-gray-300 rounded text-brand-primary focus:ring-brand-primary"
        />
        <label htmlFor="terms" className="text-xs text-gray-500 dark:text-gray-300">
          I agree to Terms & Conditions and allow location access for nearest office suggestions.
        </label>
      </div>
      <div className="mt-4 p-4 rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-sm font-bold text-gray-900 dark:text-orange-300">Quick Links</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {AGENCY_LINKS[agency]?.homepage && (
            <a href={AGENCY_LINKS[agency].homepage} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-full bg-white text-brand-primary border border-gray-100 hover:bg-orange-50 dark:bg-gray-700 dark:text-orange-300 dark:border-gray-600 transition-colors">
              Official Site
            </a>
          )}
          {AGENCY_LINKS[agency]?.locator && (
            <a href={AGENCY_LINKS[agency].locator} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-full bg-white text-brand-primary border border-gray-100 hover:bg-orange-50 dark:bg-gray-700 dark:text-orange-300 dark:border-gray-600 transition-colors">
              Branch Locator
            </a>
          )}
          {AGENCY_LINKS[agency]?.appointment && (
            <a href={AGENCY_LINKS[agency].appointment} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-full bg-white text-brand-primary border border-gray-100 hover:bg-orange-50 dark:bg-gray-700 dark:text-orange-300 dark:border-gray-600 transition-colors">
              Appointment
            </a>
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
                className="text-white bg-brand-primary hover:bg-brand-secondary font-medium rounded-lg text-sm px-4 py-2"
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
                className="text-white bg-brand-primary hover:bg-brand-secondary font-medium rounded-lg text-sm px-4 py-2 btn-hover-effect"
              >
                Use this location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
