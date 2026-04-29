# coffee-shop-fullstack

coffee-shop-fullstack/
├── config/
│   └── db.js                 # MongoDB Atlas connection
├── models/                   # Reuse from Project 2 + add User
│   ├── User.js               # NEW: name, email, password (hashed), role
│   ├── Customer.js
│   ├── Category.js
│   ├── Product.js
│   └── Order.js
├── controllers/
│   ├── authController.js     # register, login, logout
│   ├── dashboardController.js
│   ├── categoryController.js
│   ├── productController.js
│   ├── orderController.js
│   └── customerController.js
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── customerRoutes.js
├── middleware/
│   ├── authMiddleware.js     # verifyToken
│   └── roleMiddleware.js     # checkRole(['admin']) etc.
├── views/
│   ├── layouts/
│   │   └── main.ejs
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── dashboard/
│   │   ├── admin.ejs
│   │   ├── employee.ejs
│   │   └── customer.ejs
│   ├── products/
│   │   ├── index.ejs         # list
│   │   ├── show.ejs          # detail
│   │   ├── new.ejs           # create form
│   │   └── edit.ejs          # update form
│   ├── categories/...
│   ├── orders/...
│   └── customers/...
├── public/                   # CSS, client-side JS, images
├── .env
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD (or just rely on Render auto-deploy)
├── server.js
└── package.json