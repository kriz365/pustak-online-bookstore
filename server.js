const express = require("express");
const path = require("path");
const api = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", api);

// Malformed JSON -> clean 400 instead of a stack trace
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed")
    return res.status(400).json({ success: false, message: "Request body is not valid JSON." });
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong on the server." });
});
app.use("/api", (req, res) => res.status(404).json({ success: false, message: "Unknown API route." }));

if (require.main === module) app.listen(PORT, () => console.log(`Bookstore running on http://localhost:${PORT}`));
module.exports = app;
