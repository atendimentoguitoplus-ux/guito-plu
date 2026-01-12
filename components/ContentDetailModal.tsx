
import React from 'react';
import { X, Play, Star, Calendar, Users, Info } from 'lucide-react';
import { ContentItem } from '../types';

interface ContentDetailModalProps {
  item: ContentItem;
  onClose: () => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#0d0d0d] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(220,38,38,0.1)] flex flex-col md:flex-row animate-in zoom-in slide-in-from-bottom-4 duration-500 max-h-[90vh]">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-white/50 hover:text-white bg-black/50 rounded-full md:hidden"
        >
          <X size={20} />
        </button>

        {/* Poster Image */}
        <div className="relative w-full md:w-1/3 aspect-[2/3] md:aspect-auto">
          <img 
            src={item.image_url} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-transparent to-transparent" />
        </div>

        {/* Content Details */}
        <div className="flex-1 p-8 sm:p-12 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <span className="bg-red-600/10 text-red-500 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-red-600/20 tracking-wider">
                   {item.category}
                 </span>
                 {item.is_new && (
                   <span className="bg-white/10 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded border border-white/20 tracking-wider">
                     Novo
                   </span>
                 )}
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-none tracking-tight">{item.title}</h2>
            </div>
            
            <button 
              onClick={onClose}
              className="hidden md:flex p-2 text-gray-500 hover:text-white bg-white/5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-bold text-gray-400">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500" fill="currentColor" />
              <span className="text-white">{item.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{item.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Info size={16} />
              <span className="uppercase">Ultra HD 4K</span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="mb-8">
            <h3 className="text-xs uppercase font-black tracking-widest text-red-600 mb-3">Sinopse</h3>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
              {item.synopsis || "Uma emocionante jornada de descobertas e desafios que prende a atenção do início ao fim. Prepare-se para uma experiência cinematográfica única no Guito Plus."}
            </p>
          </div>

          {/* Cast */}
          <div className="mb-10">
            <h3 className="text-xs uppercase font-black tracking-widest text-red-600 mb-4 flex items-center gap-2">
              <Users size={14} /> Elenco Principal
            </h3>
            <div className="flex flex-wrap gap-3">
              {(item.movie_cast || ['Ator Principal', 'Atriz Principal', 'Coadjuvante']).map((actor, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:border-white/10 transition-all cursor-default">
                  {actor}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(220,38,38,0.3)] active:scale-95">
              <Play size={20} fill="currentColor" /> Assista Agora
            </button>
            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-3">
              Adicionar à Lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailModal;
