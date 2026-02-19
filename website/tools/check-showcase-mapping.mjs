#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const FULL_DIR = path.join(ROOT, "static", "img", "pages", "main", "screenshots");
const PREVIEW_DIR = path.join(ROOT, "static", "img", "pages", "main", "screenshots-preview");
const INDEX_PAGE = path.join(ROOT, "src", "pages", "index.tsx");
const FULL_EXT_RE = /\.(png|jpe?g|webp)$/i;

async function listFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isFile()).map((e) => e.name).sort();
}

async function main() {
  const [fullFiles, previewFiles, indexSource] = await Promise.all([
    listFiles(FULL_DIR),
    listFiles(PREVIEW_DIR),
    fs.readFile(INDEX_PAGE, "utf8"),
  ]);

  const fullImageFiles = fullFiles.filter((name) => FULL_EXT_RE.test(name));
  const expectedPreviewSet = new Set(
    fullImageFiles.map((name) => name.replace(FULL_EXT_RE, ".webp"))
  );
  const previewSet = new Set(previewFiles.filter((name) => /\.webp$/i.test(name)));

  const missingPreviews = [...expectedPreviewSet].filter((name) => !previewSet.has(name));
  const extraPreviews = [...previewSet].filter((name) => !expectedPreviewSet.has(name));

  const sourceChecks = [
    {
      label: "showcase img uses preview src",
      ok: indexSource.includes("src={shot.previewSrc}"),
    },
    {
      label: "showcase img zoom uses full src",
      ok: indexSource.includes("data-zoom-src={shot.fullSrc}"),
    },
    {
      label: "preview context is configured",
      ok: indexSource.includes("@site/static/img/pages/main/screenshots-preview"),
    },
  ];

  const sourceFailures = sourceChecks.filter((c) => !c.ok);
  const hasFailures =
    missingPreviews.length > 0 || extraPreviews.length > 0 || sourceFailures.length > 0;

  if (hasFailures) {
    console.error("Showcase mapping check failed.");

    if (missingPreviews.length > 0) {
      console.error(
        `- Missing preview files (${missingPreviews.length}): ${missingPreviews.join(", ")}`
      );
    }
    if (extraPreviews.length > 0) {
      console.error(
        `- Extra preview files (${extraPreviews.length}): ${extraPreviews.join(", ")}`
      );
    }
    if (sourceFailures.length > 0) {
      console.error("- Source checks failed:");
      for (const check of sourceFailures) {
        console.error(`  - ${check.label}`);
      }
    }

    process.exitCode = 1;
    return;
  }

  console.log(
    `Showcase mapping check passed (${fullImageFiles.length} full images, ${previewSet.size} previews).`
  );
}

main().catch((error) => {
  console.error("Showcase mapping check crashed.");
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
