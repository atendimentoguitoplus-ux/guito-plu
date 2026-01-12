
import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SectionHeader from './SectionHeader';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Inserção real no banco de dados leads
      const { error } = await supabase.from('leads').insert([
        { 
          full_name: formData.name, 
          email: formData.email, 
          phone: formData.phone,
          message: formData.message
        }
      ]);

      if (error) throw error;
      
      // WhatsApp Redirect Logic
      const referralNumber = "5598982804577";
      const whatsappMsg = `Olá! Meu nome é ${formData.name}. Gostaria de solicitar um teste grátis no Guito Plus.\n\nE-mail: ${formData.email}\nMensagem: ${formData.message}`;
      const whatsappUrl = `https://wa.me/${referralNumber}?text=${encodeURIComponent(whatsappMsg)}`;
      
      setSuccess(true);
      window.open(whatsappUrl, '_blank');
      
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Erro ao enviar para o Supabase:', err);
      alert('Houve um problema ao processar sua solicitação. Verifique se o banco de dados está configurado corretamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-900/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <SectionHeader subtitle="Dúvidas ou Suporte" title="Fale Conosco" />

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
          <div className="space-y-8">
            <div>
              <h4 className="text-3xl font-bold mb-6">Pronto para a <span className="text-red-600">melhor experiência</span> de streaming?</h4>
              <p className="text-gray-400 text-lg leading-relaxed">
                Nossa equipe está pronta para te ajudar a configurar seu dispositivo e garantir que você aproveite o melhor do Guito Plus.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 glass p-4 rounded-2xl">
                <div className="bg-red-600/20 p-3 rounded-xl text-red-500">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-bold">E-mail</p>
                  <p className="text-lg font-semibold">contato@guitoplus.com.br</p>
                </div>
              </div>

              <div className="flex items-center gap-4 glass p-4 rounded-2xl">
                <div className="bg-red-600/20 p-3 rounded-xl text-red-500">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-bold">WhatsApp Suporte</p>
                  <p className="text-lg font-semibold">(98) 98280-4577</p>
                </div>
              </div>

              <div className="flex items-center gap-4 glass p-4 rounded-2xl">
                <div className="bg-red-600/20 p-3 rounded-xl text-red-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-bold">Atendimento</p>
                  <p className="text-lg font-semibold">Online em todo o Brasil</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 md:p-12 rounded-[2.5rem] relative">
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
                <CheckCircle2 size={80} className="text-green-500 mb-6" />
                <h4 className="text-2xl font-bold mb-2">Solicitação Iniciada!</h4>
                <p className="text-gray-400">Estamos te redirecionando para o WhatsApp do suporte...</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-8 text-red-500 font-bold underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 ml-1">Nome Completo</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: João Silva"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white placeholder:text-gray-600"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 ml-1">WhatsApp</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="(00) 00000-0000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white placeholder:text-gray-600"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 ml-1">E-mail</label>
                  <input 
                    required
                    type="email" 
                    placeholder="exemplo@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white placeholder:text-gray-600"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 ml-1">O que você busca no Guito Plus?</label>
                  <textarea 
                    rows={4}
                    placeholder="Conte-nos o que você gosta de assistir."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white placeholder:text-gray-600 resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.3)]"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Solicitar Teste Grátis</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
