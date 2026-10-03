// Run with: npm run validate
import fs from "fs"; import path from "path";
const root = "data/questions"; const REQ = ["id", "level", "question", "answer", "explanation", "tags"];
const MIN = 1; // Stage 2 sample content. Stage 4 raises this to 4 per level.
let errors = 0, files = 0, total = 0; const ids = new Set();
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".json") ? [path.join(d, e.name)] : []);
for (const f of walk(root)) {
  files++; let data;
  try { data = JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { console.log(`✗ ${f}: invalid JSON`); errors++; continue; }
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const q of data) {
    total++;
    for (const k of REQ) if (q[k] === undefined || q[k] === "") { console.log(`✗ ${f} ${q.id}: missing ${k}`); errors++; }
    if (ids.has(q.id)) { console.log(`✗ ${f}: duplicate id ${q.id}`); errors++; } ids.add(q.id);
    if (![1, 2, 3, 4].includes(q.level)) { console.log(`✗ ${f} ${q.id}: level must be 1-4`); errors++; } else counts[q.level]++;
    if (f.includes("countries") && q.needs_native_review !== true) { console.log(`✗ ${f} ${q.id}: needs_native_review must be true`); errors++; }
  }
  for (const l of [1, 2, 3, 4]) if (counts[l] < MIN) { console.log(`✗ ${f}: level ${l} has ${counts[l]} (need ${MIN}+)`); errors++; }
}
console.log(errors ? `\n${errors} problem(s)` : `\n✓ ${files} files, ${total} questions, all good`);
process.exit(errors ? 1 : 0);
