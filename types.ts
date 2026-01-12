
export interface ContentItem {
  id: string;
  title: string;
  category: 'movie' | 'series' | 'cartoon';
  image_url: string;
  rating: number;
  year: string;
  is_new: boolean;
  created_at?: string;
  synopsis?: string;
  movie_cast?: string[];
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  is_recommended: boolean;
  checkout_url: string;
  renewal_url: string;
  created_at?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'promo';
  target_user_id?: string; // Se vazio, envia para todos
  is_read?: boolean;
  created_at?: string;
}

export interface AppSettings {
  referral_reward_days: number;
  support_whatsapp: string;
  trial_hours: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}
