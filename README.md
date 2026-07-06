# AI1 Mart – All In One Mart
### Full-Stack E-Commerce + Staff Management Platform

---

## ✅ FEATURES

### Customer Portal
- 50+ product categories (Electronics, Fashion, Books, Grocery, Beauty, Appliances, Gaming, Pet, Musical Instruments, Gardening, Industrial & more)
- Real product images from Unsplash
- Product Detail page with description, features, image gallery, similar products
- Left sidebar filters: Department, Price Range, Brands, Customer Rating, Sort
- Voice Search (click 🎤 mic in search bar — Chrome/Edge only)
- AI Chatbot floating window (ask about products, orders, returns)
- Add to Cart, Buy Now, Wishlist
- Full Checkout: Delivery → Payment → Review → Place Order
- Order tracking with live progress bar
- My Account: profile, addresses, payments, settings
- Real-time updates via Socket.IO

### Staff Portal
- Super Admin: Full control — products, pricing, staff, settings
- Admin: Orders, deliveries, customers, staff holidays & queries
- Manager: Team management, holiday approval, query resolution, timesheets
- Staff: Request leave, submit queries, view schedule, clock in/out

### Technical
- React.js frontend (mobile-responsive PWA)
- Node.js + Express backend
- MongoDB database
- Socket.IO real-time events
- JWT authentication with role-based access
- Voice search (Web Speech API)
- AI Chatbot (rule-based knowledge base)
- Mobile-first responsive design

---

## 🚀 HOW TO RUN

### Step 1 — Start MongoDB (pick one)
```
# Option A — Windows PowerShell as Administrator:
net start MongoDB

# Option B — Direct (no admin needed):
mongod --dbpath "C:/data/db"

# Option C — Windows Services:
Win+R → services.msc → MongoDB → Start
```

### Step 2 — Backend (Terminal 1)
```bash
cd ai1mart/backend
npm install
npm run dev
```
✅ Backend → http://localhost:5000

### Step 3 — Frontend (Terminal 2)
```bash
cd ai1mart/frontend
npm install
npm start
```
✅ Frontend → http://localhost:3000

### Step 4 — Seed Database (Terminal 3, run ONCE)
```bash
cd ai1mart
npm install mongoose bcryptjs
node seed.js
```
Creates all users, 60+ products with real images, holidays and queries.

---

## 👤 LOGIN CREDENTIALS

### Customer Portal → http://localhost:3000 → Customer Portal
| Email                    | Password |
|--------------------------|----------|
| customer@ai1mart.com     | user123  |

### Staff Portal → http://localhost:3000 → Staff Portal
| Role        | Email                    | Password |
|-------------|--------------------------|----------|
| Super Admin | superadmin@ai1mart.com   | admin123 |
| Admin       | admin@ai1mart.com        | admin123 |
| Manager     | manager@ai1mart.com      | admin123 |
| Staff       | staff@ai1mart.com        | admin123 |

---

## 🗄️ VIEW DATABASE (For Internship Review)

### Best — MongoDB Compass (visual GUI)
1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Click **ai1mart** database
4. Browse collections: users, products, orders, carts, holidays, queries

### Terminal — mongosh
```bash
mongosh
use ai1mart
show collections

# See all products with name & price:
db.products.find({},{name:1,category:1,brand:1,price:1,salePrice:1}).pretty()

# Count per category:
db.products.aggregate([{$group:{_id:"$category",count:{$sum:1}}}])

# See all users:
db.users.find({},{firstName:1,lastName:1,email:1,role:1}).pretty()

# See all orders:
db.orders.find({},{status:1,total:1,createdAt:1}).pretty()

# See pending holidays:
db.holidays.find({status:"pending"}).pretty()

# See open queries:
db.queries.find({status:"open"}).pretty()
```

---

## 📱 MOBILE APP (PWA)

The app works as a mobile app on Android and iOS:

### Android (Chrome):
1. Open http://localhost:3000 in Chrome
2. Tap ⋮ menu → "Add to Home screen"
3. Launch from home screen — opens like a native app

### iPhone (Safari):
1. Open http://localhost:3000 in Safari
2. Tap Share → "Add to Home Screen"
3. Launch from home screen

---

## 🎤 VOICE SEARCH
1. Click the 🎤 mic button next to the search bar
2. Allow microphone permission
3. Speak the product name
4. The search fills automatically
- Works in Chrome and Edge (not Firefox)

## 🤖 AI CHATBOT
- Click the 🤖 button in the bottom-right corner
- Ask about: products, prices, orders, returns, payments, filters, etc.
- Quick suggestion buttons: 📱 Mobiles, 💻 Laptops, 👟 Shoes, 📚 Books, 🎮 Gaming, 📦 Orders

---

## 🏗️ PROJECT STRUCTURE
```
ai1mart/
├── backend/
│   ├── models/
│   │   ├── User.js        — Customer & Staff accounts
│   │   ├── Product.js     — Products with images, features, tags
│   │   ├── Order.js       — Orders
│   │   ├── Cart.js        — Shopping carts
│   │   ├── Holiday.js     — Leave requests
│   │   └── Query.js       — Staff queries
│   ├── routes/
│   │   ├── auth.js        — Login, Register, Seed accounts
│   │   ├── products.js    — Product CRUD + subcategory filter
│   │   ├── cart.js        — Cart operations
│   │   ├── orders.js      — Order management
│   │   ├── users.js       — Customer management
│   │   ├── staff.js       — Staff management
│   │   ├── holidays.js    — Leave management
│   │   ├── queries.js     — Query management
│   │   └── dashboard.js   — Admin stats
│   ├── middleware/auth.js  — JWT + Role middleware
│   ├── server.js          — Express + Socket.IO server
│   └── .env               — Config (MongoDB URI, JWT secret)
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── PortalChooser.js   — Landing page
│       │   ├── UserAuth.js        — Customer login/register
│       │   ├── StaffAuth.js       — Staff login (no credentials shown)
│       │   ├── UserStore.js       — Full Amazon-like store
│       │   └── AdminShell.js      — All staff dashboards
│       ├── context/
│       │   ├── AuthContext.js     — Auth state
│       │   └── ToastContext.js    — Notifications
│       ├── utils/api.js           — Axios + Socket.IO
│       ├── App.js                 — Routes
│       └── index.css              — Light blue theme + mobile CSS
│
├── seed.js     — Database seeder (run once)
└── README.md
```

---

## ⚡ REAL-TIME EVENTS
| Event | When | Who sees |
|-------|------|----------|
| product_update | Product added/edited/deleted | Store refreshes live |
| order_status_update | Admin updates order | Customer's orders refresh |
| new_order | Customer places order | Admin notification |
| holiday_request | Staff submits leave | Manager notification |
| holiday_update | Manager approves/rejects | Staff notified |
| new_query | Staff submits query | Manager notification |

---

## 🛠️ TECH STACK
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js 18+, Express 4 |
| Database | MongoDB, Mongoose ODM |
| Real-time | Socket.IO 4 |
| Auth | JWT + bcrypt |
| Voice | Web Speech API |
| Images | Unsplash CDN |
| Styling | Custom CSS Variables |
