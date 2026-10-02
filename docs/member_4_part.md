# Member 4 Contribution

## Role: Web Portal Interface, Usability Evaluation, and Final Improvements

As Member 4, my contribution focused on improving the real-world usability of the Library Book Reservation and Reading Room system. My work covered the desktop web portal interface, the authentication experience, usability-based design decisions, and evaluation of the system using user survey findings.

## 1. Web Portal Design

The project originally followed a mobile application layout. Since the system is expected to support both smartphone users and desktop users, I implemented a separate web interface for the desktop experience. The web version uses a wider layout with a sidebar navigation menu, dashboard panels, catalogue browsing, reservation management, reading-room information, and account details.

The mobile version and web version are separated using platform detection. When the application runs on a phone through Expo Go, users see the mobile app layout. When the same project runs in a browser, users see the desktop web portal layout. This makes the application more realistic because real systems usually do not show the exact same mobile interface on a large desktop screen.

The main desktop web sections are:

- Dashboard
- Catalogue
- Reservations
- Reading rooms
- Account

This separation improves clarity and helps desktop users complete tasks with fewer screen changes.

## 2. Authentication and Access Control Design

I improved the login page so that it behaves like a real-world institutional system. Before signing in, the system does not display actual catalogue availability, pickup codes, or personal reservation data. Instead, the public login page only explains the purpose of the portal and clearly states that catalogue availability, reservations, pickup details, and account information are shown after authentication.

This design decision improves privacy and security. In a real library system, users should not see private reservation details or operational data before logging in. The login screen now communicates:

- Secure access for students and staff
- Sign-in required for protected portal features
- Catalogue search, reservation, and account management after login
- Support guidance for users who need help signing in

## 3. HCI Design Principles Applied

Several HCI principles were considered in the final interface design.

### Visibility

The web dashboard displays the main actions clearly through navigation labels and structured panels. Users can quickly identify where to search books, view reservations, manage reading-room features, and check account details.

### Consistency

The interface uses consistent colors, spacing, button styles, cards, and labels across the web pages. The same visual language is also maintained between the mobile and web versions, while still adapting the layout for each device type.

### User Control

Users can move between dashboard sections using the sidebar navigation. They can select a book, choose a pickup date and pickup window, reserve available books, cancel reservations, and sign out from the system.

### Error Prevention

The sign-in and registration forms validate important inputs such as email format and password length. Reservation actions are disabled when a book is unavailable, reducing mistakes before submitting a request.

### Feedback

The system gives visual feedback through availability labels, active navigation states, selected pickup options, reservation details, and clear button states. This helps users understand the current state of the system.

## 4. User Research Evidence

Survey responses were used to justify the need for the system and guide the design decisions. The survey included 44 participants from different user groups such as students, library staff, academic staff, administrative staff, IT support staff, and university management.

Key findings from the survey:

- 33 out of 44 respondents said they would definitely or probably use a mobile app to reserve books in advance.
- 35 out of 44 respondents said they would definitely or probably use an app to reserve a reading-room seat.
- 37 out of 44 respondents wanted notifications about reservation status.
- The average importance rating for a library or reading-room app was 4.45 out of 5.
- The average satisfaction rating for the current book search and reservation process was only 3.02 out of 5.
- The average satisfaction rating for the current seating availability system was only 2.82 out of 5.

These results show that users face real difficulties with the current manual or semi-manual process. Many users do not know whether books or reading-room seats are available before visiting the library. This creates wasted time and frustration, especially during exam periods and busy hours.

## 5. Design Improvements Based on User Needs

Based on the survey results, the final design supports the following user needs:

- Search books by title, author, ISBN, or category
- View book availability after signing in
- Reserve available books with a selected pickup date and time window
- View personal reservations in one place
- Cancel reservations when needed
- Access reading-room related information
- Use the system on both smartphone and desktop devices

The web interface is especially useful for library staff, academic staff, administrative staff, and users who prefer laptop or desktop access. The mobile interface is useful for students who mainly use smartphones.

## 6. My Implemented Components

My implementation contribution includes the desktop web interface and final interface improvements. The key file for the web portal is:

`frontend/WebApp.js`

The web interface includes:

- Desktop login and registration layout
- Secure public landing content before login
- Sidebar navigation after login
- Dashboard summary cards
- Catalogue browsing layout
- Book details and reservation panel
- Reservation management section
- Reading-room section
- Account information section

I also helped improve the overall project structure by separating the frontend and backend folders, making the project easier to understand and run.

## 7. Testing and Verification

The web implementation was verified by running syntax checks and web export compilation. The web version successfully compiled after the changes, confirming that the interface code was valid.

The expected test flow is:

1. Start the backend server.
2. Start the frontend web app.
3. Open the web portal in the browser.
4. Register or sign in with a valid account.
5. Search the catalogue.
6. Select an available book.
7. Choose a pickup date and pickup window.
8. Create a reservation.
9. View the reservation in the reservations section.
10. Cancel the reservation if needed.

This flow checks the main tasks expected from the library reservation system.

## 8. Reflection

My part improved the system by making it more realistic for both mobile and web users. Instead of simply stretching the mobile interface across the browser, the system now provides a separate desktop portal layout. This better matches real-world library systems, where desktop users need a wider dashboard-style interface and mobile users need a simple touch-friendly app.

The final design also protects user data by keeping real catalogue availability, pickup codes, and personal reservation information behind authentication. This improves the professionalism, privacy, and credibility of the application.
