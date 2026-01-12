
import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    // Simulação de autenticação de servidor admin
    setTimeout(() => {
      // Credenciais Master Atualizadas: Admin / Gui2530
      if (username.toLowerCase() === 'admin' && password === 'Gui2530') {
        setStatus('success');
        setTimeout(() => {
          onLoginSuccess();
          setLoading(false);
        }, 1000);
      } else {
        setLoading(false);
        setError('Acesso negado. Credenciais inválidas para o Painel Master.');
        triggerShake();
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-red-600 selection:text-white">
      {/* Background radial effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full" />
      </div>

      <div className={`relative w-full max-w-md transition-all duration-500 ${isShaking ? 'animate-shake' : 'animate-in fade-in zoom-in'}`}>
        {/* Header Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-red-600 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)] mb-6">
            <ShieldAlert size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">
            Guito <span className="text-red-600">Master</span>
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Acesso Restrito ao Administrador</p>
        </div>

        {/* Login Form */}
        <div className="glass p-8 sm:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          {status === 'success' && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
              <CheckCircle2 size={64} className="text-green-500 mb-4 animate-bounce" />
              <h3 className="text-xl font-black text-white mb-1">Identidade Verificada</h3>
              <p className="text-gray-400 text-sm">Iniciando Dashboard de Controle...</p>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-6">
            {error && (
              <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold animate-in slide-in-from-top-2">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Usuário Administrativo</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={20} />
                <input 
                  required
                  type="text" 
                  placeholder="Seu usuário"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-red-600 text-white font-medium transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Senha de Acesso</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={20} />
                <input 
                  required
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-red-600 text-white font-medium transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Autenticar Acesso'}
            </button>

            <button 
              type="button"
              onClick={onCancel}
              className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors py-2 text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Voltar para o Site
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-700 uppercase font-black tracking-[0.2em]">
            Guito Plus Security Engine • v4.2.0
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
