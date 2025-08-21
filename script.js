const subjectsList = document.getElementById("subjectsList");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
const sidebarLinks = document.querySelectorAll(".sidebar-link");
let subjects = [];

// Učitavanje skripti iz JSON-a
async function loadSubjects() {
  try {
    const response = await fetch("data/skripte.json");
    const data = await response.json();
    subjects = Object.keys(data).map(name => ({
      name,
      type: name.includes("Toksikološka") || name.includes("Izborni") ? "izborni" : "obavezni",
      resources: data[name]
    }));
    displaySubjects(subjects);
  } catch (error) {
    subjectsList.innerHTML = "<p class='no-results'>Greška pri učitavanju skripti.</p>";
  }
}

// Prikaz predmeta
function displaySubjects(filteredSubjects) {
  subjectsList.innerHTML = "";
  filteredSubjects.forEach(subject => {
    const div = document.createElement("div");
    div.className = "script-card";
    div.innerHTML = `<h4>${subject.name}</h4>`;
    if (subject.resources && subject.resources.length > 0) {
      const ul = document.createElement("ul");
      subject.resources.forEach(resource => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${resource.link}" target="_blank">${resource.label}</a>`;
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }
    subjectsList.appendChild(div);
  });
}

// Filtriranje po tipu
function filterSubjects(type) {
  if (type === "all") {
    displaySubjects(subjects);
  } else {
    const filtered = subjects.filter(s => s.type === type);
    displaySubjects(filtered);
  }
}

// Pretraga
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = subjects.filter(s => s.name.toLowerCase().includes(query));
  displaySubjects(filtered);
});

searchButton.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = subjects.filter(s => s.name.toLowerCase().includes(query));
  displaySubjects(filtered);
});

// Tabovi
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// Sidebar linkovi
sidebarLinks.forEach(link => {
  link.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    sidebarLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    document.getElementById(link.dataset.tab).classList.add("active");
    document.querySelector(`.tab[data-tab="${link.dataset.tab}"]`).classList.add("active");
  });
});

// NGL Viewer za proteine
document.addEventListener("DOMContentLoaded", () => {
  const stage = new NGL.Stage("protein-viewer");
  stage.loadFile("rcsb://1CRN").then(o => {
    o.addRepresentation("cartoon", { color: "residueindex" });
    o.autoView();
  });
});

// Kekule.js za hemijske formule
Kekule.onLoad = function() {
  const viewer = new Kekule.ChemWidget.Viewer(document.getElementById("chemical-formula"));
  viewer.setDimension("100%", "100%");
  const mol = Kekule.IO.loadFormatData("smi", "C[C@H](N)C(=O)O"); // Alanin
  viewer.setChemObj(mol);
};

// Preuzimanje svih skripti (primer zip funkcionalnosti)
document.getElementById("downloadAll").addEventListener("click", () => {
  alert("Funkcionalnost preuzimanja svih skripti još nije implementirana. Dodajte zip logiku!");
});

// Pokretanje
loadSubjects();
