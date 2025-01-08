var editorId = "editor"; // Set your editor's container ID

// Delay initialization to ensure the container is in the DOM
setTimeout(() => {
    var container = document.getElementById(editorId);
    if (container) {
        // Initialize Quill if the container exists
        var editor = new Quill(container, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['clean'],
                ],
            },
        });
        console.log('Quill editor initialized successfully.');

        // Dynamically load /js/quill.js after successful initialization
        loadScript('/js/quill.js');
    } else {
        console.error(`Container with ID "${editorId}" not found.`);
    }
}, 3000);

// Function to dynamically load a JavaScript file
function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true; // Optional: Load script asynchronously
    script.onload = () => console.log(`Script loaded: ${src}`);
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    document.head.appendChild(script);
}
