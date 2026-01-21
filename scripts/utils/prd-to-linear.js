/**
 * Script to convert PRD (Product Requirements Document) to Linear issues
 * This script reads the PRD.md file and creates corresponding issues in Linear
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
// Added fallback to your discovered Team ID
const TEAM_ID = process.env.LINEAR_TEAM_ID || '2f63878f-7c59-40f3-a1b7-6a7ea6c37c5a';

if (!LINEAR_API_KEY || !TEAM_ID) {
  console.error('Missing required environment variables:');
  console.error('LINEAR_API_KEY:', LINEAR_API_KEY ? '✓' : '✗');
  console.error('LINEAR_TEAM_ID:', TEAM_ID ? '✓' : '✗');
  process.exit(1);
}

const linearClient = new LinearClient({
  apiKey: LINEAR_API_KEY,
});

// Define label colors for different categories
const LABEL_COLORS = {
  auth: '#FF5733', // Orange-red
  product: '#33FF57', // Green
  checkout: '#3357FF', // Blue
  ui: '#F333FF', // Purple
  api: '#33FFF3', // Cyan
  database: '#FFB533', // Orange
  delivery: '#FF33A8', // Pink
  cms: '#33A8FF', // Light Blue
  webhook: '#A833FF', // Purple
  default: '#808080', // Gray
};

// Cache for labels to avoid repeated API calls
let labelCache = new Map();

function getLabelColor(category) {
  return LABEL_COLORS[category.toLowerCase()] || LABEL_COLORS.default;
}

function extractMainCategory(sectionName) {
  // Remove emojis and special characters, keep only letters, numbers, and spaces
  const cleanName = sectionName
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Remove emojis and symbols
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove any remaining non-alphanum
    .trim();

  console.log(`[extractMainCategory] Section: '${sectionName}' => Cleaned: '${cleanName}'`);

  // Map of section names to categories based on PRD.md sections
  const sectionToCategory = {
    authentication: 'auth',
    'product inventory flow': 'product',
    'checkout payments': 'checkout',
    'delivery system': 'delivery',
    'cms features': 'cms',
    'react query strategy': 'api',
    'webhooks automation': 'webhook',
  };

  // Direct match first - check if we have an exact mapping
  if (sectionToCategory[cleanName]) {
    return sectionToCategory[cleanName];
  }

  // Extract the main category from the section name
  const mainCategories = [
    'auth',
    'product',
    'checkout',
    'ui',
    'api',
    'database',
    'delivery',
    'cms',
    'webhook',
  ];

  // Check for specific keywords that indicate the category
  for (const [sectionKey, category] of Object.entries(sectionToCategory)) {
    if (cleanName.includes(sectionKey)) {
      return category;
    }
  }

  // Check if the section name contains any of the main categories as a substring
  for (const category of mainCategories) {
    if (cleanName.includes(category)) {
      return category;
    }
  }

  // If no main category is found, use the first word of the section
  const firstWord = cleanName.split(/\s+/)[0];
  return firstWord || 'general';
}

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

// Add utility for reliable API calls with retries
async function retryApiCall(apiCallFn, maxRetries = 3, retryDelay = 1000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiCallFn();
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`API call failed (attempt ${attempt}/${maxRetries}): ${error.message}`);
      if (attempt < maxRetries) {
        // Add increasing delay between retries
        const delay = retryDelay * attempt;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError; // If all retries failed, throw the last error
}

// Create and return all labels upfront before creating issues
async function createAllLabels(teamId, sections) {
  console.log('Creating all necessary labels upfront...');
  const labelMap = new Map();

  for (const section of sections) {
    const sectionName = section[1];

    // Normalize section name for category mapping
    const normalizedSection = normalizeSection(sectionName);

    // Determine the category for this section
    let category = null;
    for (const [sectionKey, categoryValue] of Object.entries(sectionCategories)) {
      if (normalizedSection.includes(sectionKey)) {
        category = categoryValue;
        break;
      }
    }

    if (!category) {
      const cleanName = sectionName.replace(/[^\p{L}\p{N}\s-]/gu, '').trim();
      category = extractMainCategory(cleanName);
    }

    if (!labelMap.has(category)) {
      try {
        // Get existing labels
        const existingLabels = await getAllLabels(teamId);
        const existingLabel = existingLabels.find(
          label => label.name.toLowerCase() === category.toLowerCase()
        );

        if (existingLabel) {
          console.log(`Using existing label: ${category} (id: ${existingLabel.id})`);
          labelMap.set(category, existingLabel);
        } else {
          // Create the label with retries
          const label = await retryApiCall(async () => {
            return linearClient.createIssueLabel({
              name: category,
              teamId,
              color: getLabelColor(category),
            });
          });

          console.log(`Created new label: ${category} (labelId: ${label.id})`);
          labelMap.set(category, label);
        }
      } catch (error) {
        console.error(`Failed to create label ${category}:`, error);
      }
    }
  }

  return labelMap;
}

// Helper function to normalize section names for matching
const normalizeSection = sectionName => {
  return sectionName
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

// Define section categories
const sectionCategories = {
  authentication: 'auth',
  'product inventory flow': 'product',
  'checkout payments': 'checkout',
  'delivery system': 'delivery',
  'cms features': 'cms',
  'react query strategy': 'api',
  'webhooks automation': 'webhook',
};

async function getOrCreateLabel(sectionName, teamId, labelMap) {
  try {
    // Extract the main category from the section name
    const category = extractMainCategory(sectionName);
    const cleanName = category.replace(/[^a-zA-Z0-9\s-]/g, '').trim();

    if (!cleanName) {
      console.warn(`Invalid label name: ${sectionName}, skipping label creation`);
      return null;
    }

    // Check the map first
    if (labelMap.has(cleanName)) {
      return labelMap.get(cleanName);
    }

    // Check cache next
    if (labelCache.has(cleanName)) {
      return labelCache.get(cleanName);
    }

    // Get all existing labels
    const existingLabels = await getAllLabels(teamId);

    // Check if label already exists
    const existingLabel = existingLabels.find(
      label => label.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existingLabel) {
      labelCache.set(cleanName, existingLabel);
      labelMap.set(cleanName, existingLabel);
      return existingLabel;
    }

    // Create new label if it doesn't exist - with retries
    const label = await retryApiCall(async () => {
      return linearClient.createIssueLabel({
        name: cleanName,
        teamId,
        color: getLabelColor(category),
      });
    });

    console.log(`Created new label: ${cleanName} (${category})`);
    labelCache.set(cleanName, label);
    labelMap.set(cleanName, label);
    return label;
  } catch (error) {
    console.error(`Error with label ${sectionName}:`, error);
    return null;
  }
}

async function createIssue(title, description, teamId, sectionName, labelMap) {
  try {
    // Get or create label for the section
    const label =
      labelMap.get(sectionName) || (await getOrCreateLabel(sectionName, teamId, labelMap));

    if (!label) {
      console.warn(`No label found for section: ${sectionName}, creating issue without label`);
    }

    const issueInput = {
      teamId,
      title,
      description,
    };

    if (label && label.id) {
      issueInput.labelIds = [label.id];
      console.log(`Assigning label '${label.name}' (id: ${label.id}) to issue '${title}'`);
    } else {
      console.warn(`No label assigned to issue '${title}' (section: '${sectionName}')`);
    }

    // Create the issue with retries
    const issue = await retryApiCall(async () => {
      return linearClient.createIssue(issueInput);
    });

    console.log(`✅ Created: ${title} (id: ${issue.id})`);

    return issue;
  } catch (error) {
    console.error(`❌ Failed to create: ${title}`, error);
    return null;
  }
}

async function syncPRDToLinear() {
  try {
    console.log('\nSyncing PRD to Linear...');
    const prdPath = resolve(process.cwd(), 'PRD.md');
    const prdContent = fs.readFileSync(prdPath, 'utf-8');

    // Get existing issues from Linear
    const existingIssues = await linearClient.issues({
      filter: { team: { id: { eq: TEAM_ID } } },
    });
    const existingTitles = new Set(existingIssues.nodes.map(issue => issue.title));

    // Parse line by line to be robust against newline issues
    const lines = prdContent.split(/\r?\n/);
    let currentSection = null;
    let sections = [];
    let currentTasks = [];

    for (const line of lines) {
      const headerMatch = line.match(/^## (?!#)(.+)/); // Match ## Header but not ###
      if (headerMatch) {
        // Save previous section if it had tasks
        if (currentSection && currentTasks.length > 0) {
          sections.push([null, currentSection, currentTasks.join('\n')]);
        }
        currentSection = headerMatch[1].trim();
        currentTasks = [];
        continue;
      }

      // Match task list items: - [ ] Task or - [x] Task
      const taskMatch = line.match(/^\s*-\s*\[( |x)\]\s+(.+)/);
      if (taskMatch && currentSection) {
        // Reconstruct the task line for later processing
        currentTasks.push(`- [${taskMatch[1]}] ${taskMatch[2]}`);
      }
    }
    // Push the last section
    if (currentSection && currentTasks.length > 0) {
      sections.push([null, currentSection, currentTasks.join('\n')]);
    }

    console.log(`Found ${sections.length} sections with tasks`);

    // Create all labels upfront
    const labelMap = await createAllLabels(TEAM_ID, sections);
    console.log(`Created ${labelMap.size} labels`);

    // Process each section
    for (const [_, section, block] of sections) {
      // Strip emojis from section name for display
      const cleanSection = section.replace(/[^\p{L}\p{N}\s-]/gu, '').trim();
      console.log(`\nProcessing section: ${cleanSection}`);

      // Normalize section name for category mapping
      const normalizedSection = normalizeSection(section);

      // Try to find a matching category
      let category = null;
      for (const [sectionKey, categoryValue] of Object.entries(sectionCategories)) {
        if (normalizedSection.includes(sectionKey)) {
          category = categoryValue;
          break;
        }
      }

      // If no direct match, fall back to the extraction algorithm
      if (!category) {
        category = extractMainCategory(cleanSection);
      }

      console.log(`Section '${section}' mapped to category: '${category}'`);

      // Extract tasks from the block - now including both checked and unchecked tasks
      const tasks = [...block.matchAll(/- \[( |x)\] (.+)/g)].map(m => m[2]);

      console.log(`Found ${tasks.length} tasks in section ${cleanSection} (category: ${category})`);

      // Create issues sequentially to avoid race conditions
      for (const task of tasks) {
        if (!existingTitles.has(task)) {
          await createIssue(
            task,
            `Imported from PRD section: ${cleanSection}`,
            TEAM_ID,
            category,
            labelMap
          );

          // Add a small delay between issue creations to avoid overloading the API
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          console.log(`⏭️  Skipping existing issue: ${task}`);
        }
      }
    }
  } catch (error) {
    console.error('Error syncing PRD to Linear:', error);
  }
}

async function main() {
  try {
    console.log('Starting sync...');

    // Only sync PRD to Linear to create new issues and assign labels
    await syncPRDToLinear();

    console.log('\nSync completed successfully!');
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
}

// Run the script
main();
