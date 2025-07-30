"use strict"; // מצב קשוח של JS העוזר בלכידת שגיאות נפוצות במעבר בינארי

// קבלת התייחסות לאלמנטים ב־HTML לפי מזהה
const contactList    = document.getElementById("contactList");    // <ul> של תצוגת אנשי הקשר
const searchInput    = document.getElementById("searchInput");    // שדה חיפוש
const addBtn         = document.getElementById("addBtn");         // כפתור "Add Contact"
const clearAllBtn    = document.getElementById("clearAllBtn");    // כפתור "Clear All"
const effectBtn      = document.getElementById("effectBtn");      // כפתור החלפת ערכת צבעים
const popup          = document.getElementById("popup");          // חלון הפופ‑אפ
const popupForm      = document.getElementById("popupForm");      // הטופס שבתוך הפופ‑אפ
const formTitle      = document.getElementById("formTitle");      // כותרת הפופ‑אפ ("Add"/"Edit"/"View")
const formName       = document.getElementById("formName");       // שדה שם
const formPhone      = document.getElementById("formPhone");      // שדה טלפון
const formAddress    = document.getElementById("formAddress");    // שדה כתובת
const formEmail      = document.getElementById("formEmail");      // שדה אימייל
const formAge        = document.getElementById("formAge");        // שדה גיל
const formNotes      = document.getElementById("formNotes");      // שדה הערות
const formImage      = document.getElementById("formImage");      // שדה URL לתמונה
const cancelBtn      = document.getElementById("cancelBtn");      // כפתור ביטול בפופ‑אפ
const contactCounter = document.getElementById("contactCounter"); // תצוגת מספר אנשי הקשר
const noContactsMsg  = document.getElementById("noContactsMsg");  // הודעת "אין אנשי קשר"

// מערך התחלתי של אנשי הקשר (נשמר בזיכרון JS בלבד)
const contacts = [
  {
    name: "Ahmad Aboud",
    phone: "+972549535907",
    address: "IL ILLUT 16970",
    email: "ahmad.aboud576@gmail.com",
    age: "20",
    notes: "Professional coder",
    image: "pictures/Ahmad_Aboud.jpg"
  },
  {
    name: "Nizar Jarayse",
    phone: "+972526579472",
    address: "IL, Ma'alot-Tarshiha, 2101803",
    email: "jarayse@gmail.com",
    age: "30",
    notes: "CEO",
    image: "pictures/Nizar_Jarayse.jpg"
  },
  {
    name: "Zahra Halabi",
    phone: "+972546146092",
    address: "IL, Daliyat al-Karmel, 3005600",
    email: "zahra_halabi92@gmail.com",
    age: "28",
    notes: "Partner",
    image: "pictures/Zahra_Halabi.jpg"
  },
  {
    name: "Aiman Khashan",
    phone: "+972543564203",
    address: "IL, Shefa-Amr, 202001",
    email: "aaimn98@gmail.com",
    age: "24",
    notes: "Partner",
    image: "pictures/Aiman_Khashan.jpg"
  },
  {
    name: "Ammar Mansour",
    phone: "+972548150032",
    address: "IL, Isfiya, 3009000",
    email: "amar.mns.95@gmail.com",
    age: "25",
    notes: "Partner",
    image: "pictures/Ammar_Mansour.jpg"
  }
];

let editIndex = null;                       // מצביע למערך על הפריט שנערך (null => הוספה)
const defaultImage = "pictures/default.jpg"; // תמונת ברירת מחדל אם אין URL

// מוסיף לאלמנט li אירועי 'mouseover' ו-'mouseout' לשינוי רקע
const attachHover = li => {
  li.addEventListener("mouseover", () => li.classList.add("hovered"));  // הוסף class של הדגשה
  li.addEventListener("mouseout",  () => li.classList.remove("hovered")); // הסר class
};

// מעדכן את המונה ומציג/מסתיר את ההודעה "אין אנשי קשר"
const updateCounter = () => {
  const lis = contactList.querySelectorAll("li"); // כל הפריטים
  let visible = 0;
  lis.forEach(li => {
    if (li.style.display !== "none") visible++;  // סופר רק מה שמוצג
  });
  contactCounter.textContent = 
    `Total: ${visible} contact${visible !== 1 ? "s" : ""}`; // טקסט המונה
  noContactsMsg.classList.toggle("hidden", visible !== 0);   // הסתר אם יש לפחות אחד
};

