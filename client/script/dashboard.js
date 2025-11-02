const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://fittrack-server-nitx.onrender.com";


document.addEventListener('DOMContentLoaded', async () => {
  const main = document.querySelector('.main-content');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || 'User';
  document.getElementById("sidebarUsername").textContent = userName;

  if (!userId) {
    window.location.href = '/client/pages/login.html';
    return;
  }

  // Dashboard Skeleton
  main.innerHTML = `
    <section class="greeting">
      <h2>Welcome Back, ${escapeHtml(userName)}!</h2>
      <p>Track your fitness progress and update daily targets.</p>
    </section>

    <section class="dashboard-grid">
      <div class="cards" id="statsContainer"></div>
      <div class="controls">
        <button class="btn" id="openAddProgress">+ Add Progress</button>
        <button class="btn outline" id="openEditTargets">Edit Targets</button>
      </div>
    </section>

    <section class="charts-section">
      <div class="chart-card"><h3>Calories</h3><canvas id="caloriesChart"></canvas></div>
      <div class="chart-card"><h3>Steps</h3><canvas id="stepsChart"></canvas></div>
      <div class="chart-card"><h3>Weight</h3><canvas id="weightChart"></canvas></div>
    </section>

    <section class="history-section">
      <h3>Progress History</h3>
      <div id="historyContainer"></div>
    </section>

    <div id="modalOverlay" class="modal-overlay hidden">
      <div class="modal">
        <button class="modal-close" id="modalClose">&times;</button>
        <div id="modalBody"></div>
      </div>
    </div>
  `;

  const statsContainer = document.getElementById('statsContainer');
  const openAddProgress = document.getElementById('openAddProgress');
  const openEditTargets = document.getElementById('openEditTargets');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const historyContainer = document.getElementById('historyContainer');

  let profileData = null;
  let caloriesChart, stepsChart, weightChart;

  // Fetch Profile
  async function loadProfile() {
    try {
      const res = await fetch(`${BASE_URL}/api/profile/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      profileData = data.profile;
      renderSummary();
      renderCharts();
      renderHistory();
    } catch (err) {
      console.error('Error loading profile:', err);
      main.insertAdjacentHTML('beforeend', `<p class="error">Unable to load profile data.</p>`);
    }
  }

  // ✅ Render all progress + target stats
  function renderSummary() {
    const latest = getLatestProgress();
    const t = profileData.targets || {};

    const stats = [
      { name: 'Weight', value: latest?.weight, target: t.weight, unit: 'kg' },
      { name: 'Calories', value: latest?.calories, target: t.calories, unit: 'kcal' },
      { name: 'Protein', value: latest?.protein, target: t.protein, unit: 'g' },
      { name: 'Carbs', value: latest?.carbs, target: t.carbs, unit: 'g' },
      { name: 'Fats', value: latest?.fats, target: t.fats, unit: 'g' },
      { name: 'Water', value: latest?.water, target: t.water, unit: 'ml' },
      { name: 'Steps', value: latest?.steps, target: t.steps, unit: '' },
      { name: 'Sleep', value: latest?.sleep, target: t.sleep, unit: 'hrs' },
    ];

    statsContainer.innerHTML = stats
      .map(
        s => `
        <div class="stat-card">
          <h4>${s.name}</h4>
          <div>${s.value ?? '--'} / ${s.target ?? '--'} ${s.unit}</div>
        </div>`
      )
      .join('');
  }

  function getLatestProgress() {
    if (!profileData?.progress?.length) return null;
    return [...profileData.progress].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }

  function renderHistory() {
    historyContainer.innerHTML = '';
    if (!profileData?.progress?.length) {
      historyContainer.innerHTML = '<p>No progress entries yet.</p>';
      return;
    }

    const sorted = [...profileData.progress].sort((a, b) => new Date(b.date) - new Date(a.date));
    const table = document.createElement('table');
    table.className = 'history-table';
    table.innerHTML = `
      <thead>
        <tr><th>Date</th><th>Weight</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fats</th><th>Water</th><th>Steps</th><th>Sleep</th></tr>
      </thead>
      <tbody>
        ${sorted
          .map(
            p => `
          <tr>
            <td>${new Date(p.date).toLocaleDateString()}</td>
            <td>${p.weight ?? '-'}</td>
            <td>${p.calories ?? '-'}</td>
            <td>${p.protein ?? '-'}</td>
            <td>${p.carbs ?? '-'}</td>
            <td>${p.fats ?? '-'}</td>
            <td>${p.water ?? '-'}</td>
            <td>${p.steps ?? '-'}</td>
            <td>${p.sleep ?? '-'}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    `;
    historyContainer.appendChild(table);
  }

  function renderCharts() {
    const progress = (profileData?.progress || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = progress.map(p => new Date(p.date).toLocaleDateString());
    const calories = progress.map(p => p.calories || 0);
    const steps = progress.map(p => p.steps || 0);
    const weight = progress.map(p => p.weight || 0);

    if (caloriesChart) caloriesChart.destroy();
    if (stepsChart) stepsChart.destroy();
    if (weightChart) weightChart.destroy();

    caloriesChart = new Chart(document.getElementById('caloriesChart').getContext('2d'), {
      type: 'line',
      data: { labels, datasets: [{ label: 'Calories', data: calories, borderWidth: 2, tension: 0.3 }] },
      options: { responsive: true, maintainAspectRatio: false },
    });

    stepsChart = new Chart(document.getElementById('stepsChart').getContext('2d'), {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Steps', data: steps, borderWidth: 1 }] },
      options: { responsive: true, maintainAspectRatio: false },
    });

    weightChart = new Chart(document.getElementById('weightChart').getContext('2d'), {
      type: 'line',
      data: { labels, datasets: [{ label: 'Weight (kg)', data: weight, borderWidth: 2, tension: 0.3 }] },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  // ✅ Add Progress Modal
  openAddProgress.addEventListener('click', () => {
    openModal(`
      <h3>Add Progress</h3>
      <form id="addProgressForm" class="mini-form">
        <label>Date</label><input type="date" id="pDate" required />
        <label>Calories</label><input type="number" id="pCalories" />
        <label>Protein (g)</label><input type="number" id="pProtein" />
        <label>Carbs (g)</label><input type="number" id="pCarbs" />
        <label>Fats (g)</label><input type="number" id="pFats" />
        <label>Water (ml)</label><input type="number" id="pWater" />
        <label>Steps</label><input type="number" id="pSteps" />
        <label>Sleep (hrs)</label><input type="number" id="pSleep" step="0.1" />
        <label>Weight (kg)</label><input type="number" id="pWeight" step="0.1" />
        <div style="display:flex;gap:10px;margin-top:12px;">
          <button type="submit" class="btn">Add</button>
          <button type="button" class="btn outline" id="cancelAdd">Cancel</button>
        </div>
      </form>
    `);
    document.getElementById('cancelAdd').addEventListener('click', closeModal);
    document.getElementById('addProgressForm').addEventListener('submit', handleAddProgress);
  });

  async function handleAddProgress(e) {
    e.preventDefault();
    const progressData = {
      date: document.getElementById('pDate').value,
      calories: Number(pCalories.value) || 0,
      protein: Number(pProtein.value) || 0,
      carbs: Number(pCarbs.value) || 0,
      fats: Number(pFats.value) || 0,
      water: Number(pWater.value) || 0,
      steps: Number(pSteps.value) || 0,
      sleep: Number(pSleep.value) || 0,
      weight: Number(pWeight.value) || 0,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/progress/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      closeModal();
      await loadProfile();
      flash('Progress added');
    } catch (err) {
      console.error('Add progress error:', err);
      alert('Failed to add progress');
    }
  }

  // ✅ Edit Targets Modal
  openEditTargets.addEventListener('click', () => {
    const t = profileData.targets || {};
    openModal(`
      <h3>Edit Targets</h3>
      <form id="editTargetsForm" class="mini-form">
        <label>Calories</label><input type="number" id="tCalories" value="${t.calories || ''}" />
        <label>Protein</label><input type="number" id="tProtein" value="${t.protein || ''}" />
        <label>Carbs</label><input type="number" id="tCarbs" value="${t.carbs || ''}" />
        <label>Fats</label><input type="number" id="tFats" value="${t.fats || ''}" />
        <label>Water (ml)</label><input type="number" id="tWater" value="${t.water || ''}" />
        <label>Steps</label><input type="number" id="tSteps" value="${t.steps || ''}" />
        <label>Sleep (hrs)</label><input type="number" id="tSleep" value="${t.sleep || ''}" />
        <label>Weight (kg)</label><input type="number" id="tWeight" value="${t.weight || ''}" />
        <button type="submit" class="btn">Save</button>
      </form>
    `);
    document.getElementById('editTargetsForm').addEventListener('submit', handleEditTargets);
  });

  async function handleEditTargets(e) {
    e.preventDefault();
    const newTargets = {
      calories: parseInt(tCalories.value),
      protein: parseInt(tProtein.value),
      carbs: parseInt(tCarbs.value),
      fats: parseInt(tFats.value),
      water: parseInt(tWater.value),
      steps: parseInt(tSteps.value),
      sleep: parseFloat(tSleep.value),
      weight: parseFloat(tWeight.value),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/target/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets: newTargets }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      closeModal();
      await loadProfile();
      flash('Targets updated');
    } catch (err) {
      console.error('Update targets error:', err);
      alert('Failed to update targets');
    }
  }

  function openModal(html) {
    modalBody.innerHTML = html;
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modalOverlay.classList.add('hidden');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);

  function flash(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('visible'), 50);
    setTimeout(() => el.remove(), 2500);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  await loadProfile();
});
