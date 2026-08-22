# Officetalk — Chat Application

![Officetalk Chat Application Preview](https://github.com/user-attachments/assets/9b7e5929-8b7c-444a-bf5a-8a647f3d02a2)

A responsive Next.js web application for calm, focused conversations. The public landing page previews the chat experience; `/chat` is the interactive workspace with direct and group conversation affordances, message validation, optimistic local sending, and responsive layouts.

## 🚀 Quick Start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Production build verified with `pnpm build`.

## 🔑 Demo & Testing Credentials

> **Note**: On initial visit, the workspace displays interactive **dummy preview data** so users can test UI affordances. Once logged in via `/login`, the application connects to the live backend REST API (`POST /api/auth/login`), persists the JWT token, and dynamically fetches real MongoDB database conversations and messages.

To test live authentication and conversation sync on the `/login` page, use:

- **Phone**: `+15551234567`
- **Name**: `lipi`

## 📍 Application Routes

- `/` — Creative landing page showcasing product features
- `/chat` — Interactive chat workspace (1-to-1 DMs, Groups, Messages, Real-time sync)
- `/login` — User authentication and JWT token registration
- `docs/api-documentation.md` — Complete API endpoint specifications

---

## 📝 Part 3 — Thought Process Write-up

### 1. Architecture, Libraries & Trade-offs
- **Tech Stack**: Next.js App Router, TypeScript, and Tailwind CSS.
- **State & Real-time**: Custom React hooks (`useConversations`, `useMessages`, `useSocket`) and React Context (`AuthContext`). Combines Socket.io event listeners with a 4-second background polling fallback for maximum reliability.
- **Trade-offs**: Used lightweight custom hooks over heavy state management libraries to keep the bundle lean while retaining full control over optimistic UI updates.

### 2. Design Reasoning (Part 2 — Landing Page & Workspace)
- **Palette & Typography**: Restrained indigo/slate color system (`#2357d5` accent) with clean contrast so conversation bubbles are visually prominent.
- **Responsive Workspace**: Desktop dual-pane layout (sidebar + message thread) that automatically shifts to single-pane navigation on mobile screens.
- **UX Details**: Auto-scrolling on new messages, scroll-up protection when reading history, loading skeletons, and empty state prompts.

### 3. AI Tools Usage
- **Refinement**: All AI outputs were manually reviewed, type-checked, and refactored for production quality and strict API contract adherence.

### 4. API Quirks & Handled Edge Cases
- **Envelope Normalization**: Built defensive `unwrap()` helpers handling both `{ data: [...] }` wrapped envelopes and raw array payloads.
- **Parameter Alignment**: Standardized `phone` vs `phoneNumber` property name differences across auth and user model endpoints.
- **MongoDB ObjectId Protection**: Enforced regex checks (`/^[0-9a-fA-F]{24}$/`) to prevent mock string IDs from triggering database 500 errors.
- **Group Member Validation**: Enforced minimum participant counts in the UI to satisfy the backend rule (`a group needs at least 3 members`).

### 5. What I'd Improve With More Time
- Server-side HttpOnly cookie session management.
