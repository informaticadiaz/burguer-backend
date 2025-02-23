# package.json

```json
{
  "name": "restaurant-menu-backend",
  "version": "1.0.0",
  "description": "Backend for restaurant menu management system",
  "main": "dist/app.js",
  "scripts": {
    "start": "node dist/app.js",
    "dev": "ts-node-dev --respawn --transpile-only src/app.ts",
    "build": "tsc",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy",
    "test": "jest",
    "lint": "eslint . --ext .ts"
  },
  "dependencies": {
    "@prisma/client": "^5.10.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.18.2",
    "express-validator": "^7.0.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "eslint": "^8.56.0",
    "jest": "^29.7.0",
    "prisma": "^5.10.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```
