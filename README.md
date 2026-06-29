<div align="center">
  <h1>Launch Control</h1>
  <p><strong>Go-To-Market & Launch Tracking Hub</strong></p>
</div>

<br />

## 📖 Overview
Launch Control is a dedicated Go-To-Market (GTM) tracker for orchestrating complex product launches. It tracks marketing copy, sales enablement, legal approvals, and engineering release readiness in one consolidated view with dependency mapping.

## 💻 Local Development

Follow these instructions to run the project locally on your machine. We ensure no security data is exposed by using an example environment file.

### Prerequisites
- Node.js 18+ installed

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mvahedi2020/Launch-Control.git "Launch Control"
   cd "Launch Control"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Copy the example environment file to create your local environment variables. Never commit your `.env.local` file!
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **View the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## ✨ Features
- GTM Launch Checklist
- Cross-Department Dependency Mapping
- Readiness Scoring
- Automated Reminder Notifications

## Architecture Updates (20260628_172025)
- Introduced custom hooks for local state and debouncing.
- Established baseline Error Boundary component.
- Centralized shared types and utilities.
