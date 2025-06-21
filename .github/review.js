const { Octokit } = require('@octokit/core');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const execSync = require('child_process').execSync;

// Load GitHub event payload
const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const prNumber = event.pull_request.number;
const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
const githubToken = process.env.GITHUB_TOKEN;
const openaiKey = process.env.OPENAI_API_KEY;

(async () => {
  const octokit = new Octokit({ auth: githubToken });

  // Get base and head branch info
  const baseRef = event.pull_request.base.ref;
  const headRef = event.pull_request.head.ref;

  // Fetch diff between branches
  const diff = execSync(
    `git fetch origin ${baseRef} ${headRef} && git diff origin/${baseRef}...origin/${headRef}`
  ).toString();

  const openai = new OpenAIApi(new Configuration({ apiKey: openaiKey }));
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are a senior developer reviewing a GitHub pull request for a nextJS app, using supabase as its backend. Provide helpful, concise, and actionable feedback.',
      },
      {
        role: 'user',
        content: `Review the following pull request diff:\n\n${diff}`,
      },
    ],
  });

  const review = response.data.choices[0].message.content;

  // Post comment on the PR
  await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
    owner,
    repo,
    issue_number: prNumber,
    body: `🤖 **AI Code Review**\n\n${review}`,
  });

  console.log('Review comment posted.');
})();
