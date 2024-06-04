// index.js

document.addEventListener("DOMContentLoaded", function() {
    const titleInput = document.querySelector(".note-title");
    const textarea = document.querySelector(".note-textarea");
    const saveButton = document.querySelector(".save-note");
    const newButton = document.querySelector(".new-note");
    const clearButton = document.querySelector(".clear-btn");
    const listContainer = document.querySelector("#list-container ul");

    // Function to show only the clear button
    function showClearButton() {
        saveButton.style.display = "none";
        newButton.style.display = "none";
        clearButton.style.display = "inline-block";
    }

    // Initially, show only the clear button
    showClearButton();

    // Function to show save and clear buttons
    function showSaveAndClearButtons() {
        saveButton.style.display = "inline-block";
        newButton.style.display = "none";
        clearButton.style.display = "inline-block";
    }

    // Function to show only the new note button
    function showNewNoteButton() {
        saveButton.style.display = "none";
        newButton.style.display = "inline-block";
        clearButton.style.display = "none";
    }

    // Function to handle focus on title input
    titleInput.addEventListener("focus", function() {
        showClearButton();
    });

    // Function to handle focus on textarea
    textarea.addEventListener("focus", function() {
        showSaveAndClearButtons();
    });

    // Function to handle blur events
    titleInput.addEventListener("blur", function() {
        if (textarea.value.trim() === "") {
            showClearButton();
        }
    });

    textarea.addEventListener("blur", function() {
        if (textarea.value.trim() === "") {
            showClearButton();
        } else {
            showSaveAndClearButtons();
        }
    });

    // Function to create a new note list item
    function createNoteListItem(title, content) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center'; // Add classes for flexbox alignment
        listItem.innerHTML = `<span><strong>${title}</strong></span>`;
        listItem.dataset.content =  content; // Store the note content in a data attribute

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-sm btn-outline-danger delete-note';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';

        listItem.appendChild(deleteButton);

        return listItem;
    }

    // Function to add a new note to the list
    function addNoteToList(title, content) {
        const noteListItem = createNoteListItem(title, content);
        listContainer.appendChild(noteListItem);
    }

    // Function to handle delete button click
    function handleDeleteButtonClick(event) {
        const listItem = event.target.closest('.list-group-item');
        if (listItem) {
            const title = listItem.querySelector('strong').innerText;
            const content = listItem.dataset.content;

            // Check if the note being deleted is the one currently being viewed
            if (titleInput.value === title && textarea.value === content) {
                titleInput.value = "";
                textarea.value = "";
                showClearButton();
            }

            listItem.remove();
            saveNotesToLocalStorage(); // Save notes to localStorage when deleted
        }
    }

    // Event listener for delete button click
    listContainer.addEventListener('click', function(event) {
        const deleteButton = event.target.closest('.delete-note');
        if (deleteButton) {
            handleDeleteButtonClick(event);
        } else {
            const listItem = event.target.closest('.list-group-item');
            if (listItem) {
                // Populate the note title and text fields
                titleInput.value = listItem.querySelector('strong').innerText;
                textarea.value = listItem.dataset.content;
                showNewNoteButton();
            }
        }
    });

    // Function to save notes to localStorage
    function saveNotesToLocalStorage() {
        const notes = Array.from(listContainer.querySelectorAll("li")).map(li => ({
            title: li.querySelector('strong').innerText,
            content: li.dataset.content
        }));
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    // Function to load notes from localStorage
    function loadNotesFromLocalStorage() {
        const storedNotes = JSON.parse(localStorage.getItem("notes"));
        if (storedNotes) {
            storedNotes.forEach(note => addNoteToList(note.title, note.content));
        }
    }

    // Load notes from localStorage when the page loads
    loadNotesFromLocalStorage();

    // Event listener for save button click
    saveButton.addEventListener("click", function() {
        const title = titleInput.value.trim();
        const content = textarea.value.trim();
        if (title !== "") {
            addNoteToList(title, content);
            saveNotesToLocalStorage(); // Save notes to localStorage when saved
            titleInput.value = "";
            textarea.value = "";
            showClearButton();
        }
    });

});

