const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for serving notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Read notes from db.json
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Create a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    // Read existing notes from db.json
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        const notes = JSON.parse(data);

        // Generate a unique ID for the new note
        newNote.id = uuidv4();

        // Add the new note to the array
        notes.push(newNote);

        // Write the updated notes array back to db.json
        fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(newNote);
        });
    });
});

// Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;

    // Read existing notes from db.json
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        let notes = JSON.parse(data);

        // Remove the note with the specified ID
        notes = notes.filter((note) => note.id !== id);

        // Write the updated notes array back to db.json
        fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.sendStatus(200);
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
