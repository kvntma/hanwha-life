
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newPeptides = [
  {
    id: '637bcbe3-f000-4ff2-b8c2-43db66b3f720',
    name: 'BPC-157 Regenerate',
    tagline: 'Cellular healing catalyst.',
    description: 'Body Protection Compound 157 is a premium peptide designed to support tissue recovery, joint health, and gut system healing. High-purity formula.',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306dca665?q=80&w=2070&auto=format&fit=crop',
    price: 69.99,
    category: 'Signature',
    inventory_count: 150,
    weight: '5mg vial',
    featured: true,
    available: true
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
    available: true
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
    featured: false,
    available: true
  }
];

async function seedDatabase() {
    console.log('Seeding products on:', supabaseUrl);

    // 1. Delete old products
    const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
        console.error('Failed to clear old products:', deleteError.message);
        return;
    }
    console.log('Cleared legacy products.');

    // 2. Insert new products
    const { data, error: insertError } = await supabase.from('products').insert(newPeptides).select();
    if (insertError) {
        console.error('Failed to seed peptides:', insertError.message);
    } else {
        console.log('Database seeded successfully with new peptides!');
        console.log('Seeded products:', data?.map(p => p.name));
    }
}

seedDatabase();
