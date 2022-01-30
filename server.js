const express = require("express");
const path = require('path');
const util = require('util');
const fs = require('fs');
const {v4: uuidv4} = require("uuid");

// Handling processes : Async & Util was found online and was easier for me to understand, and less typing
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Setting Up the server
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Middleware
app.use(express.static('./public'));

// "GET" request for API Route
app.get('/api/notes', (req,res) => {
 readFileAsync('./db/db.json', 'utf-8').then(function(data) {
  notes = [].concat(JSON.parse(data))
  res.json(notes);
 })
});

// "POST" request for API Route
app.post('/api/notes', (req,res) => {
 let newNote = req.body;
 readFileAsync('./db/db.json', 'utf-8').then(function(data) {
  const notes = [].concat(JSON.parse(data));
  newNote.id = uuidv4();
  notes.push(newNote);
  return notes;
 }).then(function(notes) {
  writeFileAsync('./db/db.json', JSON.stringify(notes))
  res.json(newNote);
 })
});

// HTML ROUTES //
// displays notes.html
app.get("/notes", function(req, res) {
res.sendFile(path.join(__dirname, "../public/notes.html"));
});

// displays index.html
app.get("/", function(req, res) {
 res.sendFile(path.join(__dirname, "../public/index.html"));
});

//listen
app.listen(PORT, () => {
  console.log(`app is listening on port: ${PORT}`);
});
