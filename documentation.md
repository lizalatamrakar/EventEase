# EventEase Documentation

## Project Overview
EventEase is a frontend-only React Single Page Application (SPA) designed as a clean, responsive event ticket booking system. It covers the full user journey: browsing and searching events, choosing ticket tiers, filling attendee information, simulating payment checkout (via eSewa, Khalti, or Card), and receiving an instant booking confirmation. It also features a dedicated Admin Dashboard for event management (CRUD operations) and booking tracking. The application uses the browser's `localStorage` to simulate backend persistence and supports dynamic Dark and Light theme modes.

---

## Technology Stack
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v3 (with class-based Dark/Light mode)
- **Icons:** Lucide React
- **Data Persistence:** `localStorage` (via a modular service layer)

---

## Architecture & Code Organization

### 1. Data Persistence & Service Layer (`src/services/`)
- **`storage.js`:** Base abstraction over `localStorage` that handles JSON parsing, error safety, and seeds initial data from `src/data/events.json` and `src/data/users.json`. All keys use the `ee_` prefix (`ee_events`, `ee_users`, `ee_bookings`, `ee_current_user`, `ee_theme`).
- **`authService.js`:** Manages user login, registration, session retrieval, and profile updates.
- **`eventService.js`:** Provides event search, category extraction, filtering, CRUD operations, and ticket inventory deduction.
- **`bookingService.js`:** Handles booking creation (with event snapshotting and payment method recording), user booking lookups, and booking cancellations.

### 2. State Management (`src/context/`)
- **`ThemeContext.jsx`:** Manages Dark and Light mode states (`theme`, `toggleTheme`, `isDark`) and persists preference in `localStorage`.
- **`AuthContext.jsx`:** Provides global authentication session state (`user`, `login`, `register`, `logout`, `isAdmin`, `refreshUser`).
- **`BookingContext.jsx`:** Coordinates active multi-step booking data (`event`, `selectedTickets`, `attendee`, `step`) and dynamically calculates `totalAmount`. Supports safe functional state updates.
- **`ToastContext.jsx`:** Simple, lightweight notification system for user feedback.

### 3. Modular Component Structure (`src/components/`)
The codebase is structured into modular, focused components to keep code clean and easy to read:
- **`admin/`**:
  - `EventForm.jsx`: Clear form with venue, organizer, and ticket tier management.
  - `EventTable.jsx`: Searchable list of events with edit/delete actions.
  - `BookingsTable.jsx`: Searchable list of all booking transactions.
- **`booking/`**:
  - `BookingStepper.jsx`: Step-by-step progress indicator.
  - `TicketSelectStep.jsx`: Ticket tier selection with stock validation and counter controls.
  - `AttendeeFormStep.jsx`: Attendee details form with validation.
  - `ReviewStep.jsx`: Order summary and cost breakdown.
  - `PaymentStep.jsx`: Simulated payment gateway supporting **eSewa Mobile Wallet**, **Khalti Digital Wallet**, and **Credit/Debit Card**.
- **`common/`**:
  - `Navbar.jsx`: Header with navigation links, Dark/Light mode switch button, auth states, and user dropdown.
  - `Footer.jsx`: Footer with category shortcuts and project information.
  - `Loader.jsx`: Loading indicator.
- **`events/`**:
  - `EventCard.jsx`: Reusable event card with date, venue, price, and status badges.

### 4. Application Pages (`src/pages/`)
- **`Home.jsx`:** Hero search bar, platform stats, category shortcuts, and featured events.
- **`EventListing.jsx`:** Comprehensive search, category/date/price filtering, sorting, and pagination.
- **`EventDetails.jsx`:** Full event overview, schedule, venue info, organizer details, and ticket selection sidebar.
- **`BookingFlow.jsx`:** Clean multi-step booking coordinator.
- **`BookingConfirmation.jsx`:** Receipt summary with booking reference ID and paid payment method indicator.
- **`MyBookings.jsx`:** User booking history (upcoming and past/cancelled) with cancellation capability.
- **`Profile.jsx`:** User stats, name editing, and password updates.
- **`Login.jsx` & `Register.jsx`:** Clean authentication forms with demo quick-fill buttons.
- **`AdminDashboard.jsx`:** High-level dashboard with summary metrics, tab switching, and modal controls.
- **`NotFound.jsx`:** 404 fallback page.

---

## Simulated Payment Methods (Nepal Digital Wallets)
For demonstration and presentation purposes, the checkout flow includes 3 payment options with production-ready user interface labels (avoiding "demo" or "simulated" terminology to ensure a realistic checkout experience):
1. **eSewa Mobile Wallet:** Pre-populated with secure credential fields and a "Secure Connection" badge.
2. **Khalti Digital Wallet:** Pre-populated with secure credential fields and a "Secure Connection" badge.
3. **Credit / Debit Card:** Pre-populated secure card form with a "Secure Connection" badge and PCI-DSS compliance labels.

---

## Design System & Theme Modes
- **Dark Mode (Default):** Deep slate-indigo tones (`#0b0c16`) with high contrast text and glowing accents.
- **Light Mode:** Crisp off-white and slate background (`#f8fafc` / `#ffffff`) with dark readable typography (`#0f172a`) and tailored borders.
- **Theme Switcher:** Located conveniently in the top navigation bar (both desktop header and mobile menu), allowing users to switch themes anytime with instant persistence.
- **Typography:** Standard Inter font loaded via Google Fonts for clean legibility.
- **Responsiveness:** Full mobile, tablet, and desktop support using responsive Tailwind grid and flex layouts.

---

## How to Run Locally
```bash
npm install
npm run dev          # Start local dev server (http://localhost:5173)
npm run build        # Build optimized production bundle
```

**Default Test Accounts:**
- **Regular User:** `user@eventease.com` / `user123`
- **Administrator:** `admin@eventease.com` / `admin123`
