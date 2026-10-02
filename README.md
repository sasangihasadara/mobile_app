# LibraReserve mobile app

React Native + Expo prototype for a library book reservation and reading-room system.

The project is split into two folders:

- `frontend/` - Expo React Native mobile app
- `backend/` - MongoDB API server

## Backend and mobile setup

Requires Node.js 22.13 or newer and MongoDB (local MongoDB Community Server or MongoDB Atlas). The backend uses the official `mongodb` Node.js driver, declared in its own `backend/package.json`.

Install dependencies and create the backend configuration:

```powershell
npm.cmd run install:frontend
npm.cmd run install:backend
Copy-Item backend/.env.example backend/.env
```

For local MongoDB, start the MongoDB service and keep `MONGODB_URI=mongodb://127.0.0.1:27017`. For Atlas, set `MONGODB_URI` in `backend/.env` to your cluster connection string, create a database user with access to the `library_reserve` database, and allow your backend computer's IP in Atlas Network Access. URL-encode special characters in the password. Never put MongoDB credentials in `EXPO_PUBLIC_` variables or the mobile app. `backend/.env` is ignored by Git.

From this project directory, start the API in one terminal:

```powershell
npm.cmd run backend
```

In another terminal, start Expo:

```powershell
npm.cmd run frontend
```

Android emulator uses `http://10.0.2.2:3000/api` automatically; web/iOS simulator uses `http://localhost:3000/api`. For a physical phone, copy `frontend/.env.example` to `frontend/.env`, set `EXPO_PUBLIC_API_URL` to `http://YOUR_COMPUTER_LAN_IP:3000/api`, connect both devices to the same Wi-Fi, then restart Expo. Allow port 3000 on your private network if Windows Firewall prompts. The API health endpoint is `http://localhost:3000/api/health`.

Create an account in the app (password: at least 8 characters), then sign in to reserve books. Accounts and reservations survive API restarts in the MongoDB `library_reserve` database. Collections are `users`, `sessions`, and `books`; active reservations are embedded inside each book. The initial four books are seeded only when missing, so restarting does not reset availability. Sessions expire after seven days; the app keeps its token only in memory, so sign in again after reloading. The screen preview still uses sample data until a server catalogue is loaded; reservation writes always require authentication.

The API supports registration/login/logout, catalogue search (`GET /api/books?q=...`), listing your reservations, reserving a book with pickup date/window, and cancellation. Passwords use salted scrypt hashes; session tokens are stored hashed with a TTL index. Unique indexes protect email and student ID. Atomic conditional book updates prevent overselling and duplicate reservations without requiring a replica set. Each user can only access their own reservations. Cancellation restores exactly one copy, including concurrent cancellation requests.

Configuration in `backend/.env`: `MONGODB_URI` (default `mongodb://127.0.0.1:27017`), `MONGODB_DB` (default `library_reserve`), `PORT` (default 3000), and `CORS_ORIGIN` (default `http://localhost:8081`). The API starts listening only after MongoDB connects and indexes are ready. Use HTTPS and an appropriate CORS origin when deploying beyond local development. Any previous SQLite file is left untouched; its data is not automatically migrated. Campus SSO, password reset email, waitlists and reading-room bookings are not implemented.

Run backend integration tests against local MongoDB. The test creates and drops its own randomly named `library_test_*` database; the application database is never used. To use another test server, set `MONGODB_TEST_URI` to a MongoDB URI whose user can create and drop test databases:

```powershell
npm.cmd run test:backend
```

## Screen flow

1. Welcome
2. Sign in
3. Create account
4. Home dashboard
5. Search books
6. Search results
7. Book details and live availability
8. Reservation confirmation
9. My reservations
10. Reading-room booking

The Search Books flow supports title, author, ISBN, category and availability discovery, matching FR-01.

## High-mark usability details

- One consistent colour, typography and spacing system
- Clear hierarchy and one primary action per screen
- Search by title, author or ISBN, with live result feedback
- Availability badges use both text and colour
- Empty state, form validation and confirmation feedback
- Large, labelled touch targets and accessible input labels

## Run the project

Install the Expo dependencies, then start the app:

```powershell
npm.cmd run install:frontend
npm.cmd run android
```

If npm reports a registry certificate error, configure npm with the trusted certificate supplied by your network/IT administrator; do not disable SSL certificate verification.
