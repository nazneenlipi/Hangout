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

## Part 3 — thought process

I kept the implementation in the existing Next.js App Router project and used React state for the focused interaction surface, avoiding a large dependency footprint for the prototype. The landing page uses a restrained blue-and-ink palette so the message bubbles become the visual signature; the workspace shifts from a two-pane desktop layout to a single-pane mobile prompt. The demo composer intentionally works without an account so reviewers can experience the central interaction immediately.

The API documentation is separate and describes the supplied REST/socket contract, bearer auth, normalization assumptions, and polling fallback. If I continued, I would connect the typed API modules and React Query cache to the live endpoints, add server-backed auth persistence, and test socket payloads against the deployed service. AI tools were used for implementation scaffolding, design exploration, debugging, and browser verification; the interaction and visual direction were reviewed and adjusted manually.
