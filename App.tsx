
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ContentCard from './components/ContentCard';
import PricingSection from './components/PricingSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ClientArea from './components/ClientArea';
import ContentDetailModal from './components/ContentDetailModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { supabase, isProduction } from './supabaseClient';
import { ContentItem, Plan, AppSettings } from './types';
import { RELEASES, CARTOONS, PLANS } from './constants';
import { Loader2, Tv, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    referral_reward_days: 7,
    support_whatsapp: '5598982804577',
    trial_hours: 6
  });
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [user, setUser] = useState<any>(() => {
    try {
      const savedUser = localStorage.getItem('guito_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });
  
  const [isClientAreaOpen, setIsClientAreaOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('guito_admin_auth') === 'true';
  });

  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  useEffect(() => {
    if (user) localStorage.setItem('guito_user', JSON.stringify(user));
    else localStorage.removeItem('guito_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('guito_admin_auth', String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  useLayoutEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (!isProduction) {
        setContent([...RELEASES, ...CARTOONS]);
        setPlans(PLANS);
        setLoading(false);
        return;
      }

      const [contentRes, plansRes, settingsRes] = await Promise.all([
        supabase.from('content').select('*').order('created_at', { ascending: false }),
        supabase.from('plans').select('*').order('price', { ascending: true }),
        supabase.from('settings').select('*').eq('id', 1).maybeSingle()
      ]);

      if (contentRes.data && contentRes.data.length > 0) setContent(contentRes.data);
      else setContent([...RELEASES, ...CARTOONS]);

      if (plansRes.data && plansRes.data.length > 0) setPlans(plansRes.data);
      else setPlans(PLANS);

      if (settingsRes.data) setSettings(settingsRes.data);

    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setContent([...RELEASES, ...CARTOONS]);
      setPlans(PLANS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateClientStatus = (clientId: string, newStatus: string) => {
    if (user && user.id === clientId) {
      setUser({ ...user, status: newStatus });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsClientAreaOpen(false);
    localStorage.removeItem('guito_user');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminView(false);
    localStorage.removeItem('guito_admin_auth');
  };

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-red-600" size={48} />
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-[10px]">Guito Plus Cinema</span>
        </div>
      </div>
    );
  }

  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin 
          onLoginSuccess={() => setIsAdminAuthenticated(true)} 
          onCancel={() => setIsAdminView(false)} 
        />
      );
    }
    return (
      <AdminDashboard 
        onClose={() => { setIsAdminView(false); fetchData(); }} 
        onLogout={handleAdminLogout}
        onUpdateClientStatus={handleUpdateClientStatus} 
        currentSettings={settings}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
      />
    );
  }

  // Filtramos apenas o conteúdo público (não exclusivo para assinantes) para a home
  const releases = content.filter(item => item.category !== 'cartoon' && !item.is_subscriber_only);
  const cartoons = content.filter(item => item.category === 'cartoon' && !item.is_subscriber_only);
  
  // No painel do cliente passamos todos os conteúdos ou apenas os relevantes
  const allReleasesForClient = content.filter(item => item.category !== 'cartoon');

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-600 selection:text-white overflow-x-hidden">
      <Navbar 
        isLoggedIn={!!user} 
        onOpenClientArea={() => setIsClientAreaOpen(true)}
        onLogin={(userData) => { 
          setUser(userData); 
          setIsClientAreaOpen(true); 
        }}
      />
      
      <main className="relative">
        <Hero />

        <section id="releases" className="py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-12 w-1.5 bg-red-600 rounded-full shadow-[0_0_15px_rgba(229,9,20,0.5)]"></div>
              <div>
                <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                  <Sparkles size={14} /> Estreias da Semana
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-left">Lançamentos <span className="text-red-600">Públicos</span></h2>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8 pb-12">
                {releases.map((item) => (
                  <ContentCard key={item.id} item={item} onClick={setSelectedContent} />
                ))}
                {releases.length === 0 && <p className="text-gray-500 col-span-full py-10 text-center font-bold uppercase tracking-widest text-xs">Nenhum título público disponível.</p>}
              </div>
            )}
          </div>
        </section>

        <section id="cartoons" className="py-24 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-12 w-1.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
              <div>
                <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                  <Tv size={14} /> Diversão em Família
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-left">Mundo <span className="text-blue-500">Kids</span></h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8 pb-12">
              {cartoons.map((cartoon) => (
                <ContentCard key={cartoon.id} item={cartoon} onClick={setSelectedContent} />
              ))}
              {cartoons.length === 0 && <p className="text-gray-500 col-span-full py-10 text-center font-bold uppercase tracking-widest text-xs">Em breve novos desenhos...</p>}
            </div>
          </div>
        </section>

        <PricingSection plans={plans} loading={loading} />
        <ContactSection />
      </main>

      <Footer onAdminClick={() => setIsAdminView(true)} />

      {isClientAreaOpen && user && (
        <ClientArea 
          user={user} 
          releases={allReleasesForClient} 
          referralDays={settings.referral_reward_days}
          onLogout={handleLogout} 
          onClose={() => setIsClientAreaOpen(false)} 
        />
      )}

      {selectedContent && (
        <ContentDetailModal item={selectedContent} onClose={() => setSelectedContent(null)} />
      )}
    </div>
  );
};

export default App;
