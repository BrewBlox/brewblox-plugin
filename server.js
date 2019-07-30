// server/index.js
const express = require("express");
const path = require("path");

const PORT = 8200;

const app = express();

app.use(
  express.static(path.resolve(__dirname, "out"), {
    maxAge: "1s"
  })
);

app.listen(PORT);

//eslint-disable-next-line
console.log(`Listening on: http://localhost:${PORT}`);
