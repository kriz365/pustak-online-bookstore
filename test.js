// Run with: npm start (in one terminal), then npm test
const base = process.env.BASE || "http://localhost:3000";
const valid = { name: "Asha Patil", email: "asha@example.com", phone: "9876543210",
  address: "12 MG Road, Camp, Pune", pin: "411001", payment: "upi", items: [{ id: 5, qty: 2 }] };
const cases = [
  ["valid order", valid, 201],
  ["empty body", {}, 422],
  ["bad email", { ...valid, email: "asha@" }, 422],
  ["bad phone", { ...valid, phone: "12345" }, 422],
  ["bad PIN", { ...valid, pin: "0123" }, 422],
  ["unknown payment", { ...valid, payment: "bitcoin" }, 422],
  ["empty cart", { ...valid, items: [] }, 422],
  ["qty 99", { ...valid, items: [{ id: 5, qty: 99 }] }, 422],
  ["unknown book", { ...valid, items: [{ id: 999, qty: 1 }] }, 422],
];
(async () => {
  let fail = 0;
  for (const [label, body, want] of cases) {
    const r = await fetch(base + "/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json(); const ok = r.status === want; if (!ok) fail++;
    console.log(`${ok ? "PASS" : "FAIL"}  ${label.padEnd(16)} -> ${r.status}`, j.errors ? Object.keys(j.errors).join(",") : j.message);
  }
  process.exit(fail ? 1 : 0);
})();
