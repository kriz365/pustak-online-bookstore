// Pure validation module: takes untrusted input, returns { errors, clean }.
const books = require("../data/books");

const NAME_RE = /^[A-Za-z][A-Za-z .'-]{1,59}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/;      // Indian mobile number
const PIN_RE = /^[1-9]\d{5}$/;        // Indian PIN code
const PAYMENTS = ["upi", "card", "cod"];

function str(v) { return typeof v === "string" ? v.trim() : ""; }

function validateCheckout(body) {
  const errors = {};
  const b = body && typeof body === "object" ? body : {};

  const name = str(b.name);
  if (!name) errors.name = "Name is required.";
  else if (!NAME_RE.test(name)) errors.name = "Use 2–60 letters; spaces, . ' - allowed.";

  const email = str(b.email).toLowerCase();
  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email like name@example.com.";

  const phone = str(b.phone);
  if (!phone) errors.phone = "Phone number is required.";
  else if (!PHONE_RE.test(phone)) errors.phone = "Enter a 10-digit mobile number starting with 6–9.";

  const address = str(b.address);
  if (!address) errors.address = "Address is required.";
  else if (address.length < 10 || address.length > 200) errors.address = "Address must be 10–200 characters.";

  const pin = str(b.pin);
  if (!pin) errors.pin = "PIN code is required.";
  else if (!PIN_RE.test(pin)) errors.pin = "Enter a valid 6-digit PIN code.";

  const payment = str(b.payment);
  if (!PAYMENTS.includes(payment)) errors.payment = "Choose UPI, card or cash on delivery.";

  // Cart: never trust prices or totals from the client.
  const items = [];
  if (!Array.isArray(b.items) || b.items.length === 0) {
    errors.items = "Your cart is empty.";
  } else {
    for (const it of b.items) {
      const book = books.find((x) => x.id === it?.id);
      const qty = it?.qty;
      if (!book) { errors.items = `Unknown book id: ${String(it?.id)}.`; break; }
      if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
        errors.items = `Quantity for "${book.title}" must be a whole number from 1 to 10.`; break;
      }
      items.push({ id: book.id, title: book.title, qty, price: book.price });
    }
  }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return { errors, clean: { name, email, phone, address, pin, payment, items, total } };
}

module.exports = { validateCheckout };
