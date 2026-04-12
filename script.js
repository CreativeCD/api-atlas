const container = document.getElementById("container");

// fetch data from local JSON
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    displayData(data.apis);
  })
  .catch(err => {
    console.log("Error:", err);
  });

function displayData(apis) {
  container.innerHTML = "";

  apis.forEach(api => {
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