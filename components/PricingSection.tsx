
import React from 'react';
import { Check, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { Plan } from '../types';
import SectionHeader from './SectionHeader';

interface PricingSectionProps {
  plans: Plan[];
  loading: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({ plans, loading }) => {
  const handleSupportClick = () => {
    const message = "Olá! Tenho uma dúvida sobre os planos do Guito Plus.";
    window.open(`https://wa.me/5598982804577?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="plans" className="py-24 bg-[#0d0d0d] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader 
          subtitle="Preços Transparentes" 
          title="Escolha o Plano Ideal" 
        />

        {loading && plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <p className="text-gray-500 font-medium">Buscando as melhores ofertas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative p-8 rounded-[2.5rem] transition-all duration-500 transform hover:-translate-y-3 flex flex-col h-full ${
                  plan.is_recommended 
                  ? 'bg-gradient-to-br from-red-600 to-red-900 border-2 border-red-500 shadow-[0_25px_60px_rgba(220,38,38,0.25)]' 
                  : 'glass border-white/5 hover:border-white/20'
                }`}
              >
                {plan.is_recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-red-600 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">
                    Mais Popular
                  </div>
                )}

                <div className="mb-8">
                  <h4 className={`text-2xl font-bold mb-4 ${plan.is_recommended ? 'text-white' : 'text-gray-100'}`}>
                    {plan.name}
                  </h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-medium opacity-70">R$</span>
                    <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                    <span className="text-sm opacity-70">/mês</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-1 p-0.5 rounded-full flex-shrink-0 ${plan.is_recommended ? 'bg-white/20' : 'bg-red-600/20'}`}>
                        <Check size={14} className={plan.is_recommended ? 'text-white' : 'text-red-500'} />
                      </div>
                      <span className={`text-sm font-medium ${plan.is_recommended ? 'text-white/90' : 'text-gray-300'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a 
                  href={plan.checkout_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black flex items-center justify-center gap-2 ${
                  plan.is_recommended 
                  ? 'bg-white text-red-600 hover:bg-gray-100 shadow-xl focus-visible:ring-white' 
                  : 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600'
                }`}
                >
                  Quero o {plan.name} <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="glass p-8 rounded-[2rem] flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/5">
            <div className="flex items-center gap-6 text-left">
              <div className="bg-red-600/10 p-4 rounded-2xl">
                <ShieldCheck className="text-red-500" size={36} />
              </div>
              <div>
                <h5 className="font-bold text-xl mb-1">Pagamento 100% Seguro</h5>
                <p className="text-sm text-gray-400">Sem renovação automática ou taxas escondidas.</p>
              </div>
            </div>
            <div className="hidden lg:block h-12 w-px bg-white/10" aria-hidden="true" />
            <div className="flex flex-col items-center lg:items-end">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-tighter">Tem alguma dúvida?</p>
              <button 
                onClick={handleSupportClick}
                className="text-red-500 font-bold hover:text-red-400 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-lg px-2 py-1"
              >
                Chamar no WhatsApp <Check size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
