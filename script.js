// === State ===
let logs = JSON.parse(localStorage.getItem("logs")) || [];
let selectedLog = null;

// === Elements ===
const logList = document.getElementById("log-list");
const logTitle = document.getElementById("log-title");
const logDate = document.getElementById("log-date");
const logContent = document.getElementById("log-content");
const saveBtn = document.getElementById("save-log");
const deleteBtn = document.getElementById("delete-log");
const newLogBtn = document.getElementById("new-log");

// --- Title Modal ---
const titleModal = document.getElementById("title-modal");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const btnOk = document.getElementById("title-ok");
const btnCancel = document.getElementById("title-cancel");

// --- Delete Modal ---
const deleteModal = document.getElementById("delete-modal");
const confirmTitle = document.getElementById("confirm-title");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");

// === Utility: Format date to dd/mm/yyyy ===
function formatDate(inputDate) {
  if (!inputDate) return "Unknown";
  const [year, month, day] = inputDate.split("-");
  return `${day}/${month}/${year}`;
}

// === Render logs list ===
function renderLogs() {
  logList.innerHTML = "";
  logs.forEach((log, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="title">${log.title}</span>
      <span class="date">(${formatDate(log.date)})</span>
    `;
    li.onclick = () => selectLog(index);
    if (index === selectedLog) li.classList.add("active");
    logList.appendChild(li);
  });
}

// === Select log ===
function selectLog(index) {
  selectedLog = index;
  const log = logs[index];
  logTitle.textContent = log.title;
  logDate.textContent = `Date: ${formatDate(log.date)}`;
  logContent.value = log.content;
  logContent.disabled = false;
  saveBtn.disabled = false;
  deleteBtn.disabled = false;

  // highlight active log
  [...logList.children].forEach(li => li.classList.remove("active"));
  logList.children[index].classList.add("active");
}

// === New log (open title modal) ===
newLogBtn.addEventListener("click", () => {
  titleInput.value = "";
  dateInput.value = "";
  titleModal.classList.remove("hidden");
  titleInput.focus();
});

// === Title modal cancel ===
btnCancel.addEventListener("click", () => {
  titleModal.classList.add("hidden");
});

// === Title modal OK ===
btnOk.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const date = dateInput.value;
  if (!title || !date) return;

  const newLog = { title, date, content: "" };
  logs.push(newLog);
  localStorage.setItem("logs", JSON.stringify(logs));
  renderLogs();

  // Auto-select new log
  selectLog(logs.length - 1);

  titleModal.classList.add("hidden");
});

// === Save log ===
saveBtn.addEventListener("click", () => {
  if (selectedLog === null) return;
  logs[selectedLog].content = logContent.value;
  localStorage.setItem("logs", JSON.stringify(logs));

  // Blink effect on sidebar item
  const li = logList.children[selectedLog];
  li.classList.add("saved");
  setTimeout(() => li.classList.remove("saved"), 800);
});

// === Delete log (open modal) ===
deleteBtn.addEventListener("click", () => {
  if (selectedLog === null) return;
  confirmTitle.textContent = logs[selectedLog].title;
  deleteModal.classList.remove("hidden");
});

// === Confirm delete ===
confirmDeleteBtn.addEventListener("click", () => {
  if (selectedLog === null) return;
  logs.splice(selectedLog, 1);
  localStorage.setItem("logs", JSON.stringify(logs));
  selectedLog = null;

  // Reset UI
  logTitle.textContent = "Select or Create a Log";
  logDate.textContent = "";
  logContent.value = "";
  logContent.disabled = true;
  saveBtn.disabled = true;
  deleteBtn.disabled = true;

  deleteModal.classList.add("hidden");
  renderLogs();
});

// === Cancel delete ===
cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
});

// === Global key handling ===
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!titleModal.classList.contains("hidden")) titleModal.classList.add("hidden");
    if (!deleteModal.classList.contains("hidden")) deleteModal.classList.add("hidden");
  }
});

// === Init ===
renderLogs();
