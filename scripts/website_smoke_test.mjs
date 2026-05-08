import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);

const pages = [
  {
    path: 'index.html',
    required: ['Bag Guy', 'AI Planner', 'How to use', 'No crypto required for shoppers'],
  },
  {
    path: 'signup.html',
    required: ['Create your Bag Guy account', 'ZIP code', 'Support', 'Privacy'],
  },
  {
    path: 'login.html',
    required: ['Welcome <span>back</span>', 'Log in', 'Support', 'Privacy'],
  },
  {
    path: 'rewards.html',
    required: ['Rewards', 'Dashboard', 'AI Planner'],
  },
  {
    path: 'dashboard.html',
    required: ['Dashboard', 'Rewards', 'AI Planner'],
  },
  {
    path: 'ai-savings.html',
    required: ['AI Savings Planner', 'Generate savings plan', 'does not guarantee redemption'],
  },
  {
    path: 'support.html',
    required: ['Bag Guy support', 'support@bagguyapp.com'],
  },
  {
    path: 'privacy.html',
    required: ['Privacy Policy', 'support@bagguyapp.com'],
  },
];

const forbidden = [
  'bagguyappofficial@gmail.com',
  'hello@bagguyapp.com',
  'Receipt fallback used',
  'intent classified',
  'unknown intent',
];

let failures = 0;

for (const page of pages) {
  const filePath = resolve(root, page.path);
  if (!existsSync(filePath)) {
    console.error(`Missing page: ${page.path}`);
    failures += 1;
    continue;
  }

  const text = readFileSync(filePath, 'utf8');
  for (const needle of page.required) {
    if (!text.includes(needle)) {
      console.error(`Missing required text in ${page.path}: ${needle}`);
      failures += 1;
    }
  }

  for (const needle of forbidden) {
    if (text.includes(needle)) {
      console.error(`Forbidden text found in ${page.path}: ${needle}`);
      failures += 1;
    }
  }
}

if (failures) {
  console.error(`Website smoke test failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log(`Website smoke test passed for ${pages.length} pages.`);
