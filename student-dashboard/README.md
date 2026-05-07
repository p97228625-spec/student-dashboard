# 📚 Student Management Dashboard

A clean, minimalist web app to manage student records.
Built with: **Node.js + Express** (backend) and **HTML/CSS/JS** (frontend).

---

## 🗂️ Project Structure

```
student-dashboard/
├── server.js          ← Backend (the "brain")
├── package.json       ← Project config & dependencies
├── data/
│   └── students.json  ← Where student data is saved (like a simple database)
└── public/
    ├── index.html     ← The webpage structure
    ├── style.css      ← All the visual design
    └── app.js         ← Frontend logic (talks to backend)
```

---

## 🚀 Step-by-Step Setup (For Beginners)

### Step 1 — Install Node.js
1. Go to https://nodejs.org
2. Download the **LTS** version (the recommended one)
3. Install it — just click Next, Next, Finish
4. To check it worked, open your **Terminal** (Mac) or **Command Prompt** (Windows) and type:
   ```
   node --version
   ```
   You should see something like `v20.x.x`

---

### Step 2 — Download this project
Copy the `student-dashboard` folder to your Desktop or anywhere convenient.

---

### Step 3 — Open Terminal in the project folder
**On Mac:**
- Open Terminal
- Type `cd ` (with a space), then drag the folder into the terminal window, then press Enter

**On Windows:**
- Open the folder in File Explorer
- Click on the address bar, type `cmd`, press Enter

---

### Step 4 — Install dependencies
In the terminal, type:
```bash
npm install
```
This downloads the libraries your project needs (takes ~30 seconds).

---

### Step 5 — Start the server
```bash
npm start
```
You should see:
```
✅ Server running at http://localhost:3000
```

---

### Step 6 — Open the app
Open your browser and go to:
```
http://localhost:3000
```
🎉 Your dashboard is live!

---

## 💡 How to Use the Dashboard

| Page | What it does |
|------|-------------|
| **Dashboard** | Shows stats: total, active, inactive students + grade chart |
| **Students** | Lists all students. Click Edit or Delete on any row |
| **Add Student** | Fill in the form to add a new student |

---

## 🔁 During Development (Auto-reload)
Instead of restarting the server every time you change code, use:
```bash
npm run dev
```
This uses **nodemon** which auto-restarts when you save files.

---

## 🌐 How Frontend & Backend Talk

```
Browser (index.html)
     │
     │  HTTP Request (fetch API)
     ▼
Node.js Server (server.js)
     │
     │  Reads/writes
     ▼
data/students.json   ← your "database"
```

Every time you add/edit/delete a student, the browser sends a request
to the server. The server updates `students.json` and sends a response back.

---

## 🛠️ API Endpoints (For Reference)

| Method | URL | What it does |
|--------|-----|-------------|
| GET | /api/students | Get all students |
| GET | /api/students/:id | Get one student |
| POST | /api/students | Add a student |
| PUT | /api/students/:id | Update a student |
| DELETE | /api/students/:id | Delete a student |
| GET | /api/stats | Get summary stats |

---

## 🐛 Common Errors

| Error | Fix |
|-------|-----|
| `command not found: node` | Install Node.js from nodejs.org |
| `Cannot find module 'express'` | Run `npm install` |
| `EADDRINUSE: port 3000` | Another app is using port 3000. Stop it or change PORT in server.js |
| Page not loading | Make sure server is running (`npm start`) |
