# Finance Data Processing and Access Control Dashboard

This is a project I built for a backend intern assignment. It's a Node/Express/MongoDB API for managing financial records, with role-based access control for three user types — Admin, Analyst, and Viewer. There's also a basic React frontend I put together to visually test the API without needing Postman for everything.

---

## What This Does

- Users are assigned one of three roles: **admin**, **analyst**, or **viewer**
- Depending on the role, users can read, create, update, or delete financial records
- A dashboard API provides summary stats like total income, expenses, and net balance
- The frontend lets you switch between roles and see what each role can/can't do

---

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- bcryptjs for password hashing

**Frontend:**
- React (Vite)
- Plain fetch API (no axios)

---

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                  # mongo connection logic
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── recordController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # reads user from header
│   │   ├── roleMiddleware.js      # checks if role is allowed
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Record.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── recordRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── seed.js
│   └── app.js
├── server.js
├── .env
└── package.json

frontend/
├── src/
│   ├── components/
│   │   ├── RoleSelector.jsx
│   │   ├── Dashboard.jsx
│   │   ├── RecordForm.jsx
│   │   └── RecordList.jsx
│   ├── api.js
│   └── App.jsx
└── index.html
```

---

## Getting Started

### Requirements
- Node.js (v16+)
- MongoDB running locally, or a MongoDB Atlas URI

### Backend Setup

1. Go into the backend folder and install packages:
```bash
cd backend
npm install
```

2. Copy the example env file and fill in your values:
```bash
cp .env.example .env
```

The `.env` should look like:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance_dashboard
```

> If MongoDB isn't installed locally, the server will automatically fall back to an in-memory database (using `mongodb-memory-server`). The data won't persist across restarts but it's fine for testing.

3. Start the backend:
```bash
npm run dev
```

The server will start on `http://localhost:5000`. On first run, it automatically seeds 3 test users and 10 sample records if the database is empty.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## How Authentication Works

I didn't implement JWT for this project — it felt out of scope for an assignment and would've added a lot of complexity. Instead, clients pass a MongoDB user `_id` in the `x-user-id` header and the server looks it up.

When the server starts, it prints the user IDs:
```
Admin    ID: 64abc...
Analyst  ID: 64def...
Viewer   ID: 64ghi...
```

Use these IDs in the header when testing with Postman or curl.

---

## API Endpoints

### Auth (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/auth/roles | Lists all users (used by frontend) |

### Users — Admin only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users |
| GET | /api/users/:id | Get a single user |
| POST | /api/users | Create a new user |
| PATCH | /api/users/:id/role | Change a user's role |
| PATCH | /api/users/:id/status | Activate or deactivate a user |

### Records
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/records | All roles | Fetch records (filterable) |
| GET | /api/records/:id | All roles | Get one record |
| POST | /api/records | Analyst, Admin | Add a record |
| PUT | /api/records/:id | Analyst, Admin | Edit a record |
| DELETE | /api/records/:id | Admin only | Delete a record |

Filter params for `GET /api/records`:
- `type` — income or expense
- `category` — e.g. salary, rent
- `startDate` / `endDate` — e.g. 2024-01-01

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/dashboard/summary | Analyst, Admin | Total income, expenses, net balance |
| GET | /api/dashboard/categories | Analyst, Admin | Breakdown by category |
| GET | /api/dashboard/recent | All roles | Last N transactions |
| GET | /api/dashboard/monthly | Analyst, Admin | Month-wise summary for a year |

---

## Role Permissions

| | Viewer | Analyst | Admin |
|---|---|---|---|
| Read records | ✅ | ✅ | ✅ |
| Add/edit records | ❌ | ✅ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| Dashboard summary | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## Assumptions I Made

- No JWT auth — using header-based user ID since this is a demo project
- `createdBy` on a record is just for tracking, not for ownership restrictions. Any analyst/admin can edit any record
- Date filtering is UTC-based, so edge cases around midnight might behave unexpectedly
- No pagination on list endpoints (could add later)
- Validation is done manually without a library like Joi or Zod

---

## Known Limitations

- If you restart the server and there's no local MongoDB, all data resets (in-memory DB)
- No login/logout flow — authentication is faked via header
- Frontend is very basic, just enough to demonstrate the API
- No unit tests written (ran out of time)
- Error messages aren't super detailed on the frontend

---

## Sample Requests

**Add a record:**
```
POST /api/records
x-user-id: <admin_or_analyst_id>
Content-Type: application/json

{
  "amount": 5000,
  "type": "income",
  "category": "freelance",
  "date": "2024-03-15",
  "notes": "Side project payment"
}
```

**Get dashboard summary:**
```
GET /api/dashboard/summary
x-user-id: <analyst_or_admin_id>
```
