
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Tv, 
  ShieldCheck, 
  ExternalLink, 
  Key,
  Hash,
  X,
  CreditCard,
  LifeBuoy,
  Users,
  Calendar,
  Bell,
  AlertTriangle,
  Info,
  Gift,
  Loader2,
  RefreshCcw,
  ChevronRight,
  MessageSquare,
  Lock,
  PowerOff,
  Sparkles,
  Film,
  Play,
  Share2,
  Trophy
} from 'lucide-react';
import { ContentItem, Notification } from '../types';
import { supabase, isProduction } from '../supabaseClient';

interface ClientAreaProps {
  user: {
    id: string;
    name: string;
    email: string;
    plan: string;
    expiry: string;
    status?: 'active' | 'inactive';
    renewal_link?: string;
  };
  releases?: ContentItem[];
  referralDays?: number;
  onLogout: () => void;
  onClose: () => void;
}

const ClientArea: React.FC<ClientAreaProps> = ({ user, releases = [], referralDays = 7, onLogout, onClose }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'notifications' | 'settings'>('home');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    fetchUserNotifications();
  }, []);

  const fetchUserNotifications = async () => {
    setLoadingNotifications(true);
    try {
      if (!isProduction) {
        setNotifications([
          { id: '1', title: '🎉 Bem-vindo!', message: 'Aproveite o Guito Plus.', type: 'info', created_at: new Date().toISOString() }
        ]);
        setHasUnread(true);
        setLoadingNotifications(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`target_user_id.is.null,target_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
      if (data && data.length > 0) setHasUnread(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleIndicate = () => {
    const text = `Ei! Estou usando o Guito Plus e a qualidade é incrível. 🎬\n\nUse meu código de indicação: *${user.id}* e ganhe ${referralDays} dias de bônus na sua assinatura!\n\nChame o suporte aqui: https://wa.me/5598982804577`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const renewalUrl = user.renewal_link || `https://wa.me/5598982804577?text=Olá! Gostaria de renovar meu acesso Guito Plus (ID: ${user.id}).`;

  if (user.status === 'inactive') {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500" />
        <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-red-600/30 rounded-[3rem] p-12 text-center shadow-[0_0_80px_rgba(220,38,38,0.2)] animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-red-600/10 border border-red-600/20 rounded-full flex items-center justify-center mx-auto mb-10 text-red-600 relative">
            <Lock size={40} />
            <div className="absolute inset-0 bg-red-600/10 blur-xl rounded-full animate-pulse" />
          </div>
          
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Acesso <span className="text-red-600">Suspenso</span></h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 font-medium">
            Olá, {user.name.split(' ')[0]}! Identificamos que sua assinatura expirou ou seu ID foi desativado temporariamente. Regularize agora para voltar a curtir o Guito Plus.
          </p>

          <div className="space-y-4">
            <a href={renewalUrl} target="_blank" className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl shadow-red-600/30">
              <RefreshCcw size={20} /> Renovar Assinatura
            </a>
            <button onClick={onLogout} className="w-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all border border-white/5">
              Encerrar Sessão
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-3 text-gray-600">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Central de Atendimento Segura</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4 md:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-full sm:h-[90vh] bg-[#0d0d0d] sm:glass rounded-none sm:rounded-[2.5rem] border-0 sm:border border-white/10 overflow-hidden flex flex-col lg:flex-row animate-in fade-in zoom-in duration-500 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        
        {/* Sidebar Lateral */}
        <div className="w-full lg:w-72 bg-black/40 border-b lg:border-b-0 lg:border-r border-white/5 p-4 sm:p-8 flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)]">
              <User className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="hidden sm:block text-left">
              <h2 className="font-black text-sm leading-none truncate max-w-[140px] uppercase tracking-tighter">{user.name}</h2>
              <span className="text-[9px] text-red-500 uppercase tracking-widest font-black mt-1 flex items-center gap-1">
                <Hash size={9} /> {user.id}
              </span>
            </div>
          </div>

          <nav className="hidden lg:block space-y-2 mt-12 w-full text-left">
            <button 
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'home' ? 'bg-red-600 text-white shadow-2xl shadow-red-600/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <Tv size={18} /> Painel Geral
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'notifications' ? 'bg-red-600 text-white shadow-2xl shadow-red-600/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                <Bell size={18} /> Notificações
              </div>
              {hasUnread && <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]" />}
            </button>
          </nav>

          <div className="lg:mt-auto flex items-center gap-2">
             <button onClick={onLogout} className="flex items-center gap-2 text-red-500 font-black uppercase text-[10px] tracking-widest hover:text-red-400 transition-all p-2 group">
               <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Encerrar Sessão</span>
             </button>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 md:p-14 custom-scrollbar bg-[#050505]">
          <header className="flex justify-between items-start mb-10 md:mb-14">
            <div className="text-left">
              <h1 className="text-3xl sm:text-5xl font-black mb-2 text-white tracking-tighter uppercase leading-none">
                {activeTab === 'home' ? `OLÁ, ${user.name.split(' ')[0]}` : 'MURAL DE AVISOS'}
              </h1>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                <ShieldCheck size={12} className="text-red-600" /> {activeTab === 'home' ? 'Painel de Controle VIP' : 'Notificações Importantes'}
              </p>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-600 rounded-2xl transition-all text-gray-500 hover:text-white shadow-xl group">
              <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>
          </header>

          {activeTab === 'home' ? (
            <div className="space-y-12 animate-in fade-in duration-700">
              {/* Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                <div className="bg-gradient-to-br from-red-600/20 to-black/40 p-8 rounded-[2.5rem] border border-red-600/20 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-red-600 rounded-2xl text-white"><ShieldCheck size={24} /></div>
                    <span className="bg-red-600 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] text-white">Ativo</span>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Status: {user.plan}</p>
                  <h3 className="text-xl sm:text-2xl font-black mb-6 text-white tracking-tight">Expira em: <span className="text-red-600">{user.expiry}</span></h3>
                  <a href={renewalUrl} target="_blank" className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-red-600/20">
                    <CreditCard size={18} /> Renovar Agora
                  </a>
                </div>

                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-green-600/20 rounded-2xl text-green-500"><LifeBuoy size={24} /></div>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Atendimento VIP</p>
                  <h3 className="text-xl sm:text-2xl font-black mb-6 text-white tracking-tight">Precisa de Ajuda?</h3>
                  <a href="https://wa.me/5598982804577" target="_blank" className="w-full bg-green-600/10 hover:bg-green-600/20 text-green-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 border border-green-600/20 text-center transition-all active:scale-95">
                    WhatsApp Suporte
                  </a>
                </div>
              </div>

              {/* Dados de Acesso */}
              <div className="bg-black/40 rounded-[3rem] p-10 border border-white/5 shadow-inner text-left">
                <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tighter">
                  <Key className="text-red-600" size={24} /> Suas Credenciais
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Login (ID)', value: user.id, icon: Hash },
                    { label: 'Servidor', value: 'plus.guitoserve.tv', icon: Tv },
                    { label: 'Vencimento', value: user.expiry, icon: Calendar },
                  ].map((data, idx) => (
                    <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-3 group">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform"><data.icon size={20} /></div>
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">{data.label}</p>
                        <p className="font-mono text-xs font-bold text-white break-all">{data.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indique e Ganhe */}
              <div className="bg-gradient-to-r from-amber-600/20 via-black to-black border border-amber-600/20 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(217,119,6,0.1)] text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-xl">
                    <div className="flex items-center gap-3">
                       <div className="p-3 bg-amber-600 rounded-2xl text-white shadow-lg shadow-amber-600/30">
                          <Trophy size={24} />
                       </div>
                       <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Indique e Ganhe</h2>
                    </div>
                    <p className="text-gray-400 font-medium text-lg leading-relaxed">
                      Gosta do <span className="text-white font-bold">Guito Plus</span>? Indique um amigo e ganhe <span className="text-amber-500 font-black">{referralDays} dias grátis</span> em sua mensalidade por cada indicação ativa!
                    </p>
                  </div>
                  <button 
                    onClick={handleIndicate}
                    className="w-full lg:w-auto bg-amber-600 hover:bg-amber-700 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-600/20 group-hover:scale-105 active:scale-95"
                  >
                    <Share2 size={20} /> Indicar via WhatsApp
                  </button>
                </div>
              </div>

              {/* Banner de Novos Conteúdos */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black flex items-center gap-3 text-white uppercase tracking-tighter">
                    <Sparkles className="text-red-600" size={24} /> Novidades no Catálogo
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Recém Adicionados</span>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
                  {releases.slice(0, 6).map((item) => (
                    <div key={item.id} className="min-w-[160px] sm:min-w-[200px] aspect-[2/3] relative rounded-3xl overflow-hidden group snap-start border border-white/5 hover:border-red-600/30 transition-all cursor-pointer">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {item.is_new && <span className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Novo</span>}
                        <span className="bg-black/60 backdrop-blur-md text-white/80 text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tighter border border-white/10">4K</span>
                      </div>

                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <p className="text-[10px] font-black text-white truncate drop-shadow-lg">{item.title}</p>
                        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Play size={10} className="text-red-600" fill="currentColor" />
                           <span className="text-[8px] font-black uppercase text-red-500">Assistir Agora</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-700 text-left">
              {loadingNotifications ? (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                   <Loader2 className="animate-spin text-red-600" size={40} />
                </div>
              ) : notifications.length === 0 ? (
                <div className="bg-white/5 rounded-[3rem] p-20 text-center border border-white/5">
                   <Bell size={40} className="text-gray-700 mx-auto mb-6" />
                   <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter text-center text-white">Caixa Vazia</h4>
                   <p className="text-gray-500 text-sm text-center">Olá {user.name.split(' ')[0]}, você ainda não recebeu avisos.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((n) => (
                    <div key={n.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.08] transition-all relative overflow-hidden group">
                       <div className="flex items-start gap-8 relative z-10">
                          <div className={`p-5 rounded-[1.5rem] shrink-0 ${n.type === 'alert' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                             {n.type === 'alert' ? <AlertTriangle size={28} /> : <Info size={28} />}
                          </div>
                          <div className="flex-1 pt-1">
                             <div className="flex justify-between items-center mb-3">
                                <h4 className="text-2xl font-black text-white tracking-tight">{n.title}</h4>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{new Date(n.created_at!).toLocaleDateString('pt-BR')}</span>
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
    </div>
  );
};

export default ClientArea;
