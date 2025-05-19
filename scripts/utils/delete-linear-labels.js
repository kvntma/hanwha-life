/**
 * Script to delete all labels from a Linear team
 * WARNING: This will permanently delete all labels from the specified team
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { LinearClient } from '@linear/sdk';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);

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

async function getAllLabels(teamId) {
  try {
    const labels = await linearClient.issueLabels({
      filter: { team: { id: { eq: teamId } } },
    });
    return labels.nodes;
  } catch (error) {
    console.error('Error fetching labels:', error);
    return [];
  }
}

async function deleteLabel(labelId) {
  try {
    await linearClient.deleteIssueLabel(labelId);
    return true;
  } catch (error) {
    console.error(`Error deleting label ${labelId}:`, error);
    return false;
  }
}

async function main() {
  try {
    console.log('Fetching all labels...');
    const labels = await getAllLabels(TEAM_ID);

    if (labels.length === 0) {
      console.log('No labels found to delete.');
      return;
    }

    console.log(`Found ${labels.length} labels to delete.`);
    console.log('\nLabels to be deleted:');
    labels.forEach(label => console.log(`- ${label.name}`));

    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will permanently delete all labels from your team.');
    console.log('Type "DELETE" to confirm:');

    // Wait for user input
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', async data => {
      if (data.trim() === 'DELETE') {
        console.log('\nDeleting labels...');

        let successCount = 0;
        let failCount = 0;

        for (const label of labels) {
          const success = await deleteLabel(label.id);
          if (success) {
            console.log(`✅ Deleted: ${label.name}`);
            successCount++;
          } else {
            console.log(`❌ Failed to delete: ${label.name}`);
            failCount++;
          }
        }

        console.log('\nDeletion complete!');
        console.log(`Successfully deleted: ${successCount} labels`);
        if (failCount > 0) {
          console.log(`Failed to delete: ${failCount} labels`);
        }
      } else {
        console.log('\nOperation cancelled.');
      }
      process.exit(0);
    });
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
}

// Run the script
main();
