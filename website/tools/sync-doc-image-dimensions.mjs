import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSize } from 'image-size';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const websiteRoot = path.resolve(__dirname, '..');
const contentRoots = [
  path.join(websiteRoot, 'docs'),
  path.join(websiteRoot, 'src', 'pages'),
];
const docExtensions = new Set(['.md', '.mdx']);

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }
    if (docExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function stripQueryAndHash(value) {
  return value.split('#')[0].split('?')[0];
}

function resolveImagePath(filePath, imagePath) {
  const normalized = stripQueryAndHash(imagePath);
  if (normalized.startsWith('/')) {
    return path.join(websiteRoot, 'static', normalized.replace(/^\/+/, '').replaceAll('/', path.sep));
  }

  return path.resolve(path.dirname(filePath), normalized);
}

function readDimensions(filePath, imagePath) {
  const resolvedPath = resolveImagePath(filePath, imagePath);
  if (!fs.existsSync(resolvedPath)) return null;

  const dimensions = imageSize(fs.readFileSync(resolvedPath));
  if (!dimensions.width || !dimensions.height) return null;

  return dimensions;
}

function getTagIndent(tag) {
  const attrIndentMatch = tag.match(/\n([ \t]+)[A-Za-z][\w-]*=/);
  if (attrIndentMatch) return attrIndentMatch[1];

  const closingIndentMatch = tag.match(/\n([ \t]*)\/>\s*$/);
  if (closingIndentMatch) return `${closingIndentMatch[1]}  `;

  return '  ';
}

function upsertNumericProp(tag, propName, value, indent) {
  const propPattern = new RegExp(`\\s${propName}=\\{[^}]+\\}|\\s${propName}=\"[^\"]*\"|\\s${propName}='[^']*'`, 'm');
  if (propPattern.test(tag)) {
    return tag.replace(propPattern, ` ${propName}={${value}}`);
  }

  return tag.replace(/\n([ \t]*)\/>\s*$/, `\n${indent}${propName}={${value}}\n$1/>`);
}

function extractSrc(tag) {
  const requireMatch = tag.match(/src=\{require\((['"])(.+?)\1\)\.default\}/);
  if (requireMatch) {
    return requireMatch[2];
  }

  const stringMatch = tag.match(/src=(['"])(.+?)\1/);
  if (stringMatch) {
    return stringMatch[2];
  }

  return null;
}

function normalizeDocImageTag(tag, filePath) {
  const imagePath = extractSrc(tag);
  if (!imagePath) return tag;

  const dimensions = readDimensions(filePath, imagePath);
  if (!dimensions) return tag;

  const normalizedTag = tag.replace(/^<img\b/, '<DocImage');

  const indent = getTagIndent(tag);
  let nextTag = normalizedTag;
  nextTag = upsertNumericProp(nextTag, 'width', dimensions.width, indent);
  nextTag = upsertNumericProp(nextTag, 'height', dimensions.height, indent);
  return nextTag;
}

function convertDecorativeHeadingMarkers(content) {
  return content.replace(
    /^(#{1,2})\s+([^\n]+)\r?\n<!-- licentia-heading -->\s*$/gm,
    (_match, hashes, rawTitle) => {
      const level = hashes.length;
      const title = rawTitle.trim();
      return `${hashes} <span className="licentia-heading licentia-heading--h${level}">${title}</span>`;
    }
  );
}

function syncFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const withDecorativeHeadings = convertDecorativeHeadingMarkers(original);
  const updated = withDecorativeHeadings.replace(/<(DocImage|img)\b[\s\S]*?\/>/g, (tag) =>
    normalizeDocImageTag(tag, filePath)
  );

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    return true;
  }

  return false;
}

const files = contentRoots.flatMap((root) => walkFiles(root));
let updatedCount = 0;

for (const filePath of files) {
  if (syncFile(filePath)) {
    updatedCount += 1;
  }
}

console.log(`Updated ${updatedCount} documentation file(s).`);
