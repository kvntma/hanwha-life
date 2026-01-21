
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function testRLS() {
    console.log('Testing RLS Security...');
    console.log('Attempting to insert product as Anonymous user...');

    const { data, error } = await supabase.from('products').insert({
        name: 'HACKER PRODUCT',
        description: 'This should not be here',
        price: 0,
        inventory_count: 100,
        available: true,
        tagline: 'Hacked',
        image: 'http://example.com/image.png'
    });

    if (error) {
        console.log('✅ SECURITY SUCCESS: Insert failed as expected.');
        console.log('Error reason:', error.message);
    } else {
        console.error('❌ SECURITY FAILURE: Anonymous user was able to insert a product!');
        console.log('Inserted data:', data);
    }
}

testRLS();
