// Initialize Quill editor for the modal
let quill;

document.addEventListener("DOMContentLoaded", function () {
    // Initialize Quill editor when the modal is shown
    const noteModal = document.getElementById("noteModal");

    noteModal.addEventListener("show.bs.modal", function () {
        const editorContainer = document.getElementById("editor");
        if (!quill) {
            quill = new Quill(editorContainer, {
                theme: "snow",
                placeholder: "Write your note here...",
            });
        }
    });

    // Handle new note button click
    const newNoteBtn = document.getElementById("newNoteBtn");
    const noteTitleInput = document.getElementById("noteTitle");

    newNoteBtn.addEventListener("click", function () {
        // Clear the editor and input fields
        noteTitleInput.value = "";
        quill.setText("");

        // Show the modal
        const bootstrapModal = new bootstrap.Modal(noteModal);
        bootstrapModal.show();
    });

    // Handle saving the note
    const saveNoteBtn = document.getElementById("saveNoteBtn");
    const notesList = document.getElementById("notesList");

    saveNoteBtn.addEventListener("click", function () {
        const noteTitle = noteTitleInput.value.trim();
        const noteContent = quill.root.innerHTML.trim();

        if (!noteTitle) {
            alert("Please enter a title for your note.");
            return;
        }

        // Create a new card for the note
        const noteCard = document.createElement("div");
        noteCard.classList.add("col");
        noteCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${noteTitle}</h5>
                    <div class="card-text">${noteContent}</div>
                </div>
                <div class="card-footer text-end">
                    <button class="btn btn-sm btn-outline-primary editNoteBtn">Edit</button>
                    <button class="btn btn-sm btn-outline-danger deleteNoteBtn">Delete</button>
                </div>
            </div>
        `;

        notesList.appendChild(noteCard);

        // Close the modal
        const bootstrapModal = bootstrap.Modal.getInstance(noteModal);
        bootstrapModal.hide();
    });

    // Handle dynamic edit and delete buttons
    notesList.addEventListener("click", function (event) {
        const target = event.target;

        if (target.classList.contains("editNoteBtn")) {
            const card = target.closest(".card");
            const title = card.querySelector(".card-title").innerText;
            const content = card.querySelector(".card-text").innerHTML;

            // Populate the modal with the note data
            noteTitleInput.value = title;
            quill.root.innerHTML = content;

            // Show the modal
            const bootstrapModal = new bootstrap.Modal(noteModal);
            bootstrapModal.show();

            // Remove the card on save to replace it with the updated note
            saveNoteBtn.addEventListener("click", function handleSave() {
                card.remove();
                saveNoteBtn.removeEventListener("click", handleSave);
            });
        } else if (target.classList.contains("deleteNoteBtn")) {
            const card = target.closest(".card");
            card.remove();
        }
    });

    // Subcategories handling
    const subcategoriesList = document.getElementById("subcategoriesList");
    const newSubcategoryInput = document.getElementById("newSubcategory");
    const addSubcategoryBtn = document.getElementById("addSubcategoryBtn");

    addSubcategoryBtn.addEventListener("click", function () {
        const subcategoryName = newSubcategoryInput.value.trim();

        if (!subcategoryName) {
            alert("Please enter a subcategory name.");
            return;
        }

        const subcategoryItem = document.createElement("li");
        subcategoryItem.textContent = subcategoryName;
        subcategoriesList.appendChild(subcategoryItem);

        newSubcategoryInput.value = "";
    });
});
