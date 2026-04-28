# 🛡️ AlertGrid AI: Enterprise Emergency Command Center

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://alertgrid-ai-805190767857.us-central1.run.app)
[![Tech Stack](https://img.shields.io/badge/Tech-Stack-blue?style=for-the-badge)](https://nextjs.org/)

**AlertGrid AI** is a professional-grade, high-impact emergency coordination platform designed for large-scale institutions. It transforms chaotic crisis situations into organized, data-driven response operations.

---

## 🧠 The Problem
In large institutions like **hospitals, factories, and universities**, emergency response is often crippled by:
- **Fragmentation**: Information is scattered across radio, phone, and physical logs.
- **Latency**: Critical seconds are lost in manual communication chains.
- **Opacity**: Commanders lack a real-time "Single Pane of Glass" view of the entire crisis.

## 💡 The Solution
AlertGrid AI provides a **centralized command intelligence hub** that:
- **Aggregates** real-time incident reports from multiple entry points.
- **Analyzes** crisis severity using Gemini AI.
- **Automates** response protocols based on institutional hierarchy.
- **Visualizes** the state of the institution through an interactive, cinematic command center.

---

## 🔗 [Launch Live Command Center](https://alertgrid-ai-805190767857.us-central1.run.app)
> **Demo Access**: Use the **"Emergency Login Bypass"** on the sign-in page for instant access to the dashboard.

---

## ✨ Core Features

### ⚡ Real-Time Command Dashboard
A cinematic, glassmorphism-inspired interface showing live incident feeds, system status, and active coordination nodes.

### 🧠 AI Intelligence Hub
Integrates **Google Gemini AI** to provide real-time analysis of incident reports, suggesting priority levels and response strategies.

### 🏢 Multi-Sector Coordination
Dedicated views for different institutional sectors (e.g., Medical, Security, Logistics) ensuring each team has the data they need.

### 🔐 Enterprise-Grade Auth
Secure authentication system with a built-in **Cinematic Demo Suite** for flawless presentations.

---

## ⚙️ Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Logic & State**: Framer Motion, Lucide React
- **Backend/Database**: Firebase (Auth, Firestore)
- **AI Engine**: Google Gemini AI
- **Infrastructure**: Docker, Google Cloud Run

---

## 🏗️ Project Structure
```text
/root
├── /app             # Next.js App Router (Pages & Layouts)
├── /components      # Reusable UI Components (Sidebar, Topbar, etc.)
├── /context         # React Context Providers (Auth, Crisis State)
├── /lib             # Utility libraries (Firebase, Gemini, API helpers)
├── /public          # Static assets and icons
├── .env.example     # Template for environment variables
├── Dockerfile       # Containerization for Cloud Run
└── README.md        # Documentation
```

---

## 🚀 Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mahesh-Nandigam/Alertgrid-ai.git
   cd alertgrid-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy `.env.example` to `.env.local` and fill in your Firebase and Gemini API keys.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the result.

---

## 🌍 Future Scope
- **IoT Integration**: Connect real-world smoke detectors and smart locks.
- **Predictive Analytics**: Use historical data to predict crisis hotspots.
- **Mobile First-Responder App**: Dedicated low-bandwidth interface for field operators.

---

## 👥 Developed By
- **Mahesh Nandigam** - *Lead Engineer & Visionary*

---
*Developed for the Future of Institutional Safety.*
