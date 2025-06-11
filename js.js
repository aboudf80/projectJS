"use strict";

// Element references
const contactList    = document.getElementById("contactList");
const searchInput    = document.getElementById("searchInput");
const addBtn         = document.getElementById("addBtn");
const clearAllBtn    = document.getElementById("clearAllBtn");
const effectBtn      = document.getElementById("effectBtn");
const popup          = document.getElementById("popup");
const popupForm      = document.getElementById("popupForm");
const formTitle      = document.getElementById("formTitle");
const formName       = document.getElementById("formName");
const formPhone      = document.getElementById("formPhone");
const formAddress    = document.getElementById("formAddress");
const formEmail      = document.getElementById("formEmail");
const formAge        = document.getElementById("formAge");
const formNotes      = document.getElementById("formNotes");
const formImage      = document.getElementById("formImage");
const cancelBtn      = document.getElementById("cancelBtn");
const contactCounter = document.getElementById("contactCounter");
const noContactsMsg  = document.getElementById("noContactsMsg");

// State
let editIndex = null;
const defaultImagePath = "pictures/default.jpg";

// Attach hover highlight
const attachHoverEvents = li => {
  li.addEventListener("mouseover", () => li.classList.add("hovered"));
  li.addEventListener("mouseout",  () => li.classList.remove("hovered"));
};

// Update counter & “no contacts” message (counts only visible)
const updateCounterAndEmptyMsg = () => {
  const items = contactList.querySelectorAll("li");
  let visibleCount = 0;
  items.forEach(li => {
    if (li.style.display !== "none") visibleCount++;
  });
  contactCounter.textContent = `Total: ${visibleCount} contact${visibleCount !== 1 ? "s" : ""}`;
  noContactsMsg.classList.toggle("hidden", visibleCount !== 0);
};

// Filter contacts by name
const filterContacts = () => {
  const filter = searchInput.value.toLowerCase();
  contactList.querySelectorAll("li").forEach(li => {
    const name = li.querySelector(".name").textContent.toLowerCase();
    li.style.display = name.includes(filter) ? "" : "none";
  });
  updateCounterAndEmptyMsg();
};

// Show popup for add / edit / view
const showPopup = (li = null, readonly = false) => {
  popup.classList.remove("hidden");
  if (li) {
    // populate form from li.dataset and spans
    formTitle.textContent = readonly ? "View Contact" : "Edit Contact";
    formName.value    = li.querySelector(".name").textContent;
    formPhone.value   = li.querySelector(".phone").textContent;
    formAddress.value = li.dataset.address || "";
    formEmail.value   = li.dataset.email || "";
    formAge.value     = li.dataset.age || "";
    formNotes.value   = li.dataset.notes || "";
    formImage.value   = li.querySelector("img").src || "";
    // find index
    const all = Array.from(contactList.children);
    editIndex = all.indexOf(li);
  } else {
    formTitle.textContent = "Add Contact";
    popupForm.reset();
    editIndex = null;
  }
  // enable/disable inputs
  const inputs = popupForm.querySelectorAll("input, textarea");
  inputs.forEach(i => i.disabled = readonly);
  popupForm.querySelector("button[type=submit]").style.display = readonly ? "none" : "";
};

// Hide popup
const hidePopup = () => {
  popup.classList.add("hidden");
  popupForm.reset();
  editIndex = null;
};

// Handlers
const editContact = btn => showPopup(btn.closest("li"), false);
const viewContact = btn => showPopup(btn.closest("li"), true);
const deleteContact = btn => {
  const li = btn.closest("li");
  contactList.removeChild(li);
  updateCounterAndEmptyMsg();
};

// Form submission with duplicate-name check
popupForm.onsubmit = e => {
  e.preventDefault();
  const name    = formName.value.trim();
  const phone   = formPhone.value.trim();
  const address = formAddress.value.trim();
  const email   = formEmail.value.trim();
  const age     = formAge.value.trim();
  const notes   = formNotes.value.trim();
  const image   = formImage.value.trim() || defaultImagePath;

  if (!name || !phone) {
    alert("Name and Phone are required.");
    return;
  }

  // Check duplicate name
  const items = contactList.querySelectorAll("li");
  for (let i = 0; i < items.length; i++) {
    const existing = items[i].querySelector(".name").textContent;
    if (existing === name && i !== editIndex) {
      alert("Name already exists. Cannot save duplicate.");
      return;
    }
  }

  // Build innerHTML
  let html  = `<img src="${image}" alt="${name}">`;
      html += `<span class="name">${name}</span>`;
      html += `<span class="phone">${phone}</span>`;
      html += `<span class="actions">`
           +   `<button onclick="editContact(this)">&#9998;</button>`
           +   `<button onclick="viewContact(this)">&#8505;</button>`
           +   `<button onclick="deleteContact(this)">&#128465;</button>`
           + `</span>`;

  if (editIndex !== null) {
    const li = items[editIndex];
    li.innerHTML = html;
    // store details in data-attributes
    li.dataset.address = address;
    li.dataset.email   = email;
    li.dataset.age     = age;
    li.dataset.notes   = notes;
  } else {
    const li = document.createElement("li");
    li.innerHTML = html;
    li.dataset.address = address;
    li.dataset.email   = email;
    li.dataset.age     = age;
    li.dataset.notes   = notes;
    contactList.appendChild(li);
    attachHoverEvents(li);
  }

  hidePopup();
  updateCounterAndEmptyMsg();
};

// Wire up controls
addBtn.onclick = () => showPopup();
cancelBtn.onclick = hidePopup;
clearAllBtn.onclick = () => {
  contactList.innerHTML = "";
  updateCounterAndEmptyMsg();
};
searchInput.oninput = filterContacts;
effectBtn.onclick = () => document.body.classList.toggle("fancy-effect");

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  contactList.querySelectorAll("li").forEach(li => attachHoverEvents(li));
  updateCounterAndEmptyMsg();
});
