// ============================================================
// APP.JS — Frontend Logic
// This file controls what you see and sends requests to the
// backend server (server.js) to fetch or change data.
// ============================================================

// ── STATE ─────────────────────────────────────────────────
let allStudents = [];   // Holds all students fetched from server
let deleteTargetId = null; // Tracks which student to delete

// ── NAVIGATION ────────────────────────────────────────────
// Show a page and mark the correct nav link as active
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

  // Load fresh data when switching pages
  if (pageId === 'dashboard') loadDashboard();
  if (pageId === 'students') loadStudents();
  if (pageId === 'add') resetForm();
}

// Wire up sidebar nav links
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigate(link.dataset.page);
  });
});

// ── TOAST HELPER ──────────────────────────────────────────
// Shows a brief pop-up message at the bottom-right
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── API HELPER ────────────────────────────────────────────
// A wrapper to make HTTP requests to our backend
async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  return res.json();
}

// ── DASHBOARD ─────────────────────────────────────────────
async function loadDashboard() {
  const stats    = await api('GET', '/api/stats');
  const students = await api('GET', '/api/students');

  // Update stat cards
  document.getElementById('stat-total').textContent    = stats.total;
  document.getElementById('stat-active').textContent   = stats.active;
  document.getElementById('stat-inactive').textContent = stats.inactive;

  // Grade breakdown bars
  const barsEl = document.getElementById('grade-bars');
  barsEl.innerHTML = '';
  const grades = ['A', 'B', 'C', 'D', 'F'];
  grades.forEach(g => {
    const count = stats.gradeCounts[g] || 0;
    const pct   = stats.total ? Math.round((count / stats.total) * 100) : 0;
    barsEl.innerHTML += `
      <div class="grade-row">
        <span class="grade-label">${g}</span>
        <div class="grade-track">
          <div class="grade-fill" style="width:${pct}%"></div>
        </div>
        <span class="grade-count">${count}</span>
      </div>`;
  });

  // Recent enrollments (last 5)
  const recent = [...students].reverse().slice(0, 5);
  const tbody = document.getElementById('recent-body');
  tbody.innerHTML = recent.length
    ? recent.map(s => `
        <tr>
          <td><strong>${s.name}</strong></td>
          <td>${s.subject}</td>
          <td>${gradeBadge(s.grade)}</td>
          <td>${statusBadge(s.status)}</td>
          <td style="color:var(--muted);font-size:13px">${s.enrolledDate}</td>
        </tr>`).join('')
    : '<tr class="empty-row"><td colspan="5">No students yet.</td></tr>';
}

// ── STUDENTS TABLE ────────────────────────────────────────
async function loadStudents() {
  allStudents = await api('GET', '/api/students');
  renderStudentsTable(allStudents);
}

function renderStudentsTable(students) {
  const tbody = document.getElementById('students-body');
  tbody.innerHTML = students.length
    ? students.map(s => `
        <tr>
          <td><strong>${s.name}</strong></td>
          <td style="color:var(--muted);font-size:13px">${s.email}</td>
          <td>${s.subject}</td>
          <td>${gradeBadge(s.grade)}</td>
          <td>${statusBadge(s.status)}</td>
          <td>
            <div class="action-btns">
              <button class="btn-icon" onclick="editStudent('${s.id}')">Edit</button>
              <button class="btn-icon delete" onclick="promptDelete('${s.id}')">Delete</button>
            </div>
          </td>
        </tr>`).join('')
    : '<tr class="empty-row"><td colspan="6">No students found.</td></tr>';
}

// Search / filter
function filterStudents() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const filtered = allStudents.filter(s => s.name.toLowerCase().includes(q));
  renderStudentsTable(filtered);
}

// ── FORM: ADD / EDIT ──────────────────────────────────────
function resetForm() {
  document.getElementById('edit-id').value    = '';
  document.getElementById('f-name').value     = '';
  document.getElementById('f-email').value    = '';
  document.getElementById('f-grade').value    = '';
  document.getElementById('f-subject').value  = '';
  document.getElementById('f-status').value   = 'Active';
  document.getElementById('form-title').textContent = 'Add Student';
}

async function editStudent(id) {
  const s = await api('GET', '/api/students/' + id);
  document.getElementById('edit-id').value    = s.id;
  document.getElementById('f-name').value     = s.name;
  document.getElementById('f-email').value    = s.email;
  document.getElementById('f-grade').value    = s.grade;
  document.getElementById('f-subject').value  = s.subject;
  document.getElementById('f-status').value   = s.status;
  document.getElementById('form-title').textContent = 'Edit Student';
  navigate('add');
}

async function submitForm() {
  const id      = document.getElementById('edit-id').value;
  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const grade   = document.getElementById('f-grade').value;
  const subject = document.getElementById('f-subject').value.trim();
  const status  = document.getElementById('f-status').value;

  if (!name || !email || !grade) {
    showToast('⚠️ Please fill in all required fields.');
    return;
  }

  const payload = { name, email, grade, subject, status };

  if (id) {
    // UPDATE existing student
    await api('PUT', '/api/students/' + id, payload);
    showToast('✅ Student updated!');
  } else {
    // ADD new student
    await api('POST', '/api/students', payload);
    showToast('✅ Student added!');
  }

  navigate('students');
}

function cancelForm() {
  navigate('students');
}

// ── DELETE ────────────────────────────────────────────────
function promptDelete(id) {
  deleteTargetId = id;
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  deleteTargetId = null;
  document.getElementById('modal').classList.remove('open');
}

async function confirmDelete() {
  if (!deleteTargetId) return;
  await api('DELETE', '/api/students/' + deleteTargetId);
  closeModal();
  showToast('🗑️ Student deleted.');
  loadStudents();
}

// ── BADGE HELPERS ─────────────────────────────────────────
function gradeBadge(grade) {
  return `<span class="grade-badge grade-${grade}">${grade}</span>`;
}

function statusBadge(status) {
  return `<span class="status-badge status-${status}">${status}</span>`;
}

// ── INIT ──────────────────────────────────────────────────
// Load the dashboard when the page first opens
loadDashboard();
