const API_URL = "https://apikeyhub.com";

let allPosts = [];

async function fetchAPIs() {
    const loader = document.getElementById("loader");
    const container = document.getElementById("cardsContainer");

    loader.style.display = "block";
    container.innerHTML = "";

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        allPosts = data;
        displayAPIs(allPosts);

    } catch (error) {
        container.innerHTML = "<h2>Error fetching data</h2>";
        console.log(error);
    }

    loader.style.display = "none";
}

function displayAPIs(posts) {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    posts.slice(0, 20).forEach(post => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <p><strong>Post ID:</strong> ${post.id}</p>
        `;

        container.appendChild(card);
    });
}

// Search
document.getElementById("searchInput").addEventListener("input", function() {
    const searchValue = this.value.toLowerCase();
    const filtered = allPosts.filter(post =>
        post.title.toLowerCase().includes(searchValue)
    );
    displayAPIs(filtered);
});

// Dark Mode
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

fetchAPIs();