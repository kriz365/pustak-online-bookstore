# Pustak – Mini Bookstore (React + Node/Express)

React cart (useReducer, controlled forms, client validation) + Express API with **server-side validation**.

## Run
    npm install
    npm start          # http://localhost:3000
    npm test           # in a 2nd terminal: valid + invalid inputs

## API
| Method | Route | Result |
|---|---|---|
| GET  | /api/books?search=&category= | 200 list |
| POST | /api/checkout | 201 success / 422 `{errors}` / 400 bad JSON |
| GET  | /api/orders/:id | 200 / 404 |

## Deploy (Render)
Push to GitHub → Render "New Web Service" → Build: `npm install` → Start: `npm start`.
(Railway/Cyclic work the same; the app reads `PORT` from the environment.)
