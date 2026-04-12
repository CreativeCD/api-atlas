const container = document.getElementById("container");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");

let allData = [];


fetch("data.json")
  .then(res => res.json())
  .then(data => {
    allData = data.apis;

    showCategories(allData);
    displayData(allData);
  });


function showCategories(data) {
  let categories = [...new Set(data.map(api => api.category))];

  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filterSelect.appendChild(option);
  });
}


function displayData(data) {
  container.innerHTML = "";

  data.map(api => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${api.name}</h2>
      <p>${api.description}</p>
      <div class="category">${api.category}</div>
      <a href="${api.link}" target="_blank" class="link">Visit API</a>
    `;

    container.appendChild(card);
  });
}


function updateUI() {
  let temp = [...allData];


  let searchValue = searchInput.value.toLowerCase();
  temp = temp.filter(api =>
    api.name.toLowerCase().includes(searchValue) ||
    api.description.toLowerCase().includes(searchValue)
  );


  let category = filterSelect.value;
  if (category !== "all") {
    temp = temp.filter(api => api.category === category);
  }


  let sortValue = sortSelect.value;
  if (sortValue === "az") {
    temp.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "za") {
    temp.sort((a, b) => b.name.localeCompare(a.name));
  }

  displayData(temp);
}


searchInput.addEventListener("input", updateUI);
filterSelect.addEventListener("change", updateUI);
sortSelect.addEventListener("change", updateUI);