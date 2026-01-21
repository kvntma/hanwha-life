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
  flavor_profile: string;
};

export const products: Product[] = [
  {
    id: '637bcbe3-f000-4ff2-b8c2-43db66b3f720',
    name: 'Arctic Mint',
    tagline: 'Sub-zero focus.',
    description: 'Crisp, bone-chilling mint that hits with precision. Stay sharp, stay cool.',
    image: 'https://pouchpal-store.lovable.app/assets/product-mint-DF6hOC_L.jpg',
    price: 11.99,
    category: 'Signature',
    inventory_count: 150,
    weight: '10 tins',
    featured: true,
    strength_mg: 16,
    flavor_profile: 'Ice / Precision Mint'
  },
  {
    id: '8d313b16-a57b-4a42-aeb0-6c427529305f',
    name: 'Black Thunder',
    tagline: 'Pure intensity.',
    description: 'A deep, bold nicotine experience with dark undertones. Designed for the relentless.',
    image: 'https://pouchpal-store.lovable.app/assets/product-strong-DkOY5pmk.jpg',
    price: 12.99,
    category: 'Signature',
    inventory_count: 100,
    weight: '10 tins',
    featured: true,
    strength_mg: 24,
    flavor_profile: 'Dark Tobacco / Bold'
  },
  {
    id: 'ae7cbe2e-871f-44ca-8fb8-76b1d744f224',
    name: 'Vortex Berry',
    tagline: 'Infinite flavor.',
    description: 'Electric berry blast with a lingering finish. Fast-acting and fierce.',
    image: 'https://pouchpal-store.lovable.app/assets/product-berry-Dk4n3c20.jpg',
    price: 11.99,
    category: 'Standard',
    inventory_count: 120,
    weight: '10 tins',
    featured: false,
    strength_mg: 16,
    flavor_profile: 'Wild Berry / Charge'
  }
];
