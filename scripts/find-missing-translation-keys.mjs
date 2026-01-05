import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const TRANSLATIONS_DIR = path.join(SRC_DIR, 'translations');

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIndexable(value) {
  return isObject(value) || Array.isArray(value);
}

function getAllFiles(dir, exts, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      getAllFiles(full, exts, out);
    } else if (e.isFile()) {
      if (exts.some(ext => e.name.endsWith(ext))) out.push(full);
    }
  }
  return out;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function buildEnglishTranslations() {
  const engDir = path.join(TRANSLATIONS_DIR, 'eng');
  const files = fs
    .readdirSync(engDir, { withFileTypes: true })
    .filter(d => d.isFile() && d.name.endsWith('.json'))
    .map(d => d.name);

  const root = {};
  for (const file of files) {
    const namespace = file.replace(/\.json$/i, '');
    root[namespace] = readJson(path.join(engDir, file));
  }

  // lang.ts is merged at runtime but doesn't contain app keys; ignore here.
  return root;
}

function hasKey(translationsRoot, key) {
  // Ignore non-literal keys extracted from template strings like `foo.${bar}`.
  // Those are runtime-determined and shouldn't be reported by this static scan.
  if (key.includes('${')) return true;

  // Support namespace:key format (e.g. success:login)
  if (key.includes(':')) {
    const [namespace, ...rest] = key.split(':');
    const actualKey = rest.join(':');
    let value = translationsRoot[namespace];
    if (!value) return false;
    if (!actualKey) return true;

    const parts = actualKey.split('.');
    for (const p of parts) {
      if (!isIndexable(value) && typeof value !== 'string') return false;
      value = value?.[p];
      if (value === undefined) return false;
    }
    return true;
  }

  const parts = key.split('.');
  let value = translationsRoot;
  for (const p of parts) {
    if (!isIndexable(value) && typeof value !== 'string') return false;
    value = value?.[p];
    if (value === undefined) return false;
  }
  return true;
}

function extractTCalls(source) {
  // Extract t('...') / t("...") / t(`...`) where the first argument is a literal.
  const results = [];
  const re = /\bt\(\s*(['"`])([^'"`]+)\1/g;
  let m;
  while ((m = re.exec(source))) {
    // Skip template literals with interpolation. Example: `landing.${feature.title}`
    // will be matched by the regex but isn't a real literal key.
    if (m[1] === '`' && m[2].includes('${')) continue;
    results.push(m[2]);
  }
  return results;
}

const translations = buildEnglishTranslations();
const files = getAllFiles(SRC_DIR, ['.ts', '.tsx']);

const missing = new Map();

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const keys = extractTCalls(text);
  for (const key of keys) {
    if (!hasKey(translations, key)) {
      const arr = missing.get(key) ?? [];
      arr.push(path.relative(ROOT, file));
      missing.set(key, arr);
    }
  }
}

if (missing.size === 0) {
  console.log('No missing translation keys in English.');
  process.exit(0);
}

console.log(`Missing translation keys in English: ${missing.size}`);

const sorted = [...missing.entries()].sort((a, b) => a[0].localeCompare(b[0]));
for (const [key, occurrences] of sorted) {
  const unique = [...new Set(occurrences)];
  console.log(`\n- ${key}`);
  for (const f of unique.slice(0, 8)) console.log(`  - ${f}`);
  if (unique.length > 8) console.log(`  - (+${unique.length - 8} more)`);
}
