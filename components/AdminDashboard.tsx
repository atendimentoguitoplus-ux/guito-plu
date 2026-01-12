
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  User,
  Hash,
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit2, 
  MessageSquare, 
  X, 
  Loader2, 
  Save, 
  Zap,
  ShieldCheck,
  CreditCard,
  Bell, 
  Send,
  Info,
  AlertTriangle,
  Gift,
  Image as ImageIcon,
  ShoppingBag,
  Globe,
  Link as LinkIcon,
  Mail,
  Power,
  PowerOff,
  Megaphone,
  Target,
  Settings as SettingsIcon,
  RefreshCw,
  Trophy
} from 'lucide-react';
import { supabase, isProduction } from '../supabaseClient';
import { ContentItem, Plan, Notification, AppSettings } from '../types';
import { RELEASES, CARTOONS, PLANS } from '../constants';

interface AdminDashboardProps {
  onClose: () => void;
  onLogout: () => void;
  onUpdateClientStatus: (clientId: string, newStatus: string) => void;
  currentSettings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

interface ClientData {
  id: string;
  name: string;
  email: string;
  renewal_link: string;
  expiry: string;
  registration_date: string;
  server: string;
  app_name: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

const initialClientForm: ClientData = {
  id: '',
  name: '',
  email: '',
  renewal_link: '',
  expiry: '',
  registration_date: new Date().toLocaleDateString('pt-BR'),
  server: 'plus.guitoserve.tv',
  app_name: 'Guito Plus VIP',
  status: 'active'
};

const initialNotificationForm: Omit<Notification, 'id'> = {
  title: '',
  message: '',
  type: 'info',
  target_user_id: ''
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onLogout, onUpdateClientStatus, currentSettings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'content' | 'plans' | 'notifications' | 'settings'>('overview');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientForm, setClientForm] = useState<ClientData>(initialClientForm);
  const [notificationForm, setNotificationForm] = useState<Omit<Notification, 'id'>>(initialNotificationForm);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: string } | null>(null);

  const [localSettings, setLocalSettings] = useState<AppSettings>(currentSettings);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (!isProduction) {
        setClients([
          { id: '882941', name: 'Ricardo Oliveira', email: 'ricardo@email.com', renewal_link: '', expiry: '25/12/2025', registration_date: '01/01/2024', server: 'plus.guitoserve.tv', app_name: 'Guito Plus VIP', status: 'active' },
          { id: '1234', name: 'Usuário Teste', email: 'teste@guitoplus.com', renewal_link: '', expiry: '30/06/2025', registration_date: '10/02/2024', server: 'plus.guitoserve.tv', app_name: 'Premium 4K', status: 'inactive' }
        ]);
        setContent([...RELEASES, ...CARTOONS]);
        setPlans(PLANS);
        setNotifications([
          { id: '1', title: 'Manutenção Preventiva', message: 'O servidor passará por manutenção às 03:00.', type: 'alert', created_at: new Date().toISOString() },
          { id: '2', title: 'Novos Canais HBO', message: 'Adicionamos 5 novos canais HBO em 4K.', type: 'promo', created_at: new Date().toISOString() }
        ]);
        setLoading(false);
        return;
      }

      const [c, cl, p, n] = await Promise.all([
        supabase.from('content').select().order('created_at', { ascending: false }),
        supabase.from('clients').select().order('created_at', { ascending: false }),
        supabase.from('plans').select().order('created_at', { ascending: true }),
        supabase.from('notifications').select().order('created_at', { ascending: false })
      ]);
      
