# Workspace Reservation System — Cinema SPA

## Description

Single Page Application for managing cinema screenings and ticket reservations. Administrators can create, edit, and cancel screenings and manage all reservations. Standard users can browse the current billboard, book tickets, and manage their own reservations.

## Technologies Used

- JavaScript ES6+
- Vite
- TailwindCSS v4
- JSON Server
- Concurrently
- HTML5

## Installation

```bash
npm install
```

## Running the Project

```bash
npm run dev
```

This starts both the Vite dev server (port 5173) and JSON Server (port 3000) simultaneously via Concurrently.

## Running JSON Server Separately

```bash
json-server --watch db.json --port 3000
```

## Test Users

| Role  | Email            | Password |
|-------|------------------|----------|
| Admin | admin@test.com   | A123456  |
| User  | user@test.com    | A123456  |
| User  | user2@test.com   | A123456  |

## Project Structure

```
src/
├── api/
│   └── http.js               # Fetch wrapper (GET, POST, PUT, PATCH, DELETE)
├── components/
│   └── Sidebar.js            # Shared navigation component
├── controllers/
│   ├── admin.controller.js   # CRUD logic for screenings and all reservations
│   ├── login.controller.js   # Authentication logic
│   └── user.controller.js    # Booking and personal reservation logic
├── router/
│   └── router.js             # Client-side routing with role-based guards
├── services/
│   ├── function.service.js   # API calls for screenings
│   └── reservation.service.js # API calls for reservations
├── views/
│   ├── adminPanelView.js     # Admin panel (screenings + all reservations)
│   ├── homeView.js           # Redirect entry point
│   ├── loginView.js          # Login page
│   ├── notFound.js           # 404 page
│   └── userPanelView.js      # User panel (billboard + my reservations)
├── main.js
├── style.css
└── utils.js                  # Session helpers (save, get, remove, isAdmin)
```

## Role Permissions

### Admin
- Create, edit, and delete screenings
- Cancel a screening (blocks new reservations)
- View all reservations from all users
- Confirm or cancel any reservation
- Delete any reservation

### User
- Browse available screenings (billboard)
- Book tickets for an active screening
- View only their own reservations
- Edit their own reservations (if not cancelled)
- Cancel their own reservations

## Technical Decisions

**Routing:** History API (`pushState`) with route guards that redirect unauthenticated users to login and enforce role-based access — admins cannot access `/user` and regular users cannot access `/admin`.

**Session persistence:** User session is stored in `localStorage` as a JSON object containing `id`, `name`, and `role`. This keeps the session across page refreshes without re-authenticating.

**Available seat tracking:** Every time a reservation is created or cancelled, the application immediately patches the screening's `availableSeats` field in JSON Server to keep data consistent.

**DOM rendering pattern:** Views return HTML strings and call their controller inside a `setTimeout` to allow the browser to insert the HTML before event listeners are attached.

**Modular services:** All API calls are routed through a central `http` wrapper (`src/api/http.js`) that handles headers and error propagation, keeping service files focused solely on endpoint definitions.
