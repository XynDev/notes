document.addEventListener("DOMContentLoaded", function () {
    // Initialize Quill editor for the modal
    let quill;
    let categories = {}; // Store categories and their subcategories
    let currentCategory = null;
    let currentSubcategory = null;

    const noteModal = document.getElementById("noteModal");
    const noteTitleInput = document.getElementById("noteTitle");
    const saveNoteBtn = document.getElementById("saveNoteBtn");
    const notesList = document.getElementById("notesList");
    const categoriesList = document.getElementById("categoriesList");
    const subcategoriesList = document.getElementById("subcategoriesList");
    const newCategoryInput = document.getElementById("newCategory");
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const newSubcategoryInput = document.getElementById("newSubcategory");
    const addSubcategoryBtn = document.getElementById("addSubcategoryBtn");

    if (noteModal) {
        noteModal.addEventListener("show.bs.modal", function () {
            const editorContainer = document.getElementById("editor");
            if (!quill) {
                quill = new Quill(editorContainer, {
                    theme: "snow",
                    placeholder: "Write your note here...",
                });
            }

            // Reset values when opening the modal
            noteTitleInput.value = "";
            if (quill) quill.setText("");
            subcategoriesList.innerHTML = "";
        });
    }

    // Handle new note button click
    const newNoteBtn = document.getElementById("newNoteBtn");
    if (newNoteBtn) {
        newNoteBtn.addEventListener("click", function () {
            // Clear the form
            categoriesList.innerHTML = "";
            newCategoryInput.value = "";
            newSubcategoryInput.value = "";
            currentCategory = null;
            currentSubcategory = null;

            const bootstrapModal = new bootstrap.Modal(noteModal);
            bootstrapModal.show();
        });
    }

    // Add Category
    addCategoryBtn.addEventListener("click", function () {
        const categoryName = newCategoryInput.value.trim();
        if (categoryName) {
            categories[categoryName] = [];
            const categoryItem = document.createElement("li");
            categoryItem.classList.add("list-group-item", "list-group-item-action");
            categoryItem.innerText = categoryName;
            categoryItem.addEventListener("click", function () {
                currentCategory = categoryName;
                updateSubcategoriesList(categoryName);
            });
            categoriesList.appendChild(categoryItem);
            newCategoryInput.value = "";
        }
    });

    // Add Subcategory
    addSubcategoryBtn.addEventListener("click", function () {
        const subcategoryName = newSubcategoryInput.value.trim();
        if (subcategoryName && currentCategory) {
            categories[currentCategory].push(subcategoryName);
            const subcategoryItem = document.createElement("li");
            subcategoryItem.classList.add("list-group-item", "list-group-item-action");
            subcategoryItem.innerText = subcategoryName;
            subcategoryItem.addEventListener("click", function () {
                currentSubcategory = subcategoryName;
                loadNotesForSubcategory(currentCategory, currentSubcategory);
            });
            subcategoriesList.appendChild(subcategoryItem);
            newSubcategoryInput.value = "";
        }
    });

    // Handle saving the note
    saveNoteBtn.addEventListener("click", function () {
        const noteTitle = noteTitleInput.value.trim();
        const noteContent = quill.root.innerHTML.trim();

        if (!noteTitle || !currentCategory || !currentSubcategory) {
            alert("Please enter a title and select a category and subcategory.");
            return;
        }

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

        const categoryKey = `${currentCategory}:${currentSubcategory}`;
        if (!localStorage.getItem(categoryKey)) {
            localStorage.setItem(categoryKey, JSON.stringify([]));
        }

        const notes = JSON.parse(localStorage.getItem(categoryKey));
        notes.push({ title: noteTitle, content: noteContent });
        localStorage.setItem(categoryKey, JSON.stringify(notes));

        loadNotesForSubcategory(currentCategory, currentSubcategory);

        const bootstrapModal = bootstrap.Modal.getInstance(noteModal);
        bootstrapModal.hide();
    });

    // Load notes for a given category and subcategory
    function loadNotesForSubcategory(category, subcategory) {
        const categoryKey = `${category}:${subcategory}`;
        const notes = JSON.parse(localStorage.getItem(categoryKey) || "[]");
        notesList.innerHTML = ""; // Clear previous notes

        notes.forEach(note => {
            const noteCard = document.createElement("div");
            noteCard.classList.add("col");
            noteCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${note.title}</h5>
                        <div class="card-text">${note.content}</div>
                    </div>
                    <div class="card-footer text-end">
                        <button class="btn btn-sm btn-outline-primary editNoteBtn">Edit</button>
                        <button class="btn btn-sm btn-outline-danger deleteNoteBtn">Delete</button>
                    </div>
                </div>
            `;
            notesList.appendChild(noteCard);
        });
    }

    // Dynamic edit and delete buttons
    notesList.addEventListener("click", function (event) {
        const target = event.target;

        if (target.classList.contains("editNoteBtn")) {
            const card = target.closest(".card");
            const title = card.querySelector(".card-title").innerText;
            const content = card.querySelector(".card-text").innerHTML;

            noteTitleInput.value = title;
            quill.root.innerHTML = content;

            const bootstrapModal = new bootstrap.Modal(noteModal);
            bootstrapModal.show();

            saveNoteBtn.addEventListener("click", function handleSave() {
                card.remove();
                saveNoteBtn.removeEventListener("click", handleSave);
            });
        } else if (target.classList.contains("deleteNoteBtn")) {
            const card = target.closest(".card");
            card.remove();
        }
    });
});
