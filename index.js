
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

let allIssues = [];

 
async function fetchIssues() {
  const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
  const data = await res.json();

  allIssues = data.data || data;

  renderIssues(allIssues);
}

 
function renderIssues(issues) {
  container.innerHTML = "";
  issueCount.textContent = `${issues.length} Issues`;

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
      <!-- Top -->
        <div class="flex items-center gap-2 mb-2">

        <span class="text-xs font-semibold px-3 py-1 rounded-full
          ${getPriorityColor(issue.priority)}">
          ${issue.priority.toUpperCase()}
        </span>

      </div>

      <!-- Title -->
      <h2 class="text-md font-semibold text-gray-800">
        ${issue.title}
      </h2>

      <!-- Description -->
      <p class="text-sm text-gray-500 mt-1">
        ${issue.description}
      </p>

      <!-- Labels -->
      <div class="flex gap-2 mt-3 flex-wrap">
        ${renderLabels(issue.labels)}
      </div>

      <!-- Footer -->
      <div class="mt-4 text-xs text-gray-400">
        <p>#${issue.id} by ${issue.author}</p>
        <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
      </div>
    `;

    const helpBtn = card.querySelector(".help-btn");

    
    container.appendChild(card);
    });
}

 
function renderLabels(labels) {
  return labels.map(label => {

    if (label === "bug") {
      return `<span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">BUG</span>`;
    }

    if (label === "help wanted") {
      return `<span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600 cursor-pointer help-btn">
                HELP WANTED
              </span>`;
    }
    if (label === "help wanted") {
      return `<span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600 cursor-pointer help-btn">
                HELP WANTED
              </span>`;
    }

     

  }).join("");
}

 
function getPriorityColor(priority) {
  if (priority === "high") return "bg-red-100 text-red-600";
  if (priority === "medium") return "bg-yellow-100 text-yellow-600";
  return "bg-gray-200 text-gray-600";
}

 
allBtn.addEventListener("click", () => {
  renderIssues(allIssues);
});

openBtn.addEventListener("click", () => {
  const openIssues = allIssues.filter(i => i.status === "open");
  renderIssues(openIssues);
});

closedBtn.addEventListener("click", () => {
  const closedIssues = allIssues.filter(i => i.status === "closed");
  renderIssues(closedIssues);
});

 
fetchIssues();
