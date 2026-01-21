
import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const TEAM_ID = process.env.LINEAR_TEAM_ID || '2f63878f-7c59-40f3-a1b7-6a7ea6c37c5a';

const client = new LinearClient({ apiKey: LINEAR_API_KEY });

async function listTitles() {
    const issues = await client.issues({ filter: { team: { id: { eq: TEAM_ID } } } });
    let allIssues = issues.nodes;
    while (issues.pageInfo.hasNextPage) {
        await issues.fetchNext();
        allIssues = allIssues.concat(issues.nodes);
    }

    console.log(`--- Total Issues: ${allIssues.length} ---`);
    for (const i of allIssues) {
        const state = await i.state;
        console.log(`[${state?.name}] ${i.title}`);
    }
}

listTitles();
