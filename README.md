🧠 Project Overview
Repository: Dynamic-Questionnaire-and-Analytics-Tool
Purpose: A multi-framework tool for building, managing, and analyzing questionnaire-based assessments.
Frameworks Used: Next.js, React, Svelte

🔧 Main Functional Areas
1. Next.js App (Project/my-next-app)
🧩 API Routes
Located in /api/questions

Endpoint	Description
route.ts	Returns all stored questions (GET)
add/route.ts	Adds a single question
bulk-add/route.ts	Adds multiple questions
remove/[id]/route.ts	Deletes a question by ID

Data is stored in a TypeScript file acting as a flat-file database.

📝 Quiz Flow
Page	Description
quiz/page.tsx	Handles quiz UI, question navigation, and scoring
results/page.tsx	Displays radar chart, PDF export, and sends results via email

🧱 UI Components
Found in components/ui

Buttons, Toasts, Progress Bars, Utilities

Example: button.tsx

2. React App (react/questionnairereactapp)
File	Purpose
Question.js	Quiz question display with animation
Results.js	Radar chart and score explanation
ConfettiEffect.js	Visual celebration effect
ThemeContext.js	Dark/light mode support
ThemeToggle.js	Toggle component for theme switching

3. Svelte App (svelte-v3-1)
File	Description
+page.svelte	Full questionnaire flow, result display with radar chart
+page.server.js	Backend logic with Drizzle ORM for storing user responses
+layout.svelte	Global layout and CSS imports

🚀 Summary
This repo is a rich, modular toolkit for creating questionnaires across different frontend ecosystems, with built-in analytics, data export, visual charts, and persistence mechanisms. It can be deployed as-is or selectively integrated into existing applications.

