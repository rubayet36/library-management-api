
const express = require('express');
const router = express.Router();
const { loadDB, saveDB } = require('../db');

const RESOURCE = 'books';       
const REQUIRED_FIELDS = [ 'title', 'author', 'price', 'quantity'];

// ---------- helper ----------
function sendJSON(res, status, success, dataOrMsg) {
  if (success) {
    res.status(status).json({ success: true, data: dataOrMsg });
  } else {
    res.status(status).json({ success: false, msg: dataOrMsg });
  }
}


router.get('/', (req, res) => {
  const db = loadDB();
  let result = Array.isArray(db[RESOURCE]) ? db[RESOURCE] : Array.isArray(db.book) ? db.book : [];

  Object.entries(req.query).forEach(([key, value]) => {
    result = result.filter(item => String(item[key]) === String(value));
  });

  sendJSON(res, 200, true, result);
});

router.get('/:id', (req, res) => {
  const db = loadDB();
  const books = Array.isArray(db[RESOURCE]) ? db[RESOURCE] : Array.isArray(db.book) ? db.book : [];
  const item = books.find(i => i.id == req.params.id);
  if (!item) return sendJSON(res, 404, false, 'Not found');
  sendJSON(res, 200, true, item);
});

//Create book
router.post('/', (req, res) => {
  const db = loadDB();
  const books = Array.isArray(db[RESOURCE]) ? db[RESOURCE] : Array.isArray(db.book) ? db.book : [];
  const newItem = req.body;

  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    if (!newItem.hasOwnProperty(field)) {
      return sendJSON(res, 400, false, `Missing required field: ${field}`);
    }
  }

  // Check for duplicate ID
  if (books.some(i => i.id === newItem.id)) {
    return sendJSON(res, 400, false, 'Duplicate ID');
  }

  // Assign a new ID
  newItem.id = books.length ? Math.max(...books.map(i => i.id)) + 1 : 1;
  books.push(newItem);
  db[RESOURCE] = books;
  if (!db.book || !Array.isArray(db.book)) {
    db.book = books;
  }
  saveDB(db);
  sendJSON(res, 201, true, newItem);
});

//Retrieve all books
router.get('/', (req, res) => {
  const db = loadDB();
  const books = Array.isArray(db[RESOURCE]) ? db[RESOURCE] : Array.isArray(db.book) ? db.book : [];
  sendJSON(res, 200, true, books);
});

module.exports = router;

