import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { 
  Download, 
  Copy, 
  ExternalLink, 
  Clock, 
  CreditCard, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  Circle, 
  Bookmark, 
  Share2, 
  Globe,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AGENCY_LINKS } from '@/lib/constants';

interface ResultCardProps {
  result: string;
  agency: string;
  action: string;
  location?: string;
  isMock: boolean;
  onGuideUpdate?: () => void;
  generatedAt?: number;
}

export default function ResultCard({ result, agency, action, location, isMock, onGuideUpdate, generatedAt }: ResultCardProps) {
  const [checklist, setChecklist] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Regex to find the requirements section. Matches variants like:
  // **📋 Requirements Checklist**
  // **Requirements Checklist**
  // **Requirements**
  // **Mga Kailangan**
  // **Documents Needed**
  // Case insensitive, optional emoji
  const checklistRegex = /\*\*(?:📋|📝)?\s*(?:Requirements|Checklist|Mga Kailangan|Requirements Checklist|Mga Requirement|Documents Needed)\s*\*\*([\s\S]*?)(?=\*\*|$)/i;

  // Parse checklist from AI response
  useEffect(() => {
    const checklistMatch = result.match(checklistRegex);
    if (checklistMatch) {
      const items = checklistMatch[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('•') || line.match(/^\d+\./)) // Accept bullets or numbered lists
        .map(line => line.replace(/^•|^\d+\./, '').trim()); // Clean up
      
      if (items.length > 0) {
        setChecklist(items);
        // Load checked state from local storage if available for this specific guide? 
        // For now, just reset. Complexity of per-guide state is high.
        setCheckedItems(new Array(items.length).fill(false));
      }
    }
    
    // Check if already saved
    const saved = localStorage.getItem('savedGuides');
    if (saved) {
      const guides = JSON.parse(saved);
      const exists = guides.some((g: any) => g.agency === agency && g.action === action);
      setIsSaved(exists);
    }
  }, [result, agency, action]);

  const toggleCheckbox = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  const progress = checklist.length > 0 
    ? Math.round((checkedItems.filter(Boolean).length / checklist.length) * 100) 
    : 0;

  const handleSave = () => {
    const saved = localStorage.getItem('savedGuides');
    let guides = saved ? JSON.parse(saved) : [];
    
    if (isSaved) {
      // Remove
      guides = guides.filter((g: any) => !(g.agency === agency && g.action === action));
      setIsSaved(false);
    } else {
      // Add
      guides.unshift({
        agency,
        action,
        result,
        date: Date.now()
      });
      setIsSaved(true);
    }
    localStorage.setItem('savedGuides', JSON.stringify(guides));
    if (onGuideUpdate) onGuideUpdate();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Guide: ${agency} - ${action}`,
          text: `Check out this guide for ${action} at ${agency} via Bago App!`,
          url: window.location.href
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      copyToClipboard();
    }
  };

  const linkify = (text: string) => {
    // Safety Filter: Hide the "Follow-up Questions" section
    const displaySafeText = text.replace(/(?:[\?❓].*Follow-up Questions|Questions|Tanong|Mga Tanong).*?(:)?([\s\S]*)$/i, '');

    // Hide Checklist from main text if we extracted it successfully
    const finalDisplay = checklist.length > 0 
      ? displaySafeText.replace(/\*\*📋 Requirements Checklist\*\*([\s\S]*?)(?=\*\*|$)/, '') 
      : displaySafeText;

    const parts = finalDisplay.split(/\n/);
    return parts.map((line, i) => {
      // Skip empty lines that might result from the replace
      if (!line.trim()) return null;

      const tokens = line.split(/(\*\*.*?\*\*|https?:\/\/\S+|www\.\S+)/g);
      return (
        <p key={i} className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
          {tokens.map((t, j) => {
            if (t.match(/^(https?:\/\/|www\.)/)) {
              const href = t.startsWith('www.') ? `https://${t}` : t;
              return (
                <a key={j} href={href} target="_blank" rel="noopener noreferrer" className="text-brand-primary font-medium hover:underline break-all">
                  {t}
                </a>
              );
            } else if (t.startsWith('**') && t.endsWith('**')) {
              return (
                <strong key={j} className="font-bold text-brand-primary dark:text-blue-300">
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

  const downloadPdf = () => {
    const doc = new jsPDF();
    
    // Add Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Brand Blue (Blue-600)
    doc.text("BAGO APP Reference", 20, 20);
    
    // Add Subheader
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`${agency} - ${action}`, 20, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 38);
    
    // Add Content
    doc.setFontSize(11);
    doc.setTextColor(0);
    
    const cleanText = result.replace(/\*\*|###/g, '');
    const splitText = doc.splitTextToSize(cleanText, 170);
    doc.text(splitText, 20, 55);
    
    // Add Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Generated by BAGO APP - Verify with official sources.", 20, pageHeight - 10);
    
    doc.save(`BAGO-APP-${agency.replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Main Title Header */}
      <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-white flex items-center gap-2">
          {agency} <span className="text-gray-400 font-light">|</span> <span className="text-gray-700 dark:text-gray-300">{action}</span>
        </h2>
        {generatedAt && (
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" /> 
            Last Updated: {new Date(generatedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Sidebar: Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="bg-brand-primary p-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                Quick Info
              </h3>
            </div>
            <div className="p-5 space-y-4 bg-orange-50/50 dark:bg-gray-800/50">
              
              {(AGENCY_LINKS[agency]?.appointment || AGENCY_LINKS[agency]?.homepage) && (
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-brand-primary mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Online Services</p>
                    <a 
                      href={AGENCY_LINKS[agency]?.appointment || AGENCY_LINKS[agency]?.homepage} 
                      target="_blank" 
                      className="text-sm font-bold text-brand-primary hover:underline block"
                    >
                      {AGENCY_LINKS[agency]?.appointment ? 'Apply / Book Online' : 'Official Website'}
                    </a>
                    <span className="text-xs text-gray-400 block mt-1">External Link</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-primary mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Estimated Time</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Varies (Check Guide)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-brand-primary mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Processing Fee</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">See Requirements</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-primary mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nearest Office</p>
                  {location ? (
                    <a 
                      href={`https://www.google.com/maps/search/${encodeURIComponent(`nearest ${agency} to ${location}`)}`} 
                      target="_blank" 
                      className="text-sm font-bold text-brand-primary hover:underline block"
                    >
                      View Map in {location}
                    </a>
                  ) : (
                    <a 
                      href={`https://www.google.com/maps/search/${encodeURIComponent(`nearest ${agency}`)}`} 
                      target="_blank" 
                      className="text-sm font-bold text-brand-primary hover:underline block"
                    >
                      Find Nearest Branch
                    </a>
                  )}
                  <span className="text-xs text-gray-400 block mt-1">Opens Google Maps</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-brand-primary mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Who Can Apply</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Eligible Citizens</p>
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {(AGENCY_LINKS[agency]?.appointment || AGENCY_LINKS[agency]?.homepage) && (
              <button
                onClick={() => window.open(AGENCY_LINKS[agency]?.appointment || AGENCY_LINKS[agency]?.homepage, '_blank')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold hover:bg-blue-200 shadow-sm dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 btn-hover-effect"
              >
                <Globe className="w-4 h-4" />
                Apply Online
              </button>
            )}

            <button
              onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(location ? `nearest ${agency} to ${location}` : `nearest ${agency}`)}`, '_blank')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-orange-100 text-orange-700 border border-orange-200 rounded-lg font-bold hover:bg-orange-200 shadow-sm dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800 btn-hover-effect"
            >
              <MapPin className="w-4 h-4" />
              {location ? `Locate in ${location}` : 'Find Nearest Branch'}
            </button>

            <button
              onClick={handleSave}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold shadow-sm transition-all ${
                isSaved 
                  ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved to Library' : 'Save Guide'}
            </button>

            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 btn-hover-effect"
            >
              <Share2 className="w-4 h-4" />
              Share Guide
            </button>

            <button
              onClick={downloadPdf}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 btn-hover-effect"
            >
              <Download className="w-4 h-4" />
              Download PDF Guide
            </button>
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 btn-hover-effect"
            >
              <Copy className="w-4 h-4" />
              Copy to Clipboard
            </button>
            <button
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`${agency} ${action} requirements Philippines ${new Date().getFullYear()}`)}`, '_blank')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-secondary shadow-md btn-hover-effect"
            >
              <ExternalLink className="w-4 h-4" />
              Verify on Google
            </button>
          </div>
        </div>

        {/* Right Column: Main Guide Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 dark:bg-gray-800 dark:border-gray-700">
             
             {/* Interactive Checklist Widget */}
             {checklist.length > 0 && (
               <div className="mb-8 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl p-6 animate-in fade-in zoom-in duration-500">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                     <span className="text-xl">📋</span> Interactive Checklist
                   </h3>
                   <span className="text-xs font-bold px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-orange-600 border border-orange-200 dark:border-gray-600">
                     {progress}% Ready
                   </span>
                 </div>
                 
                 {/* Progress Bar */}
                 <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700">
                   <div 
                    className="bg-orange-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                   ></div>
                 </div>

                 <div className="space-y-3">
                   {checklist.map((item, idx) => (
                     <button 
                       key={idx}
                       onClick={() => toggleCheckbox(idx)}
                       className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-all border ${
                         checkedItems[idx] 
                           ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                           : 'bg-white border-gray-100 hover:border-orange-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
                       }`}
                     >
                       <div className={`mt-0.5 flex-shrink-0 transition-colors ${checkedItems[idx] ? 'text-green-500' : 'text-gray-300'}`}>
                         {checkedItems[idx] ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                       </div>
                       <span className={`text-sm transition-all ${checkedItems[idx] ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-gray-200 font-medium'}`}>
                         {item}
                       </span>
                     </button>
                   ))}
                 </div>
               </div>
             )}

             <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm">1</span>
                  Follow These Steps
                </h3>
             </div>
             
             <div className="prose prose-blue max-w-none dark:prose-invert">
                {linkify(result)}
             </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 flex gap-3 dark:bg-yellow-900/20 dark:border-yellow-900 dark:text-yellow-200">
             <span className="font-bold text-xl">⚠</span>
             <p>
               <strong>Disclaimer:</strong> This guide is generated by AI and may not reflect the very latest policy changes. Always verify with the official {agency} website or office.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
