
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2, 
  Save, 
  ShieldCheck,
  CreditCard,
  Bell, 
  Send,
  Image as ImageIcon,
  Power,
  PowerOff,
  Settings as SettingsIcon,
  RefreshCw,
  Trophy,
  Star,
  Calendar,
  Link as LinkIcon,
  Crown,
  FileText,
  Clock,
  Phone,
  AlertTriangle,
  Info,
  CheckCircle2
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
  custom_banner_url: string;
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
  custom_banner_url: '',
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
  is_subscriber_only: false,
  synopsis: '',
  movie_cast: []
};

const initialPlanForm: Plan = {
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
  
  const [showClientModal, setShowClientModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [clientForm, setClientForm] = useState<ClientData>(initialClientForm);
  const [contentForm, setContentForm] = useState<ContentItem>(initialContentForm);
  const [planForm, setPlanForm] = useState<Plan>(initialPlanForm);
  const [notificationForm, setNotificationForm] = useState<Omit<Notification, 'id'>>(initialNotificationForm);
  
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'client' | 'notification' | 'content' | 'plan' } | null>(null);
  const [localSettings, setLocalSettings] = useState<AppSettings>(currentSettings);

  const [imagePreviewError, setImagePreviewError] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (!isProduction) {
        setClients([
          { id: '882941', name: 'Ricardo Oliveira', email: 'ricardo@email.com', renewal_link: '', custom_banner_url: '', expiry: '25/12/2025', registration_date: '01/01/2024', server: 'plus.guitoserve.tv', app_name: 'Guito Plus VIP', status: 'active' }
        ]);
        setContent([...RELEASES, ...CARTOONS]);
        setPlans(PLANS);
        setNotifications([
          { id: '1', title: 'Boas-vindas', message: 'Sistema Guito Plus operando em 4K.', type: 'info', created_at: new Date().toISOString() }
        ]);
        setLoading(false);
        return;
      }

      const [c, cl, p, n, s] = await Promise.all([
        supabase.from('content').select().order('created_at', { ascending: false }),
        supabase.from('clients').select().order('created_at', { ascending: false }),
        supabase.from('plans').select().order('created_at', { ascending: true }),
        supabase.from('notifications').select().order('created_at', { ascending: false }),
        supabase.from('settings').select().eq('id', 1).maybeSingle()
      ]);
      
      setContent(c.data || []);
      setClients(cl.data || []);
      setPlans(p.data && p.data.length > 0 ? p.data : PLANS);
      setNotifications(n.data || []);
      if (s.data) setLocalSettings(s.data);
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
    await supabase.from('clients').update({ status: newStatus }).eq('id', client.id);
    fetchAdminData();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!isProduction) {
      onUpdateSettings(localSettings);
      alert("Ajustes salvos!");
      setIsSubmitting(false);
      return;
    }
    try {
      const { error } = await supabase.from('settings').upsert({ id: 1, ...localSettings });
      if (error) throw error;
      onUpdateSettings(localSettings);
      alert("Configurações atualizadas com sucesso!");
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
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
      if (!isEditing && (!data.id || data.id === "")) delete data.id;
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
      if (!isEditing && (!data.id || data.id === "")) delete data.id;
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
    
    const planData: any = {
      name: planForm.name,
      price: planForm.price,
      features: planForm.features,
      is_recommended: planForm.is_recommended,
      checkout_url: planForm.checkout_url,
      renewal_url: planForm.renewal_url
    };

    if (!isProduction) {
      const finalForm = { ...planData, id: isEditing ? planForm.id : Math.random().toString() };
      setPlans(prev => isEditing ? prev.map(p => p.id === planForm.id ? finalForm : p) : [finalForm, ...prev]);
      setShowPlanModal(false); setIsSubmitting(false); return;
    }
    
    try {
      const { error } = isEditing 
        ? await supabase.from('plans').update(planData).eq('id', planForm.id)
        : await supabase.from('plans').insert([planData]);
      
      if (error) throw error;
      await fetchAdminData();
      setShowPlanModal(false);
    } catch (err: any) { 
      alert("Erro ao salvar plano: " + err.message); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalData = { 
      ...notificationForm, 
      target_user_id: notificationForm.target_user_id === "" ? null : notificationForm.target_user_id,
      created_at: new Date().toISOString() 
    };
    if (!isProduction) {
      setNotifications(prev => [{ ...finalData, id: Math.random().toString() } as Notification, ...prev]);
      setShowNotificationModal(false); setIsSubmitting(false); return;
    }
    try {
      const { error } = await supabase.from('notifications').insert([finalData]);
      if (error) throw error;
      await fetchAdminData();
      setShowNotificationModal(false);
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;
    if (!isProduction) {
      if (type === 'client') setClients(prev => prev.filter(c => c.id !== id));
      if (type === 'content') setContent(prev => prev.filter(c => c.id !== id));
      if (type === 'plan') setPlans(prev => prev.filter(p => p.id !== id));
      if (type === 'notification') setNotifications(prev => prev.filter(n => n.id !== id));
      setItemToDelete(null); return;
    }
    const tableMap: Record<string, string> = { 'client': 'clients', 'content': 'content', 'plan': 'plans', 'notification': 'notifications' };
    await supabase.from(tableMap[type]).delete().eq('id', id);
    fetchAdminData(); setItemToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-sans text-left">
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
        <nav className="space-y-2 flex-1">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'clients', label: 'Assinantes', icon: Users },
            { id: 'notifications', label: 'Notificações', icon: Bell },
            { id: 'content', label: 'Catálogo', icon: Film },
            { id: 'plans', label: 'Planos', icon: CreditCard },
            { id: 'settings', label: 'Ajustes', icon: SettingsIcon },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-8 space-y-3">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-red-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest bg-red-600/10 hover:bg-red-600 border border-red-600/20 group">
            <PowerOff size={18} /> Encerrar Sessão
          </button>
          <button onClick={onClose} className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-all py-2 text-[10px] font-bold uppercase tracking-widest">
            <ArrowLeft size={14} /> Voltar ao Site
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 sm:p-10 lg:p-14 custom-scrollbar bg-[#050505]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 text-left">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter">
              {activeTab === 'clients' ? 'Assinantes VIP' : 
               activeTab === 'notifications' ? 'Histórico de Avisos' : 
               activeTab === 'content' ? 'Catálogo VIP' :
               activeTab === 'plans' ? 'Gestão de Planos' :
               activeTab === 'settings' ? 'Configurações' : 'Sumário Master'}
            </h2>
          </div>
          <div className="flex gap-4">
            {activeTab === 'clients' && (
              <button onClick={() => { setIsEditing(false); setClientForm(initialClientForm); setShowClientModal(true); }} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-red-700 shadow-xl transition-all"><Plus size={20} /> Novo Cliente</button>
            )}
            {activeTab === 'notifications' && (
              <button onClick={() => { setNotificationForm(initialNotificationForm); setShowNotificationModal(true); }} className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-gray-200 shadow-xl transition-all"><Send size={20} /> Novo Aviso</button>
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
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-white/5 border border-white/5 p-10 rounded-2xl text-left">
                  <Users className="text-red-500 mb-6" size={32} />
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Total Assinantes</p>
                  <h3 className="text-5xl font-black">{clients.length}</h3>
                </div>
                <div className="bg-white/5 border border-white/5 p-10 rounded-2xl text-left">
                  <Film className="text-blue-500 mb-6" size={32} />
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Catálogo</p>
                  <h3 className="text-5xl font-black">{content.length}</h3>
                </div>
                <div className="bg-white/5 border border-white/5 p-10 rounded-2xl text-left">
                  <CreditCard className="text-amber-500 mb-6" size={32} />
                  <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Planos Ativos</p>
                  <h3 className="text-5xl font-black">{plans.length}</h3>
                </div>
              </div>
            )}

            {activeTab === 'clients' && (
              <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/5 font-black uppercase text-[10px] text-gray-500">
                    <tr>
                      <th className="px-10 py-6">Assinante</th>
                      <th className="px-10 py-6">Status</th>
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
                           <button onClick={() => handleToggleClientStatus(client)} className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border transition-all ${client.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-600/10 text-red-600 border-red-600/20'}`}>
                              {client.status === 'active' ? 'Ativo' : 'Inativo'}
                           </button>
                        </td>
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

            {activeTab === 'plans' && (
              <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/5 font-black uppercase text-[10px] text-gray-500">
                    <tr>
                      <th className="px-10 py-6">Nome do Plano</th>
                      <th className="px-10 py-6">Preço (R$)</th>
                      <th className="px-10 py-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {plans.map(plan => (
                      <tr key={plan.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-6">
                          <div className="font-bold text-white">{plan.name}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest">{plan.is_recommended ? '⭐ Recomendado' : 'Padrão'}</div>
                        </td>
                        <td className="px-10 py-6 font-black text-amber-500">R$ {plan.price}</td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setPlanForm(plan); setIsEditing(true); setShowPlanModal(true); }} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"><Edit2 size={18} /></button>
                            <button onClick={() => setItemToDelete({ id: plan.id!, type: 'plan' })} className="p-2 text-red-600 hover:bg-red-600/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {plans.length === 0 && <div className="p-20 text-center text-gray-600 uppercase font-black text-xs tracking-widest">Nenhum plano configurado.</div>}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/5 font-black uppercase text-[10px] text-gray-500">
                    <tr>
                      <th className="px-10 py-6">Aviso</th>
                      <th className="px-10 py-6">Alvo</th>
                      <th className="px-10 py-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {notifications.map(notif => (
                      <tr key={notif.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-6">
                          <div className="font-bold text-white">{notif.title}</div>
                          <div className="text-[10px] text-gray-500 line-clamp-1">{notif.message}</div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                              {notif.target_user_id ? `ID: ${notif.target_user_id}` : 'Global'}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button onClick={() => setItemToDelete({ id: notif.id, type: 'notification' })} className="p-2 text-red-600 hover:bg-red-600/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 max-w-4xl text-left">
                <header className="flex items-center gap-4 mb-12">
                   <div className="p-4 bg-red-600/10 rounded-2xl text-red-600"><SettingsIcon size={32} /></div>
                   <div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter">Ajustes Master</h4>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Controle operacional do sistema</p>
                   </div>
                </header>
                <form onSubmit={handleSaveSettings} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Clock size={12}/> Horas de Teste</label>
                         <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-600" value={localSettings.trial_hours} onChange={(e) => setLocalSettings({...localSettings, trial_hours: parseInt(e.target.value)})} />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Trophy size={12}/> Brinde Indicação (Dias)</label>
                         <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-600" value={localSettings.referral_reward_days} onChange={(e) => setLocalSettings({...localSettings, referral_reward_days: parseInt(e.target.value)})} />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Phone size={12}/> WhatsApp Suporte</label>
                         <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-600" value={localSettings.support_whatsapp} onChange={(e) => setLocalSettings({...localSettings, support_whatsapp: e.target.value})} />
                      </div>
                   </div>
                   <button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95">
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} Atualizar Configurações
                   </button>
                </form>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/5 font-black uppercase text-[10px] text-gray-500">
                    <tr>
                      <th className="px-10 py-6">Título</th>
                      <th className="px-10 py-6">Nota</th>
                      <th className="px-10 py-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {content.map(item => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-6 flex items-center gap-4">
                          <img src={item.image_url} className="w-10 h-14 object-cover rounded bg-zinc-900" />
                          <div>
                            <div className="font-bold text-white text-sm">{item.title}</div>
                            {item.is_subscriber_only && <span className="text-[8px] font-black uppercase text-amber-500 flex items-center gap-1"><Crown size={8}/> VIP</span>}
                          </div>
                        </td>
                        <td className="px-10 py-6 font-mono text-sm text-yellow-500">{item.rating}</td>
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
          </div>
        )}
      </main>

      {/* MODAL PLANOS - RESTAURADO E CORRIGIDO */}
      {showPlanModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowPlanModal(false)} />
          <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-10 text-left animate-in zoom-in duration-200 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
             <header className="mb-8">
                <h3 className="text-3xl font-black uppercase tracking-tighter">{isEditing ? 'Editar' : 'Novo'} Plano Guito Plus</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Defina o preço e os benefícios exclusivos</p>
             </header>
             <form onSubmit={handleSavePlan} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Nome do Plano</label>
                      <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 font-bold" value={planForm.name} onChange={(e) => setPlanForm({...planForm, name: e.target.value})} placeholder="Ex: Master VIP 4K" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Preço (Ex: 39,90)</label>
                      <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 font-bold" value={planForm.price} onChange={(e) => setPlanForm({...planForm, price: e.target.value})} placeholder="00,00" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><CheckCircle2 size={12}/> Vantagens (separe por vírgula)</label>
                   <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 resize-none text-sm leading-relaxed" value={planForm.features.join(', ')} onChange={(e) => setPlanForm({...planForm, features: e.target.value.split(',').map(f => f.trim())})} placeholder="Canais HD, 2 Telas, 4K..." />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><LinkIcon size={12}/> Link de Checkout (WhatsApp ou Checkout)</label>
                   <input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 text-xs" value={planForm.checkout_url} onChange={(e) => setPlanForm({...planForm, checkout_url: e.target.value})} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><RefreshCw size={12}/> Link de Renovação Direta</label>
                   <input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 text-xs" value={planForm.renewal_url} onChange={(e) => setPlanForm({...planForm, renewal_url: e.target.value})} placeholder="https://..." />
                </div>
                <div className="flex items-center gap-3 bg-red-600/5 p-4 rounded-xl border border-red-600/20">
                   <input type="checkbox" id="recCheck" className="w-5 h-5 accent-red-600" checked={planForm.is_recommended} onChange={(e) => setPlanForm({...planForm, is_recommended: e.target.checked})} />
                   <label htmlFor="recCheck" className="text-[10px] font-black uppercase text-white tracking-widest cursor-pointer">Destacar como Plano Recomendado</label>
                </div>
                <div className="pt-6 flex gap-4">
                   <button type="button" onClick={() => setShowPlanModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-500 font-black text-xs uppercase hover:text-white transition-all">Cancelar</button>
                   <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-xl bg-red-600 text-white font-black text-xs uppercase shadow-xl flex items-center justify-center gap-3 hover:bg-red-700 transition-all">
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />} {isEditing ? 'Salvar Alterações' : 'Criar Plano VIP'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* MODAL CLIENTE COMPLETO */}
      {showClientModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowClientModal(false)} />
          <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-2xl p-10 text-left animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">{isEditing ? 'Editar' : 'Novo'} Assinante</h3>
            <form onSubmit={handleSaveClient} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">ID Usuário</label><input required disabled={isEditing} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-mono font-bold text-white outline-none focus:border-red-600" value={clientForm.id} onChange={(e) => setClientForm({...clientForm, id: e.target.value.replace(/\D/g, '')})} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Nome do Cliente</label><input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 font-bold text-white outline-none focus:border-red-600" value={clientForm.name} onChange={(e) => setClientForm({...clientForm, name: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">E-mail</label><input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={clientForm.email} onChange={(e) => setClientForm({...clientForm, email: e.target.value})} placeholder="email@exemplo.com" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Banner VIP Customizado</label><input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={clientForm.custom_banner_url} onChange={(e) => setClientForm({...clientForm, custom_banner_url: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Link de Renovação</label><input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={clientForm.renewal_link} onChange={(e) => setClientForm({...clientForm, renewal_link: e.target.value})} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Expiração</label><input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={clientForm.expiry} onChange={(e) => setClientForm({...clientForm, expiry: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Status</label><select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={clientForm.status} onChange={(e) => setClientForm({...clientForm, status: e.target.value as any})}><option value="active">Ativo</option><option value="inactive">Inativo</option></select></div>
              </div>
              <div className="pt-6 flex gap-4"><button type="button" onClick={() => setShowClientModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-500 font-black text-xs uppercase transition-colors hover:text-white">Cancelar</button><button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-xl bg-red-600 text-white font-black text-xs uppercase shadow-xl hover:bg-red-700 transition-all">{isSubmitting ? 'Salvando...' : 'Confirmar'}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CATÁLOGO COMPLETO */}
      {showContentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowContentModal(false)} />
          <div className="relative w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-2xl p-10 text-left animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">{isEditing ? 'Editar' : 'Novo'} Conteúdo</h3>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="w-full md:w-64 shrink-0 space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block ml-1">Capa do Filme</label>
                <div className="aspect-[2/3] bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                  {contentForm.image_url && !imagePreviewError ? (
                    <img src={contentForm.image_url} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreviewError(true)} onLoad={() => setImagePreviewError(false)} />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-600"><ImageIcon size={48} /></div>
                  )}
                </div>
              </div>
              <form onSubmit={handleSaveContent} className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Título</label><input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={contentForm.title} onChange={(e) => setContentForm({...contentForm, title: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Categoria</label><select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={contentForm.category} onChange={(e) => setContentForm({...contentForm, category: e.target.value as any})}><option value="movie">Filme</option><option value="series">Série</option><option value="cartoon">Desenho/Kids</option></select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Star size={12}/> Nota</label><input type="number" step="0.1" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={contentForm.rating} onChange={(e) => setContentForm({...contentForm, rating: parseFloat(e.target.value)})} /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Calendar size={12}/> Ano</label><input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={contentForm.year} onChange={(e) => setContentForm({...contentForm, year: e.target.value})} /></div>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">URL da Imagem</label><input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={contentForm.image_url} onChange={(e) => { setContentForm({...contentForm, image_url: e.target.value}); setImagePreviewError(false); }} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 accent-red-600" checked={contentForm.is_new} onChange={(e) => setContentForm({...contentForm, is_new: e.target.checked})} />
                    <label className="text-[10px] font-black uppercase text-white tracking-widest">Lançamento</label>
                  </div>
                  <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 accent-amber-500" checked={contentForm.is_subscriber_only} onChange={(e) => setContentForm({...contentForm, is_subscriber_only: e.target.checked})} />
                    <label className="text-[10px] font-black uppercase text-amber-500 tracking-widest flex items-center gap-1"><Crown size={12}/> Exclusivo VIP</label>
                  </div>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><FileText size={12}/> Sinopse</label><textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 resize-none" value={contentForm.synopsis} onChange={(e) => setContentForm({...contentForm, synopsis: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Users size={12}/> Elenco</label><input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={contentForm.movie_cast?.join(', ') || ''} onChange={(e) => setContentForm({...contentForm, movie_cast: e.target.value.split(',').map(m => m.trim())})} /></div>
                <div className="pt-4 flex gap-4"><button type="button" onClick={() => setShowContentModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-500 font-black text-xs uppercase hover:text-white transition-all">Cancelar</button><button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-xl bg-red-600 text-white font-black text-xs uppercase shadow-xl hover:bg-red-700 transition-all">{isSubmitting ? 'Salvando...' : 'Confirmar'}</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOTIFICAÇÕES COMPLETO */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowNotificationModal(false)} />
          <div className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-2xl p-10 text-left animate-in zoom-in duration-200">
             <header className="mb-8"><h3 className="text-3xl font-black uppercase tracking-tighter">Novo Aviso VIP</h3></header>
             <form onSubmit={handleSendNotification} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Tipo</label><select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={notificationForm.type} onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value as any})}><option value="info">Info</option><option value="alert">Alerta</option><option value="promo">Promo</option></select></div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Alvo (ID Vazio = Todos)</label><input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={notificationForm.target_user_id} onChange={(e) => setNotificationForm({...notificationForm, target_user_id: e.target.value})} placeholder="Ex: 882941" /></div>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Título</label><input required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600" value={notificationForm.title} onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Mensagem</label><textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 resize-none" value={notificationForm.message} onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})} /></div>
                <div className="pt-6 flex gap-4"><button type="button" onClick={() => setShowNotificationModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-500 font-black text-xs uppercase">Cancelar</button><button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-xl bg-red-600 text-white font-black text-xs uppercase shadow-xl">{isSubmitting ? 'Enviando...' : 'Disparar Agora'}</button></div>
             </form>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95">
          <div className="bg-[#111] p-10 rounded-2xl border border-white/10 max-w-sm w-full text-center">
            <Trash2 size={48} className="text-red-600 mx-auto mb-6" />
            <h4 className="text-2xl font-black mb-6 uppercase tracking-tighter">Confirmar Exclusão?</h4>
            <div className="flex gap-4">
              <button onClick={() => setItemToDelete(null)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-xs uppercase transition-colors hover:text-white">Manter</button>
              <button onClick={handleDelete} className="flex-1 py-4 rounded-xl bg-red-600 text-white font-black text-xs uppercase shadow-xl hover:bg-red-700 transition-all">Excluir</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E50914; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
