
export interface ContentItem {
  id: string;
  title: string;
  category: 'movie' | 'series' | 'cartoon';
  image_url: string;
  rating: number;
  year: string;
  is_new: boolean;
  is_subscriber_only?: boolean;
  created_at?: string;
  synopsis?: string;
  movie_cast?: string[];
}

export interface Plan {
  id?: string; // Tornado opcional para criação de novos planos
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
  target_user_id?: string;
  is_read?: boolean;
  created_at?: string;
}

export interface AppSettings {
  referral_reward_days: number;
  support_whatsapp: string;
  trial_hours: number;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  plan: string;
  expiry: string;
  status?: 'active' | 'inactive';
  renewal_link?: string;
  custom_banner_url?: string;
}
