// Generates src/configs/iconNames.json from the installed material-symbols package.
// Run after upgrading material-symbols: pnpm icons:generate
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const dts = readFileSync(
  require.resolve('material-symbols/index.d.ts'),
  'utf8',
);

const names = [
  ...new Set(dts.match(/"[a-z0-9_]+"/g).map((s) => s.slice(1, -1))),
];

writeFileSync(
  new URL('../src/configs/iconNames.json', import.meta.url),
  `${JSON.stringify(names)}\n`,
);

console.log(`Generated ${names.length} icon names.`);
