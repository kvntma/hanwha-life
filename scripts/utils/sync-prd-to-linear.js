
import fs from 'fs';
import path from 'path';
import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
config({ path: envPath });

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const TEAM_ID = process.env.LINEAR_TEAM_ID || '2f63878f-7c59-40f3-a1b7-6a7ea6c37c5a';

if (!LINEAR_API_KEY) {
    console.error('❌ Missing LINEAR_API_KEY');
    process.exit(1);
}

const client = new LinearClient({ apiKey: LINEAR_API_KEY });

async function syncPRDToLinear() {
    console.log('🔄 Syncing PRD.md -> Linear Status...');

    try {
        const prdPath = path.resolve(process.cwd(), 'PRD.md');
        const prdContent = fs.readFileSync(prdPath, 'utf8');

        // Parse completed tasks from PRD
        const lines = prdContent.split(/\r?\n/);
        const completedTasks = new Set();

        for (const line of lines) {
            const match = line.match(/^\s*-\s*\[x\]\s+(.+)/);
            if (match) {
                completedTasks.add(match[1].trim());
            }
        }

        console.log(`Found ${completedTasks.size} completed tasks in PRD.md`);

        if (completedTasks.size === 0) {
            console.log('No completed tasks to sync.');
            return;
        }

        // Fetch all issues for the team
        console.log('Fetching issues from Linear...');
        const issues = await client.issues({
            filter: { team: { id: { eq: TEAM_ID } } }
        });

        let allIssues = issues.nodes;
        while (issues.pageInfo.hasNextPage) {
            await issues.fetchNext();
            allIssues = allIssues.concat(issues.nodes);
        }

        // Get the "Done" state ID for this team
        const team = await client.team(TEAM_ID);
        const states = await team.states();
        const doneState = states.nodes.find(s => s.name === 'Done' || s.type === 'completed');

        if (!doneState) {
            console.error('❌ Could not find "Done" state in Linear');
            return;
        }

        let updatedCount = 0;

        for (const issue of allIssues) {
            if (completedTasks.has(issue.title.trim())) {
                const state = await issue.state;
                if (state.type !== 'completed') {
                    console.log(`✅ Updating to Done: ${issue.title}`);
                    await issue.update({ stateId: doneState.id });
                    updatedCount++;
                    // Small delay to prevent rate limit
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
        }

        console.log(`✅ Updated ${updatedCount} issues in Linear.`);

    } catch (error) {
        console.error('❌ Error syncing:', error);
    }
}

syncPRDToLinear();
