/* ----------------------------------------
   Names : 1. Ahmad Aboud | ID : 214586562
           2. Zahra Halabi| ID : 316351063
   Class :         Software 50/5 
---------------------------------------- */
`use strict`; // Enable strict mode for catching common errors

// Get references to HTML elements by their IDs
const contactList    = document.getElementById("contactList");    // <ul> for displaying contacts
const searchInput    = document.getElementById("searchInput");    // Search input field
const addBtn         = document.getElementById("addBtn");         // "Add Contact" button
const clearAllBtn    = document.getElementById("clearAllBtn");    // "Clear All" button
const effectBtn      = document.getElementById("effectBtn");      // Toggle color effect button
const popup          = document.getElementById("popup");          // Popup overlay
const popupForm      = document.getElementById("popupForm");      // Form inside the popup
const formTitle      = document.getElementById("formTitle");      // Popup title ("Add"/"Edit"/"View")
const formName       = document.getElementById("formName");       // Name input field
const formPhone      = document.getElementById("formPhone");      // Phone input field
const formAddress    = document.getElementById("formAddress");    // Address input field
const formEmail      = document.getElementById("formEmail");      // Email input field
const formAge        = document.getElementById("formAge");        // Age input field
const formNotes      = document.getElementById("formNotes");      // Notes textarea
const formImage      = document.getElementById("formImage");      // Image URL input field
const cancelBtn      = document.getElementById("cancelBtn");      // "Cancel" button in popup
const contactCounter = document.getElementById("contactCounter"); // Display for total contacts
const noContactsMsg  = document.getElementById("noContactsMsg");  // "No contacts" message

// Initial in-memory array of contact objects
const contacts = [
  { name: "Ahmad Aboud", phone: "+972549535907", address: "IL ILLUT 16970",
    email: "ahmad.aboud576@gmail.com", age: "20", notes: "Professional coder",
    image: "pictures/Ahmad_Aboud.jpg" },
  { name: "Nizar Jarayse", phone: "+972526579472", address: "IL, Ma'alot-Tarshiha, 2101803",
    email: "jarayse@gmail.com", age: "30", notes: "CEO",
    image: "pictures/Nizar_Jarayse.jpg" },
  { name: "Zahra Halabi", phone: "+972546146092", address: "IL, Daliyat al-Karmel, 3005600",
    email: "zahra_halabi92@gmail.com", age: "28", notes: "Partner",
    image: "pictures/Zahra_Halabi.jpg" },
  { name: "Aiman Khashan", phone: "+972543564203", address: "IL, Shefa-Amr, 202001",
    email: "aaimn98@gmail.com", age: "24", notes: "Partner",
    image: "pictures/Aiman_Khashan.jpg" },
  { name: "Ammar Mansour", phone: "+972548150032", address: "IL, Isfiya, 3009000",
    email: "amar.mns.95@gmail.com", age: "25", notes: "Partner",
    image: "pictures/Ammar_Mansour.jpg" }
];

let editIndex = null;                       // Index in the array being edited; null = add mode
const defaultImage = "pictures/default.jpg"; // Default avatar if none provided

// Add hover highlight events to an <li>
const attachHover = li => {
  li.addEventListener("mouseover", () => li.classList.add("hovered"));
  li.addEventListener("mouseout",  () => li.classList.remove("hovered"));
};

// Update the counter and toggle the "no contacts" message
const updateCounter = () => {
  const lis = contactList.querySelectorAll("li");
  let visible = 0;
  lis.forEach(li => {
    if (li.style.display !== "none") visible++;
  });
  contactCounter.textContent =
    `Total: ${visible} contact${visible !== 1 ? "s" : ""}`;
  noContactsMsg.classList.toggle("hidden", visible !== 0);
};

