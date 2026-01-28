# EIE4432_Project_20-12-2025
EIE4432 project done by myself, Topic is Western Orchestral Music Performance Seat Booking System

Western Orchestral Music Performance Seat Booking System

Description
-----------
This web application allows users to register, log in, browse orchestral music events, select seats via an interactive interface, and book tickets. Admins can manage events, seats, users, and bookings.

Installation & Quick Start
--------------------------

1. Prerequisites:
   - Install Node.js
   - Install MongoDB / Use MongoDB Atlas

2. Clone or copy the repository to your local machine:
   git clone <your_repository_url>
   cd <your_project_directory>

3. Install server dependencies:
   npm install

4. Configure MongoDB connection:
   - Default MongoDB connection is set in `server.js`
   - To customize, edit the MongoDB URI in `server.js` 

5. Restore data from a backup:
   - A backup folder (e.g., `/backup`), run:
     ```
     mongorestore --db orchestra_db /path/to/backup/
     ```
   - Or restore JSON collections:
     ```
     mongoimport --db orchestra_db --collection users --file backup/users.json
     mongoimport --db orchestra_db --collection events --file backup/events.json
     mongoimport --db orchestra_db --collection seats --file backup/seats.json
     mongoimport --db orchestra_db --collection bookings --file backup/bookings.json
     ```

6. Create the database:
   - Ensure MongoDB is running (`mongod`)
   - The required database and collections are automatically created when the app runs and data is added.

7. Run the project:
   npm start
   or
   node server.js

8. Access the web app:
   Open your browser and go to: http://localhost:8080

Login Information
-----------------
- **Admin account**
  - Username: admin
  - Password: adminpass

- **Sample user account**
  - Username: 23079398d
  - Password: 23079398d

Usage 
-----------
- Register new users via `/register.html` or log in at `/login.html`
- Admins access management pages (events, seats, users, transactions)
- User pages: event browsing, interactive seat selection, simulated payments, booking history, and ticket viewing

