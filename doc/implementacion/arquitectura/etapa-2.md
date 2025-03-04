# Archivos Necesarios para Backend Etapa 2

## Sistema de Menú (Completar)

### Productos (MenuItem)
- `src/types/menu.ts` - Interfaces y DTOs para items del menú
- `src/services/menu/menuItemService.ts` - Métodos CRUD, búsqueda, filtros y paginación
- `src/controllers/menu/menuItemController.ts` - Endpoints para listado, detalle, creación, actualización y eliminación
- `src/middleware/validation/menuItemValidators.ts` - Reglas de validación para productos
- `src/routes/menuItemRoutes.ts` - Definición de rutas para productos

### Opciones de Personalización
- `src/types/customization.ts` - Interfaces para opciones de personalización
- `src/services/menu/customizationService.ts` - CRUD para opciones y grupos
- `src/controllers/menu/customizationController.ts` - Endpoints para gestión de personalizaciones
- `src/middleware/validation/customizationValidators.ts` - Validaciones para precios y comportamiento
- `src/routes/customizationRoutes.ts` - Rutas para personalización de productos

## Sistema de Autenticación y Usuarios

### Gestión de Usuarios
- `src/types/user.ts` - Interfaces para usuarios y roles
- `src/services/auth/userService.ts` - Registro, consulta, actualización y gestión de roles
- `src/controllers/auth/userController.ts` - Endpoints para administración de usuarios
- `src/middleware/validation/userValidators.ts` - Validación de contraseñas, emails y datos personales
- `src/routes/userRoutes.ts` - Rutas para administración de usuarios

### Autenticación
- `src/types/auth.ts` - Interfaces para autenticación y tokens
- `src/services/auth/authService.ts` - Login, refresh tokens, logout
- `src/controllers/auth/authController.ts` - Endpoints para login/logout y perfil
- `src/middleware/validation/authValidators.ts` - Validación de credenciales y tokens
- `src/routes/authRoutes.ts` - Rutas para autenticación

## Integración y Actualización

### Archivos a Modificar/Actualizar
- `src/routes/index.ts` - Actualizar para incluir nuevas rutas
- `src/app.ts` - Integrar nuevos módulos
- `src/middleware/auth.ts` - Mejoras en autenticación y autorización
- `prisma/schema.prisma` - Actualizar modelo de datos para usuarios y tokens

## Tests

### Tests Unitarios
- `tests/unit/services/menu/menuItemService.test.ts`
- `tests/unit/services/menu/customizationService.test.ts`
- `tests/unit/services/auth/userService.test.ts`
- `tests/unit/services/auth/authService.test.ts`

### Tests de Integración
- `tests/integration/api/menu.test.ts`
- `tests/integration/api/customization.test.ts`
- `tests/integration/api/auth.test.ts`
- `tests/integration/api/users.test.ts`

## Documentación
- `docs/api/menu.md` - Documentación de API para sistema de menú
- `docs/api/auth.md` - Documentación de API para autenticación
- `docs/guides/authentication.md` - Guía para el sistema de autenticación
- `README.md` - Actualizar con nuevas funcionalidades