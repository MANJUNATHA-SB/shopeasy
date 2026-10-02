# ShopEasy — Full-Stack E-Commerce App

React (Vite) + Spring Boot 3 + MySQL 8, with JWT auth and role-based access.

## Project structure

```
.
├── database/
│   ├── schema.sql          # run first
│   └── sample_data.sql     # run second
├── backend/                 # Spring Boot API (port 8080)
├── frontend/                 # React app (port 5173)
├── postman/
│   └── ecommerce.postman_collection.json
└── docs/
    └── COMMON_ERRORS.md
```

## Prerequisites

- Java 17+
- Maven (or use `./mvnw` once you've generated it from start.spring.io — see Step 3)
- Node.js 18+ and npm
- MySQL 8 running locally

## 1. Database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql
```

This creates `ecommerce_db` with 7 tables, 5 categories, 12 products, and two test accounts
(passwords are already BCrypt-hashed in the script):

| Email | Password | Role |
|---|---|---|
| admin@shop.com | Admin@123 | ADMIN |
| user@shop.com | User@123 | USER |

## 2. Backend

```bash
cd backend
```

Open `src/main/resources/application.properties` and set your MySQL password — either edit
`change_me` directly or export it:

```bash
export DB_PASSWORD=your_mysql_password
```

Then run it:

```bash
./mvnw spring-boot:run
```

Wait for `Started EcommerceApplication` in the console. Confirm it's up:

```bash
curl http://localhost:8080/api/products
```

You should get back a JSON page of 12 products. If you get a connection error, see
`docs/COMMON_ERRORS.md`.

## 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The `.env` file already points it at
`http://localhost:8080/api`, so no config needed if you kept the default backend port.

## 4. Try it end to end

1. Browse products on the home page — search, filter by category, sort by price.
2. Register a new account (or log in as `user@shop.com`).
3. Add a few items to the cart, adjust quantities.
4. Checkout with a shipping address — this creates a real order and reduces stock.
5. View it under **Orders**.
6. Log out, log back in as `admin@shop.com`, and open **Admin** — add a product, add a
   category, and check the Orders/Users tabs.

## How the three pieces talk to each other

```
React (Axios) → JWT in Authorization header → Spring Security filter → Controller → Service → Repository → MySQL
```

- The frontend never touches the database directly — every read and write goes through the
  REST API.
- `AuthContext` stores the JWT in `localStorage` after login/register and Axios attaches it
  to every request automatically (`services/api.js`).
- Spring Security's `JwtAuthenticationFilter` validates that token on every request before it
  reaches a controller. No token, or an invalid one, and protected routes return 401
  automatically — the frontend's Axios interceptor catches that and redirects to `/login`.
- Role checks (`ADMIN` vs `USER`) happen in `SecurityConfig`, not in the frontend — hiding the
  "Admin" link in the header is a UX nicety, not the actual security boundary.

## Testing the API directly

Import `postman/ecommerce.postman_collection.json` into Postman. Run **Auth → Login (User)**
and **Auth → Login (Admin)** once each — the tokens are saved automatically and every other
request in the collection already references them.

## Known simplifications (worth mentioning if asked in an interview)

- No order status/tracking — an order is a fixed snapshot from the moment it's placed.
- Payment is Cash on Delivery only; no real payment gateway integration.
- No product reviews, wishlists, or email notifications.
- No refresh tokens — the JWT is valid for 24 hours, then you log in again.
- No rate limiting or request logging middleware.

These were left out deliberately to keep the project finishable and easy to explain end to
end, not because they were forgotten.
