Current State
No application code exists yet. Only the frontend boilerplate (hooks, UI components, config) and uploaded image assets are present.

Requested Changes (Diff)
Add
Backend: company incorporation data model with Company and Shareholder entities
Backend: createCompany API — saves draft company with name, shareholder count, total capital; returns company ID
Backend: updateCompanyShareholders API — saves shareholder records linked to a company and marks company complete
Backend: getCompanies API — returns all companies with nested shareholders
Backend: getCompany API — returns a single company with its shareholders
Backend: deleteCompany API — removes a company and its shareholders
Frontend: Landing page ("/") — INCORP. logo, hero with "Your Business" accent, "START INCORPORATION" CTA, building photo
Frontend: Step 1 form ("/incorporate") — Company Name, Number of Shareholders, Total Capital Invested; draft saved to backend on submit; companyId persisted in localStorage for refresh-safe draft restoration
Frontend: Step 2 form ("/incorporate/shareholders") — Renders exactly N shareholder forms (First Name, Last Name, Nationality); restores draft on load
Frontend: Admin dashboard ("/admin") — Card grid of all companies with capital, shareholder count, date, expandable shareholder list, delete button
Modify
Nothing (fresh build)
Remove
Nothing
Implementation Plan
Generate Motoko backend with Company + Shareholder data types, stable storage, and CRUD APIs
Build landing page matching the design mockups (INCORP. wordmark, lime-green accent, building image)
Build multi-step form with progress stepper, inline validation, toast on error, and draft persistence via localStorage + backend
Build admin dashboard at /admin with company cards and expandable shareholders
Wire all frontend pages to backend canister APIs via generated bindings

✅ Step 1: Test Both Servers Locally
Terminal 1 - Backend
bash

Copy code
cd /Users/macair/Desktop/company-incorporation-tool/src/express-backend
pnpm install
pnpm start
Expected: Server starts on http://localhost:3000

Terminal 2 - Frontend
bash

Copy code
cd /Users/macair/Desktop/company-incorporation-tool/src/frontend
pnpm install
pnpm dev
Expected: App starts on http://localhost:5173

✅ Step 2: Verify Both Are Running
Test

Command

Expected Result

Backend API

curl http://localhost:3000

Returns JSON response

Frontend

Open http://localhost:5173 in browser

App loads without errors

API Connection

Test form submission in frontend

Data saves to backend

✅ Step 3: Update README.md
Add this section to your README.md:

markdown

Copy code
## 🚀 Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- pnpm (`npm install -g pnpm`)

### Backend Setup
```bash
cd src/express-backend
pnpm install
pnpm start
API runs on: http://localhost:3000

Frontend Setup
bash

Copy code
cd src/frontend
pnpm install
pnpm dev
App runs on: http://localhost:5173

Running Both Together
Open two separate terminal windows:

Terminal 1: Run backend commands above
Terminal 2: Run frontend commands above
Testing
Open http://localhost:5173 in your browser
Test the application features
Verify API calls work (check browser console)

Copy code

---

## ✅ Step 4: Create a Test Script (Optional but Recommended)

Create `scripts/test.sh` to make it easier for them:

```bash
#!/bin/bash
echo "Starting Backend..."
cd src/express-backend && pnpm start &
echo "Starting Frontend..."
cd src/frontend && pnpm dev &
echo "Both servers started!"
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"
