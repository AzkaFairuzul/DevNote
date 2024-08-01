import "./style.css";
import { INote, INoteResult } from "./types/entity";

let notes: INote[] = [];
let currentNoteId: string | null = null;

// Get DOM elements
const newNoteBtn = document.getElementById("newNoteBtn") as HTMLButtonElement;
const newNoteIcon = document.getElementById("newNoteIcon") as HTMLButtonElement;
const noteModal = document.getElementById("noteModal") as HTMLDivElement;
const closeNoteModal = document.getElementById(
  "closeNoteModal"
) as HTMLSpanElement;
const noteTitle = document.getElementById("noteTitle") as HTMLInputElement;
const noteContent = document.getElementById(
  "noteContent"
) as HTMLTextAreaElement;
const saveNoteBtn = document.getElementById("saveNoteBtn") as HTMLButtonElement;
const noteList = document.getElementById("noteList") as HTMLUListElement;
const notesDisplay = document.getElementById("notesDisplay") as HTMLDivElement;
const deleteModal = document.getElementById("deleteModal") as HTMLDivElement;
const closeDeleteModal = document.getElementById(
  "closeDeleteModal"
) as HTMLSpanElement;
const confirmDeleteBtn = document.getElementById(
  "confirmDeleteBtn"
) as HTMLButtonElement;
const cancelDeleteBtn = document.getElementById(
  "cancelDeleteBtn"
) as HTMLButtonElement;
const modalTitle = document.getElementById("modalTitle") as HTMLHeadingElement;

const API_URL = "https://v1.appbackend.io/v1/rows/3Mq8k1BtGGLC";

// Event listeners
newNoteBtn.onclick = () => openNoteModal();
newNoteIcon.onclick = () => openNoteModal();
closeNoteModal.onclick = () => closeModal(noteModal);
saveNoteBtn.onclick = () => saveNote();
closeDeleteModal.onclick = () => closeModal(deleteModal);
cancelDeleteBtn.onclick = () => closeModal(deleteModal);

// Open note modal for creating or editing
function openNoteModal(note: INote | null = null) {
  currentNoteId = note ? note._id : null;
  noteTitle.value = note ? note.title : "";
  noteContent.value = note ? note.note : "";
  modalTitle.textContent = note ? "Edit Note" : "New Note"; // Set the title based on action
  noteModal.style.display = "block";
}

// Save note (create or update)
function saveNote() {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  const titleError = document.getElementById("titleError");
  const contentError = document.getElementById("contentError");

  // Clear previous error messages
  if (titleError) {
    titleError.textContent = "";
  }
  if (contentError) {
    contentError.textContent = "";
  }

  // Validate input fields
  let isValid = true;
  if (title === "") {
    if (titleError) {
      titleError.textContent = "Title is required.";
    }
    isValid = false;
  }
  if (content === "") {
    if (contentError) {
      contentError.textContent = "Content is required.";
    }
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  if (currentNoteId === null) {
    // Create new note
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ title, note: content }]),
    })
      .then((response) => response.json())
      .then((result) => {
        notes.push(result.data[0]);
        closeModal(noteModal); // Close the modal after saving
        renderNotes();
      })
      .catch((error) => console.log("error", error))
      .finally(() => window.location.reload());
  } else {
    // Update existing note
    fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: currentNoteId, title, note: content }),
    })
      .then((response) => response.json())
      .then((result) => {
        const noteIndex = notes.findIndex((note) => note._id === currentNoteId);
        notes[noteIndex] = result.data[0];
        closeModal(noteModal); // Close the modal after updating
        renderNotes();
      })
      .catch((error) => console.log("error", error))
      .finally(() => window.location.reload());
  }
}

// Render notes in the sidebar and main content area
function renderNotes() {
  noteList.innerHTML = "";
  notesDisplay.innerHTML = "";
  notes.forEach((note) => {
    // Render note in sidebar
    const li = document.createElement("li");
    li.className = "note-list-item";
    li.innerHTML = `
      <span class="note-title">${note.title}</span>
      <div class="note-actions">
        <button class="btn-update">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="currentColor" d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"/>
        </svg>
        </button>
        <button class="btn-delete">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"/>
          </svg>
        </button>
      </div>
    `;
    li.querySelector(".btn-update")?.addEventListener("click", () =>
      openNoteModal(note)
    );
    li.querySelector(".btn-delete")?.addEventListener("click", () =>
      openDeleteModal(note._id)
    );
    noteList.appendChild(li);

    // Render note in main content area
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.note}</p>
      <button class="btn-delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"/>
        </svg>
      </button>
    `;
    div.addEventListener("click", () => openNoteModal(note));
    div.querySelector(".btn-delete")?.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering the div click event
      openDeleteModal(note._id);
    });
    notesDisplay.appendChild(div);
  });
}

// Open delete confirmation modal
function openDeleteModal(noteId: string) {
  currentNoteId = noteId;
  deleteModal.style.display = "block";
}

// Delete note
confirmDeleteBtn.onclick = () => {
  if (currentNoteId !== null) {
    fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([currentNoteId]), // Send the currentNoteId to delete
    })
      .then((response) => {
        if (response.ok) {
          notes = notes.filter((note) => note._id !== currentNoteId);
          closeModal(deleteModal);
          renderNotes();
        } else {
          console.log("Failed to delete note");
        }
      })
      .catch((error) => console.log("error", error));
  }
};

// Close modal
function closeModal(modal: HTMLDivElement) {
  modal.style.display = "none";
  currentNoteId = null;
}

// Get current date, time, and greeting
function getGreeting() {
  const now = new Date();
  const hours = now.getHours();
  let greeting = "Hello";
  if (hours < 12) {
    greeting = "Good Morning";
  } else if (hours < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  // Set locale to 'en-US' to ensure date is formatted in English
  const dateTime = now.toLocaleDateString("en-US", options);
  return { greeting, dateTime };
}

// Display greeting message on page load
function displayGreeting() {
  const { greeting, dateTime } = getGreeting();
  const greetingDisplay = document.getElementById("greetingDisplay");
  if (greetingDisplay) {
    greetingDisplay.innerHTML = `<h2>${greeting}</h2><p>${dateTime}</p>`;
  }
}

// Fetch notes on page load
window.onload = () => {
  fetch(API_URL)
    .then((response) => response.json())
    .then((result: INoteResult) => {
      notes = result.data;
      renderNotes();
      displayGreeting();
    })
    .catch((error) => console.log("error", error));
};
