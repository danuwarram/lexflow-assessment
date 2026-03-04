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
