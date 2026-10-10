import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, '_incoming', 'frontend');

const FILES = [
  'package.json',
  'index.html',
  'vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  '.env.example',
  'src/App.tsx',
  'src/main.tsx',
  'src/index.css',
  'src/vite-env.d.ts',
  'src/types/index.ts',
  'src/context/FarmContext.tsx',
  'src/components/Layout.tsx',
  'src/components/PageHeader.tsx',
  'src/components/DataModeBadge.tsx',
  'src/components/StateViews.tsx',
  'src/components/AdvisoryCard.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Onboarding.tsx',
  'src/pages/Weather.tsx',
  'src/pages/Market.tsx',
  'src/services/config.ts',
  'src/services/http.ts',
  'src/services/index.ts',
  'src/services/advisoryService.ts',
  'src/services/weatherService.ts',
  'src/services/marketService.ts',
  'src/utils/format.ts',
  'src/utils/useAsync.ts',
  'src/mocks/index.ts',
  'src/mocks/advisory.ts',
  'src/mocks/weather.ts',
  'src/mocks/market.ts',
];

const BASE = 'https://raw.githubusercontent.com/4ka-nsha/Cline/main/frontend';

mkdirSync(OUT_DIR, { recursive: true });

for (const rel of FILES) {
  const url = `${BASE}/${rel}`;
  const dest = join(OUT_DIR, rel);
  mkdirSync(dirname(dest), { recursive: true });
  console.log(`fetch ${rel}`);
  execFileSync(
    process.execPath,
    [
      '-e',
      `
const url = ${JSON.stringify(url)};
const dest = ${JSON.stringify(dest)};
fetch(url).then(async (r) => {
  if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
  const text = await r.text();
  require('node:fs').writeFileSync(dest, text);
  console.log('saved ' + ${JSON.stringify(rel)});
}).catch((e) => { console.error(e.message); process.exit(1); });
`,
    ],
    { stdio: 'inherit' },
  );
}

// AdvisoryCard was not in the earlier listing output; try it separately (non-fatal).
try {
  const rel = 'src/components/AdvisoryCard.tsx';
  const dest = join(OUT_DIR, rel);
  mkdirSync(dirname(dest), { recursive: true });
  execFileSync(
    process.execPath,
    [
      '-e',
      `
fetch(${JSON.stringify(`${BASE}/${rel}`)}).then(async (r) => {
  if (!r.ok) throw new Error('HTTP ' + r.status);
  require('node:fs').writeFileSync(${JSON.stringify(dest)}, await r.text());
  console.log('saved AdvisoryCard');
}).catch((e) => { console.error('AdvisoryCard: ' + e.message); process.exit(1); });
`,
    ],
    { stdio: 'inherit' },
  );
} catch {
  console.log('AdvisoryCard missing upstream; will reuse local fallback.');
}

writeFileSync(join(OUT_DIR, '.fetched-ok'), `fetched ${new Date().toISOString()}\n`);
console.log('done');
