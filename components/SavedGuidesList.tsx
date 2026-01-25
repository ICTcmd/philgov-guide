import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';

interface SavedGuide {
  agency: string;
  action: string;
  result: string;
  date: number;
}

interface SavedGuidesListProps {
  guides: SavedGuide[];
  onSelect: (guide: SavedGuide) => void;
  onDelete: (guide: SavedGuide) => void;
}

export default function SavedGuidesList({ guides, onSelect, onDelete }: SavedGuidesListProps) {
  if (guides.length === 0) return null;

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
       <div className="flex items-center justify-between mb-2">
         <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide flex items-center gap-1">
           <Bookmark className="w-3 h-3" /> Saved Guides
         </p>
         <span className="text-xs text-gray-400">{guides.length} items</span>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
         {guides.map((guide, idx) => (
           <div key={idx} className="group relative flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-green-200 transition-all dark:bg-gray-800 dark:border-gray-700">
             <button 
               onClick={() => onSelect(guide)}
               className="flex-1 text-left flex items-center gap-3 pr-8"
             >
               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30 dark:text-green-400">
                 <Bookmark className="w-5 h-5" />
               </div>
               <div className="overflow-hidden">
                 <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{guide.action}</p>
                 <p className="text-xs text-gray-500 truncate">{guide.agency} • {new Date(guide.date).toLocaleDateString()}</p>
               </div>
             </button>
             <button 
               onClick={(e) => { e.stopPropagation(); onDelete(guide); }}
               className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
               title="Remove from Library"
             >
               <Trash2 className="w-4 h-4" />
             </button>
           </div>
         ))}
       </div>
    </div>
  );
}
