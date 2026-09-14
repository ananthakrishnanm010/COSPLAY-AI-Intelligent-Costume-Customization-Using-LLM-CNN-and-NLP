# Folder Structure Guide - Cosplay

This document acts as a map for the codebase. Use it to understand where files belong and how to keep the architecture clean and modular.

---

## Root Directories

- [client/](file:///d:/COSPLAY.COM/client/) - All React frontend components, page layout elements, routes, and browser styling.
- [server/](file:///d:/COSPLAY.COM/server/) - Backend REST API, database schemas, controllers, and middlewares.
- [shared/](file:///d:/COSPLAY.COM/shared/) - Shared constants (like category arrays or error strings) imported by both `client` and `server`.
- [docs/](file:///d:/COSPLAY.COM/docs/) - Architectural guidelines, API specs, database definitions, and deployment checklists.

---

## Client Folder Detail (`client/src/`)

Frontend code is organized using a **hybrid feature-based** structure. Global cross-cutting code is kept in shared directories, while domain logic (like products, cart, profile, and checkout) is isolated in feature modules.

```text
src/
├── app/             # Application shell, root App component, and main providers
├── assets/          # Static files (images, SVGs, brand logos)
├── components/      # "Dumb" presentational UI components (Button, Input, Badge)
├── features/        # Modular business capabilities
│   └── [feature]/   # e.g., auth, products, cart, checkout, wishlist
│       ├── components/  # Feature-specific UI (ProductCard.jsx, CartItem.jsx)
│       ├── hooks/       # Feature-specific hooks (useProductDetails.js)
│       ├── services/    # Feature-specific API calls (productService.js)
│       └── utils/       # Feature-specific calculations (formatPrice.js)
├── hooks/           # Global custom hooks (useLocalStorage, useMediaQuery)
├── layouts/         # Frame layouts (RootLayout.jsx, AdminLayout.jsx)
├── pages/           # Thin route views mapping components together
├── routes/          # Router setup (public vs. protected paths)
├── services/        # Base API Client setup (axios interceptors)
├── styles/          # Global variables and CSS styling system
└── utils/           # Global utilities (validation regex, date formatters)
```

### Guidance on Adding Frontend Files:

1. **Adding a UI component:** If it is a generic element like a custom button, put it in `src/components/`. If it is domain-specific like a product card, put it in `src/features/products/components/`.
2. **Adding API call routines:** Write them inside the service directory of the relevant feature (e.g., `src/features/auth/services/authService.js`).
3. **Sharing logic across features:** Only import from `src/components/`, `src/hooks/`, or `src/utils/`. **Never import components directly from one feature folder into another** (e.g., no `import from '../wishlist/components' inside the 'cart' folder`). Use pages or contexts to unify them.

### Common Beginner Mistakes:

- **Mixing concerns:** Writing API calls directly inside a `useEffect` inside a React component. Create a dedicated feature service function instead.
- **Overusing Global Context:** Putting all state (like modal toggle states or search queries) in React Context. Keep state as local as possible.

---

## Server Folder Detail (`server/src/`)

Backend code uses a **layered tier system** to decouple routes from business workflows and database access.

```text
src/
├── config/          # Environment parser and service connection instances
├── controllers/     # Incoming HTTP requests parser and output response handlers
├── routes/          # Express route bindings
├── middleware/      # Authentication, payload validators, and error handles
├── services/        # Core business operations (calculations, workflows)
├── repositories/    # Database queries (decoupled database layer)
├── models/          # Explicit schema or TypeScript stub definitions
├── validators/      # JSON payload validation schemas (validation rules)
├── database/        # Prisma Client instance exports and DB seeds
├── utils/           # Global helpers (custom AppError, Winston logger)
├── uploads/         # Local file upload directory
└── jobs/            # Background tasks or cron files
```

### Guidance on Adding Backend Files:

1. **Creating a new API endpoint:**
   - Define the endpoint path in `src/routes/`.
   - Implement the payload validation schema in `src/validators/` and apply it as middleware.
   - Implement request parsing and response handling in `src/controllers/`.
   - Put database queries in `src/repositories/`.
   - Write business workflows (like notifications or payments) in `src/services/`.

### Common Beginner Mistakes:

- **Writing Database Code in Routes:** Placing Prisma commands (like `prisma.user.findUnique`) inside Express route files. Always route to controllers, compile business workflows in services, and retrieve data using repositories.
- **Hiding errors:** Catching errors in controllers or services and returning a status `200` with an error message. Let errors bubble up to the global error middleware, returning appropriate HTTP error codes (`401`, `403`, `400`, `404`).
