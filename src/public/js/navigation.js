document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.nav-link');

    /**
     * Function to dynamically load components into #main-content
     * @param {string} page - The name of the page to load
     */
    async function loadComponent(page) {
        try {
            const response = await fetch(`/components/${page}.html`);
            if (!response.ok) throw new Error(`Error loading ${page}: ${response.status}`);
            
            // Load the HTML into #main-content
            const html = await response.text();
            mainContent.innerHTML = html;

            // Reinitialize page-specific scripts or components
            if (page === 'personal') {
                initializePersonalPage();
            } else if (page === 'all') {
                console.log('All Notes page loaded.');
                // You can add other page-specific initialization logic here
            }
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }

    /**
     * Function to initialize the Personal Notes page (Quill, event listeners, etc.)
     */
    function initializePersonalPage() {
        const editor = document.querySelector('#editor');
        const newNoteBtn = document.getElementById('newNoteBtn');
        const noteModal = document.getElementById('noteModal');

        // Initialize Quill editor if the editor container exists
        if (editor) {
            const quill = new Quill('#editor', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['clean'],
                    ],
                },
            });
            console.log('Quill editor initialized for Personal Notes.');

            // Handle "New Note" button click
            if (newNoteBtn) {
                newNoteBtn.addEventListener('click', () => {
                    const bootstrapModal = new bootstrap.Modal(noteModal);
                    bootstrapModal.show();
                });
            }
        } else {
            console.error('Quill editor container (#editor) not found.');
        }
    }

    /**
     * Attach click listeners to nav links
     */
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Get the page from the data-page attribute
            const page = e.target.closest('.nav-link').getAttribute('data-page');
            
            // Load the selected component/page
            loadComponent(page);

            // Update active class for links
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.closest('.nav-link').classList.add('active');
        });
    });

    // Load the default page (e.g., 'personal') on initial load
    loadComponent('personal');
});
