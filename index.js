const pageList = document.getElementById("page-list");
const noteContent = document.getElementById("note-content");
const createPageBtn = document.getElementById("create-page");
const contextMenu = document.getElementById("context-menu");
const deleteBtn = document.getElementById("delete-page");
let pages = JSON.parse(localStorage.getItem("pages")) || {};
let currentPage = Object.keys(pages)[0] || null;
let rightClickedPage = null;

function renderPages() {
  pageList.innerHTML = "";
  for (let page in pages) {
    const box = document.createElement("div");
    box.className = "page-box";
    box.textContent = page;

    if (page === currentPage) {
      box.classList.add("active");
    }
    box.onclick = () => loadPage(page);
    box.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      rightClickedPage = page;
      showContextMenu(e.pageX, e.pageY);
    });
    pageList.appendChild(box);
  }
}
function loadPage(name) {
  if (currentPage !== name) {
    saveCurrentPage();
  }
  currentPage = name;
  noteContent.value = pages[name] || "";
  renderPages();
}
function saveCurrentPage() {
  if (currentPage) {
    pages[currentPage] = noteContent.value;
  }
}
createPageBtn.onclick = () => {
  const name = prompt("Enter page name:");
  if (name && !pages[name]) {
    pages[name] = "";
    localStorage.setItem("pages", JSON.stringify(pages));
    loadPage(name);
  } else if (pages[name]) {
    alert("Page already exists.");
  }
};
// Save when typing
noteContent.addEventListener("input", () => {
  saveCurrentPage();
  localStorage.setItem("pages", JSON.stringify(pages));
});

// Load first page if exists
if (Object.keys(pages).length > 0) {
  loadPage(Object.keys(pages)[0]);
}
function showContextMenu(x, y) {
  contextMenu.style.left = x + "px";
  contextMenu.style.top = y + "px";
  contextMenu.style.display = "block";
}

function hideContextMenu() {
  contextMenu.style.display = "none";
}
document.addEventListener("click", (e) => {
  if (!contextMenu.contains(e.target)) {
    hideContextMenu();
  }
});
deleteBtn.onclick = () => {
  if (!rightClickedPage) return;

  delete pages[rightClickedPage];
  localStorage.setItem("pages", JSON.stringify(pages));

  if (currentPage === rightClickedPage) {
    const remaining = Object.keys(pages);
    currentPage = remaining[0] || null;
    noteContent.value = currentPage ? pages[currentPage] : "";
  }

  renderPages();
  hideContextMenu();
};
