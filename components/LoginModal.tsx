
import React, { useState, useEffect } from 'react';
import { Hash, Loader2, X, Shield, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase, isProduction } from '../supabaseClient';

interface LoginModalProps {
  onLogin: (userData: any) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [userNumber, setUserNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
  }, [userNumber]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (userNumber.length < 4) {
      setStatus('error');
      setMessage('O ID deve conter pelo menos 4 dígitos.');
      triggerShake();
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('Verificando sua assinatura...');
    
    // Simulação de login para modo de demonstração
    if (!isProduction) {
      setTimeout(() => {
        if (userNumber === '1234' || userNumber === '882941') {
          // No modo demo, o ID 1234 será tratado como inativo para teste da tela de bloqueio
          const isUserActive = userNumber === '882941'; 
          
          if (!isUserActive && userNumber === '1234') {
             // Deixa o login prosseguir para que o usuário veja a tela de bloqueio no ClientArea
          }

          setStatus('success');
          setMessage('Login demonstrativo realizado!');
          setTimeout(() => {
            onLogin({
              id: userNumber,
              name: 'Usuário de Teste',
              email: 'teste@guitoplus.com',
              plan: 'Plano Premium VIP',
              expiry: '31/12/2025',
              server: 'plus.guitoserve.tv',
              status: isUserActive ? 'active' : 'inactive'
            });
          }, 800);
        } else {
          setLoading(false);
          setStatus('error');
          setMessage('Modo Demonstração: use o ID 1234 ou 882941 para testar.');
          triggerShake();
        }
      }, 1200);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', userNumber)
        .single();

      if (error || !data) {
        throw new Error('Assinante não encontrado');
      }

      // Se estiver explicitamente inativo, avisa no login (bloqueio preventivo)
      if (data.status === 'inactive') {
        setLoading(false);
        setStatus('error');
        setMessage('Sua assinatura está suspensa ou expirada. Entre em contato com o suporte.');
        triggerShake();
        return;
      }

      setStatus('success');
      setMessage(`Bem-vindo de volta, ${data.name}!`);
      
      setTimeout(() => {
        onLogin({
          id: data.id,
          name: data.name,
          email: data.email || 'assinante@guitoplus.com',
          plan: data.app_name || 'Plano VIP',
          expiry: data.expiry,
          renewal_link: data.renewal_link,
          server: data.server,
          status: data.status
        });
      }, 1000);

    } catch (err) {
      console.error('Erro de login:', err);
      setLoading(false);
      setStatus('error');
      setMessage('ID de usuário não localizado ou assinatura bloqueada.');
      triggerShake();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className={`relative w-full max-w-md bg-[#0d0d0d] border ${status === 'error' ? 'border-red-600/50' : status === 'success' ? 'border-green-500/50' : 'border-white/10'} rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_0_100px_rgba(220,38,38,0.2)] transition-all duration-300 ${isShaking ? 'animate-shake' : 'animate-in fade-in slide-in-from-bottom-5'} max-h-[95vh] flex flex-col overflow-hidden`}>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 ${status === 'error' ? 'bg-red-600/10 text-red-600' : status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-600/10 text-red-600'} rounded-2xl sm:rounded-3xl mb-6 border transition-colors duration-300 ${status === 'error' ? 'border-red-600/20' : status === 'success' ? 'border-green-500/20' : 'border-red-600/20'}`}>
              {status === 'success' ? (
                <CheckCircle2 size={40} className="animate-in zoom-in" />
              ) : (
                <Shield size={40} />
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
              {status === 'success' ? 'Acesso Liberado!' : 'Área do Cliente'}
            </h2>
            <p className="text-sm text-gray-400">
              {status === 'success' ? 'Carregando seu painel personalizado...' : 'Digite seu ID de assinante para entrar.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">ID de Assinante</label>
                {status === 'error' && (
                  <span className="text-[10px] text-red-500 font-bold flex items-center gap-1 animate-in slide-in-from-right-2">
                    <AlertCircle size={10} /> Verifique seu status
                  </span>
                )}
              </div>
              <div className="relative group">
                <Hash className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${status === 'error' ? 'text-red-500' : status === 'success' ? 'text-green-500' : 'text-gray-500 group-focus-within:text-red-600'}`} size={20} />
                <input 
                  required
                  disabled={loading || status === 'success'}
                  type="text" 
                  inputMode="numeric"
                  placeholder="Ex: 882941"
                  className={`w-full bg-white/5 border rounded-2xl pl-14 pr-5 py-4 sm:py-5 focus:outline-none focus:ring-2 transition-all text-white text-lg font-mono placeholder:text-gray-700 disabled:opacity-50 ${status === 'error' ? 'border-red-600/50 focus:ring-red-600' : status === 'success' ? 'border-green-500/50 focus:ring-green-500' : 'border-white/10 focus:ring-red-600'}`}
                  value={userNumber}
                  onChange={(e) => setUserNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {message && (
                <p className={`text-[11px] font-bold mt-2 ml-1 animate-in fade-in duration-300 ${status === 'error' ? 'text-red-500' : 'text-green-500 font-black'}`}>
                  {message}
                </p>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading || !userNumber || status === 'success'}
              className={`w-full py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
                status === 'success' 
                  ? 'bg-green-500 text-white shadow-green-500/20' 
                  : status === 'error' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Verificando...</span>
                </>
              ) : status === 'success' ? (
                <>Bem-vindo <CheckCircle2 size={20} /></>
              ) : (
                <>Entrar no Painel <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5 text-center">
            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed px-2">
              Precisa de ajuda ou renovar? Fale com nosso suporte.
            </p>
            <a 
              href="https://wa.me/5598982804577"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-red-500 text-xs font-bold hover:text-red-400 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              Suporte via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
