
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
  Trophy,
  Star,
  Calendar,
  Layers,
  List
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

const initialContentForm: ContentItem = {
  id: '',
  title: '',
  category: 'movie',
  image_url: '',
  rating: 9.0,
  year: new Date().getFullYear().toString(),
  is_new: true,
  synopsis: '',
  movie_cast: []
};

const initialPlanForm: Plan = {
  id: '',
  name: '',
  price: '',
  features: [],
  is_recommended: false,
  checkout_url: '',
  renewal_url: ''
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
  
  // Modals visibility
  const [showClientModal, setShowClientModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Forms state
  const [clientForm, setClientForm] = useState<ClientData>(initialClientForm);
  const [contentForm, setContentForm] = useState<ContentItem>(initialContentForm);
  const [planForm, setPlanForm] = useState<Plan>(initialPlanForm);
  const [notificationForm, setNotificationForm] = useState<Omit<Notification, 'id'>>(initialNotificationForm);
  
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'client' | 'notification' | 'content' | 'plan' } | null>(null);
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
      setPlans(p.data && p.data.length > 0 ? p.data : PLANS);
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
      setClients(prev => isEditing ? prev.map(c => c.id === clientForm.id ? clientForm : c) : [{...clientForm, id: clientForm.id || Math.random().toString()}, ...prev]);
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

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!isProduction) {
      const finalForm = { ...contentForm, id: contentForm.id || Math.random().toString() };
      setContent(prev => isEditing ? prev.map(c => c.id === contentForm.id ? finalForm : c) : [finalForm, ...prev]);
      setShowContentModal(false); setIsSubmitting(false); return;
    }
    try {
      const { created_at, ...data } = contentForm as any;
      const { error } = isEditing 
        ? await supabase.from('content').update(data).eq('id', contentForm.id)
        : await supabase.from('content').insert([data]);
      if (error) throw error;
      fetchAdminData();
      setShowContentModal(false);
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!isProduction) {
      const finalForm = { ...planForm, id: planForm.id || Math.random().toString() };
      setPlans(prev => isEditing ? prev.map(p => p.id === planForm.id ? finalForm : p) : [finalForm, ...prev]);
      setShowPlanModal(false); setIsSubmitting(false); return;
    }
    try {
      const { created_at, ...data } = planForm as any;
      const { error } = isEditing 
        ? await supabase.from('plans').update(data).eq('id', planForm.id)
        : await supabase.from('plans').insert([data]);
      if (error) throw error;
      fetchAdminData();
      setShowPlanModal(false);
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
      if (type === 'content') setContent(prev => prev.filter(c => c.id !== id));
      if (type === 'plan') setPlans(prev => prev.filter(p => p.id !== id));
      setItemToDelete(null); return;
    }
    
    const tableMap: Record<string, string> = {
      'client': 'clients',
      'notification': 'notifications',
      'content': 'content',
      'plan': 'plans'
    };

    const table = tableMap[type];
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
            <PowerOff size={18} className="group-hover:scale-110 transition-transform" /> Encerrar Sessão
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
               activeTab === 'content' ? 'Catálogo VIP' :
               activeTab === 'plans' ? 'Gestão de Planos' :
               activeTab === 'settings' ? 'Configurações' : 'Sumário Master'}
            </h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">
              Gerencie todos os aspectos do Guito Plus Cinema
            </p>
          </div>
          <div className="flex gap-4">
            {activeTab === 'clients' && (
              <button onClick={() => { setIsEditing(false); setClientForm(initialClientForm); setShowClientModal(true); }} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-red-700 shadow-xl transition-all"><Plus size={20} /> Novo Cliente</button>
            )}
            {activeTab === 'notifications' && (
              <button onClick={() => { setNotificationForm(initialNotificationForm); setShowNotificationModal(true); }} className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-gray-200 shadow-xl transition-all"><Send size={20} /> Criar Aviso</button>
            )}
            {activeTab === 'content' && (
              <button onClick={() => { setIsEditing(false); setContentForm(initialContentForm); setShowContentModal(true); }} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-red-700 shadow-xl transition-all"><Plus size={20} /> Novo Conteúdo</button>
            )}
            {activeTab === 'plans' && (
              <button onClick={() => { setIsEditing(false); setPlanForm(initialPlanForm); setShowPlanModal(true); }} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-red-700 shadow-xl transition-all"><Plus size={20} /> Novo Plano</button>
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

            {activeTab === 'content' && (
              <div className="bg-black/40 backdrop-blur-md rounded-[3rem] border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5 font-black uppercase text-[10px] text-gray-500">
                      <th className="px-10 py-6">Título</th>
                      <th className="px-10 py-6">Categoria</th>
                      <th className="px-10 py-6 text-center">Ano</th>
                      <th className="px-10 py-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {content.map(item => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <img src={item.image_url} className="w-10 h-14 object-cover rounded-lg bg-zinc-900" />
                              <div className="font-bold text-white text-sm">{item.title}</div>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-[9px] font-black uppercase text-red-500 bg-red-600/10 px-3 py-1 rounded-full border border-red-600/20">
                             {item.category}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-center font-mono text-xs text-gray-500">{item.year}</td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setContentForm(item); setIsEditing(true); setShowContentModal(true); }} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"><Edit2 size={18} /></button>
                            <button onClick={() => setItemToDelete({ id: item.id, type: 'content' })} className="p-2 text-red-600 hover:bg-red-600/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'plans' && (
              <div className="bg-black/40 backdrop-blur-md rounded-[3rem] border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5 font-black uppercase text-[10px] text-gray-500">
                      <th className="px-10 py-6">Plano</th>
                      <th className="px-10 py-6">Preço</th>
                      <th className="px-10 py-6">Vantagens</th>
                      <th className="px-10 py-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {plans.map(plan => (
                      <tr key={plan.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-6">
                           <div className="font-bold text-white text-sm flex items-center gap-2">
                             {plan.name}
                             {plan.is_recommended && <Star size={12} fill="currentColor" className="text-amber-500" />}
                           </div>
                        </td>
                        <td className="px-10 py-6 font-black text-sm text-green-500">R$ {plan.price}</td>
                        <td className="px-10 py-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                           {plan.features.length} Itens
                        </td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex justify-end gap-2">
                            <button onClick={() => { setPlanForm(plan); setIsEditing(true); setShowPlanModal(true); }} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"><Edit2 size={18} /></button>
                            <button onClick={() => setItemToDelete({ id: plan.id, type: 'plan' })} className="p-2 text-red-600 hover:bg-red-600/10 rounded-xl transition-all"><Trash2 size={18} /></button>
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
                      <th className="px-10 py-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {notifications.map(n => (
                      <tr key={n.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-6">
                          <div className="font-bold text-white text-sm mb-1">{n.title}</div>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{n.message}</p>
                        </td>
                        <td className="px-10 py-6">
                           {n.target_user_id ? `ID: ${n.target_user_id}` : 'Todos'}
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
                  <Film className="text-blue-500 mb-6" size={32} />
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Catálogo</p>
                  <h3 className="text-5xl font-black">{content.length}</h3>
                </div>
                <div className="bg-white/5 border border-white/5 p-10 rounded-[3rem]">
                  <CreditCard className="text-amber-500 mb-6" size={32} />
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Planos</p>
                  <h3 className="text-5xl font-black">{plans.length}</h3>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAIS GERAIS */}
      
      {/* MODAL CLIENTE */}
      {showClientModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowClientModal(false)} />
          <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-[3rem] p-10 text-left animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
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
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">E-mail</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={clientForm.email} onChange={(e) => setClientForm({...clientForm, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Expiração</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={clientForm.expiry} onChange={(e) => setClientForm({...clientForm, expiry: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Status</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none" value={clientForm.status} onChange={(e) => setClientForm({...clientForm, status: e.target.value as any})}>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowClientModal(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase shadow-xl">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CATÁLOGO */}
      {showContentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowContentModal(false)} />
          <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-[3rem] p-10 text-left animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">{isEditing ? 'Editar' : 'Novo'} Conteúdo</h3>
            <form onSubmit={handleSaveContent} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Título</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={contentForm.title} onChange={(e) => setContentForm({...contentForm, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Categoria</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none" value={contentForm.category} onChange={(e) => setContentForm({...contentForm, category: e.target.value as any})}>
                    <option value="movie">Filme</option>
                    <option value="series">Série</option>
                    <option value="cartoon">Desenho/Kids</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><ImageIcon size={12}/> URL da Capa</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={contentForm.image_url} onChange={(e) => setContentForm({...contentForm, image_url: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Star size={12}/> Rating</label>
                  <input required type="number" step="0.1" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={contentForm.rating} onChange={(e) => setContentForm({...contentForm, rating: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Calendar size={12}/> Ano Lançamento</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={contentForm.year} onChange={(e) => setContentForm({...contentForm, year: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Sinopse</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 resize-none" value={contentForm.synopsis} onChange={(e) => setContentForm({...contentForm, synopsis: e.target.value})} />
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowContentModal(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase shadow-xl">Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PLANOS */}
      {showPlanModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowPlanModal(false)} />
          <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-[3rem] p-10 text-left animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">{isEditing ? 'Editar' : 'Novo'} Plano</h3>
            <form onSubmit={handleSavePlan} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Nome do Plano</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={planForm.name} onChange={(e) => setPlanForm({...planForm, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Preço (Ex: 29,90)</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={planForm.price} onChange={(e) => setPlanForm({...planForm, price: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><List size={12}/> Vantagens (Separadas por vírgula)</label>
                <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 resize-none" value={planForm.features.join(', ')} onChange={(e) => setPlanForm({...planForm, features: e.target.value.split(',').map(f => f.trim())})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><LinkIcon size={12}/> Checkout URL</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={planForm.checkout_url} onChange={(e) => setPlanForm({...planForm, checkout_url: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Recomendado?</label>
                   <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none" value={planForm.is_recommended ? 'yes' : 'no'} onChange={(e) => setPlanForm({...planForm, is_recommended: e.target.value === 'yes'})}>
                    <option value="no">Não</option>
                    <option value="yes">Sim (Destaque)</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowPlanModal(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase shadow-xl">Salvar Plano</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOTIFICAÇÃO */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowNotificationModal(false)} />
          <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-[3rem] p-10 text-left animate-in zoom-in duration-200">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">Enviar Aviso</h3>
            <form onSubmit={handleSendNotification} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Tipo</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none" value={notificationForm.type} onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value as any})}>
                    <option value="info">Informação</option>
                    <option value="alert">Alerta</option>
                    <option value="promo">Promoção</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">ID Usuário (Opcional)</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none" value={notificationForm.target_user_id} onChange={(e) => setNotificationForm({...notificationForm, target_user_id: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Título</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none" value={notificationForm.title} onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Mensagem</label>
                <textarea required rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none resize-none" value={notificationForm.message} onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})} />
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowNotificationModal(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase shadow-xl">Enviar</button>
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
