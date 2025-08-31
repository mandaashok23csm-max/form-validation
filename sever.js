const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const NOTES_FILE = './data/notes.json';

app.use(bodyParser.json());

function readNotes() {
    const data = fs.readFileSync(NOTES_FILE);
    return JSON.parse(data);
}

function writeNotes(notes) {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
}

app.get('/notes', (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

app.get('/notes/:id', (req, res) => {
    const notes = readNotes();
    const note = notes.find(n => n.id === req.params.id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ error: 'Note not found' });
    }
});

app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const notes = readNotes();
    const newNote = { id: uuidv4(), title, content };
    notes.push(newNote);
    writeNotes(notes);

    res.status(201).json(newNote);
});

app.delete('/notes/:id', (req, res) => {
    const notes = readNotes();
    const filteredNotes = notes.filter(n => n.id !== req.params.id);

    if (notes.length === filteredNotes.length) {
        return res.status(404).json({ error: 'Note not found' });
    }

    writeNotes(filteredNotes);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(Server is running at http://localhost:${PORT});
});