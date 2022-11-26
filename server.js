//set and initialize all our dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.port || 3001;

const  notes  = require("./db/db.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//npm package to generate an unique ID - found here https://www.npmjs.com/package/generate-unique-id
const generateUniqueId = require("generate-unique-id");

//function to create our new note
function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}
console.log(notes)


//Get route for the notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//Get route to add notes to the json file
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

//post route to add notes to the json file
app.post("/api/notes", (req, res) => {
  req.body.id = generateUniqueId();
  const note = createNewNote(req.body, notes);
  res.json(note);
});

//Get route for the homepage
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// listening on port 3001
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
