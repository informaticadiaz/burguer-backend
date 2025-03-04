# Archivos Necesarios para Backend Etapa 1

## Configuración e Infraestructura
- `package.json` - Dependencias y scripts del proyecto
- `tsconfig.json` - Configuración de TypeScript
- `.env` - Variables de entorno
- `.gitignore` - Archivos a ignorar en el control de versiones

## Estructura de Proyecto
- Estructura de carpetas modular organizada por dominios funcionales

## Archivos de Configuración
- `src/config/database.ts` - Configuración de Prisma ORM
- `src/config/env.ts` - Gestión de variables de entorno
- `src/config/logger.ts` - Configuración de Winston para logging

## Middlewares Fundamentales
- `src/middleware/errorHandler.ts` - Manejo centralizado de errores
- `src/middleware/auth.ts` - Middleware JWT para autenticación
- `src/middleware/validation.ts` - Middleware para validación de datos
- `src/middleware/rateLimit.ts` - Protección contra abusos de la API
- `src/middleware/logger.ts` - Registro de solicitudes HTTP

## Módulo de Categorías
- `src/types/category.ts` - Interfaces TypeScript para transferencia de datos
- `src/services/category/categoryService.ts` - Métodos CRUD para categorías
- `src/controllers/category/categoryController.ts` - Endpoints REST
- `src/middleware/validation/categoryValidators.ts` - Reglas de validación
- `src/routes/categoryRoutes.ts` - Configuración de endpoints

## Utilidades
- `src/utils/errors.ts` - Jerarquía de errores tipados

## Servidor HTTP
- `src/app.ts` - Configuración de Express, middlewares y rutas
- `src/server.ts` - Punto de entrada, gestión del ciclo de vida

## Prisma
- `prisma/schema.prisma` - Definición del modelo de datos
- `prisma/migrations/` - Migraciones de base de datos

## Tests
- `tests/unit/` - Estructura para tests unitarios
- `tests/integration/` - Estructura para tests de integración

## Documentación
- `README.md` - Documentación básica del proyecto