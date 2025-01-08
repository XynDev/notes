const express = require('express');
const path = require('path');
const fs = require('fs'); // Required for reading/writing files
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve the main index.html for all routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API to fetch notes
app.get('/notes', (req, res) => {
    const filePath = path.join(__dirname, 'src/data/notes.json');
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Notes file not found.' });
    }
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading notes.json:', err);
            return res.status(500).send('Error reading notes file.');
        }
        res.json(JSON.parse(data));
    });
});

// API to save notes
app.post('/notes', (req, res) => {
    const filePath = path.join(__dirname, 'src/data/notes.json');
    const notesData = req.body;
    if (!notesData.categories || !Array.isArray(notesData.categories.personal)) {
        return res.status(400).send('Invalid data format.');
    }
    fs.writeFile(filePath, JSON.stringify(notesData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to notes.json:', err);
            return res.status(500).send('Error saving notes.');
        }
        res.status(200).send('Notes saved successfully.');
    });
});

// API to fetch components dynamically
app.get('/components/:component', (req, res) => {
    const component = req.params.component;
    const filePath = path.join(__dirname, 'public', 'components', `${component}.html`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Component not found.');
    }
    res.sendFile(filePath);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
