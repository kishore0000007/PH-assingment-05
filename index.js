
  document.getElementById("login_form").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (username === "admin" && password === "admin123") {
    document.getElementById("login_page").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
  } else {
    alert("Invalid Username or Password");
  }
});

const container = document.getElementById("issuesContainer");
const issueCount = document.getElementById("issueCount");
const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("issueModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPriority = document.getElementById("modalPriority");
const modalStatusDot = document.getElementById("modalStatusDot");
const modalLabels = document.getElementById("modalLabels");
const modalAuthor = document.getElementById("modalAuthor");
const modalDate = document.getElementById("modalDate");

let allIssues = [];
let currentFilter = "all";

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

function showContainerSpinner() {
  container.innerHTML = `<div class="col-span-3 flex justify-center items-center py-10"><span class="loading loading-dots loading-lg"></span></div>`;
}

function showModalSpinner() {
  modalTitle.innerText = "Loading...";
  modalDesc.innerText = "";
  modalPriority.innerText = "";
  modalStatusDot.innerHTML = "";
  modalLabels.innerHTML = "";
  modalAuthor.innerText = "";
  modalDate.innerText = "";
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

async function fetchIssues() {
  showContainerSpinner();
  try {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    allIssues = data.data || data;
    applyFilters();
  } catch (err) {
    container.innerHTML = `<p class="text-red-500 text-center col-span-3">Failed to load issues</p>`;
    console.error(err);
  }
}

async function fetchSingleIssue(id) {
  showModalSpinner();
  try {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    if (!res.ok) throw new Error("Failed to fetch issue");
    const data = await res.json();
    return data.data || data;
  } catch (err) {
    alert("Failed to load issue details");
    console.error(err);
    return null;
  }
}

function renderIssues(issues) {
  container.innerHTML = "";
  issueCount.textContent = `${issues.length} Issues`;
  if (issues.length === 0) {
    container.innerHTML = `<p class="text-gray-500 text-center col-span-3">No issues found 😐</p>`;
    return;
  }
  issues.forEach(issue => {
    const card = document.createElement("div");
    const isOpen = issue.status === "open";
    card.className = `p-4 rounded-xl bg-white ${isOpen ? "shadow-[0_10px_0_rgba(34,197,94,1)]" : "shadow-[0_10px_0_rgba(168,85,247,1)]"} cursor-pointer`;
    card.innerHTML = `
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs font-semibold px-3 py-1 rounded-full ${getPriorityColor(issue.priority)}">${issue.priority.toUpperCase()}</span>
      </div>
      <h2 class="text-md font-semibold text-gray-800">${issue.title}</h2>
      <p class="text-sm text-gray-500 mt-1">${issue.description}</p>
      <div class="flex gap-2 mt-3 flex-wrap">${renderLabels(issue.labels)}</div>
      <div class="mt-4 text-xs text-gray-400">
        <p>#${issue.id} by ${issue.author}</p>
        <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
      </div>
    `;
    card.addEventListener("click", async () => {
      const fullIssue = await fetchSingleIssue(issue.id);
      if (fullIssue) openModal(fullIssue);
    });
    container.appendChild(card);
  });
}

function renderLabels(labels) {
  return labels.map(label => {
    if (label === "bug") return `<span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">BUG</span>`;
    if (label === "help wanted") return `<span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">HELP WANTED</span>`;
    return "";
  }).join("");
}

function getPriorityColor(priority) {
  if (priority === "high") return "bg-red-100 text-red-600";
  if (priority === "medium") return "bg-yellow-100 text-yellow-600";
  return "bg-gray-200 text-gray-600";
}

function applyFilters() {
  let filtered = [...allIssues];
  if (currentFilter === "open") filtered = filtered.filter(i => i.status === "open");
  if (currentFilter === "closed") filtered = filtered.filter(i => i.status === "closed");
  const searchText = searchInput?.value.toLowerCase() || "";
  if (searchText) {
    filtered = filtered.filter(issue =>
      issue.title.toLowerCase().includes(searchText) ||
      issue.description.toLowerCase().includes(searchText) ||
      issue.author.toLowerCase().includes(searchText)
    );
  }
  renderIssues(filtered);
}

function setActiveButton(activeBtn) {
  allBtn.classList.remove("btn-primary");
  openBtn.classList.remove("btn-primary");
  closedBtn.classList.remove("btn-primary");
  activeBtn.classList.add("btn-primary");
}

function openModal(issue) {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  modalTitle.innerText = issue.title;
  modalDesc.innerText = issue.description;
  modalPriority.innerText = issue.priority.toUpperCase();
  modalPriority.className = `px-3 py-1 text-xs rounded-full ${getPriorityColor(issue.priority)}`;
  modalStatusDot.innerHTML = issue.status === "open"
    ? `<span class="text-green-500">● Open</span>`
    : `<span class="text-purple-500">● Closed</span>`;
  modalLabels.innerHTML = renderLabels(issue.labels);
  modalAuthor.innerText = `#${issue.id} by ${issue.author}`;
  modalDate.innerText = new Date(issue.createdAt).toLocaleDateString();
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});

allBtn.addEventListener("click", () => {
  setActiveButton(allBtn);
  currentFilter = "all";
  showContainerSpinner();
  setTimeout(applyFilters, 300);
});

openBtn.addEventListener("click", () => {
  setActiveButton(openBtn);
  currentFilter = "open";
  showContainerSpinner();
  setTimeout(applyFilters, 300);
});

closedBtn.addEventListener("click", () => {
  setActiveButton(closedBtn);
  currentFilter = "closed";
  showContainerSpinner();
  setTimeout(applyFilters, 300);
});

if (searchInput) {
  searchInput.addEventListener("input", debounce(() => {
    applyFilters();
  }, 300));
}

setActiveButton(allBtn);
fetchIssues();
