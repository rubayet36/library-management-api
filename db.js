// db.js
// Generic JSON "database" helpers. Works for ANY resource
// as long as data/db.json has a top-level array field with that name.
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

function normalizeDB(data) {
  const safeData = data && typeof data === 'object' ? { ...data } : {};

  if (!Array.isArray(safeData.books) && Array.isArray(safeData.book)) {
    safeData.books = safeData.book;
  }

  if (!Array.isArray(safeData.book) && Array.isArray(safeData.books)) {
    safeData.book = safeData.books;
  }

  if (!Array.isArray(safeData.books)) {
    safeData.books = [];
  }

  if (!Array.isArray(safeData.book)) {
    safeData.book = safeData.books;
  }

  return safeData;
}

function loadDB() {
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return normalizeDB(JSON.parse(raw));
}

function saveDB(data) {
  const normalized = normalizeDB(data);
  fs.writeFileSync(DB_FILE, JSON.stringify(normalized, null, 2));
}

module.exports = { loadDB, saveDB };
