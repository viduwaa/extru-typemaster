# ⌨️ Extru TypeMaster

A real-time multiplayer typing game inspired by Monkeytype and Typeracer – built for fun, friendly competition, and typing awareness.



---

## 🚀 About the Project

**Extru TypeMaster** was developed as part of the **Extru Exhibition at Rajarata University of Sri Lanka**, aimed at promoting the importance of typing skills among school and university students.

Over **500+ participants** joined during the exhibition, and players could **compete in real-time typing rooms** (up to 4 players per room) with instant feedback on speed and accuracy.

---

## 🎯 Key Features

- ✅ Real-time multiplayer (Socket.IO)
- ✅ Solo practice mode
- ✅ Leaderboard (WPM-based)
- ✅ Word correctness & accuracy tracking
- ✅ PostgreSQL/MySQL support
- ✅ Awareness module: Collects anonymized typing stats for insight

---

## 📊 What We Learned

From data gathered during the exhibition:
- Average WPM of most participants: **15-20**
- School students (Grades 12 & 13) showed **low typing proficiency**, which may impact future academic and professional paths.
- **University students and staff** also showed room for improvement.

🔔 This allowed us to **raise awareness** during the event and discuss typing practice habits with students and teachers.

---

## 🌐 Play It Online

👉 [https://type.viduwa.me](https://type.viduwa.me)

> ⚠️ _Note: The app is currently hosted on a limited-resource VPS. High traffic may lead to downtime. I'm aware of this and monitoring it – your patience is appreciated!_

---

## 📦 Tech Stack

- **Frontend:** React, TypeScript
- **Backend:** Node.js, Express
- **Real-time Engine:** Socket.IO
- **Database:** PostgreSQL / MySQL
- **Deployment:** Azure Cloud, Ubuntu 22.04 VPS, CloudPanel,

---

## 🛠 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/viduwaa/extru-typemaster.git
cd extru-typemaster

# Install dependencies
npm install

# Create .env file with your database and server configs
cp .env.example .env

# Start server
npm start
