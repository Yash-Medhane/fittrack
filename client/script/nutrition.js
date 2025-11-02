document.addEventListener("DOMContentLoaded", async () => {
  const cardContainer = document.getElementById("cardContainer");
  const searchInput = document.getElementById("searchInput");

  // Fetch data from backend
  async function fetchNutritionData() {
    try {
      const res = await fetch("http://localhost:3000/api/nutrition");
      const data = await res.json();

      if (!res.ok || !data.nutrition) throw new Error("Failed to load");

      renderCards(data.nutrition);
    } catch (err) {
      console.error("Error fetching nutrition data:", err);
      cardContainer.innerHTML = "<p style='color:white;'>⚠️ Unable to load data.</p>";
    }
  }

  // Render nutrition cards
  function renderCards(nutritionData, filter = "") {
    cardContainer.innerHTML = "";

    const filtered = nutritionData.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase()) ||
      item.goal.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
      cardContainer.innerHTML = "<p style='color:white;'>No matching recipes found.</p>";
      return;
    }

    filtered.forEach(item => {
      const dotColor = item.category.toLowerCase() === "veg" ? "green-dot" : "red-dot";

      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="dot ${dotColor}"></div>
        <h3>${item.name}</h3>
        <p>${item.description || "No description available."}</p>
        <div class="macros">
          <p><strong>Calories:</strong> ${item.calories} kcal</p>
          <p><strong>Protein:</strong> ${item.protein}g</p>
          <p><strong>Carbs:</strong> ${item.carbs}g</p>
          <p><strong>Fats:</strong> ${item.fats}g</p>
        </div>
        <span class="tag goal-tag">${item.goal}</span>
      `;
      cardContainer.appendChild(card);
    });
  }

  // Handle search
  searchInput.addEventListener("input", async (e) => {
    const res = await fetch("http://localhost:3000/api/nutrition");
    const data = await res.json();
    renderCards(data.nutrition, e.target.value);
  });

  fetchNutritionData();
});
