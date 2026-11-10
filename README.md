# iMovies - Movie Ticket Booking (MERN)

Folders: `client` (React + Vite) and `server` (Express + MongoDB, MVC: models / controllers / routes).

## Run

1. Install and start MongoDB locally.
2. **Frontend** - in `client`:
   ```
   npm install
   npm run dev
   ```
   App: http://localhost:5173
3. **Backend** - open a second terminal:
   ```
   cd ../server
   npm install
   ```
   Create `server/.env` (a copy of `.env.example`):
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/imovies
   JWT_SECRET=any_long_random_string
   ```
   Start (nodemon is a dev dependency):
   ```
   npx nodemon index.js
   ```
   API: http://localhost:8000

The client proxies `/api` and `/uploads` to port 8000 (see `client/vite.config.js`).

## Using it
1. Register an admin (Register page -> "Register as an Admin"), then Admin Login.
2. Add Theatre -> Add Movie (poster upload) -> Add Show.
3. Register a normal user, open a movie, choose a show, pick seats, review, pay.

## Admin navbar icons
Home = all movies (delete) | clapper = Add Show | plus = Add Movie | masks = Add Theatre | history = Shows and All Bookings | arrow = logout.

## Demo payments
No real gateway is connected. Card `4242 4242 4242 4242` succeeds; any card ending `0000` is declined so you can test the retry flow. UPI needs `name@bank`.

## Notes
- Seats are numbered 1..N within each tier (balcony / middle / lower). Seat reservation is atomic, so two users cannot book the same seat.
- Prices are in rupees. Admin shows use 12-hour time; user pages use 24-hour time.
- Booking emails and 24-hour reminders are sent only if the SMTP_* variables are set.
- Deleting a movie or a show cancels its bookings.
# imovies
