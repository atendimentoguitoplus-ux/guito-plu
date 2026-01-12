
import { createClient } from '@supabase/supabase-js';

/**
 * Busca variáveis de ambiente de forma robusta para Vercel e Vite.
 */
const getEnvVar = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key] as string;
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Verificação de segurança para evitar crash em builds de CI/CD
const isConfigured = supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder');

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

export const isProduction = isConfigured;

if (isProduction) {
  console.log('🚀 [Guito Plus] Conectado ao Supabase Production');
} else {
  console.warn('⚠️ [Guito Plus] Rodando em modo DEMO. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
}