// Render the entire contact list from the `contacts` array
const renderList = () => {
  contactList.innerHTML = ""; // Clear existing items
  contacts.forEach((c, i) => {
    const li = document.createElement("li");

    // Store extra fields in data-attributes
    li.dataset.address = c.address;
    li.dataset.email   = c.email;
    li.dataset.age     = c.age;
    li.dataset.notes   = c.notes;

    // Image element
    const img = document.createElement("img");
    img.src = c.image || defaultImage;
    img.alt = c.name;

    // Name span
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = c.name;

    // Phone span
    const phoneSpan = document.createElement("span");
    phoneSpan.className = "phone";
    phoneSpan.textContent = c.phone;

    // Actions container
    const actions = document.createElement("span");
    actions.className = "actions";

    // Edit button (✏️ = &#x270F;)
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "&#x270F;&#xFE0F;"; // ✏️ with emoji VS-16
    editBtn.onclick   = () => showPopup(li, false);

    // View button (ℹ️ = &#x2139;)
    const viewBtn = document.createElement("button");
    viewBtn.innerHTML = "&#x2139;&#xFE0F;";  // ℹ️
    viewBtn.onclick   = () => showPopup(li, true);

    // Delete button (🗑️ = &#x1F5D1;)
    const delBtn = document.createElement("button");
    delBtn.innerHTML = "&#x1F5D1;&#xFE0F;";          // 🗑️
    delBtn.onclick   = () => {
    // ask the user if they're sure, naming the contact
    if (confirm(`Are you sure you want to delete “${c.name}”?`)) {
    contacts.splice(i, 1);                 // remove from array
    renderList();                          // re-render
  }
};

    actions.append(editBtn, viewBtn, delBtn);
    li.append(img, nameSpan, phoneSpan, actions);
    attachHover(li);
    contactList.appendChild(li);
  });
  updateCounter();
};

// Filter contacts by the search term
const filterList = () => {
  const term = searchInput.value.toLowerCase();
  contactList.querySelectorAll("li").forEach(li => {
    const name = li.querySelector(".name").textContent.toLowerCase();
    li.style.display = name.includes(term) ? "" : "none";
  });
  updateCounter();
};

// Show popup in add/edit/view mode
const showPopup = (li = null, readonly = false) => {
  popup.classList.remove("hidden");
  if (li) {
    formTitle.textContent = readonly ? "View Contact" : "Edit Contact";
    formName.value    = li.querySelector(".name").textContent;
    formPhone.value   = li.querySelector(".phone").textContent;
    formAddress.value = li.dataset.address;
    formEmail.value   = li.dataset.email;
    formAge.value     = li.dataset.age;
    formNotes.value   = li.dataset.notes;
    formImage.value   = li.querySelector("img").src;
    // Determine index for editing
    const all = Array.from(contactList.children);
    editIndex = all.indexOf(li);
  } else {
    formTitle.textContent = "Add Contact";
    popupForm.reset();
    editIndex = null;
  }
  // Disable inputs in view-only mode
  popupForm.querySelectorAll("input,textarea")
    .forEach(i => i.disabled = readonly);
  popupForm.querySelector("button[type=submit]")
    .style.display = readonly ? "none" : "";
};

// Hide the popup
const hidePopup = () => {
  popup.classList.add("hidden");
  popupForm.reset();
  editIndex = null;
};

// Handle form submission: add/edit with duplicate-name and email validation
popupForm.addEventListener("submit", e => {
  e.preventDefault();
  const name    = formName.value.trim();
  const phone   = formPhone.value.trim();
  const address = formAddress.value.trim();
  const email   = formEmail.value.trim();
  const age     = formAge.value.trim();
  const notes   = formNotes.value.trim();
  const image   = formImage.value.trim() || defaultImage;

  // Required fields check
  if (!name || !phone) {
    alert("Name and Phone are required.");
    return;
  }
  // Email format check if provided
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Invalid email address.");
    return;
  }
  // Duplicate-name check
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].name === name && i !== editIndex) {
      alert("Name already exists. Cannot save duplicate.");
      return;
    }
  }
  // Build updated contact object
  const entry = { name, phone, address, email, age, notes, image };
  if (editIndex !== null) contacts[editIndex] = entry;
  else                   contacts.push(entry);

  hidePopup();
  renderList();
});

// Wire up button events
addBtn.onclick      = () => showPopup();
cancelBtn.onclick   = hidePopup;
clearAllBtn.onclick = () => {
  contacts.length = 0;
  renderList();
};
searchInput.oninput = filterList;
effectBtn.onclick   = () => document.body.classList.toggle("fancy-effect");

// Initial render on page load
document.addEventListener("DOMContentLoaded", renderList);

