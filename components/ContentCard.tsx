
import React from 'react';
import { Star, Play, Plus } from 'lucide-react';
import { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  onClick: (item: ContentItem) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onClick }) => {
  return (
    <div 
      onClick={() => onClick(item)}
      className="group relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/5 bg-[#0a0a0a]"
    >
      <img 
        src={item.image_url} 
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Overlay Layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
      
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        {item.is_new && (
          <span className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
            New
          </span>
        )}
        <span className="bg-black/60 backdrop-blur-md text-white/80 text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-white/10">
          4K HDR
        </span>
      </div>

      {/* Info on Hover/Always */}
      <div className="absolute bottom-0 left-0 p-4 sm:p-5 w-full">
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-white/60 mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
          <span className="text-yellow-500 flex items-center gap-1">
            <Star size={10} fill="currentColor" /> {item.rating}
          </span>
          <span>•</span>
          <span>{item.year}</span>
        </div>
        
        <h3 className="text-sm sm:text-lg font-black text-white leading-tight mb-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 truncate">
          {item.title}
        </h3>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <button className="flex-1 bg-white text-black py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-red-600 hover:text-white transition-colors">
            <Play size={12} fill="currentColor" /> Assistir
          </button>
          <button className="p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl border border-white/10 transition-colors hidden sm:block">
            <Plus size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