// יוצר מחדש את כל רשימת אנשי הקשר מהמערך
const renderList = () => {
  contactList.innerHTML = ""; // מנקה קודם כל
  contacts.forEach((c, i) => {
    const li = document.createElement("li");
    // שומר שדות נוספים ב‑data-attributes של ה‑<li>
    li.dataset.address = c.address;
    li.dataset.email   = c.email;
    li.dataset.age     = c.age;
    li.dataset.notes   = c.notes;

    // תמונה
    const img = document.createElement("img");
    img.src = c.image || defaultImage;
    img.alt = c.name;

    // שם
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = c.name;

    // טלפון
    const phoneSpan = document.createElement("span");
    phoneSpan.className = "phone";
    phoneSpan.textContent = c.phone;

    // actions: כפתורי עריכה, צפייה, מחיקה
    const actions = document.createElement("span");
    actions.className = "actions";

    // כפתור עריכה (✏️ = &#x270F;)
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "&#x270F;";          // קוד הקסדצימלי של ✏
    editBtn.onclick   = () => showPopup(li, false);

    // כפתור צפייה (ℹ️ = &#x2139;)
    const viewBtn = document.createElement("button");
    viewBtn.innerHTML = "&#x2139;";          // קוד הקסדצימלי של ℹ
    viewBtn.onclick   = () => showPopup(li, true);

    // כפתור מחיקה (🗑️ = &#x1F5D1;)
    const delBtn = document.createElement("button");
    delBtn.innerHTML = "&#x1F5D1;";          // קוד הקסדצימלי של 🗑
    delBtn.onclick   = () => {
      contacts.splice(i, 1);                 // הוצא מהמערך
      renderList();                          // רענון התצוגה
    };

    actions.append(editBtn, viewBtn, delBtn);
    li.append(img, nameSpan, phoneSpan, actions);
    attachHover(li);                         // הוסף הדגשת hover
    contactList.appendChild(li);            // הדבקה ל־DOM
  });
  updateCounter();                          // עדכון מונה
};

// מסנן לפי שם מה שהוקלד בשדה החיפוש
const filterList = () => {
  const term = searchInput.value.toLowerCase();
  contactList.querySelectorAll("li").forEach(li => {
    const name = li.querySelector(".name").textContent.toLowerCase();
    li.style.display = name.includes(term) ? "" : "none"; // show/hide
  });
  updateCounter(); // עדכון מונה
};

// פותח את חלון הפופ‑אפ למצב הוספה / עריכה / צפייה
const showPopup = (li = null, readonly = false) => {
  popup.classList.remove("hidden");        // מציג את הפופ‑אפ
  if (li) {
    // במצב עריכה/צפייה – ממלא את השדות
    formTitle.textContent = readonly ? "View Contact" : "Edit Contact";
    formName.value    = li.querySelector(".name").textContent;
    formPhone.value   = li.querySelector(".phone").textContent;
    formAddress.value = li.dataset.address;
    formEmail.value   = li.dataset.email;
    formAge.value     = li.dataset.age;
    formNotes.value   = li.dataset.notes;
    formImage.value   = li.querySelector("img").src;
    // מוצא את מיקום ה‑<li> במערך ל‑editIndex
    const all = Array.from(contactList.children);
    editIndex = all.indexOf(li);
  } else {
    // במצב הוספה – אפס טופס
    formTitle.textContent = "Add Contact";
    popupForm.reset();
    editIndex = null;
  }
  // בקרת קריאות בלבד
  popupForm.querySelectorAll("input,textarea")
    .forEach(i => i.disabled = readonly);
  popupForm.querySelector("button[type=submit]")
    .style.display = readonly ? "none" : "";
};

// סוגר את הפופ‑אפ
const hidePopup = () => {
  popup.classList.add("hidden");
  popupForm.reset();
  editIndex = null;
};

// טיפול בשליחת הטופס – הוספה/עריכה עם בדיקת שם כפול
popupForm.addEventListener("submit", e => {
  e.preventDefault();                      // מונע רענון אוטומטי
  const name    = formName.value.trim();
  const phone   = formPhone.value.trim();
  const address = formAddress.value.trim();
  const email   = formEmail.value.trim();
  const age     = formAge.value.trim();
  const notes   = formNotes.value.trim();
  const image   = formImage.value.trim() || defaultImage;

  // בדיקת שדות חובה
  if (!name || !phone) {
    alert("Name and Phone are required.");
    return;
  }
  // בדיקת שם כפול
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].name === name && i !== editIndex) {
      alert("Name already exists. Cannot save duplicate.");
      return;
    }
  }
  // בניית אובייקט חדש/מעודכן
  const entry = { name, phone, address, email, age, notes, image };
  if (editIndex !== null) contacts[editIndex] = entry; // עריכה
  else                   contacts.push(entry);          // הוספה

  hidePopup();
  renderList();                             // רענון תצוגה
});

// קישור כפתורים לאירועים
addBtn.onclick      = () => showPopup();      // הוספה
cancelBtn.onclick   = hidePopup;              // ביטול
clearAllBtn.onclick = () => {
  contacts.length = 0;                        // ריקון המערך
  renderList();
};
searchInput.oninput = filterList;             // חיפוש חי
effectBtn.onclick   = () => document.body.classList.toggle("fancy-effect"); // אפקט צבעים

// רינדור ראשוני של הרשימה
document.addEventListener("DOMContentLoaded", renderList);
