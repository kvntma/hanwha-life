/**
 * Script to sync completed Linear tickets to PRD checkboxes
 * This script reads Linear issues and updates the PRD.md checkboxes accordingly
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';
import { LinearClient } from '@linear/sdk';

// Load environment variables from root .env.local
const envPath = resolve(process.cwd(), '.env.local');
console.log('Loading environment from:', envPath);
config({ path: envPath });

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const TEAM_ID = process.env.LINEAR_TEAM_ID;

if (!LINEAR_API_KEY || !TEAM_ID) {
  console.error('Missing required environment variables:');
  console.error('LINEAR_API_KEY:', LINEAR_API_KEY ? '✓' : '✗');
  console.error('LINEAR_TEAM_ID:', TEAM_ID ? '✓' : '✗');
  process.exit(1);
}

const linearClient = new LinearClient({
  apiKey: LINEAR_API_KEY,
});

async function syncCompletedTasks() {
  try {
    console.log('\nFetching completed issues from Linear...');

    // Get all completed issues from Linear
    const issues = await linearClient.issues({
      filter: {
        team: { id: { eq: TEAM_ID } },
        state: { type: { eq: 'completed' } },
      },
    });

    console.log(`Found ${issues.nodes.length} completed issues in Linear`);

    // Read the PRD file
    const prdPath = resolve(process.cwd(), 'PRD.md');
    let prdContent = fs.readFileSync(prdPath, 'utf-8');

    // Track changes
    let updatedTasks = 0;
    let skippedTasks = 0;
    let notFoundTasks = 0;

    // Process each completed issue
    for (const issue of issues.nodes) {
      console.log(`\nProcessing issue: "${issue.title}"`);

      // Escape special characters in the title for regex
      const escapedTitle = issue.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Match both checked and unchecked tasks
      const taskPattern = new RegExp(`- \\[( |x)\\] ${escapedTitle}`, 'g');

      // Find the current state of the task in the PRD
      const currentMatch = prdContent.match(taskPattern);

      if (!currentMatch) {
        console.log(`⚠️  Task not found in PRD: "${issue.title}"`);
        notFoundTasks++;
        continue;
      }

      const currentState = currentMatch[0].includes('[x]');

      // If already checked, skip
      if (currentState) {
        console.log(`✓ Task already checked: "${issue.title}"`);
        skippedTasks++;
        continue;
      }

      // Update the task to checked
      const replacement = `- [x] ${issue.title}`;
      const oldContent = prdContent;
      prdContent = prdContent.replace(taskPattern, replacement);

      // Verify the replacement worked
      if (oldContent === prdContent) {
        console.log(`❌ Failed to update task: "${issue.title}"`);
        console.log('Pattern:', taskPattern);
        console.log('Replacement:', replacement);
      } else {
        console.log(`✅ Updated task to checked: "${issue.title}"`);
        updatedTasks++;
      }
    }

    // Write updated content back to PRD
    fs.writeFileSync(prdPath, prdContent);

    // Print summary
    console.log('\nSync Summary:');
    console.log(`Total completed issues: ${issues.nodes.length}`);
    console.log(`Tasks updated: ${updatedTasks}`);
    console.log(`Tasks skipped (already checked): ${skippedTasks}`);
    console.log(`Tasks not found in PRD: ${notFoundTasks}`);
    console.log('\n✅ PRD updated with completed tasks');
  } catch (error) {
    console.error('Error syncing completed tasks:', error);
    process.exit(1);
  }
}

// Run the script
syncCompletedTasks();
