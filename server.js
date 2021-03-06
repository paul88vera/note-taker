const express = require("express");
const path = require("path");
const util = require("util");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Handling processes : Async & Util was easier for me to understand, and less typing
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Setting Up the server
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Middleware
app.use(express.static("public"));

// "GET" request for API Route
app.get("/api/notes", (req, res) => {
  readFileAsync("./db/db.json", "utf-8").then((data) => {
    notes = [].concat(JSON.parse(data));
    res.json(notes);
  });
});

// "POST" request for API Route
app.post("/api/notes", (req, res) => {
  let newNote = req.body;
  readFileAsync("./db/db.json", "utf-8")
    .then((data) => {
      const notes = [].concat(JSON.parse(data));
      newNote.id = [notes.length + 1].concat(uuidv4());
      notes.push(newNote);
      return notes;
    })
    .then((notes) => {
      writeFileAsync("./db/db.json", JSON.stringify(notes));
      res.json(newNote);
    });
});

// "DELETE" doesn't refresh but deletes from the array. Manual page refresh needed until issue is fixed.
app.delete("/api/notes/:id", (req, res) => {
  readFileAsync("./db/db.json", "utf-8").then(function (data) {
    const notes = [].concat(JSON.parse(data));
    notes.splice(req.params.id, 1);
    console.log(`Deleted note '${req.params.id}'`);
    writeFileAsync("./db/db.json", JSON.stringify(notes, "\t"), (err) => {
      if (err) throw err;
      return true;
    })
  })
});

// HTML ROUTES //
// displays notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// displays index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// displays index.html with anything after /api/notes/
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//listen
app.listen(PORT, () => {
  console.log(`app is listening on port: ${PORT}`);
});
