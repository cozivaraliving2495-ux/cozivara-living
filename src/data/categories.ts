export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  badgeBg: string;
  badgeText: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'small-spaces',
    name: 'Small Spaces',
    slug: 'small-spaces',
    tagline: 'Smart ideas for compact living.',
    description: 'Transform snug apartments and tiny nooks into open, airy sanctuaries with clever multifunctional styling.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-[#EEF2EC]',
    badgeText: 'text-[#485540]',
  },
  {
    id: 'budget-decor',
    name: 'Budget Decor',
    slug: 'budget-decor',
    tagline: 'Stylish looks for less.',
    description: 'Elevate your interior without overspending. Curated thrift finds, DIY hacks, and high-end aesthetics on a real budget.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-[#F4EFEA]',
    badgeText: 'text-[#8C6D53]',
  },
  {
    id: 'bedroom-ideas',
    name: 'Bedroom Ideas',
    slug: 'bedroom-ideas',
    tagline: 'Cozy & calm sleep spaces.',
    description: 'Create peaceful, restful retreats featuring layered linens, ambient lighting, and serene neutral color schemes.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-[#F9EDE6]',
    badgeText: 'text-[#965A4B]',
  },
  {
    id: 'home-organization',
    name: 'Home Organization',
    slug: 'home-organization',
    tagline: 'Less clutter, more peace.',
    description: 'Streamlined pantry systems, closet makeovers, and thoughtful daily storage habits that bring immediate calm.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-[#EBF2EB]',
    badgeText: 'text-[#425C40]',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    slug: 'lifestyle',
    tagline: 'Simple living. Happier you.',
    description: 'Mindful home habits, slow morning routines, sustainable seasonal updates, and intentional host rituals.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-[#F2ECE6]',
    badgeText: 'text-[#6C5345]',
  },
];
