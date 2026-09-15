/**
 * Tags every table body cell with the text of its column header, as `data-label`.
 *
 * Markdown tables are the one element that cannot survive a phone. A three-column table
 * squeezed into 375px gives each column about 120 pixels, which turns a sentence into a
 * ladder of two-word lines -- and when it overflows by even a few pixels, Docusaurus's
 * `display: block; overflow: auto` turns the whole table into a horizontal scroll
 * container that swallows vertical swipes. Both were happening on /pre-installation.
 *
 * The fix is to stop drawing a grid on narrow screens and stack each row as a small card
 * instead (see `.markdown table` in src/css/custom.css). That only works if each cell can
 * still say which column it came from, and markdown gives no way to write that by hand --
 * hence this. It runs at build time, so the labels are in the static HTML: no layout
 * shift, no client-side pass, and nothing to run for readers with JavaScript off.
 *
 * Header text is flattened to a plain string; a header containing anything but text and
 * inline formatting simply yields an empty label, and the cell renders without one.
 */

/** The plain text of a header cell, ignoring emphasis, links and the like. */
function textOf(node) {
  if (!node || typeof node !== 'object') return '';
  if (typeof node.value === 'string' && (node.type === 'text' || node.type === 'inlineCode')) {
    return node.value;
  }
  if (!Array.isArray(node.children)) return '';
  return node.children.map(textOf).join('');
}

function label(cell) {
  return textOf(cell).replace(/\s+/g, ' ').trim();
}

function tagTable(table) {
  const rows = Array.isArray(table.children) ? table.children : [];
  const [header, ...body] = rows;
  if (!header || !Array.isArray(header.children)) return;

  const labels = header.children.map(label);
  if (!labels.some(Boolean)) return;

  for (const row of body) {
    if (!Array.isArray(row.children)) continue;
    row.children.forEach((cell, column) => {
      const text = labels[column];
      if (!text || !cell || typeof cell !== 'object') return;
      cell.data = cell.data || {};
      cell.data.hProperties = { ...(cell.data.hProperties || {}), 'data-label': text };
    });
  }
}

function walk(node) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'table') tagTable(node);
  if (Array.isArray(node.children)) node.children.forEach(walk);
}

module.exports = function remarkTableLabels() {
  return (tree) => walk(tree);
};
