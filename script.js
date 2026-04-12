const API_URL = "https://api.publicapis.org/entries";

let allAPIs = [];
let filteredAPIs = [];

let currentPage = 1;
const limit = 12;

// ---------------- FETCH DATA ----------------
async function fetchAPIs() {
    const loader = document.getElementById("loader");
    loader.style.display = "block";

    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        allAPIs = data.entries || [];
        filteredAPIs = [...allAPIs];

        populateCategories();
        render();

    } catch (err) {
        console.error(err);
        document.getElementById("cardsContainer").innerHTML =
            "<h3>Error loading APIs</h3>";
    }

    loader.style.display = "none";
}

// ---------------- RENDER ----------------
function render() {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    let start = (currentPage - 1) * limit;
    let end = start + limit;

    let pageData = filteredAPIs.slice(start, end);

    pageData.forEach(api => {
        const isFav = isFavorite(api.API);

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${api.API}</h3>
            <p>${api.Description}</p>
            <p><strong>Category:</strong> ${api.Category}</p>
            <a href="${api.Link}" target="_blank">Visit</a>
            <br/>
            <button onclick="toggleFavorite('${api.API}')">
                ${isFav ? "Remove ⭐" : "Add ⭐"}
            </button>
        `;

        container.appendChild(card);
    });

    document.getElementById("pageInfo").innerText =
        `Page ${currentPage} of ${Math.ceil(filteredAPIs.length / limit)}`;
}

// ---------------- CATEGORY FILTER ----------------
function populateCategories() {
    const select = document.getElementById("categoryFilter");

    const categories = [...new Set(allAPIs.map(a => a.Category))];

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

// ---------------- SEARCH ----------------
document.getElementById("searchInput").addEventListener("input", function () {
    applyFilters();
});

// ---------------- FILTER + SORT ----------------
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("sortSelect").addEventListener("change", applyFilters);

function applyFilters() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const sort = document.getElementById("sortSelect").value;

    filteredAPIs = allAPIs.filter(api => {
        return (
            (api.API.toLowerCase().includes(search) ||
             api.Description.toLowerCase().includes(search)) &&
            (category === "" || api.Category === category)
        );
    });

    if (sort === "az") {
        filteredAPIs.sort((a, b) => a.API.localeCompare(b.API));
    } else {
        filteredAPIs.sort((a, b) => b.API.localeCompare(a.API));
    }

    currentPage = 1;
    render();
}

// ---------------- PAGINATION ----------------
document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentPage < Math.ceil(filteredAPIs.length / limit)) {
        currentPage++;
        render();
    }
});

document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        render();
    }
});

// ---------------- FAVORITES ----------------
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function isFavorite(name) {
    return getFavorites().includes(name);
}

function toggleFavorite(name) {
    let favs = getFavorites();

    if (favs.includes(name)) {
        favs = favs.filter(f => f !== name);
    } else {
        favs.push(name);
    }

    localStorage.setItem("favorites", JSON.stringify(favs));
    render();
}

// ---------------- DARK MODE ----------------
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// ---------------- INIT ----------------
fetchAPIs();
