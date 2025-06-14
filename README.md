# 🗳️ Poll & Voting App - MERN Stack

A full-stack web application that allows admins to create polls and users to vote. Poll results are displayed with role-based access control.

---

## 🚀 Features

- 👤 User and Admin login/registration
- 🔒 Role-based authentication using JWT
- ✅ Admin can:
  - Create polls with multiple options and a closing date
  - View all polls
  - See results after polls close
  - Delete any poll
- 🗳️ Users can:
  - View all open polls
  - Vote once per poll
  - View results after voting (only if poll is closed)
- 📊 Vote results shown in real-time
- 🎨 Clean and modern UI with light/dark styling

---

## 🔧 Tech Stack

| Tech        | Description                     |
|-------------|---------------------------------|
| MongoDB     | Database                        |
| Express.js  | Backend framework               |
| React.js    | Frontend library                |
| Node.js     | Backend runtime                 |
| JWT         | Authentication                  |
| Axios       | HTTP client                     |

---

## 📂 Project Structure

Voting_app/
│
├── poll_app-frontend/ # React Frontend
│ └── src/
│ ├── pages/ # React Pages (Login, Register, Dashboard, etc.)
│ └── services/ # API helper
│
├── poll_app-backend/ # Node.js Backend
│ ├── controllers/ # Poll and Auth controllers
│ ├── middleware/ # Auth middleware
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Express routes
│ └── server.js # App entry point

2. Backend Setup

cd poll_app-backend
npm install


Create .env file in poll_app-backend/:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

3. Frontend Setup

cd poll_app-frontend
npm install
npm start



🔐 Credentials
To test roles, register two accounts:

Admin Role: Choose "Admin" during registration

User Role: Choose "User" during registration
