export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  price: number;
  category: string;
  proteinType: 'chicken' | 'beef' | 'plant';
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  weight: string;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'The Shredder',
    tagline: 'Lean machine fuel',
    description:
      'Juicy grilled chicken breast with steamed broccoli and brown rice. The perfect post-workout meal to help you hit your macros without sacrificing flavor. Each bite is packed with protein to support your muscle recovery and growth.',
    image:
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=2070&auto=format&fit=crop',
    price: 12.99,
    category: 'Bestseller',
    proteinType: 'chicken',
    nutrition: {
      calories: 420,
      protein: 45,
      carbs: 30,
      fat: 12,
    },
    weight: '12 oz',
    featured: true,
  },
  {
    id: '2',
    name: 'No Moo Monday',
    tagline: 'Plant power perfection',
    description:
      'Plant-based protein bowl with quinoa, roasted vegetables, and our signature herb dressing. This vegan option packs a punch with complete proteins and essential nutrients that will keep you full and energized all day.',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
    price: 11.99,
    category: 'Plant-Based',
    proteinType: 'plant',
    nutrition: {
      calories: 380,
      protein: 22,
      carbs: 45,
      fat: 14,
    },
    weight: '11 oz',
    featured: true,
  },
  {
    id: '3',
    name: 'Bulking Beast',
    tagline: 'Mass gaining monster',
    description:
      'Premium grass-fed beef with sweet potato and roasted vegetables. This hearty meal is designed for those serious bulk phases, providing quality protein and complex carbs to fuel your growth without excess fat.',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop',
    price: 14.99,
    category: 'High Calorie',
    proteinType: 'beef',
    nutrition: {
      calories: 650,
      protein: 40,
      carbs: 65,
      fat: 22,
    },
    weight: '14 oz',
  },
  {
    id: '4',
    name: 'Teriyaki Titan',
    tagline: 'Asian-fusion gains',
    description:
      'Tender chicken thighs in our house-made teriyaki sauce with jasmine rice and stir-fried vegetables. The perfect blend of sweet and savory that will transport your taste buds while keeping your nutrition on point.',
    image:
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=2125&auto=format&fit=crop',
    price: 13.99,
    category: 'International',
    proteinType: 'chicken',
    nutrition: {
      calories: 510,
      protein: 35,
      carbs: 55,
      fat: 15,
    },
    weight: '12 oz',
  },
  {
    id: '5',
    name: 'Keto Konquest',
    tagline: 'Low carb, high flavor',
    description:
      "Grilled chicken breast with cauliflower rice and avocado. This keto-friendly option is perfect for those looking to maintain ketosis while enjoying a satisfying meal that doesn't taste like diet food.",
    image:
      'https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=2187&auto=format&fit=crop',
    price: 13.99,
    category: 'Keto',
    proteinType: 'chicken',
    nutrition: {
      calories: 390,
      protein: 35,
      carbs: 8,
      fat: 24,
    },
    weight: '11 oz',
    featured: true,
  },
  {
    id: '6',
    name: 'Beefy Boy',
    tagline: 'Serious gains fuel',
    description:
      'Slow-cooked beef with roasted potatoes and seasonal vegetables. This protein-packed meal provides sustained energy and muscle-building nutrients to support even the most intense training regimens.',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
    price: 14.99,
    category: 'Bestseller',
    proteinType: 'beef',
    nutrition: {
      calories: 520,
      protein: 42,
      carbs: 40,
      fat: 18,
    },
    weight: '13 oz',
  },
  {
    id: '7',
    name: 'Green Gains',
    tagline: 'Plant-powered pump',
    description:
      "Protein-rich lentils with roasted vegetables and our signature herb sauce. Proof that plant-based eating doesn't mean sacrificing protein or flavor, this meal delivers both while keeping your carbon footprint low.",
    image:
      'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=2064&auto=format&fit=crop',
    price: 12.99,
    category: 'Plant-Based',
    proteinType: 'plant',
    nutrition: {
      calories: 410,
      protein: 24,
      carbs: 50,
      fat: 12,
    },
    weight: '12 oz',
  },
  {
    id: '8',
    name: 'Spicy Gainz',
    tagline: 'Heat up your metabolism',
    description:
      'Spicy chicken breast with black beans and cilantro lime rice. The perfect balance of heat and flavor, this meal will fire up your metabolism while providing quality protein for muscle recovery.',
    image:
      'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=1935&auto=format&fit=crop',
    price: 13.49,
    category: 'Spicy',
    proteinType: 'chicken',
    nutrition: {
      calories: 450,
      protein: 38,
      carbs: 45,
      fat: 10,
    },
    weight: '12 oz',
  },
];
