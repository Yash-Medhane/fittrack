const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://fittrack-server-nitx.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const mainContent = document.querySelector(".main-content");

  async function fetchWorkouts() {
    try {
      const res = await fetch(`${BASE_URL}/api/workouts`);
      const data = await res.json();
      console.log(data);

      if (!res.ok || !data.workouts) throw new Error("Failed to load");

      renderWorkouts(data.workouts);
    } catch (err) {
      console.error("Error fetching workouts:", err);
      mainContent.innerHTML += "<p style='color:red;'>⚠️ Unable to load workouts.</p>";
    }
  }

  function renderWorkouts(workouts) {
    const container = document.createElement("div");
    container.classList.add("workout-container");

    if (workouts.length === 0) {
      container.innerHTML = "<p>No workouts found.</p>";
      mainContent.appendChild(container);
      return;
    }

    workouts.forEach(workout => {
      const card = document.createElement("div");
      card.classList.add("workout-card");

      card.innerHTML = `
        <img src="${workout.image || 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png'}" alt="${workout.name}">
        <h3>${workout.name}</h3>
        <p>${workout.description || "No description provided."}</p>
        <div class="details">
          <p><strong>Duration:</strong> ${workout.duration} mins</p>
          <p><strong>Type:</strong> ${workout.category}</p>
          <p><strong>Level:</strong> ${workout.level}</p>
        </div>
      `;
      container.appendChild(card);
    });

    mainContent.appendChild(container);
  }

  fetchWorkouts();
});
