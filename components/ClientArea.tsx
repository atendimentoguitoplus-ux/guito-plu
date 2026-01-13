
import React, { useState, useEffect } from 'react';
import { 
  User, 
  LogOut, 
  Tv, 
  ShieldCheck, 
  Hash,
  X,
  CreditCard,
  LifeBuoy,
  Bell,
  AlertTriangle,
  Info,
  Loader2,
  RefreshCcw,
  Play,
  Share2,
  Trophy,
  Crown,
  Key,
  Lock,
  Star
} from 'lucide-react';
import { ContentItem, Notification, UserData } from '../types';
import { supabase, isProduction } from '../supabaseClient';

interface ClientAreaProps {
  user: UserData;
  releases?: ContentItem[];
  referralDays?: number;
  onLogout: () => void;
  onClose: () => void;
}

const ClientArea: React.FC<ClientAreaProps> = ({ user, releases = [], referralDays = 7, onLogout, onClose }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'notifications'>('home');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [subscriberOnlyContent, setSubscriberOnlyContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    fetchUserNotifications();
    fetchSubscriberContent();
  }, []);

  const fetchUserNotifications = async () => {
    setLoadingNotifications(true);
    try {
      if (!isProduction) {
        setNotifications([{ id: '1', title: '🎉 Bem-vindo!', message: 'Aproveite o Guito Plus VIP.', type: 'info', created_at: new Date().toISOString() }]);
        setHasUnread(true); setLoadingNotifications(false); return;
      }
      const { data } = await supabase.from('notifications').select('*').or(`target_user_id.is.null,target_user_id.eq.${user.id}`).order('created_at', { ascending: false });
      setNotifications(data || []);
      if (data && data.length > 0) setHasUnread(true);
    } catch (err) { console.error(err); } finally { setLoadingNotifications(false); }
  };

  const fetchSubscriberContent = async () => {
    if (!isProduction) return;
    try {
      // Busca conteúdos que são exclusivos para assinantes logados
      const { data } = await supabase.from('content').select('*').eq('is_subscriber_only', true).limit(15);
      if (data && data.length > 0) {
        setSubscriberOnlyContent(data);
      }
    } catch (err) { console.error(err); }
  };

  const handleIndicate = () => {
    const text = `Ei! Estou usando o Guito Plus e a qualidade é incrível. 🎬\n\nUse meu código: *${user.id}* e ganhe ${referralDays} dias de bônus!\n\nChame o suporte: https://wa.me/5598982804577`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const renewalUrl = user.renewal_link || `https://wa.me/5598982804577?text=Quero+renovar+meu+acesso+Guito+Plus+(ID:+${user.id})`;

  // Fallback para conteúdo caso a busca de exclusivos falhe ou seja modo demo
  const displayContent = subscriberOnlyContent.length > 0 ? subscriberOnlyContent : releases;

  if (user.status === 'inactive') {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" />
        <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-red-600/30 rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in">
          <div className="w-24 h-24 bg-red-600/10 border border-red-600/20 rounded-full flex items-center justify-center mx-auto mb-10 text-red-600"><Lock size={40} /></div>
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Acesso <span className="text-red-600">Suspenso</span></h2>
          <p className="text-gray-400 text-lg mb-10">Regularize sua assinatura para voltar a curtir o Guito Plus.</p>
          <div className="space-y-4">
            <a href={renewalUrl} target="_blank" className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all"><RefreshCcw size={20} /> Renovar Agora</a>
            <button onClick={onLogout} className="w-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white py-5 rounded-[2rem] font-black text-[10px] uppercase border border-white/5">Encerrar Sessão</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-6xl h-full sm:h-[90vh] bg-[#0d0d0d] sm:glass rounded-none sm:rounded-[2.5rem] border-0 sm:border border-white/10 overflow-hidden flex flex-col lg:flex-row animate-in fade-in zoom-in duration-500 shadow-2xl">
        
        {/* Sidebar */}
        <div className="w-full lg:w-72 bg-black/40 border-b lg:border-r border-white/5 p-8 shrink-0 flex flex-col">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-xl"><User className="text-white" /></div>
            <div className="text-left">
              <h2 className="font-black text-sm leading-none truncate max-w-[140px] uppercase text-white">{user.name}</h2>
              <span className="text-[9px] text-red-500 uppercase tracking-widest font-black mt-1 flex items-center gap-1"><Hash size={9} /> {user.id}</span>
            </div>
          </div>
          <nav className="flex-1 space-y-2 text-left">
            <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-xs uppercase transition-all ${activeTab === 'home' ? 'bg-red-600 text-white shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}><Tv size={18} /> Painel Geral</button>
            <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-black text-xs uppercase transition-all ${activeTab === 'notifications' ? 'bg-red-600 text-white shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <div className="flex items-center gap-3"><Bell size={18} /> Notificações</div>
              {hasUnread && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
            </button>
          </nav>
          <button onClick={onLogout} className="mt-8 flex items-center gap-2 text-red-500 font-black uppercase text-[10px] tracking-widest hover:text-red-400 transition-all p-2 w-full"><LogOut size={18} /> Encerrar Sessão</button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-14 custom-scrollbar bg-[#050505] text-left">
          <header className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black mb-2 text-white tracking-tighter uppercase">{activeTab === 'home' ? `BEM-VINDO!` : 'AVISOS'}</h1>
              <div className="flex items-center gap-3">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2"><Crown size={12} className="text-amber-500" /> {user.plan}</p>
                 <span className="w-1 h-1 rounded-full bg-gray-800" />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Status Online</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-600 rounded-2xl transition-all text-gray-500 hover:text-white shadow-xl"><X size={24} /></button>
          </header>

          {activeTab === 'home' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              
              {/* BANNER VIP PERSONALIZADO */}
              {user.custom_banner_url ? (
                <div className="w-full aspect-[21/9] sm:aspect-[21/6] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                   <img src={user.custom_banner_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" alt="Banner VIP" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                   <div className="absolute bottom-8 left-10">
                      <div className="bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 inline-block shadow-xl">Experiência VIP</div>
                      <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">Acesso Master Ativo</h2>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-red-600/20 to-black/40 p-10 rounded-[2.5rem] border border-red-600/20 shadow-xl relative overflow-hidden group">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Assinatura Ativa</p>
                    <h3 className="text-xl sm:text-2xl font-black mb-8 text-white tracking-tight">Vencimento: <span className="text-red-600">{user.expiry}</span></h3>
                    <a href={renewalUrl} target="_blank" className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"><RefreshCcw size={18} /> Renovar Acesso</a>
                  </div>
                  <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Fale Conosco</p>
                      <h3 className="text-xl font-black mb-2 text-white uppercase tracking-tighter">Suporte 24h</h3>
                    </div>
                    <a href="https://wa.me/5598982804577" target="_blank" className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-3 border border-white/10 transition-all"><LifeBuoy size={18} /> Chamar Atendente</a>
                  </div>
                </div>
              )}

              {/* CONTEÚDO EXCLUSIVO - FIX DAS CAPAS */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-black flex items-center gap-3 text-white uppercase tracking-tighter">
                    <Crown className="text-amber-500" size={24} /> 
                    Catálogo VIP Exclusivo
                  </h2>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 bg-white/5 px-3 py-1 rounded-full">4K HDR</span>
                </div>
                
                <div className="flex gap-5 overflow-x-auto pb-6 px-2 hide-scrollbar snap-x snap-mandatory">
                  {displayContent.map((item) => (
                    <div key={item.id} className="min-w-[170px] sm:min-w-[210px] aspect-[2/3] relative rounded-3xl overflow-hidden group snap-start border border-white/5 hover:border-red-600/50 transition-all cursor-pointer bg-zinc-900 shadow-2xl">
                      {/* Lógica de Renderização da Capa com Fallback */}
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                        loading="lazy"
                        onError={(e) => { 
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                      
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        <span className="bg-amber-500 text-black text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter flex items-center gap-1"><Crown size={8}/> VIP</span>
                        <span className="bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter flex items-center gap-1"><Star size={8} fill="currentColor" className="text-yellow-500"/> {item.rating}</span>
                      </div>

                      <div className="absolute bottom-0 left-0 p-5 w-full">
                        <p className="text-[11px] font-black text-white truncate drop-shadow-2xl uppercase tracking-tight mb-2">{item.title}</p>
                        <button className="flex items-center gap-2 bg-red-600/90 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                           <Play size={10} fill="currentColor" /> Assistir
                        </button>
                      </div>
                    </div>
                  ))}
                  {displayContent.length === 0 && (
                    <div className="w-full py-20 text-center border border-dashed border-white/5 rounded-[2rem] text-gray-600 uppercase font-black text-xs tracking-widest">Nenhum conteúdo exclusivo no momento</div>
                  )}
                </div>
              </div>

              {/* DADOS DE ACESSO */}
              <div className="bg-black/40 rounded-[3rem] p-10 border border-white/5 shadow-inner">
                <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tighter"><Key className="text-red-600" size={24} /> Configuração do Player</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-3">Login / ID Único</p>
                    <p className="font-mono text-xs font-bold text-white bg-black/40 p-4 rounded-xl border border-white/5 truncate">{user.id}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-3">Servidor Principal</p>
                    <p className="font-mono text-xs font-bold text-white bg-black/40 p-4 rounded-xl border border-white/5 truncate">plus.guitoserve.tv</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-3">Modo de Conexão</p>
                    <p className="font-mono text-xs font-bold text-white bg-black/40 p-4 rounded-xl border border-white/5 truncate">XC Connect / M3U8</p>
                  </div>
                </div>
              </div>

              {/* INDIQUE E GANHE */}
              <div className="bg-gradient-to-r from-amber-600/10 via-black to-black border border-amber-600/20 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                  <div className="space-y-4 max-w-xl">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                       <div className="p-3 bg-amber-600 rounded-2xl text-white shadow-xl"><Trophy size={24} /></div>
                       <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Programa de Indicação</h2>
                    </div>
                    <p className="text-gray-400 font-medium text-lg leading-relaxed">Ganhe <span className="text-amber-500 font-black">{referralDays} dias de bônus</span> por cada amigo que assinar usando seu código de ID!</p>
                  </div>
                  <button onClick={handleIndicate} className="w-full lg:w-auto bg-amber-600 hover:bg-amber-700 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"><Share2 size={20} /> Indicar Agora</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in text-left">
              {loadingNotifications ? (
                <div className="flex flex-col items-center justify-center py-24 gap-6"><Loader2 className="animate-spin text-red-600" size={40} /></div>
              ) : notifications.length === 0 ? (
                <div className="bg-white/5 rounded-[3rem] p-20 text-center border border-white/5">
                   <Bell size={40} className="text-gray-800 mx-auto mb-6" />
                   <h4 className="text-xl font-black text-white mb-2 uppercase text-center">Tudo Limpo por Aqui</h4>
                   <p className="text-gray-600 text-sm text-center font-bold uppercase tracking-widest">Nenhum aviso pendente no momento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((n) => (
                    <div key={n.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.08] transition-all">
                       <div className="flex items-start gap-8">
                          <div className={`p-5 rounded-[1.5rem] shrink-0 ${n.type === 'alert' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                             {n.type === 'alert' ? <AlertTriangle size={28} /> : <Info size={28} />}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-3">
                                <h4 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{n.title}</h4>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{new Date(n.created_at!).toLocaleDateString('pt-BR')}</span>
                             </div>
                             <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{n.message}</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E50914; }
      `}`}</style>
    </div>
  );
};

export default ClientArea;
