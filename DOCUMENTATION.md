# Stories Coffee — Full-Stack Application Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture — MVC](#3-architecture--mvc)
4. [Folder Structure](#4-folder-structure)
5. [Database & Models](#5-database--models)
6. [HTTP Request/Response Cycle](#6-http-requestresponse-cycle)
7. [Authentication — JWT & bcrypt](#7-authentication--jwt--bcrypt)
8. [Middleware Chain](#8-middleware-chain)
9. [Role-Based Authorization](#9-role-based-authorization)
10. [Controllers](#10-controllers)
11. [Routes](#11-routes)
12. [Views & EJS Templating](#12-views--ejs-templating)
13. [Method Override — Faking PUT & DELETE](#13-method-override--faking-put--delete)
14. [Security Decisions](#14-security-decisions)
15. [Inventory Management](#15-inventory-management)
16. [Loyalty Points](#16-loyalty-points)
17. [CI/CD Pipeline](#17-cicd-pipeline)
18. [Environment Variables](#18-environment-variables)
19. [Common Professor Questions](#19-common-professor-questions)

---

## 1. Project Overview

Stories Coffee is a full-stack web application for managing a coffee shop. It allows:
- **Customers** to browse the menu, place orders, and track loyalty points
- **Employees** to manage pending orders and create orders on behalf of customers
- **Admins** to manage everything: products, categories, users, orders, inventory, and feedback

Built as a server-side rendered MVC application — no separate frontend framework, no JSON API.

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Runtime | Node.js | JavaScript on the server |
| Framework | Express.js | Minimal, flexible HTTP framework |
| Database | MongoDB Atlas | Document database, hosted in the cloud |
| ODM | Mongoose | Schema enforcement + query builder for MongoDB |
| Templating | EJS | HTML templates with embedded JavaScript |
| Auth | bcrypt + JWT | Secure password hashing + stateless sessions |
| Cookie parsing | cookie-parser | Reads cookies from incoming requests |
| Form methods | method-override | Lets HTML forms send PUT and DELETE requests |
| Deployment | Render | Cloud hosting with auto-deploy on git push |
| CI/CD | GitHub Actions | Triggers Render deploy on every push to main |

---

## 3. Architecture — MVC

MVC stands for **Model-View-Controller**. It separates the application into three layers:

```
Browser
   │
   │  HTTP Request (GET /products)
   ▼
Router  ──────────────────────────────────► Controller
                                               │
                                               │  queries
                                               ▼
                                             Model  ◄──► MongoDB
                                               │
                                               │  data
                                               ▼
                                           Controller
                                               │
                                               │  res.render(view, data)
                                               ▼
                                             View (EJS)
                                               │
                                               │  HTML
                                               ▼
                                           Browser
```

- **Model** — defines the data structure and talks to MongoDB (`models/User.js`, `models/Product.js`, etc.)
- **View** — EJS templates that produce the HTML the user sees (`views/products/index.ejs`, etc.)
- **Controller** — the logic in between. Receives the request, calls the model, passes data to the view (`controllers/productController.js`, etc.)

**Why MVC?**
- **Separation of concerns** — changing the UI doesn't require touching the database logic
- **Maintainability** — each layer has one job
- **Testability** — you can test controllers independently of views

---

## 4. Folder Structure

```
coffee-shop-fullstack/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # register, login, logout
│   ├── userController.js      # user CRUD (admin manages staff/customers)
│   ├── productController.js   # product CRUD + restock
│   ├── categoryController.js  # category CRUD
│   ├── orderController.js     # order creation and management
│   ├── feedbackController.js  # customer feedback
│   └── dashboardController.js # role-specific dashboard data
├── middleware/
│   └── authMiddleware.js      # requireAuth, attachUser, requireRole
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   └── Feedback.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   ├── feedbackRoutes.js
│   └── dashboardRoutes.js
├── views/
│   ├── partials/              # header, footer, navbar (included in every page)
│   ├── layouts/
│   ├── auth/                  # login.ejs, register.ejs
│   ├── dashboard/             # admin.ejs, employee.ejs, customer.ejs
│   ├── customers/             # index, show, edit, new, orders
│   ├── products/              # index, show, new, edit, restock
│   ├── categories/            # index, show, new, edit
│   ├── orders/                # index, show, new, edit
│   └── feedback/              # index, show, new, edit
├── public/
│   ├── style.css
│   └── images/categories/    # category images dropped here
├── .env                       # secrets (never committed)
├── server.js                  # app entry point
├── seed.js                    # database seeding script
└── package.json
```

---

## 5. Database & Models

### MongoDB & Mongoose
MongoDB stores data as **documents** (JSON-like objects) inside **collections**. Mongoose adds a **schema** on top — it enforces field types, required fields, and validations before anything is saved.

### User Model (`models/User.js`)
```
name         String  required
username     String  required, unique
email        String  required, unique
phone        String
password     String  required  ← stored as bcrypt hash, NEVER plain text
role         String  enum: ['customer', 'employee', 'admin']  default: 'customer'
loyaltyPoints Number default: 0  ← only meaningful for customers
```
**One model for all roles** — employees and admins simply have `loyaltyPoints: 0` which is ignored. This is simpler than maintaining two separate collections and avoids joining across collections for authentication.

### Product Model (`models/Product.js`)
```
name         String  required, unique
description  String
price        Number  required
inventory    Number  default: 0  ← decremented on every order
isAvailable  Boolean default: true  ← set to false automatically when inventory hits 0
category     ObjectId → ref: Category
orders       [ObjectId → ref: Order]
```

### Category Model (`models/Category.js`)
```
name         String  required, unique
description  String
image        String  ← filename, served from public/images/categories/
```

### Order Model (`models/Order.js`)
```
customer     ObjectId → ref: User   required
products     [{ product: ObjectId → ref: Product, quantity: Number }]
orderDate    Date    default: now
totalAmount  Number  required
status       String  enum: ['pending', 'completed', 'cancelled']  default: 'pending'
```
This implements the **many-to-many** relationship between orders and products — one order has many products, one product appears in many orders.

### Feedback Model (`models/Feedback.js`)
```
user         ObjectId → ref: User  (optional — who submitted it)
customerName String  required
email        String  required
rating       Number  required, min: 1, max: 5
comment      String
```

### Relationships Summary
```
User ──────────── Order  (one-to-many: one customer has many orders)
Category ──────── Product (one-to-many: one category has many products)
Order ─────────── Product (many-to-many: via products array with quantity)
```

---

## 6. HTTP Request/Response Cycle

### What happens on every request

```
1. Browser sends HTTP request
      GET /products HTTP/1.1
      Host: localhost:3000
      Cookie: token=eyJhbGci...

2. Express receives it and runs middleware pipeline:
      express.urlencoded()  → parses form body into req.body
      express.json()        → parses JSON body
      cookieParser()        → parses cookies into req.cookies
      methodOverride()      → rewrites POST?_method=PUT to PUT
      attachUser()          → verifies JWT, sets req.user if logged in

3. Router matches the path to a controller function:
      GET /products → productController.index

4. Controller runs:
      queries MongoDB
      passes data to res.render()

5. EJS template engine compiles the view:
      fills in <%= variables %>
      runs <% if/forEach logic %>
      produces a complete HTML string

6. Express sends HTTP response:
      HTTP/1.1 200 OK
      Content-Type: text/html
      [HTML page]

7. Browser renders the HTML
```

### The difference between res.render and res.redirect
- `res.render('products/index', { products })` → builds and sends an HTML page (status 200)
- `res.redirect('/dashboard')` → sends status 302 with a `Location` header, browser makes a new GET request

### POST-Redirect-GET pattern
After any form submission (POST/PUT/DELETE), controllers redirect instead of rendering. This prevents the "resubmit form?" browser popup if the user refreshes. The flow is:

```
Browser                 Server
  │─── POST /orders ──►│  creates order
  │◄── 302 /orders/123 ─│
  │─── GET /orders/123 ►│  renders page
  │◄── 200 HTML ────────│
```

---

## 7. Authentication — JWT & bcrypt

### bcrypt — Password Hashing

Plain text passwords must **never** be stored. bcrypt is used because:
1. It is **one-way** — you cannot reverse a hash to get the original password
2. It uses a **salt** — a random value added before hashing, so two users with the same password get different hashes (prevents rainbow table attacks)
3. It is **slow by design** — the cost factor (10 rounds) makes brute-force attacks computationally expensive

```js
// Registration: hash before storing
const hashedPassword = await bcrypt.hash(password, 10);

// Login: compare submitted password against stored hash
const isMatch = await bcrypt.compare(submittedPassword, storedHash);
```

`bcrypt.compare` does not "un-hash" — it re-hashes the submitted password with the same salt embedded in the stored hash and compares the results.

### JWT — JSON Web Tokens

A JWT is a **signed, self-contained token** that encodes the user's identity. Structure:

```
eyJhbGciOiJIUzI1NiJ9    ← Header (algorithm)
.eyJpZCI6IjY0Zi4uLiJ9   ← Payload (data: id, email, role, name)
.SflKxwRJSMeKKF2QT4     ← Signature (HMAC-SHA256 of header+payload using JWT_SECRET)
```

**Why JWT over sessions?**
Sessions store user state on the server (in memory or database). JWT is **stateless** — the server stores nothing. The token itself carries all the identity information, verified by the signature.

**Flow:**
```
Login  → jwt.sign({ id, email, role, name }, JWT_SECRET, { expiresIn: '24h' })
         → sent as httpOnly cookie

Every request → jwt.verify(token, JWT_SECRET)
                → if signature valid: decode payload → req.user
                → if tampered/expired: throw error → redirect to login
```

**Why httpOnly cookie instead of localStorage?**
`httpOnly` means JavaScript running in the browser **cannot access** the cookie. If the site had an XSS vulnerability (injected JS), an attacker could steal a localStorage token but cannot steal an httpOnly cookie.

**Why sameSite: strict?**
Prevents CSRF (Cross-Site Request Forgery). With `sameSite: strict`, the browser will not send the cookie on requests originating from other websites, so a malicious site cannot make authenticated requests on behalf of the user.

---

## 8. Middleware Chain

Middleware are functions that run between the request arriving and the controller handling it. Each has the signature `(req, res, next)`. Calling `next()` passes to the next middleware; not calling it ends the chain.

```js
// server.js — global middleware (runs on every request)
app.use(express.urlencoded({ extended: true }))  // parse form bodies
app.use(express.json())                          // parse JSON bodies
app.use(cookieParser())                          // parse cookies
app.use(methodOverride('_method'))               // handle PUT/DELETE from forms
app.use(express.static('public'))                // serve CSS/images
app.use(attachUser)                              // soft auth — attach user if logged in
```

### Three custom middlewares (`middleware/authMiddleware.js`)

**`attachUser`** — Soft. Tries to verify the JWT cookie. If valid, sets `req.user` and `res.locals.user`. If invalid or missing, continues without blocking. Used on public pages that show different content to logged-in users (like the menu showing a cart).

**`requireAuth`** — Strict. If no valid token, redirects to `/login`. Used on every route that requires being logged in.

**`requireRole(...roles)`** — Role gate. Called after `requireAuth`. If the logged-in user's role is not in the allowed list, renders a 403 error page. Example: `requireRole('admin')` blocks employees and customers.

**Execution order on a protected route:**
```
GET /users/new
  → requireAuth     checks JWT → req.user set ✓
  → requireRole('admin')  checks req.user.role === 'admin' ✓
  → userController.newForm  renders the form
```

---

## 9. Role-Based Authorization

Three roles with increasing privileges:

| Action | Customer | Employee | Admin |
|--------|----------|----------|-------|
| Browse menu | ✓ | ✓ | ✓ |
| Place own order | ✓ | ✓ | ✓ |
| Place order for customer | ✗ | ✓ | ✓ |
| View all orders | ✗ | ✓ | ✓ |
| Update order status | ✗ | ✓ | ✓ |
| View own profile | ✓ | ✓ | ✓ |
| View other profiles | ✗ | ✓ | ✓ |
| Manage products/categories | ✗ | ✗ | ✓ |
| Manage users | ✗ | view only | ✓ |
| Delete anything | ✗ | ✗ | ✓ |
| View all feedback | ✗ | ✗ | ✓ |

### Defense in depth — two-layer enforcement

Role checks happen in **two places**:
1. **Route middleware** — `requireRole('admin')` rejects the request before it even reaches the controller
2. **Controller logic** — e.g., `if (req.user.role === 'customer' && order.customer._id.toString() !== req.user.id) return 403`

This means even if a route is accidentally misconfigured, the controller still enforces ownership and role rules. The role in `req.user` comes from the verified JWT — it cannot be forged by the client.

---

## 10. Controllers

Each controller is a file of exported async functions. Pattern:

```js
exports.index = async (req, res) => {
  try {
    const data = await Model.find();
    res.render('view/index', { data, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};
```

### Standard 7 REST actions per resource
| Action | Method + Path | Purpose |
|--------|--------------|---------|
| `index` | GET /products | List all |
| `show` | GET /products/:id | Show one |
| `newForm` | GET /products/new | Render create form |
| `create` | POST /products | Process create |
| `editForm` | GET /products/:id/edit | Render edit form |
| `update` | PUT /products/:id | Process update |
| `delete` | DELETE /products/:id | Remove |

### authController
Handles register, login, logout. Special responsibilities:
- Never trusts `req.body.role` on public registration — always creates `role: 'customer'`
- Uses generic error messages on login failure ("Invalid email or password") — never reveals whether the email exists (prevents user enumeration attacks)
- Auto-logs in the user after registration by issuing a JWT immediately

### orderController
Most complex controller. The `create` function:
1. Determines customer (self for customers, selected from dropdown for employees/admins)
2. Fetches all selected products in a **single query** using `$in` operator (not one query per product)
3. Validates inventory for each item before creating the order
4. Creates the Order document
5. Decrements inventory for each product with `$inc`
6. Sets `isAvailable: false` on any product that hits 0 stock
7. Awards loyalty points to the customer (1 point per dollar)

### dashboardController
Renders different views based on role:
- **Admin** — aggregate stats (total orders, revenue, customers, products) + recent orders
- **Employee** — pending orders queue for the current day
- **Customer** — their own recent orders + loyalty points

---

## 11. Routes

Routes map HTTP method + path combinations to controller functions, with middleware applied per route.

```js
// routes/productRoutes.js
router.get('/',           requireAuth,                            productController.index)
router.get('/new',        requireAuth, requireRole('admin'),      productController.newForm)
router.get('/:id/edit',   requireAuth, requireRole('admin'),      productController.editForm)
router.get('/:id/restock',requireAuth, requireRole('admin'),      productController.restockForm)
router.get('/:id',        requireAuth,                            productController.show)
router.post('/',          requireAuth, requireRole('admin'),      productController.create)
router.post('/:id/restock',requireAuth,requireRole('admin'),      productController.restock)
router.put('/:id',        requireAuth, requireRole('admin'),      productController.update)
router.delete('/:id',     requireAuth, requireRole('admin'),      productController.delete)
```

**Important ordering rule**: specific routes like `/new` must be defined **before** parameterized routes like `/:id`. Otherwise Express matches `/new` as an id.

All route files are mounted in `server.js`:
```js
app.use('/',          authRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/users',     userRoutes)
app.use('/products',  productRoutes)
app.use('/categories',categoryRoutes)
app.use('/orders',    orderRoutes)
app.use('/feedback',  feedbackRoutes)
```

---

## 12. Views & EJS Templating

EJS (Embedded JavaScript) lets you write HTML with JavaScript logic inside `<% %>` tags.

```html
<!-- Output a value -->
<%= product.name %>

<!-- Run logic (no output) -->
<% if (user.role === 'admin') { %>
  <a href="/products/new">Add Product</a>
<% } %>

<!-- Loop -->
<% products.forEach(product => { %>
  <div><%= product.name %></div>
<% }) %>

<!-- Include a partial -->
<%- include('../partials/header') %>
```

### Partials
`header.ejs` and `footer.ejs` are included at the top and bottom of every view. This avoids repeating the HTML boilerplate (DOCTYPE, Bootstrap CDN links, body tags) across 30+ files.

`navbar.ejs` is included inside `header.ejs` and uses `typeof user !== 'undefined' && user` to safely check if a user is logged in before showing role-specific links.

### `res.locals.user`
The `attachUser` middleware sets `res.locals.user = req.user`. EJS automatically has access to all `res.locals` variables — this is why `user` is available in every template without explicitly passing it from every controller.

---

## 13. Method Override — Faking PUT & DELETE

HTML forms only support `GET` and `POST`. To use REST conventions (`PUT` for update, `DELETE` for delete), the project uses the `method-override` package.

**In the form:**
```html
<form action="/products/123?_method=PUT" method="POST">
```

**In server.js:**
```js
app.use(methodOverride('_method'))
```

When `method-override` sees `POST /products/123?_method=PUT`, it rewrites the request method to `PUT` before it reaches the router. So `router.put('/:id', ...)` matches correctly.

---

## 14. Security Decisions

| Decision | Reason |
|----------|--------|
| bcrypt with 10 rounds | Industry standard balance of security vs performance. Higher rounds = slower brute force |
| httpOnly cookie | JavaScript cannot read it — protects against XSS token theft |
| sameSite: strict | Browser won't send cookie on cross-site requests — protects against CSRF |
| secure: true in production | Cookie only sent over HTTPS in production |
| JWT signed with secret | Tampered payloads invalidate the signature — role cannot be forged |
| Generic login errors | "Invalid email or password" — doesn't reveal whether the email is registered (prevents user enumeration) |
| Public registration always assigns role: customer | Never trust `req.body.role` — a malicious user could submit `role: 'admin'` |
| `.select('-password')` on all user queries | Password hash never sent to the view layer accidentally |
| Price never trusted from form | Order total is calculated server-side from DB prices, not from submitted form values |
| Inventory checked before order creation | Prevents overselling — if stock is insufficient, order is rejected with a clear error |

---

## 15. Inventory Management

When an order is placed (`orderController.create`):

```
1. Fetch all selected products in one query (not N separate queries)
2. For each item:
   - Check product.inventory >= requested quantity
   - If not: reject entire order with error message
3. Create the Order document
4. For each item:
   - Product.findByIdAndUpdate({ $inc: { inventory: -quantity } })
   - If updated.inventory <= 0: set isAvailable: false
```

When admin restocks (`productController.restock`):
```
Product.findByIdAndUpdate({ $inc: { inventory: +quantity }, isAvailable: true })
```

This ensures a product marked unavailable automatically becomes available again when restocked.

---

## 16. Loyalty Points

Loyalty points are awarded in `orderController.create` after a successful order:

```js
await User.findByIdAndUpdate(customerId, {
  $inc: { loyaltyPoints: Math.floor(totalAmount) }
});
```

1 point per dollar spent (e.g., a $4.50 order awards 4 points). Points are stored on the User document and displayed in the customer dashboard.

---

## 17. CI/CD Pipeline

```
Developer pushes to GitHub main branch
         │
         ▼
GitHub Actions triggered (.github/workflows/deploy.yml)
         │
         ▼
Workflow sends POST request to Render Deploy Hook URL
         │
         ▼
Render pulls latest code from GitHub
         │
         ▼
Render runs `npm install` + `node server.js`
         │
         ▼
New version is live
```

The deploy hook URL is stored in GitHub Secrets (`RENDER_DEPLOY_HOOK_URL`) — never hardcoded in the workflow file. The full cycle takes approximately 1-2 minutes.

---

## 18. Environment Variables

Stored in `.env`, never committed to git (listed in `.gitignore`). Loaded at startup via `require('dotenv').config()`.

| Variable | Purpose |
|----------|---------|
| `MONGO_DB_URI` | MongoDB Atlas connection string including credentials |
| `JWT_SECRET` | Secret key used to sign and verify all JWTs. If this leaks, attackers can forge tokens |
| `PORT` | Server port (Render provides this automatically in production) |
| `NODE_ENV` | `development` or `production` — controls whether cookies require HTTPS |

In production on Render, these are set as environment variables in the dashboard (not from a `.env` file).

---

## 19. Common Professor Questions

**Q: Why use JWT instead of sessions?**
Sessions require server-side storage (memory or database). JWT is stateless — the server doesn't store anything. Each token is self-contained and verified by its cryptographic signature. This scales better (multiple servers don't need to share session state).

**Q: What happens if someone changes their role in the JWT?**
The JWT payload is base64-encoded, not encrypted — anyone can read it. But it is **signed** with `JWT_SECRET` using HMAC-SHA256. If the payload is modified, the signature no longer matches. `jwt.verify()` throws an error and the middleware redirects to login.

**Q: Why hash passwords with bcrypt and not MD5/SHA256?**
MD5 and SHA are fast — designed for performance. bcrypt is **deliberately slow**. A fast hash means an attacker with a leaked database can test billions of passwords per second. bcrypt's cost factor limits this to thousands per second, making brute-force attacks impractical.

**Q: What is the difference between authentication and authorization?**
- **Authentication** = proving who you are (login with email + password → JWT issued)
- **Authorization** = determining what you're allowed to do (role check → admin can delete, customer cannot)

**Q: Why do you check roles in both middleware AND controllers?**
Defense in depth. If a route is accidentally missing its `requireRole` middleware, the controller still enforces ownership rules. Two independent checks mean a single misconfiguration cannot expose a privilege escalation.

**Q: What is the MVC pattern and why use it?**
Model-View-Controller separates data (Model), presentation (View), and logic (Controller). Benefits: each layer has one responsibility, the UI can change without touching business logic, and code is easier to test and maintain.

**Q: How does method-override work?**
HTML forms only support GET and POST. The `method-override` middleware reads `?_method=PUT` (or DELETE) from the query string and rewrites the request method before it reaches the router, allowing true REST conventions without JavaScript.

**Q: What is the Post-Redirect-Get pattern?**
After a form submission (POST), instead of rendering a page directly, the server redirects to a GET route. If the user refreshes, they re-run the GET (harmless) rather than re-submitting the POST (which would create a duplicate). All write operations in this project follow this pattern.

**Q: Why is price calculated server-side and not trusted from the form?**
A user could inspect and modify a hidden price field in the form before submitting. Server-side calculation always fetches the authoritative price from MongoDB, making price manipulation impossible.

**Q: How does inventory prevent overselling?**
Before creating an order, the controller checks `product.inventory >= requestedQuantity` for every item. If any product is insufficient, the order is rejected. Only after the Order document is created does the inventory decrement happen — using MongoDB's atomic `$inc` operator.

**Q: What is `res.locals` and why does `user` work in every view?**
`res.locals` is an object that Express automatically passes to every `res.render()` call. The `attachUser` middleware sets `res.locals.user = req.user`, making the logged-in user available in all EJS templates without controllers needing to explicitly pass it each time.
