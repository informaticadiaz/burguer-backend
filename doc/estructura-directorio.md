restaurant-menu-backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── menuController.ts
│   │   ├── categoryController.ts
│   │   └── customizationController.ts
│   ├── models/
│   │   ├── MenuItem.ts
│   │   ├── Category.ts
│   │   └── CustomizationOption.ts
│   ├── routes/
│   │   ├── menuRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   └── customizationRoutes.ts
│   ├── services/
│   │   ├── menuService.ts
│   │   ├── categoryService.ts
│   │   └── imageService.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── validators.ts
│   └── app.ts
├── prisma/
│   └── schema.prisma
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md