# API Design Specification - Cosplay

This document outlines the REST API standards, naming conventions, versioning, and payload guidelines for the Thread & Form backend.

---

## Base URL & Versioning

All API routes are prefixed with `/api` followed by the API version.

- **Current Version:** `v1`
- **Base Endpoint:** `http://localhost:5000/api/v1`

---

## RESTful Naming Conventions

We use resource-oriented, plural noun naming conventions for REST endpoints. Avoid putting verbs in paths.

| Resource     | HTTP Method | Endpoint          | Description                            |
| :----------- | :---------- | :---------------- | :------------------------------------- |
| **Products** | `GET`       | `/products`       | List products (supports query filters) |
|              | `POST`      | `/products`       | Create a new product (Admin only)      |
|              | `GET`       | `/products/:id`   | Get details of a single product        |
|              | `PUT`       | `/products/:id`   | Update product details (Admin only)    |
|              | `DELETE`    | `/products/:id`   | Delete a product (Admin only)          |
| **Cart**     | `GET`       | `/cart`           | Retrieve user's current shopping cart  |
|              | `POST`      | `/cart/items`     | Add item to cart                       |
|              | `DELETE`    | `/cart/items/:id` | Remove item from cart                  |
| **Orders**   | `POST`      | `/orders`         | Submit a new order checkout            |
|              | `GET`       | `/orders`         | Get user order history                 |

---

## Response Formats

The API always returns JSON formatted responses.

### 1. Success Response (GET, PUT, DELETE)

Returns a status indicator and the payload data under a `data` key.

```json
{
  "status": "success",
  "data": {
    "id": "a9b23-c456",
    "name": "Relaxed Cotton Shirt",
    "price": 42.0
  }
}
```

### 2. Paginated List Response

When returning arrays that support scrolling/pages, include pagination metadata.

```json
{
  "status": "success",
  "data": [{ "id": "1", "name": "Shirt" }],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 42,
    "totalPages": 5
  }
}
```

### 3. Error Responses

For payload validation errors, client exceptions, or internal issues, serialize using a uniform structure.

#### Validation Error (HTTP 400):

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

#### Resource Not Found (HTTP 404):

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Product with ID 123 not found"
}
```
