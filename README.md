# 🛍️ Dukaan Khata — Full-Stack Node.js & MongoDB System

A digital ledger system for local businesses, featuring real-time stock availability, dual-role authentication (**Owner** & **Customer**), and scan-to-pay transaction tracking.

---

## 📁 Project Structure

```
c:\Users\krant\OneDrive\Desktop\seminar\
│
├── config/
│   ├── db.js                 # MongoDB connection logic via Mongoose
│   └── seeder.js             # Initial database seeder (demo owner, customer & products)
│
├── models/
│   ├── User.js               # User Schema (Customer / Owner roles, shopName, bcrypt hashing)
│   ├── Product.js            # Product Schema (name, shop, price, status: in/low/out)
│   └── Transaction.js        # Transaction Schema (QR scan payments & ledger history)
│
├── routes/
│   ├── auth.routes.js        # POST /register, POST /login, GET /me
│   ├── product.routes.js     # GET / (search/filter), POST, PUT /:id, DELETE /:id
│   └── payment.routes.js     # POST /scan-pay, GET /stats
│
├── middleware/
│   └── auth.middleware.js    # JWT token verification & role authorization (Owner/Customer)
│
├── public/
│   ├── index.html            # Main ledger dashboard connected to MongoDB REST API
│   └── login.html            # Dual-role Auth page (Owner & Customer switcher)
│
├── web.html                  # Standalone frontend copy (ready for Live Server)
├── login.html                # Standalone login page copy
├── server.js                 # Main Express application entry point
├── package.json              # Node dependencies & run scripts
├── .env                      # Environment config (Port, Mongo URI, JWT secret)
└── README.md                 # Documentation & steps
```

---

## 🚀 Quick Setup & Run Steps (In VS Code)

### Step 1: Open the project in VS Code
Open VS Code, press `Ctrl + O` (or `File > Open Folder`), and select:
`c:\Users\krant\OneDrive\Desktop\seminar`

### Step 2: Open Terminal & Install Dependencies
Press `Ctrl + ~` (backtick) in VS Code to open the integrated terminal, then run:
```bash
npm install
```

### Step 3: Ensure MongoDB is Running
- If you have MongoDB installed locally as a service, it runs automatically on port `27017`.
- You can test/view your database anytime using **MongoDB Compass** by connecting to:
  `mongodb://127.0.0.1:27017`

### Step 4: Start the Backend Server
In the terminal, run:
```bash
node server.js
```
*(or `npm run dev` if you have `nodemon`)*

You will see:
```
===============================================
🚀 Dukaan Khata Backend Server Running!
🌐 Local URL: http://localhost:5000
🔐 Login Page: http://localhost:5000/login.html
🛍️ App Dashboard: http://localhost:5000/index.html
===============================================
✅ MongoDB Connected: 127.0.0.1
✅ Demo Owner created: owner@sharma.com / password123
✅ Demo Customer created: customer@gmail.com / password123
✅ Initial stock ledger products populated.
```

---

## 🔑 Pre-Seeded Test Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Shop Owner** | `owner@sharma.com` | `password123` | Add products, cycle stock (`In` / `Low` / `Out`), delete items, receive QR payments |
| **Customer** | `customer@gmail.com` | `password123` | Search items across shops, check stock status in real-time, simulate scan & pay |

*(You can also click **"Auto Fill"** on the login page or switch to **"Create Account"** to register your own custom shop or customer profile!)*

---

## 🌐 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new Owner or Customer (with shopName for owners)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get profile for current logged-in user

### 📦 Products & Ledger (`/api/products`)
- `GET /api/products` — List all products (supports query `?search=oil` and `?shop=Sharma`)
- `POST /api/products` — Add new product *(Owner protected)*
- `PUT /api/products/:id` — Update product or status cycle (`in` / `low` / `out`) *(Owner protected)*
- `DELETE /api/products/:id` — Delete product *(Owner protected)*

### 💳 Payments & Stats (`/api/payments`)
- `POST /api/payments/scan-pay` — Capture simulated QR payment to MongoDB
- `GET /api/payments/stats` — Platform KPI statistics & registered business accounts
