
import { ContentItem, Plan } from './types';

export const RELEASES: ContentItem[] = [
  { 
    id: '1', 
    title: 'Duna: Parte Dois', 
    category: 'movie', 
    image_url: 'https://image.tmdb.org/t/p/original/8uD9879uX8X6f58p5c8o5b8f6q7.jpg', 
    rating: 9.8, 
    year: '2024', 
    is_new: true,
    synopsis: 'Paul Atreides se une a Chani e aos Fremen em uma guerra de vingança contra os conspiradores que destruíram sua família.',
    movie_cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson']
  },
  { 
    id: '2', 
    title: 'The Last of Us', 
    category: 'series', 
    image_url: 'https://image.tmdb.org/t/p/original/uKvHba6v9uS7XUshXvXvYV9zUvW.jpg', 
    rating: 9.5, 
    year: '2023', 
    is_new: false,
    synopsis: 'Vinte anos após a civilização moderna ser destruída, Joel, um sobrevivente experiente, é contratado para tirar Ellie de uma zona de quarentena.',
    movie_cast: ['Pedro Pascal', 'Bella Ramsey']
  },
  { 
    id: '3', 
    title: 'Deadpool & Wolverine', 
    category: 'movie', 
    image_url: 'https://image.tmdb.org/t/p/original/86S6pS8p9v9O5V9V9v9O5V9V9v9.jpg', 
    rating: 9.2, 
    year: '2024', 
    is_new: true,
    synopsis: 'O anti-herói favorito de todos retorna para salvar o multiverso ao lado do mutante mais icônico de todos.',
    movie_cast: ['Ryan Reynolds', 'Hugh Jackman']
  },
  { 
    id: '4', 
    title: 'House of the Dragon', 
    category: 'series', 
    image_url: 'https://image.tmdb.org/t/p/original/m7XpS8p9v9O5V9V9v9O5V9V9v9.jpg', 
    rating: 9.0, 
    year: '2024', 
    is_new: true,
    synopsis: 'A história da dinastia Targaryen, 200 anos antes dos eventos de Game of Thrones.',
    movie_cast: ['Emma D\'Arcy', 'Matt Smith']
  }
];

export const CARTOONS: ContentItem[] = [
  { id: 'c1', title: 'Divertida Mente 2', category: 'cartoon', image_url: 'https://image.tmdb.org/t/p/original/8uD9879uX8X6f58p5c8o5b8f6q8.jpg', rating: 9.6, year: '2024', is_new: true },
  { id: 'c2', title: 'Kung Fu Panda 4', category: 'cartoon', image_url: 'https://image.tmdb.org/t/p/original/8uD9879uX8X6f58p5c8o5b8f6q9.jpg', rating: 8.9, year: '2024', is_new: true },
  { id: 'c3', title: 'Super Mario Bros', category: 'cartoon', image_url: 'https://image.tmdb.org/t/p/original/8uD9879uX8X6f58p5c8o5b8f6q1.jpg', rating: 9.1, year: '2023', is_new: false },
  { id: 'c4', title: 'Homem-Aranha: Através do Aranhaverso', category: 'cartoon', image_url: 'https://image.tmdb.org/t/p/original/8uD9879uX8X6f58p5c8o5b8f6q2.jpg', rating: 9.8, year: '2023', is_new: false },
];

export const PLANS: Plan[] = [
  {
    id: 'p1',
    name: 'Essencial HD',
    price: '29,90',
    features: ['1 Tela HD', 'Todos os Canais Liberados', 'Filmes e Séries On-Demand', 'Suporte via WhatsApp'],
    is_recommended: false,
    checkout_url: 'https://wa.me/5598982804577?text=Quero+o+Plano+Essencial',
    renewal_url: 'https://wa.me/5598982804577?text=Quero+renovar+o+Essencial',
  },
  {
    id: 'p2',
    name: 'Guito VIP 4K',
    price: '45,90',
    features: ['2 Telas 4K Ultra HD', 'Canais de Esportes e Premiere', 'Lançamentos de Cinema VIP', 'Servidor de Alta Estabilidade'],
    is_recommended: true,
    checkout_url: 'https://wa.me/5598982804577?text=Quero+o+Plano+VIP',
    renewal_url: 'https://wa.me/5598982804577?text=Quero+renovar+o+VIP',
  },
  {
    id: 'p3',
    name: 'Master Família',
    price: '75,90',
    features: ['4 Telas 4K Simultâneas', 'Conteúdo Kids Completo', 'App para Todos Dispositivos', 'Prioridade em Suporte'],
    is_recommended: false,
    checkout_url: 'https://wa.me/5598982804577?text=Quero+o+Plano+Família',
    renewal_url: 'https://wa.me/5598982804577?text=Quero+renovar+o+Família',
  },
];
