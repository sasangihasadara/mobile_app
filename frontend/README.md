# LibraReserve frontend

Expo SDK 55, Expo Router and TypeScript. The entry point is expo-router/entry.

## Source structure

- src/app/_layout.tsx: shared provider and root navigator
- src/app/index.tsx: mobile welcome / desktop portal
- src/app/(auth)/: login, registration and password help
- src/app/(tabs)/: home and reservations
- src/app/books/: search, results, [id] details, reservation and confirmation routes
- src/app/seats/: reading-room information
- src/app/explore.tsx: screen preview
- src/components/: reusable UI and desktop layout
- src/screens/: typed presentation components used by the routes
- src/context/LibraryProvider.tsx: shared account, catalogue and reservation state
- src/services/api.ts: backend HTTP client
- src/types/library.ts: book, user, reservation and screen contracts
- data/catalogue.json: catalogue seed shared with the backend

The (tabs) group uses a Stack because the mobile screens render their own bottom navigation. Parenthesized groups organize routes without adding a URL segment. Backend server.cjs and database.cjs remain Node CommonJS files; they are not React components.

## Run

From this frontend directory:

~~~powershell
npm.cmd install
npm.cmd run typecheck
npx.cmd expo start --clear
~~~

Stop the old Metro process before starting again after the migration. Press a for Android or w for web. For Android emulator access, set EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api in .env; for browser access use http://localhost:3000/api. Restart Metro after changing .env. The backend must be running separately and connected to MongoDB for account and reservation requests.

## Migration

The previous JavaScript frontend files are archived at ../frontend-javascript-backup.zip. Edit src files for the active app. Login state remains in memory; reloading requires signing in again. Reading-room booking and a live shelf-location service are not implemented.
