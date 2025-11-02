const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://fittrack-server-nitx.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const usernameEl = document.querySelector(".username");
  const mainContent = document.querySelector(".main-content");

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  if (!userId) {
    window.location.href = "/client/pages/login.html";
    return;
  }

  usernameEl.textContent = userName || "User";

  try {
    const res = await fetch(`${BASE_URL}/api/profile/${userId}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Unable to fetch profile");

    const profile = data.profile;

    mainContent.insertAdjacentHTML(
      "beforeend",
      `
      <section class="profile-section">
        <form id="profileForm" class="profile-form">
          <label>Full Name:</label>
          <input type="text" id="fullName" value="${profile.fullName || ""}" />

          <label>Email:</label>
          <input type="email" id="email" value="${profile.email || ""}" disabled />

          <label>Phone:</label>
          <input type="text" id="phone" value="${profile.phone || ""}" />

          <label>Date of Birth:</label>
          <input type="date" id="dateOfBirth" value="${
            profile.dateOfBirth
              ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
              : ""
          }" />

          <label>Gender:</label>
          <select id="gender">
            <option value="" disabled ${
              !profile.gender ? "selected" : ""
            }>Select Gender</option>
            <option value="Male" ${
              profile.gender === "Male" ? "selected" : ""
            }>Male</option>
            <option value="Female" ${
              profile.gender === "Female" ? "selected" : ""
            }>Female</option>
            <option value="Other" ${
              profile.gender === "Other" ? "selected" : ""
            }>Other</option>
          </select>

          <label>Height (cm):</label>
          <input type="number" id="height" value="${profile.height || ""}" />

          <label>Weight (kg):</label>
          <input type="number" id="weight" value="${profile.weight || ""}" />

          <label>Goal:</label>
          <select id="goal">
            <option value="Lose Weight" ${
              profile.goal === "Lose Weight" ? "selected" : ""
            }>Lose Weight</option>
            <option value="Maintain Weight" ${
              profile.goal === "Maintain Weight" ? "selected" : ""
            }>Maintain Weight</option>
            <option value="Gain Muscle" ${
              profile.goal === "Gain Muscle" ? "selected" : ""
            }>Gain Muscle</option>
          </select>

          <label>Activity Level:</label>
          <select id="activityLevel">
            <option value="Low" ${
              profile.activityLevel === "Low" ? "selected" : ""
            }>Low</option>
            <option value="Moderate" ${
              profile.activityLevel === "Moderate" ? "selected" : ""
            }>Moderate</option>
            <option value="High" ${
              profile.activityLevel === "High" ? "selected" : ""
            }>High</option>
          </select>

          <button type="submit">Update Profile</button>
        </form>
      </section>
      `
    );

    const form = document.getElementById("profileForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedProfile = {
        fullName: document.getElementById("fullName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        dateOfBirth: document.getElementById("dateOfBirth").value.trim(),
        gender: document.getElementById("gender").value,
        height: document.getElementById("height").value.trim(),
        weight: document.getElementById("weight").value.trim(),
        goal: document.getElementById("goal").value,
        activityLevel: document.getElementById("activityLevel").value,
      };

      try {
        const updateRes = await fetch(`${BASE_URL}/api/profile/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        });

        const updateData = await updateRes.json();

        if (!updateRes.ok) throw new Error(updateData.message || "Update failed");

        alert("✅ Profile updated successfully!");
      } catch (err) {
        console.error(err);
        alert("⚠️ Failed to update profile.");
      }
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    mainContent.insertAdjacentHTML("beforeend", `<p>⚠️ Unable to load profile data.</p>`);
  }
});
