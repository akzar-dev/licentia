const fs = require('node:fs');
const path = require('node:path');
const { imageSize } = require('image-size');

function isLocalPath(value) {
  if (!value || typeof value !== 'string') return false;
  const lower = value.toLowerCase();
  return !(
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('//') ||
    lower.startsWith('data:') ||
    lower.startsWith('#')
  );
}

function stripQueryAndHash(value) {
  return value.split('#')[0].split('?')[0];
}

function resolveLocalImagePath(rawPath, fromFilePath) {
  if (!isLocalPath(rawPath) || !fromFilePath) return null;

  if (rawPath.startsWith('/')) {
    return path.resolve(process.cwd(), 'static', `.${stripQueryAndHash(rawPath)}`);
  }

  return path.resolve(path.dirname(fromFilePath), stripQueryAndHash(rawPath));
}

function readDimensions(absPath) {
  try {
    if (!absPath || !fs.existsSync(absPath)) return null;
    const data = fs.readFileSync(absPath);
    const dims = imageSize(data);
    if (!dims.width || !dims.height) return null;
    return { width: dims.width, height: dims.height };
  } catch {
    return null;
  }
}

function appendStyleDeclaration(styleValue, declaration) {
  const trimmed = typeof styleValue === 'string' ? styleValue.trim() : '';
  if (!trimmed) return declaration;
  const suffix = trimmed.endsWith(';') ? '' : ';';
  return `${trimmed}${suffix} ${declaration}`;
}

function visitChildren(parent, file) {
  if (!Array.isArray(parent.children)) return;

  for (let index = 0; index < parent.children.length; index += 1) {
    const node = parent.children[index];
    if (!node || typeof node !== 'object') continue;

    if (node.type === 'image' && typeof node.url === 'string') {
      const absPath = resolveLocalImagePath(node.url, file.path);
      const dims = readDimensions(absPath);
      if (dims) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.width = dims.width;
        node.data.hProperties.height = dims.height;
        node.data.hProperties.style = appendStyleDeclaration(
          node.data.hProperties.style,
          `aspect-ratio: ${dims.width} / ${dims.height};`
        );
      }
    }

    visitChildren(node, file);
  }
}

module.exports = function remarkImageDimensions() {
  return (tree, file) => {
    visitChildren(tree, file);
  };
};
