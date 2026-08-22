# HANGOUT.

A responsive Next.js web application for calm, focused conversations. The public landing page previews the chat experience; `/chat` is the interactive workspace with direct and group conversation affordances, message validation, optimistic local sending, and responsive layouts.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The production build is verified with `pnpm build`.

## Routes

- `/` — product landing page and interactive message preview
- `/chat` — responsive chat workspace
- `docs/api-documentation.md` — API contract and assumptions

# OFFICETALK CHAT APPLICATION

A modern, responsive Next.js web application for calm, focused direct and group conversations. Features an interactive landing page previewing the core chat experience, a full `/chat` workspace connected to live REST and Socket.io endpoints, optimistic sending, real-time sync, and defensive response normalization.

## Quick Start (Run Locally)

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Verify production build with `pnpm build`.

## Routes & Resources

- `/` — Creative landing page showcasing product features
- `/chat` — Responsive chat workspace (Direct & Group chats, Search, Real-time messaging)
- `/login` — Demo phone & name login flow with JWT token persistence
- `docs/api-documentation.md` — API contract, endpoint specification, and socket assumptions

---

## Part 3 — Thought Process Write-up

### 1. Architecture, Libraries & Trade-offs
- **Framework & Styling**: Built with Next.js (App Router), TypeScript, and Tailwind CSS for rapid, maintainable component design and robust type-safety.
- **State Management & Live API**: Used React Hooks and Context (`AuthContext`, `useConversations`, `useMessages`, `useSocket`) to keep state lightweight without bloating bundle size with heavy external state managers.
- **Real-Time Sync**: Implemented Socket.io connection (`message:new`, `conversation:updated`) paired with defensive background polling (4-second interval) as a robust fallback if web sockets disconnect.
- **Trade-offs**: Chose custom React hooks over React Query for zero-dependency portability and direct control over optimistic state reconciliation during message sending.

### 2. Design Choices (Part 2 — Landing Page & Workspace UI)
- **Visual Direction**: Styled with a restrained indigo/slate palette (`#2357d5` accent, sleek neutral backgrounds, soft borders) so message bubbles stand out as the primary visual focus.
- **Responsive Layout**: Designed a dual-pane layout for desktop (Conversation List + Active Thread) that seamlessly collapses into a focused single-pane thread on mobile devices.
- **UX Polish**: Added loading skeletons, empty state illustrations, automatic auto-scrolling on new messages, and scroll-up protection when reviewing message history.

### 3. AI Tools Usage
- **Tools Used**: AI assistant tools were utilized for boilerplate scaffolding, rapid UI layout exploration, TypeScript interface drafting, and debugging edge cases.
- **Validation & Refinement**: All AI-suggested code was manually audited, type-checked, and refactored to ensure strict API contract adherence and robust error handling.

### 4. API Quirks & Handled Edge Cases
- **Field Name Normalization**: Handled schema variations across endpoints (e.g., backend accepting `phone` for auth while returning `phoneNumber` in some user models).
- **Response Envelope Flexibility**: Created a defensive `unwrap()` helper handling both `{ data: [...] }` wrapped envelopes and direct array payloads.
- **MongoDB ObjectId Validation**: Added regex validation (`/^[0-9a-fA-F]{24}$/`) to prevent invalid mock IDs from triggering 500 `Cast to ObjectId` errors on the live database.

### 5. Future Improvements (Given More Time)
- **Rich Media & Attachments**: Adding image/file upload support and audio message voice notes.
- **Message Reactions & Search**: Full-text message searching across conversation history and emoji reaction pickers.
- **Auth Persistence**: Adding server-side JWT session cookies for enhanced security.
