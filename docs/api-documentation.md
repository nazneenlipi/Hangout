# relay. API notes

Base URL: `https://frontend-task-chatapp.onrender.com/api`

## Authentication

The client logs in with a phone number and display name. The API returns a bearer token; subsequent requests send `Authorization: Bearer <token>`.

## Resource flow

- `POST /auth/login` — `{ phoneNumber, name }` → session/user payload
- `GET /users/search?q=<name-or-number>` — find people to start a direct conversation
- `GET /conversations` — list the signed-in user’s conversations
- `POST /conversations` — create a direct conversation with a selected user
- `POST /conversations/group` — create a group with a name and participant ids
- `GET /conversations/:id/messages` — retrieve message history
- `POST /conversations/:id/messages` — `{ content }` → created message

The exact response envelope can vary between endpoints, so the application normalizes common `data`, `items`, and direct-array payloads before rendering them.

## Live updates

Socket.io connects to the API host with the bearer token and listens for `message:new` and `conversation:updated`. When a socket is unavailable, the web client uses a short polling interval and invalidates conversation/message queries.

## Error handling

Non-2xx responses are surfaced as readable errors. Empty message content is rejected before a request is made. Sending is optimistic: a temporary message appears immediately, then is reconciled or marked for retry if the request fails.

## Assumptions

The provided Swagger page did not expose complete response schemas during implementation. The documented paths reflect the assignment contract and the client is intentionally defensive around response envelopes and ids.
