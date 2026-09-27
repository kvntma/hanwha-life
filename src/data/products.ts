export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  price: number;
  category: 'Signature' | 'Elite' | 'Standard';
  inventory_count: number;
  weight: string;
  featured?: boolean;
  strength_mg: number;
  flavor_profile: string; // Used for purity / form description
};

export const products: Product[] = [
  {
    id: '637bcbe3-f000-4ff2-b8c2-43db66b3f720',
    name: 'BPC-157 Regenerate',
    tagline: 'Cellular healing catalyst.',
    description: 'Body Protection Compound 157 is a premium peptide designed to support tissue recovery, joint health, and gut system healing. High-purity formula.',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=2070&auto=format&fit=crop',
    price: 69.99,
    category: 'Signature',
    inventory_count: 150,
    weight: '5mg vial',
    featured: true,
    strength_mg: 5,
    flavor_profile: '99.8% Purity / Lyophilized'
  },
  {
    id: '8d313b16-a57b-4a42-aeb0-6c427529305f',
    name: 'TB-500 Longevity',
    tagline: 'Tissue repair optimizer.',
    description: 'Thymosin Beta-4 is an elite research peptide engineered to promote healing, muscle repair, and flexibility. Crucial for advanced systemic regeneration.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    price: 79.99,
    category: 'Signature',
    inventory_count: 100,
    weight: '5mg vial',
    featured: true,
    strength_mg: 5,
    flavor_profile: '99.9% Purity / Lyophilized'
  },
  {
    id: 'ae7cbe2e-871f-44ca-8fb8-76b1d744f224',
    name: 'Semaglutide Apex',
    tagline: 'Metabolic performance core.',
    description: 'An advanced GLP-1 receptor agonist for scientific research, optimized for metabolic efficiency, weight management, and steady nutrient partitioning.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2070&auto=format&fit=crop',
    price: 99.99,
    category: 'Standard',
    inventory_count: 120,
    weight: '10mg vial',
    featured: true,
    strength_mg: 10,
    flavor_profile: '99.7% Purity / Lyophilized'
  }
];
