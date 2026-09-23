# LibraReserve mobile app

React Native + Expo prototype for a library book reservation and reading-room system.

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
npm.cmd install
npm.cmd run android
```

This computer's npm connection currently rejects the registry certificate. Configure npm with the trusted certificate supplied by the network/IT administrator before installing packages; do not disable SSL certificate verification.
