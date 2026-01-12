
import React from 'react';
import { PlayCircle, Instagram, Facebook, Youtube, Twitter, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const whatsappUrl = "https://wa.me/5598982804577?text=Olá! Gostaria de um teste grátis do Guito Plus.";

  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/5" aria-label="Rodapé">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-red-600 p-1.5 rounded-lg">
                <PlayCircle className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tighter text-white">
                GUITO <span className="text-red-600">PLUS</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              A melhor plataforma de IPTV do Brasil. Conteúdo de qualidade, 
              estabilidade garantida e o melhor suporte técnico para você e sua família.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="bg-white/5 hover:bg-red-600 p-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 text-white"><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook" className="bg-white/5 hover:bg-red-600 p-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 text-white"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter" className="bg-white/5 hover:bg-red-600 p-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 text-white"><Twitter size={20} /></a>
              <a href="#" aria-label="Youtube" className="bg-white/5 hover:bg-red-600 p-3 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 text-white"><Youtube size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-red-600">Navegação</h4>
            <ul className="space-y-4 text-gray-300">
              <li><a href="#home" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md px-1">Início</a></li>
              <li><a href="#releases" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md px-1">Lançamentos</a></li>
              <li><a href="#plans" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md px-1">Planos e Preços</a></li>
              <li><a href="#cartoons" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md px-1">Infantil</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-red-600">Suporte</h4>
            <ul className="space-y-4 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md px-1">Perguntas Frequentes</a></li>
              <li><a href="#" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md px-1">Tutoriais de Instalação</a></li>
              <li><a href={whatsappUrl} target="_blank" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md px-1">Teste Grátis</a></li>
              <li><a href="#" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md px-1">Status do Servidor</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-red-600">Newsletter</h4>
            <p className="text-gray-400 mb-6 text-sm">Receba avisos de novos filmes e promoções exclusivas.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                aria-label="E-mail para newsletter"
                type="email" 
                placeholder="Seu e-mail" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 text-white placeholder:text-gray-500"
              />
              <button 
                type="submit"
                aria-label="Inscrever-se na newsletter"
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>© 2024 Guito Plus. Todos os direitos reservados.</p>
            {onAdminClick && (
              <button 
                onClick={onAdminClick}
                className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-gray-700 hover:text-red-600 transition-colors"
              >
                <ShieldAlert size={12} /> Painel Administrativo
              </button>
            )}
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md px-1">Políticas de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md px-1">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
