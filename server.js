// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
let notes = require("./db/db.json")

// Set our port to 8080
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Navigation Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// API routes
// this route is allowing the user to view the existing note
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "db/db.json"),
        (err, data) => {
            if (err) return res.json(err);
            data ? res.json(JSON.parse(data)) : res.json(false);
        });
});
// save new note
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    if (notes.length === 0) {
        newNote.id = 1;
    } else {
        // creates new id 
        const newNoteId = notes[notes.length - 1].id + 1;
        newNote.id = newNoteId;
    }

    console.log(newNote);
    // pushes note to array
    notes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    // sends to create new db entry
    res.json(newNote);
});

// remove id from arraw
app.delete("/api/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    // look for the chosen id and remove it from the array
    const newNotes = notes.filter((note) => {
        return note.id !== id;
    });
    // rewrites the db
    fs.writeFileSync("./db/db.json", JSON.stringify(newNotes));
    // sets new data set
    notes = newNotes;
    res.json(newNotes);
});

// Listener
app.listen(PORT, () => {
    console.log("App listening on PORT" + PORT);
});