const fs = require("fs");
const path = require("path");

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
const assetPattern = /(?:href|src)="([^"#?]+(?:\.html|\.js|\.css|\.png|\.webmanifest|\.xml|\.txt|\.zip))[^"]*"/g;
const report = {
  pages: htmlFiles.length,
  missingAssets: [],
  duplicateIds: [],
  emptyLinks: [],
};

for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const seenIds = new Map();

  for (const match of source.matchAll(assetPattern)) {
    const target = match[1];
    if (/^(https?:|mailto:|tel:)/.test(target)) continue;
    const normalized = target.replace(/^\//, "");
    const targetPath = path.join(root, normalized);
    if (!fs.existsSync(targetPath)) {
      report.missingAssets.push({ file, target });
    }
  }

  for (const match of source.matchAll(/\sid="([^"]+)"/g)) {
    const id = match[1];
    seenIds.set(id, (seenIds.get(id) || 0) + 1);
  }

  for (const [id, count] of seenIds) {
    if (count > 1) report.duplicateIds.push({ file, id, count });
  }

  for (const match of source.matchAll(/href="#"/g)) {
    report.emptyLinks.push({ file, index: match.index });
  }
}

console.log(JSON.stringify(report, null, 2));
