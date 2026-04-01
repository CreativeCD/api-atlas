const API_URL = "https://discovery.googleapis.com/discovery/v1/apis";

let allAPIs = [];

async function fetchAPIs() {
    const loader = document.getElementById("loader");
    const container = document.getElementById("cardsContainer");

    loader.style.display = "block";
    container.innerHTML = "";

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Google APIs list is in data.items
        allAPIs = data.items || [];
        displayAPIs(allAPIs);

    } catch (error) {
        container.innerHTML = "<h2>Error fetching data</h2>";
        console.error(error);
    }

    loader.style.display = "none";
}

function displayAPIs(apis) {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    if (apis.length === 0) {
        container.innerHTML = "<h3>No APIs found</h3>";
        return;
    }

    // Show first 20 APIs
    apis.slice(0, 20).forEach(api => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${api.title}</h3>
            <p><strong>Name:</strong> ${api.name}</p>
            <p><strong>Version:</strong> ${api.version}</p>
            <p><a href="${api.discoveryRestUrl}" target="_blank">Discovery URL</a></p>
        `;

        container.appendChild(card);
    });
}

// Search by title
document.getElementById("searchInput").addEventListener("input", function() {
    const searchValue = this.value.toLowerCase();
    const filtered = allAPIs.filter(api =>
        api.title.toLowerCase().includes(searchValue) ||
        api.name.toLowerCase().includes(searchValue)
    );
    displayAPIs(filtered);
});

// Dark Mode
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Initial fetch
fetchAPIs();