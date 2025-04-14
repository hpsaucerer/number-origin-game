// mergePuzzles.js

const fs = require("fs");
const path = require("path");

const existingPath = path.join(__dirname, "data", "puzzles.js");
const newPath = path.join(__dirname, "data", "newPuzzles.js");

// Load existing puzzles
let existing = require(existingPath);
let incoming = require(newPath);

// Ensure both are arrays
if (!Array.isArray(existing) || !Array.isArray(incoming)) {
  console.error("❌ One of the puzzle files is not an array.");
  process.exit(1);
}

// Create a Set of existing puzzle numbers to avoid duplicates
const existingNumbers = new Set(existing.map((p) => p.number));

// Validate incoming puzzles
const validNew = incoming.filter((p) => {
  const requiredFields = ["number", "formatted", "answer", "clues", "keywords", "funFact"];
  const hasAllFields = requiredFields.every((key) => p[key]);
  const isDuplicate = existingNumbers.has(p.number);

  if (!hasAllFields) {
    console.warn(`⚠️ Puzzle ${p.number} is missing required fields.`);
    return false;
  }

  if (isDuplicate) {
    console.warn(`⚠️ Puzzle ${p.number} is a duplicate and will be skipped.`);
    return false;
  }

  return true;
});

// Merge and sort by number
const merged = [...existing, ...validNew].sort((a, b) => a.number - b.number);

// Save merged file
const output = `const puzzles = ${JSON.stringify(merged, null, 2)};\n\nexport default puzzles;\n`;
fs.writeFileSync(existingPath, output);

console.log(`✅ Merged ${validNew.length} new puzzle(s) into puzzles.js`);

// Overwrite newPuzzles.js with an empty export
fs.writeFileSync(
  newPath,
  "module.exports = [];\n"
);
console.log("🧹 Cleared newPuzzles.js after merge.");

