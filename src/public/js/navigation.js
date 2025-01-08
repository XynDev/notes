document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.nav-link');

    async function loadComponent(page) {
        try {
            const response = await fetch(`/components/${page}.html`);
            if (!response.ok) throw new Error(`Error loading ${page}: ${response.status}`);
            const html = await response.text();
    
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = html;
    
            // Reinitialize Quill if the personal page is loaded
            if (page === 'personal') {
                initializeQuill();
            }
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }
    
    // Function to initialize Quill
    function initializeQuill() {
        const editor = document.querySelector('#editor');
        if (editor) {
            new Quill('#editor', {
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
        } else {
            console.error('Quill editor container (#editor) not found.');
        }
    }
    

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.closest('.nav-link').getAttribute('data-page');
            loadComponent(page);

            // Update active class for links
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.closest('.nav-link').classList.add('active');
        });
    });

    // Load default page (All Notes)
    loadComponent('personal');
});



