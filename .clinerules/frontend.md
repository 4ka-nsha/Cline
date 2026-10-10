# Frontend Rules

This document defines the working agreement for the **frontend** of the Farm
Assistant application. It is scoped for a 7-hour hackathon. Preserve any
existing rules in this folder; only add or clarify frontend-specific guidance.

## 1. Scope of work
- Work **only** on the frontend and its documentation. Do not modify backend
  files, server code, or API implementations.
- Preserve teammates' work and follow existing conventions in the repository.
- If a repository-wide `.clinerules` file exists, those rules still apply; this
  file layers frontend-specific rules on top.

## 2. Data access
- **All** data access goes through a typed service layer in `src/services/`.
- Do not call `fetch`/`axios` or import mock data directly inside components or
  pages. Components consume services, services own the transport details.
- Share data shapes via TypeScript interfaces in `src/types/`.

## 3. Mock vs. live API modes
- The app supports **explicit** modes selected via the environment variable
  `VITE_DATA_MODE`, which must be either `mock` or `live` (default: `mock`).
- In `mock` mode, services return data from `src/mocks/`.
- In `live` mode, services call the real backend at `VITE_API_BASE_URL`.
- **Never silently replace a failed live request with mock data.** If a live
  request fails, surface a clear error to the UI (and log it). Do not fall back
  to mocks automatically — that hides real outages from users and teammates.

## 4. Secrets and configuration
- **Never put API secrets or keys in frontend code or in `VITE_` variables.**
  Vite inlines every `VITE_*` variable into the public client bundle, so they
  are visible to anyone.
- Only non-secret configuration may live in `VITE_` variables (e.g. the public
  backend base URL). Anything sensitive must stay server-side on the backend.

## 5. Version control
- **Do not commit, push, or deploy automatically.** Leave changes staged in the
  working tree for the user and teammates to review.

## 6. Keep scope achievable
- This is an MVP for a hackathon. Favor simple, readable, working code over
  abstractions. Do not add features outside the agreed scope (e.g. no general
  chatbot, authentication, or maps for this MVP).
