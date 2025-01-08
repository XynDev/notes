const express = require('express');
const path = require('path');
const fs = require('fs');
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
    const filePath = path.join(__dirname, 'data/notes.json');
    if (!fs.existsSync(filePath)) {
        // Return default structure if file does not exist
        return res.json({
            categories: {
                personal: [],
                work: [],
                archived: []
            },
        });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading notes.json:', err);
            return res.status(500).send('Error reading notes file.');
        }

        try {
            const notesData = JSON.parse(data);
            res.json(notesData);
        } catch (parseError) {
            console.error('Error parsing notes.json:', parseError);
            res.status(500).send('Error parsing notes file.');
        }
    });
});

// API to save notes
app.post('/notes', (req, res) => {
    const filePath = path.join(__dirname, 'src/data/notes.json');
    const { category, note } = req.body;

    // Validate the request body
    if (!category || !note || !note.title || !note.content) {
        return res.status(400).send('Invalid data format. Category and note data are required.');
    }

    // Read the existing notes
    fs.readFile(filePath, 'utf-8', (err, data) => {
        let notesData;

        if (err || !data) {
            // If file doesn't exist or is empty, create a default structure
            notesData = { categories: { personal: [], work: [], archived: [] } };
        } else {
            try {
                notesData = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing notes.json:', parseError);
                return res.status(500).send('Error parsing notes file.');
            }
        }

        // Ensure the category exists
        if (!notesData.categories[category]) {
            notesData.categories[category] = [];
        }

        // Add the new note
        notesData.categories[category].push(note);

        // Write the updated notes data back to the file
        fs.writeFile(filePath, JSON.stringify(notesData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to notes.json:', writeErr);
                return res.status(500).send('Error saving note.');
            }

            res.status(200).send('Note saved successfully.');
        });
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
