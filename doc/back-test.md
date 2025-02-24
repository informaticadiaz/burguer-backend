# Testing Guide for Restaurant Menu Backend API

This guide will walk you through testing your backend API deployed at `https://burguer-backend-wcqv.onrender.com`.

## 1. Basic Health Check

First, verify that your server is running properly with a health check:

```bash
curl https://burguer-backend-wcqv.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-02-24T..."
}
```

## 2. Testing Category Endpoints

### 2.1. Get All Categories

```bash
curl https://burguer-backend-wcqv.onrender.com/api/categories
```

### 2.2. Create a New Category

```bash
curl -X POST https://burguer-backend-wcqv.onrender.com/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Burgers",
    "description": "Delicious hamburgers",
    "order": 1,
    "isActive": true
  }'
```

### 2.3. Get a Category by ID

Replace `{id}` with an actual category ID:

```bash
curl https://burguer-backend-wcqv.onrender.com/api/categories/{id}
```

### 2.4. Update a Category

Replace `{id}` with an actual category ID:

```bash
curl -X PUT https://burguer-backend-wcqv.onrender.com/api/categories/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hamburguesas",
    "description": "Nuestras hamburguesas especiales",
    "isActive": true
  }'
```

### 2.5. Delete a Category

Replace `{id}` with an actual category ID:

```bash
curl -X DELETE https://burguer-backend-wcqv.onrender.com/api/categories/{id}
```

## 3. Testing Menu Item Endpoints

### 3.1. Get All Menu Items

```bash
curl https://burguer-backend-wcqv.onrender.com/api/menu-items
```

### 3.2. Create a New Menu Item

First, make sure you have a valid category ID:

```bash
curl -X POST https://burguer-backend-wcqv.onrender.com/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classic Burger",
    "description": "Juicy beef patty with lettuce, tomato, and special sauce",
    "price": 9.99,
    "categoryId": 1,
    "imageUrl": "https://example.com/burger.jpg",
    "isPopular": true,
    "customizationOptions": [
      {
        "name": "Extra Cheese",
        "price": 1.50,
        "isAvailable": true
      },
      {
        "name": "Bacon",
        "price": 2.00,
        "isAvailable": true
      }
    ]
  }'
```

### 3.3. Get a Menu Item by ID

Replace `{id}` with an actual menu item ID:

```bash
curl https://burguer-backend-wcqv.onrender.com/api/menu-items/{id}
```

### 3.4. Update a Menu Item

Replace `{id}` with an actual menu item ID:

```bash
curl -X PUT https://burguer-backend-wcqv.onrender.com/api/menu-items/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Classic Burger",
    "price": 10.99,
    "isPopular": true
  }'
```

### 3.5. Delete a Menu Item

Replace `{id}` with an actual menu item ID:

```bash
curl -X DELETE https://burguer-backend-wcqv.onrender.com/api/menu-items/{id}
```

### 3.6. Get Menu Items by Category

Replace `{categoryId}` with an actual category ID:

```bash
curl https://burguer-backend-wcqv.onrender.com/api/menu-items/category/{categoryId}
```

## 4. Testing Customization Endpoints

### 4.1. Get Customizations for a Menu Item

Replace `{menuItemId}` with an actual menu item ID:

```bash
curl https://burguer-backend-wcqv.onrender.com/api/customizations/menu-item/{menuItemId}
```

### 4.2. Create a New Customization Option

Replace `{menuItemId}` with an actual menu item ID:

```bash
curl -X POST https://burguer-backend-wcqv.onrender.com/api/customizations/menu-item/{menuItemId} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gluten-free Bun",
    "price": 1.50,
    "isAvailable": true,
    "groupName": "bun_options",
    "isMutuallyExclusive": true
  }'
```

### 4.3. Update a Customization Option

Replace `{id}` with an actual customization option ID:

```bash
curl -X PUT https://burguer-backend-wcqv.onrender.com/api/customizations/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gluten-free Bun",
    "price": 2.00,
    "isAvailable": true
  }'
```

### 4.4. Delete a Customization Option

Replace `{id}` with an actual customization option ID:

```bash
curl -X DELETE https://burguer-backend-wcqv.onrender.com/api/customizations/{id}
```

## 5. Testing with Postman

If you prefer using Postman or a similar tool, here's how to set up your requests:

1. Set the request URL to the appropriate endpoint
2. For POST and PUT requests:
   - Set the request method appropriately
   - Add header: `Content-Type: application/json`
   - In the Body tab, select "raw" and "JSON" format
   - Enter the JSON payload as shown in the curl examples

## Troubleshooting

If you encounter issues with your API:

### Common HTTP Status Codes

- 200: Success
- 201: Created successfully (POST requests)
- 204: No content (successful DELETE)
- 400: Bad request (invalid data)
- 404: Resource not found
- 500: Server error

### For Server-side Errors

1. Check the server logs in the Render dashboard
2. Verify your database connection
3. Confirm that your environment variables are set correctly
4. Check for any syntax errors in your code

### Database Issues

1. Ensure your PostgreSQL database is running
2. Verify that migrations have been applied
3. Check connection credentials

### CORS Issues

If you're calling from a frontend application and experiencing CORS errors:

1. Verify that the `CORS_ORIGIN` environment variable is set correctly
2. Check that the CORS middleware is configured properly in your Express app
