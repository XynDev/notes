document.addEventListener('DOMContentLoaded', () => {
    /**
     * Wait for a specific DOM element to exist
     * @param {string} selector - The CSS selector of the target element
     * @param {number} timeout - Maximum time to wait in milliseconds
     * @returns {Promise<Element>} Resolves with the element or rejects if not found
     */
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            (function checkElement() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms`));
                } else {
                    requestAnimationFrame(checkElement);
                }
            })();
        });
    }

    /**
     * Fetch notes from the backend
     * @returns {Promise<Object>} Notes data
     */
    async function fetchNotes() {
        try {
            const response = await fetch('/notes');
            if (!response.ok) throw new Error(`Failed to fetch notes: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching notes:', error);
            return { categories: { personal: [], work: [], archived: [] } }; // Default structure
        }
    }

    /**
     * Render notes for a specific category
     * @param {Array} notes - Notes array
     */
    function renderNotes(notes) {
        waitForElement('#notesList')
            .then((notesList) => {
                notesList.innerHTML = ''; // Clear existing notes

                notes.forEach((note) => {
                    console.log(note)
                    const noteCard = document.createElement('div');
                    noteCard.classList.add('col');
                    noteCard.innerHTML = `
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">${note.title}</h5>
                                <p class="card-text">${note.content}</p>
                                <p class="text-muted">Last Edited: ${note.lastEdited}</p>
                                <p><strong>Subcategories:</strong> ${note.subcategories.join(', ')}</p>
                            </div>
                            <div class="card-footer text-end">
                                <button class="btn btn-sm btn-outline-primary editNoteBtn">Edit</button>
                                <button class="btn btn-sm btn-outline-danger deleteNoteBtn">Delete</button>
                            </div>
                        </div>
                    `;
                    notesList.appendChild(noteCard);
                });
            })
            .catch((error) => {
                console.error('Error rendering notes:', error);
            });
    }

    /**
     * Initialize the notes renderer
     */
    async function initializeRenderer(category = 'personal') {
        console.log(`Initializing renderer for category: ${category}`);
        const notesData = await fetchNotes();
        console.log(notesData)

        if (notesData.categories && Array.isArray(notesData.categories[category])) {
            renderNotes(notesData.categories[category]);
        } else {
            console.error(`Category "${category}" not found in notes data.`);
            waitForElement('#notesList')
                .then((notesList) => {
                    notesList.innerHTML = `<p>No notes available for the selected category.</p>`;
                })
                .catch((error) => {
                    console.error('Error displaying fallback message:', error);
                });
        }
    }

    // Initialize renderer with the 'personal' category
    initializeRenderer();
});
