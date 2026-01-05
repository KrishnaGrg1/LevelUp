import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TRANSLATIONS_DIR = path.join(ROOT, 'src', 'translations');
const BASE_LANG = 'eng';

function isObject(value) {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepFillMissing(target, source) {
	// Mutates target: adds any keys present in source but missing in target.
	for (const [key, sourceValue] of Object.entries(source)) {
		const targetValue = target[key];

		if (targetValue === undefined) {
			target[key] = sourceValue;
			continue;
		}

		if (isObject(targetValue) && isObject(sourceValue)) {
			deepFillMissing(targetValue, sourceValue);
		}
	}
}

function readJson(filePath) {
	const raw = fs.readFileSync(filePath, 'utf8');
	return JSON.parse(raw);
}

function writeJson(filePath, obj) {
	const json = JSON.stringify(obj, null, 2) + '\n';
	fs.writeFileSync(filePath, json, 'utf8');
}

function listJsonFiles(dir) {
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter(d => d.isFile() && d.name.endsWith('.json'))
		.map(d => d.name);
}

const baseDir = path.join(TRANSLATIONS_DIR, BASE_LANG);
if (!fs.existsSync(baseDir)) {
	console.error(`Base language folder not found: ${baseDir}`);
	process.exit(1);
}

const baseFiles = listJsonFiles(baseDir);
const langDirs = fs
	.readdirSync(TRANSLATIONS_DIR, { withFileTypes: true })
	.filter(d => d.isDirectory())
	.map(d => d.name)
	.filter(name => name !== BASE_LANG);

let touchedFiles = 0;

for (const lang of langDirs) {
	const langDir = path.join(TRANSLATIONS_DIR, lang);

	for (const fileName of baseFiles) {
		const basePath = path.join(baseDir, fileName);
		const targetPath = path.join(langDir, fileName);

		const sourceObj = readJson(basePath);

		let targetObj = {};
		if (fs.existsSync(targetPath)) {
			try {
				targetObj = readJson(targetPath);
			} catch {
				// If a target file is malformed, don't destroy it automatically.
				console.error(`Skipping malformed JSON: ${targetPath}`);
				continue;
			}
		}

		const before = JSON.stringify(targetObj);
		deepFillMissing(targetObj, sourceObj);
		const after = JSON.stringify(targetObj);

		if (before !== after) {
			fs.mkdirSync(langDir, { recursive: true });
			writeJson(targetPath, targetObj);
			touchedFiles += 1;
		}
	}
}

console.log(`Sync complete. Updated ${touchedFiles} file(s).`);
