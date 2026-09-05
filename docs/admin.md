# Velura administration

Open `/admin`. Sign in using `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured on the server. `AUTH_SECRET` must be configured, along with `DATABASE_URL`. Sessions expire after eight hours. The existing in-memory login limiter limits production attempts per server process; a shared rate limiter is needed when running multiple instances.

## Workflows

- **Overview:** collected revenue excluding refunded payments, fulfilment queue, active products, drafts, newsletter audience, and recent orders.
- **Products:** search and filter, create a draft, edit details, upload images, select a primary image, reorder or remove images, publish/unpublish, and delete. Draft status persists in the editor. Deleting a product removes its images and reviews; historical order item snapshots remain intact.
- **Orders:** search by order ID, name, email, or phone; filter by payment and fulfilment; paginate; open order details and custom specifications. Existing confirm, ship, deliver, COD collection, cancel, and return actions are preserved. Unpaid online orders cannot advance through fulfilment. Order mutations lock the database row to serialize concurrent operations.
- **Refunds:** online captured payments use the existing Razorpay integration. COD and payments without a gateway payment ID require the operator to return the money outside the app first, then explicitly confirm the manual refund as completed. External refunds cannot be rolled back by a database transaction; ambiguous gateway failures require reconciliation before retrying.
- **Categories:** edit collection labels, descriptions, image URLs, and order. These values feed the homepage collection grid. Slugs remain the existing seven schema enum values.
- **Customers:** signed-in Clerk profiles (email, role, orders) plus guest checkout emails. Admins can set manager ↔ customer. See `docs/accounts.md`.
- **Reviews:** search and remove inappropriate feedback. Removal and product rating/count recalculation run in one serializable transaction.
- **Subscribers:** search the audience and remove subscriptions on request.

## Integrations and deployment

Image uploads require `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Refunds require the existing Razorpay credentials and webhook setup. No credentials are displayed in the UI. Customer accounts add `Profile`, cart, wishlist, and `Order.profileId` — apply with `npx prisma db push` (see `docs/accounts.md`). Clerk managers/admins and the env-based NextAuth operator can both open `/admin`.

Admin pages perform server-side session checks in addition to proxy protection. Management APIs validate the configured admin identity. Page failures show a retry state instead of reporting an empty store. Product and category writes validate inputs on the server. The admin layout is excluded from search indexing.

## Verification

Run:

```sh
node --import tsx --test tests/admin.test.ts tests/accounts.test.ts
npx tsc --noEmit
npm run build
```

The policy tests cover callback confinement, invalid product/category data, unpaid online fulfilment, closed orders, and manual COD refund semantics. Local HTTP smoke verification also covered sign-in, all management pages, unauthorized writes, invalid input, and a disposable product lifecycle (draft → edit → publish → delete). Live gateway refunds and Cloudinary uploads were not executed during implementation.
