const express = require("express");
const books = require("../data/books");
const { validateCheckout } = require("../validators/checkout");

const router = express.Router();
const orders = new Map();   // in-memory store (demo)
let nextOrder = 1001;

// GET /api/books?search=&category=
router.get("/books", (req, res) => {
  const q = String(req.query.search || "").toLowerCase();
  const cat = String(req.query.category || "");
  const list = books.filter((b) =>
    (!q || (b.title + b.author).toLowerCase().includes(q)) && (!cat || b.category === cat));
  res.json({ count: list.length, books: list });
});

// POST /api/checkout  -> 201 on success, 422 on validation failure
router.post("/checkout", (req, res) => {
  const { errors, clean } = validateCheckout(req.body);
  if (Object.keys(errors).length) {
    return res.status(422).json({ success: false, message: "Please fix the highlighted fields.", errors });
  }
  const id = nextOrder++;
  orders.set(id, { id, ...clean, createdAt: new Date().toISOString() });
  res.status(201).json({ success: true, message: `Order #${id} placed. Thank you, ${clean.name}!`, order: orders.get(id) });
});

// GET /api/orders/:id
router.get("/orders/:id", (req, res) => {
  const o = orders.get(Number(req.params.id));
  if (!o) return res.status(404).json({ success: false, message: "Order not found." });
  res.json({ success: true, order: o });
});

module.exports = router;
