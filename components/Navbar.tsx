
import React, { useState, useEffect } from 'react';
import { PlayCircle, User, ChevronRight, LogIn } from 'lucide-react';
import LoginModal from './LoginModal';

interface NavbarProps {
  isLoggedIn: boolean;
  onOpenClientArea: () => void;
  onLogin: (user: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onOpenClientArea, onLogin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Catálogo', href: '#releases' },
    { name: 'Kids', href: '#cartoons' },
    { name: 'Planos', href: '#plans' },
    { name: 'Contato', href: '#contact' },
  ];

  return (
    <>
      <nav 
        aria-label="Navegação Principal"
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out h-20 md:h-24 flex items-center ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
            : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-10 flex items-center justify-between">
          {/* Logo Section */}
          <a href="#home" className="flex items-center gap-3 group cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-xl p-1" aria-label="Guito Plus Home">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600 blur-md opacity-40 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-red-600 p-2 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                <PlayCircle className="text-white w-5 h-5 md:w-6 md:h-6" fill="white" />
              </div>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-lg md:text-2xl font-black tracking-tighter text-white">
                GUITO <span className="text-red-600">PLUS</span>
              </span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 group-hover:text-red-500 transition-colors">
                Premium Streaming
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative text-[11px] uppercase tracking-[0.2em] font-bold text-gray-300 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-lg px-2 py-1"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            
            <div className="h-8 w-px bg-white/10 mx-2" aria-hidden="true"></div>
            
            <div className="flex items-center gap-5">
              {isLoggedIn ? (
                <button 
                  onClick={onOpenClientArea}
                  className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-lg px-3 py-2"
                >
                  <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/50 flex items-center justify-center">
                    <User size={14} className="text-red-500" />
                  </div>
                  Painel VIP
                </button>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-lg px-3 py-2"
                >
                  <LogIn size={16} className="text-red-600 group-hover:scale-110 transition-transform" /> 
                  Entrar
                </button>
              )}
              
              <button className="relative overflow-hidden bg-red-600 text-white px-7 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                <span className="relative z-10">Assine Agora</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" aria-hidden="true"></div>
              </button>
            </div>
          </div>

          {/* Mobile Actions & Toggle */}
          <div className="flex items-center gap-1 lg:hidden">
             <button 
               onClick={isLoggedIn ? onOpenClientArea : () => setIsLoginModalOpen(true)}
               className="text-white p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-full hover:bg-white/5 transition-colors" 
               aria-label={isLoggedIn ? "Área do Cliente" : "Login"}
             >
                <User size={20} className={isLoggedIn ? "text-red-500" : "text-gray-400"} />
             </button>
             
             <button 
              className={`relative z-[110] w-12 h-12 rounded-xl transition-all duration-500 flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isMenuOpen ? 'bg-red-600 shadow-lg' : 'bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Fechar Menu" : "Abrir Menu"}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-white rounded-full transition-all duration-300 transform origin-left ${isMenuOpen ? 'rotate-[42deg] translate-x-1' : ''}`}></span>
                <span className={`h-0.5 w-full bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`}></span>
                <span className={`h-0.5 w-full bg-white rounded-full transition-all duration-300 transform origin-left ${isMenuOpen ? '-rotate-[42deg] translate-x-1' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Modern Mobile Menu Overlay */}
      <div 
        id="mobile-menu"
        className={`fixed inset-0 z-[90] lg:hidden transition-all duration-700 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
        
        <div className={`absolute right-0 top-0 h-full w-[80%] max-w-[320px] bg-[#0d0d0d] border-l border-white/5 shadow-2xl flex flex-col p-6 pt-24 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col gap-1">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between text-xl font-bold text-white hover:text-red-600 transition-all py-4 px-2 border-b border-white/5 group focus-visible:outline-none focus-visible:bg-white/5 rounded-lg ${
                  isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${150 + idx * 75}ms` }}
              >
                {link.name}
                <ChevronRight size={18} className="text-red-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </a>
            ))}
          </div>

          <div className="mt-auto space-y-3 pb-6">
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                isLoggedIn ? onOpenClientArea() : setIsLoginModalOpen(true);
              }}
              className="w-full py-4 rounded-xl bg-white/5 text-white text-sm font-bold flex items-center justify-center gap-2 border border-white/10"
            >
              <User size={16} className="text-red-600" /> {isLoggedIn ? 'Meu Painel VIP' : 'Área do Cliente'}
            </button>
            <button className="w-full py-5 rounded-xl bg-red-600 text-white text-sm font-black uppercase tracking-widest shadow-[0_10px_25px_rgba(220,38,38,0.3)]">
              Assinar Agora
            </button>
          </div>
        </div>
      </div>

      {isLoginModalOpen && (
        <LoginModal 
          onClose={() => setIsLoginModalOpen(false)} 
          onLogin={(userData) => {
            onLogin(userData);
            setIsLoginModalOpen(false);
          }} 
        />
      )}
    </>
  );
};

export default Navbar;