      setContent(c.data || []);
      setClients(cl.data || []);
      setPlans(p.data || PLANS);
      setNotifications(n.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClientStatus = async (client: ClientData) => {
    const newStatus = client.status === 'active' ? 'inactive' : 'active';
    onUpdateClientStatus(client.id, newStatus);

    if (!isProduction) {
      setClients(prev => prev.map(c => c.id === client.id ? { ...c, status: newStatus } : c));
      return;
    }

    try {
      const { error } = await supabase.from('clients').update({ status: newStatus }).eq('id', client.id);
      if (error) throw error;
      setClients(prev => prev.map(c => c.id === client.id ? { ...c, status: newStatus } : c));
    } catch (err: any) {
      alert("Erro ao alternar status: " + err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!isProduction) {
      onUpdateSettings(localSettings);
      alert("Configurações atualizadas (Modo Demo)");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from('settings').upsert(localSettings);
      if (error) throw error;
      onUpdateSettings(localSettings);
      alert("Configurações salvas com sucesso!");
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!isProduction) {
      setClients(prev => isEditing ? prev.map(c => c.id === clientForm.id ? clientForm : c) : [clientForm, ...prev]);
      setShowClientModal(false); setIsSubmitting(false); return;
    }
    try {
      const { created_at, ...data } = clientForm as any;
      const { error } = isEditing 
        ? await supabase.from('clients').update(data).eq('id', clientForm.id)
        : await supabase.from('clients').insert([data]);
      if (error) throw error;
      fetchAdminData();
      setShowClientModal(false);
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalData = { ...notificationForm, created_at: new Date().toISOString() };
    
    if (!isProduction) {
      setNotifications(prev => [{ ...finalData, id: Math.random().toString() }, ...prev]);
      setShowNotificationModal(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from('notifications').insert([finalData]);
      if (error) throw error;
      await fetchAdminData();
      setShowNotificationModal(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;
    
    if (!isProduction) {
      if (type === 'client') setClients(prev => prev.filter(c => c.id !== id));
      if (type === 'notification') setNotifications(prev => prev.filter(n => n.id !== id));
      setItemToDelete(null); return;
    }
    
    const table = type === 'client' ? 'clients' : 'notifications';
    await supabase.from(table).delete().eq('id', id);
    fetchAdminData(); setItemToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-sans">
      <aside className="w-full lg:w-80 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col p-8 shrink-0 relative z-50">
        <div className="flex items-center gap-4 mb-16">
          <div className="relative bg-gradient-to-br from-red-600 to-red-800 p-2.5 rounded-2xl shadow-2xl">
            <ShieldCheck size={28} />
          </div>
          <div className="text-left">
            <h1 className="font-black text-2xl tracking-tighter">GUITO <span className="text-red-600">HUB</span></h1>
            <span className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] block">Painel Master</span>
          </div>
        </div>

        <nav className="space-y-2 flex-1 text-left">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'clients', label: 'Assinantes', icon: Users },
            { id: 'notifications', label: 'Notificações', icon: Bell },
            { id: 'content', label: 'Catálogo', icon: Film },
            { id: 'plans', label: 'Planos', icon: CreditCard },
            { id: 'settings', label: 'Ajustes', icon: SettingsIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={20} />
              {item.label}
              {item.id === 'notifications' && notifications.length > 0 && (
                <span className="ml-auto bg-white/10 px-2 py-0.5 rounded-md text-[9px]">{notifications.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-8 space-y-3">
          <button 
            onClick={onLogout} 
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-red-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest bg-red-600/10 hover:bg-red-600 border border-red-600/20 shadow-xl shadow-red-600/5 group"
          >
            <PowerOff size={18} className="group-hover:scale-110 transition-transform" /> Encerrar Sessão Master
          </button>
          <button 
            onClick={onClose} 
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-all py-2 text-[10px] font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Voltar ao Site
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 sm:p-10 lg:p-14 custom-scrollbar bg-[#050505]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 text-left">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter">
              {activeTab === 'clients' ? 'Assinantes VIP' : 
               activeTab === 'notifications' ? 'Mural de Avisos' : 
               activeTab === 'settings' ? 'Configurações' : 'Sumário Master'}
            </h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">
              {activeTab === 'settings' ? 'Ajuste de Variáveis e Regras do Sistema' : 'Gestão de Acessos e Status'}
            </p>
          </div>
          <div className="flex gap-4">
            {activeTab === 'clients' && (
              <button onClick={() => { setIsEditing(false); setClientForm(initialClientForm); setShowClientModal(true); }} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-red-700 shadow-xl transition-all"><Plus size={20} /> Novo Cliente</button>
            )}
            {activeTab === 'notifications' && (
              <button onClick={() => { setNotificationForm(initialNotificationForm); setShowNotificationModal(true); }} className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-gray-200 shadow-xl transition-all"><Send size={20} /> Criar Aviso</button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-red-600" size={40} /></div>
        ) : (
          <div className="animate-in fade-in duration-500">
            
            {activeTab === 'settings' && (
              <div className="max-w-4xl space-y-8 text-left">
                <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
                  <form onSubmit={handleSaveSettings} className="space-y-10">
                    <div className="flex items-center gap-4 mb-6 text-left">
                       <div className="p-3 bg-amber-600/10 rounded-2xl text-amber-500">
                          <Trophy size={28} />
                       </div>
                       <div>
                          <h4 className="text-xl font-black uppercase tracking-tighter text-white">Programa de Indicação</h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Defina as recompensas para quem indica</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Dias de Brinde por Indicação</label>
                          <div className="relative group">
                             <RefreshCw className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500 group-focus-within:rotate-180 transition-transform duration-500" size={20} />
                             <input 
                               type="number" 
                               min="0"
                               max="365"
                               className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 font-black text-white outline-none focus:border-amber-500 transition-colors"
                               value={localSettings.referral_reward_days}
                               onChange={(e) => setLocalSettings({...localSettings, referral_reward_days: parseInt(e.target.value) || 0})}
                             />
                          </div>
                          <p className="text-[9px] text-gray-600 italic px-2">Este valor altera automaticamente o texto no painel do cliente.</p>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Horas de Teste Grátis</label>
                          <div className="relative group">
                             <Zap className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                             <input 
                               type="number" 
                               className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 font-black text-white outline-none focus:border-blue-500 transition-colors"
                               value={localSettings.trial_hours}
                               onChange={(e) => setLocalSettings({...localSettings, trial_hours: parseInt(e.target.value) || 0})}
                             />
                          </div>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 text-left">
                       <button 
                         type="submit" 
                         disabled={isSubmitting}
                         className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                       >
                         {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} Atualizar Configurações
                       </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'clients' && (
              <div className="bg-black/40 backdrop-blur-md rounded-[3rem] border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5 font-black uppercase text-[10px] text-gray-500">
                      <th className="px-10 py-6">Assinante</th>
                      <th className="px-10 py-6">Status</th>
                      <th className="px-10 py-6">Vencimento</th>
                      <th className="px-10 py-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {clients.map(client => (
                      <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-6">
                          <div className="font-bold text-white">{client.name}</div>
                          <span className="text-[10px] text-gray-500 font-mono">ID: {client.id}</span>
                        </td>
                        <td className="px-10 py-6">
                          <button 
                            onClick={() => handleToggleClientStatus(client)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase border transition-all ${
                              client.status === 'active' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                                : 'bg-red-600/10 text-red-600 border-red-600/20 hover:bg-red-600/20'
                            }`}
                          >
                            {client.status === 'active' ? <Power size={12} /> : <PowerOff size={12} />}
                            {client.status === 'active' ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>
                        <td className="px-10 py-6 font-mono text-sm text-gray-400">{client.expiry}</td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setClientForm(client); setIsEditing(true); setShowClientModal(true); }} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"><Edit2 size={18} /></button>
                            <button onClick={() => setItemToDelete({ id: client.id, type: 'client' })} className="p-2 text-red-600 hover:bg-red-600/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-black/40 backdrop-blur-md rounded-[3rem] border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5 font-black uppercase text-[10px] text-gray-500">
                      <th className="px-10 py-6">Aviso</th>
                      <th className="px-10 py-6">Público</th>
                      <th className="px-10 py-6">Data</th>
                      <th className="px-10 py-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {notifications.map(n => (
                      <tr key={n.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3 mb-1">
                             {n.type === 'alert' && <AlertTriangle size={14} className="text-yellow-500" />}
                             {n.type === 'promo' && <Gift size={14} className="text-green-500" />}
                             {n.type === 'info' && <Info size={14} className="text-blue-500" />}
                             <div className="font-bold text-white text-sm">{n.title}</div>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{n.message}</p>
                        </td>
                        <td className="px-10 py-6">
                           {n.target_user_id ? (
                             <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                               <Target size={10} /> ID: {n.target_user_id}
                             </span>
                           ) : (
                             <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-red-500 bg-red-600/10 px-3 py-1 rounded-full border border-red-600/20">
                               <Megaphone size={10} /> Massa (Todos)
                             </span>
                           )}
                        </td>
                        <td className="px-10 py-6 text-[10px] font-mono text-gray-500">
                          {new Date(n.created_at || '').toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button onClick={() => setItemToDelete({ id: n.id, type: 'notification' })} className="p-2 text-red-600 hover:bg-red-600/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
                <div className="bg-white/5 border border-white/5 p-10 rounded-[3rem]">
                  <Users className="text-red-500 mb-6" size={32} />
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Total Assinantes</p>
                  <h3 className="text-5xl font-black">{clients.length}</h3>
                </div>
                <div className="bg-white/5 border border-white/5 p-10 rounded-[3rem]">
                  <ShieldCheck className="text-green-500 mb-6" size={32} />
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Contas Ativas</p>
                  <h3 className="text-5xl font-black">{clients.filter(c => c.status === 'active').length}</h3>
                </div>
                <div className="bg-white/5 border border-white/5 p-10 rounded-[3rem]">
                  <Bell className="text-blue-500 mb-6" size={32} />
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Notificações</p>
                  <h3 className="text-5xl font-black">{notifications.length}</h3>
                </div>
                <div className="bg-white/5 border border-white/5 p-10 rounded-[3rem]">
                  <SettingsIcon className="text-amber-500 mb-6" size={32} />
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Brinde Indicação</p>
                  <h3 className="text-5xl font-black">{currentSettings.referral_reward_days}d</h3>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL CLIENTE */}
      {showClientModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowClientModal(false)} />
          <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-[3rem] p-10 shadow-4xl text-left animate-in zoom-in duration-200">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">{isEditing ? 'Editar' : 'Novo'} Assinante</h3>
            <form onSubmit={handleSaveClient} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">ID Usuário</label>
                  <input required disabled={isEditing} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-mono font-bold text-white outline-none focus:border-red-600" value={clientForm.id} onChange={(e) => setClientForm({...clientForm, id: e.target.value.replace(/\D/g, '')})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Nome Completo</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-bold text-white outline-none focus:border-red-600" value={clientForm.name} onChange={(e) => setClientForm({...clientForm, name: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Expiração (DD/MM/AAAA)</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={clientForm.expiry} onChange={(e) => setClientForm({...clientForm, expiry: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Status Inicial</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none" value={clientForm.status} onChange={(e) => setClientForm({...clientForm, status: e.target.value as any})}>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowClientModal(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase hover:bg-white/10 transition-all">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase shadow-xl flex items-center justify-center gap-3">
                   {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />} Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOTIFICAÇÃO */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowNotificationModal(false)} />
          <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-[3rem] p-10 shadow-4xl text-left animate-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-4 bg-red-600/10 rounded-2xl text-red-600">
                  <Bell size={32} />
               </div>
               <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Enviar Aviso</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mensagem para o Mural do Cliente</p>
               </div>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Tipo de Alerta</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={notificationForm.type} onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value as any})}>
                    <option value="info">Informação Geral</option>
                    <option value="alert">Aviso Urgente</option>
                    <option value="promo">Promoção / Bônus</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Público Alvo</label>
                  <input placeholder="ID Usuário (Vazio = TODOS)" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-mono text-white outline-none focus:border-red-600" value={notificationForm.target_user_id} onChange={(e) => setNotificationForm({...notificationForm, target_user_id: e.target.value})} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Título da Mensagem</label>
                <input required placeholder="Ex: Novos Filmes Disponíveis" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-bold text-white outline-none focus:border-red-600" value={notificationForm.title} onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Conteúdo Detalhado</label>
                <textarea required rows={4} placeholder="Escreva aqui o comunicado para seus clientes..." className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 resize-none" value={notificationForm.message} onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})} />
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowNotificationModal(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase hover:bg-white/10 transition-all">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase shadow-xl flex items-center justify-center gap-3">
                   {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Publicar no Mural</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95">
          <div className="bg-[#111] p-10 rounded-[2.5rem] border border-white/10 max-w-sm w-full text-center">
            <Trash2 size={48} className="text-red-600 mx-auto mb-6" />
            <h4 className="text-2xl font-black mb-6 uppercase tracking-tighter">Confirmar Exclusão?</h4>
            <div className="flex gap-4">
              <button onClick={() => setItemToDelete(null)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 font-black text-xs uppercase">Manter</button>
              <button onClick={handleDelete} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase shadow-xl">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
