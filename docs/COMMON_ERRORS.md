# Common Errors & Solutions

## Backend won't start

**`Communications link failure` / `Unknown database 'ecommerce_db'`**
MySQL isn't running, or you haven't run `database/schema.sql` yet. Start MySQL, then:
```
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql
```

**`Access denied for user 'root'@'localhost'`**
Wrong password in `application.properties`. Set the `DB_PASSWORD` environment variable, or edit
`spring.datasource.password` directly.

**`Schema-validation: missing table` (on startup)**
`ddl-auto=validate` means Hibernate checks your entities against existing tables — it never
creates them. Run `schema.sql` first.

**Port 8080 already in use**
Something else is using it. Either stop that process, or add `server.port=8081` to
`application.properties` (and update the frontend's `VITE_API_BASE_URL` to match).

## Auth / 401 / 403

**Every request returns 401, even `GET /api/products`**
Check `SecurityConfig` — `GET /api/products/**` and `GET /api/categories/**` should be
`permitAll()`. If you added new public routes, they need to be listed there too.

**Login succeeds but the next request is still 401**
The frontend isn't sending the token. Check Postman/browser dev tools for an
`Authorization: Bearer <token>` header — a common mistake is forgetting the word `Bearer `
before the token.

**403 Forbidden on an admin route while logged in as a normal user**
Working as intended — that route is `hasRole('ADMIN')`. Log in with the seeded
`admin@shop.com` account, or promote a user with:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

**Token stops working after 24 hours**
`app.jwt.expiration-ms` is 24 hours by default. Log in again for a new token, or raise the
value for local testing.

## Validation / business errors

**400 with a `details` array**
A `@Valid` DTO field failed — the `details` list names exactly which fields and why
(e.g. `"Price cannot be negative"`).

**409 `"An account with this email already exists"`**
Duplicate email on register — expected behavior, not a bug.

**409 `"Only N units of 'X' are in stock"`**
Stock check failed, either when adding to cart or at checkout (checkout re-checks stock even
if it was fine when you added it to the cart). Lower the quantity or restock the product as
admin.

**404 on a cart item or order that you know exists**
You're likely looking at someone else's item — ownership is enforced, so it looks
identical to "not found" (cart items) or comes back as a 403 (orders — see below) rather than
leaking that the resource exists.

## Frontend

**`Network Error` in the browser console**
Usually CORS or the backend not running. Confirm `app.cors.allowed-origins` in
`application.properties` matches your frontend's actual origin (`http://localhost:5173` by
default), and confirm the backend is up on port 8080.

**Blank page after `npm run dev`**
Check the terminal for an import error first — a typo'd file path in `App.jsx` is the most
common cause. Browser console errors (F12) are the next place to check.

**Cart badge doesn't update after adding an item**
Make sure you're calling `addItem` from `useCart()` (which updates shared state), not calling
`cartService.addItem()` directly — the latter updates the server but not the UI.

**"Add to Cart" does nothing while logged out**
Working as intended — `ProductDetailPage` redirects to `/login` instead of calling the API,
since `/api/cart/**` requires authentication.

## Database

**Deleting a category fails / wasn't implemented**
Intentional — `products.category_id` is `ON DELETE RESTRICT`, so a category with products
can't be deleted without first reassigning or removing those products. No delete endpoint was
built for categories in this project.

**Order total looks wrong after changing a product's price**
It shouldn't — `order_items.price` stores the price at the time of purchase, not a live
reference to `products.price`. If a total looks wrong, check that column specifically.
