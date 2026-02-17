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
  if (!isLocalPath(rawPath)) return null;
  if (!fromFilePath) return null;
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

function getMdxSrcAttribute(node) {
  if (!node.attributes || !Array.isArray(node.attributes)) return null;
  return node.attributes.find(
    (attr) => attr && attr.type === 'mdxJsxAttribute' && attr.name === 'src'
  );
}

function getMdxLocalPathFromSrcAttr(srcAttr) {
  if (!srcAttr) return null;
  if (typeof srcAttr.value === 'string') {
    return srcAttr.value;
  }
  if (srcAttr.value && typeof srcAttr.value === 'object' && srcAttr.value.type === 'mdxJsxAttributeValueExpression') {
    const expr = srcAttr.value.value || '';
    const m = expr.match(/require\((['"])(.+?)\1\)\.default/);
    if (m) return m[2];
  }
  return null;
}

function hasMdxAttribute(node, name) {
  return (
    Array.isArray(node.attributes) &&
    node.attributes.some((attr) => attr && attr.type === 'mdxJsxAttribute' && attr.name === name)
  );
}

function setMdxWidthHeight(node, width, height) {
  if (!Array.isArray(node.attributes)) node.attributes = [];
  if (!hasMdxAttribute(node, 'width')) {
    node.attributes.push({ type: 'mdxJsxAttribute', name: 'width', value: String(width) });
  }
  if (!hasMdxAttribute(node, 'height')) {
    node.attributes.push({ type: 'mdxJsxAttribute', name: 'height', value: String(height) });
  }
}

function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  visit(node);
  const children = node.children;
  if (Array.isArray(children)) {
    for (const child of children) walk(child, visit);
  }
}

module.exports = function remarkImageDimensions() {
  return (tree, file) => {
    walk(tree, (node) => {
      // Markdown image syntax: ![alt](./img/foo.png)
      if (node.type === 'image' && typeof node.url === 'string') {
        const absPath = resolveLocalImagePath(node.url, file.path);
        const dims = readDimensions(absPath);
        if (!dims) return;
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        if (node.data.hProperties.width == null) node.data.hProperties.width = dims.width;
        if (node.data.hProperties.height == null) node.data.hProperties.height = dims.height;
        return;
      }

      // MDX JSX image syntax: <img src={require('./img/foo.png').default} ... />
      const isMdxImg =
        (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
        node.name === 'img';
      if (!isMdxImg) return;

      const srcAttr = getMdxSrcAttribute(node);
      const srcPath = getMdxLocalPathFromSrcAttr(srcAttr);
      const absPath = resolveLocalImagePath(srcPath, file.path);
      const dims = readDimensions(absPath);
      if (!dims) return;

      setMdxWidthHeight(node, dims.width, dims.height);
    });
  };
};
