
 /*document.getElementById("login_form").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "admin" && password === "admin123") {
        // Hide login
        document.getElementById("login_page").classList.add("hidden");

        // Show dashboard
        document.getElementById("dashboard").classList.remove("hidden");
    } else {
        alert("Invalid Username or Password ");
    }
});
*/

     const container = document.getElementById("issuesContainer");
const issueCount = document.getElementById("issueCount");

const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");
const searchInput = document.getElementById("searchInput");

let allIssues = [];
let currentFilter = "all";

// ================= FETCH =================
async function fetchIssues() {
  try {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();

    console.log("API Data:", data); // debug

    allIssues = data.data || data;

    applyFilters(); // render after fetch

  } catch (error) {
    console.error("Fetch Error:", error);

    container.innerHTML = `
      <p class="text-red-500 text-center col-span-3">
        Failed to load issues 
      </p>
    `;
  }
}

// ================= RENDER =================
function renderIssues(issues) {
  container.innerHTML = "";
  issueCount.textContent = `${issues.length} Issues`;

  if (issues.length === 0) {
    container.innerHTML = `
      <p class="text-gray-500 text-center col-span-3">
        No issues found 😐
      </p>
    `;
    return;
  }

  issues.forEach(issue => {
    const card = document.createElement("div");

    const isOpen = issue.status === "open";

    card.className = `
      p-4 rounded-xl bg-white
      ${isOpen 
        ? "shadow-[0_10px_0_rgba(34,197,94,1)]" 
        : "shadow-[0_10px_0_rgba(168,85,247,1)]"}
    `;

    card.innerHTML = `
      <div class="flex items-center gap-2 mb-2">
         

        <span class="text-xs font-semibold px-3 py-1 rounded-full
          ${getPriorityColor(issue.priority)}">
          ${issue.priority.toUpperCase()}
        </span>
      </div>

      <h2 class="text-md font-semibold text-gray-800">
        ${issue.title}
      </h2>

      <p class="text-sm text-gray-500 mt-1">
        ${issue.description}
      </p>

      <div class="flex gap-2 mt-3 flex-wrap">
        ${renderLabels(issue.labels)}
      </div>

      <div class="mt-4 text-xs text-gray-400">
        <p>#${issue.id} by ${issue.author}</p>
        <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

// ================= LABELS =================
function renderLabels(labels) {
  return labels.map(label => {

    if (label === "bug") {
      return `<span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">BUG</span>`;
    }

    if (label === "help wanted") {
      return `<span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                HELP WANTED
              </span>`;
    }

    return "";
  }).join("");
}

// ================= PRIORITY =================
function getPriorityColor(priority) {
  if (priority === "high") return "bg-red-100 text-red-600";
  if (priority === "medium") return "bg-yellow-100 text-yellow-600";
  return "bg-gray-200 text-gray-600";
}

// ================= FILTER =================
function applyFilters() {
  let filtered = [...allIssues];

  // status filter
  if (currentFilter === "open") {
    filtered = filtered.filter(i => i.status === "open");
  }

  if (currentFilter === "closed") {
    filtered = filtered.filter(i => i.status === "closed");
  }

  // search filter (SAFE)
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

// ================= BUTTON ACTIVE =================
function setActiveButton(activeBtn) {
  allBtn.classList.remove("btn-primary");
  openBtn.classList.remove("btn-primary");
  closedBtn.classList.remove("btn-primary");

  activeBtn.classList.add("btn-primary");
}

// ================= EVENTS =================
allBtn.addEventListener("click", () => {
  setActiveButton(allBtn);
  currentFilter = "all";
  applyFilters();
});

openBtn.addEventListener("click", () => {
  setActiveButton(openBtn);
  currentFilter = "open";
  applyFilters();
});

closedBtn.addEventListener("click", () => {
  setActiveButton(closedBtn);
  currentFilter = "closed";
  applyFilters();
});

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}
function showSpinner() {
  container.innerHTML = `
    <div class="col-span-3 flex justify-center items-center py-10">
      <span class="loading loading-dots loading-lg"></span>
    </div>
  `;
}
allBtn.addEventListener("click", () => {
  setActiveButton(allBtn);
  currentFilter = "all";

  showSpinner(); // 👈 show loader

  setTimeout(() => {
    applyFilters();
  }, 300); // small delay for effect
});

openBtn.addEventListener("click", () => {
  setActiveButton(openBtn);
  currentFilter = "open";

  showSpinner();

  setTimeout(() => {
    applyFilters();
  }, 300);
});

closedBtn.addEventListener("click", () => {
  setActiveButton(closedBtn);
  currentFilter = "closed";

  showSpinner();

  setTimeout(() => {
    applyFilters();
  }, 300);
});


// ================= INIT =================
setActiveButton(allBtn);
fetchIssues();
