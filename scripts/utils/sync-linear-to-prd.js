
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
// Use fallback team ID if env missing
const TEAM_ID = process.env.LINEAR_TEAM_ID || '2f63878f-7c59-40f3-a1b7-6a7ea6c37c5a';

if (!LINEAR_API_KEY) {
    console.error('❌ Missing LINEAR_API_KEY');
    process.exit(1);
}

const client = new LinearClient({ apiKey: LINEAR_API_KEY });

async function syncLinearToPRD() {
    console.log('🔄 Syncing Linear Status -> PRD.md...');

    try {
        // 1. Fetch all issues for the team
        console.log('Fetching issues from Linear...');
        const issues = await client.issues({
            filter: {
                team: { id: { eq: TEAM_ID } }
            }
        });

        // 2. Build map of Title -> IsDone
        const doneTasks = new Set();

        // We need to fetch state for each issue to know if it's done
        // Or we can pre-fetch states.
        // Easier: Fetch all issues, and for each, check its state.
        // Optimization: The issue object has a .state promise.

        // Linear SDK issues pagination...
        let allIssues = issues.nodes;
        while (issues.pageInfo.hasNextPage) {
            await issues.fetchNext();
            allIssues = allIssues.concat(issues.nodes);
        }

        console.log(`Found ${allIssues.length} total issues.`);

        for (const issue of allIssues) {
            const state = await issue.state;
            if (state.type === 'completed' || state.name.toLowerCase() === 'done') {
                doneTasks.add(issue.title.trim());
            }
        }

        console.log(`Found ${doneTasks.size} COMPLETED tasks.`);

        // 3. Update PRD.md
        const prdPath = path.resolve(process.cwd(), 'PRD.md');
        let prdContent = fs.readFileSync(prdPath, 'utf8');
        const lines = prdContent.split(/\r?\n/);
        let updatedLines = [];
        let updatesCount = 0;

        for (const line of lines) {
            // Match: - [ ] Task Title
            const match = line.match(/^(\s*-\s*\[)( )(\]\s+)(.+)$/);

            if (match) {
                const prefix = match[1];
                const suffix = match[3];
                const taskTitle = match[4].trim(); // Remove trailing newline chars if any implicit

                // Exact match check
                if (doneTasks.has(taskTitle)) {
                    updatedLines.push(`${prefix}x${suffix}${match[4]}`);
                    updatesCount++;
                } else {
                    updatedLines.push(line);
                }
            } else {
                updatedLines.push(line);
            }
        }

        if (updatesCount > 0) {
            fs.writeFileSync(prdPath, updatedLines.join('\n'), 'utf8');
            console.log(`✅ Updated ${updatesCount} tasks in PRD.md to [x]`);
        } else {
            console.log('✨ PRD is already up to date.');
        }

    } catch (error) {
        console.error('❌ Error syncing:', error);
    }
}

syncLinearToPRD();
