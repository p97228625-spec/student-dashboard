// ============================================================
// SERVER.JS — The "brain" of your app (Backend)
// This file runs on your computer and handles all data logic.
// ============================================================

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'students.json');

// MIDDLEWARE — Tells Express how to read incoming data
app.use(express.json());                          // Read JSON from requests
app.use(express.static('public'));                // Serve your frontend files

// ─── HELPERS ──────────────────────────────────────────────
function readStudents() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeStudents(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateId() {
  return Date.now().toString();
}

// ─── ROUTES (API Endpoints) ────────────────────────────────
// Think of routes like doors — each URL opens a different door.

// GET all students
app.get('/api/students', (req, res) => {
  const students = readStudents();
  res.json(students);
});

// GET one student by ID
app.get('/api/students/:id', (req, res) => {
  const students = readStudents();
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

// POST — Add a new student
app.post('/api/students', (req, res) => {
  const { name, email, grade, subject, status } = req.body;

  // Basic validation
  if (!name || !email || !grade) {
    return res.status(400).json({ error: 'Name, email, and grade are required.' });
  }

  const students = readStudents();
  const newStudent = {
    id: generateId(),
    name,
    email,
    grade,
    subject: subject || 'General',
    status: status || 'Active',
    enrolledDate: new Date().toISOString().split('T')[0]
  };

  students.push(newStudent);
  writeStudents(students);
  res.status(201).json(newStudent);
});

// PUT — Update an existing student
app.put('/api/students/:id', (req, res) => {
  const students = readStudents();
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Student not found' });

  students[index] = { ...students[index], ...req.body };
  writeStudents(students);
  res.json(students[index]);
});

// DELETE — Remove a student
app.delete('/api/students/:id', (req, res) => {
  let students = readStudents();
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Student not found' });

  students.splice(index, 1);
  writeStudents(students);
  res.json({ message: 'Student deleted successfully' });
});

// GET — Dashboard stats summary
app.get('/api/stats', (req, res) => {
  const students = readStudents();
  const total = students.length;
  const active = students.filter(s => s.status === 'Active').length;
  const inactive = students.filter(s => s.status === 'Inactive').length;

  const gradeCounts = {};
  students.forEach(s => {
    gradeCounts[s.grade] = (gradeCounts[s.grade] || 0) + 1;
  });

  res.json({ total, active, inactive, gradeCounts });
});

// ─── START SERVER ──────────────────────────────────────────
const PORT = process.env.PORT ||8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

}