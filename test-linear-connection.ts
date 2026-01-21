
import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
    console.error('❌ Missing LINEAR_API_KEY in .env.local');
    process.exit(1);
}

const client = new LinearClient({ apiKey: LINEAR_API_KEY });

async function testConnection() {
    console.log('Testing Linear Connection...');
    try {
        const me = await client.viewer;
        console.log(`✅ Connected as user: ${me.name} (${me.email})`);

        console.log('Fetching available teams...');
        const teams = await client.teams();

        if (teams.nodes.length > 0) {
            console.log('\n--- AVAILABLE TEAMS ---');
            teams.nodes.forEach(team => {
                console.log(`Name: ${team.name}`);
                console.log(`Key:  ${team.key}`);
                console.log(`ID:   ${team.id}  <-- USE THIS FOR LINEAR_TEAM_ID`);
                console.log('---');
            });
        } else {
            console.log('No teams found for this user.');
        }

    } catch (error: any) {
        console.error('❌ Connection Failed:', error.message || error);
    }
}

testConnection();
