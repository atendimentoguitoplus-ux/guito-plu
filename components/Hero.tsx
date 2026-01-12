
import React from 'react';
import { Play, Sparkles, ChevronDown, Info } from 'lucide-react';

const Hero: React.FC = () => {
  const handleTestRequest = () => {
    const message = "Olá! Gostaria de solicitar um teste grátis de 6 horas no Guito Plus.";
    const whatsappUrl = `https://wa.me/5598982804577?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="home" className="relative min-h-[95vh] md:min-h-screen w-full overflow-hidden flex items-center">
      {/* Background Cinematic con Parallax Effect (simulated) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2500&auto=format&fit=crop" 
          alt="Guito Plus Banner" 
          className="w-full h-full object-cover scale-110 animate-ken-burns"
        />
        {/* Layered Overlays for Depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(229,9,20,0.15),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl space-y-6 md:space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#E50914]" />
            <span className="text-[10px] md:text-xs font-black text-white/80 uppercase tracking-[0.2em]">
              Servidor VIP • Ultra HD 4K Ativado
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter text-white">
            EXPERIÊNCIA <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-red-800 drop-shadow-2xl">
              SEM LIMITES.
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-300/90 leading-relaxed max-w-2xl font-medium">
            Esqueça o IPTV comum. O <span className="text-white font-bold">Guito Plus</span> entrega estabilidade absoluta e o catálogo mais atualizado do Brasil direto na sua TV.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative flex items-center justify-center gap-3 bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-red-700 hover:scale-105 active:scale-95 glow-red overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Play fill="white" size={18} /> Assine Agora
            </button>
            <button 
              onClick={handleTestRequest}
              className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
            >
              <Info size={18} /> Teste 6 Horas
            </button>
          </div>
          
          <div className="flex items-center gap-6 pt-8 border-t border-white/5 max-w-fit">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white">45k+</span>
              <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Canais & Filmes</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white">99.9%</span>
              <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Uptime Real</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
        <ChevronDown size={28} />
      </div>

      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-ken-burns { animation: ken-burns 30s infinite alternate linear; }
        .animate-fade-in-up { animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </section>
  );
};

export default Hero;
