# Archivos Necesarios para Backend Etapa 4 - Sistema de Clientes

## Definiciones de Tipos

- `src/types/customer.ts` - Interfaces y DTOs para clientes, direcciones y favoritos

## Servicios

- `src/services/customer/customerService.ts` - Métodos CRUD para clientes, gestión de perfiles
- `src/services/customer/addressService.ts` - Gestión de direcciones múltiples por cliente
- `src/services/customer/favoriteService.ts` - Gestión de productos favoritos de clientes

## Controladores

- `src/controllers/customer/customerController.ts` - Endpoints para gestión de clientes
- `src/controllers/customer/addressController.ts` - Endpoints para gestión de direcciones
- `src/controllers/customer/favoriteController.ts` - Endpoints para gestión de favoritos

## Validadores

- `src/middleware/validation/customerValidators.ts` - Reglas para validación de datos de clientes
- `src/middleware/validation/addressValidators.ts` - Reglas para validación de direcciones

## Rutas

- `src/routes/customerRoutes.ts` - Definición de endpoints para el sistema de clientes

## Tests

### Tests Unitarios
- `tests/unit/services/customer/customerService.test.ts`
- `tests/unit/services/customer/addressService.test.ts`
- `tests/unit/services/customer/favoriteService.test.ts`

### Tests de Integración
- `tests/integration/api/customer.test.ts`
- `tests/integration/api/address.test.ts`
- `tests/integration/api/favorite.test.ts`

## Integración con Sistema de Pedidos

- `src/services/order/orderService.ts` - Actualizar para asociar pedidos a clientes
- `src/controllers/order/orderController.ts` - Añadir filtros por cliente

## Documentación

- `docs/api/customers.md` - Documentación de API para sistema de clientes
- `docs/guides/customer-management.md` - Guía sobre gestión de clientes
- `README.md` - Actualización con nueva funcionalidad

## Estructura de Endpoints a Implementar

### Clientes

- `GET /api/customers` - Listar clientes con filtros
- `GET /api/customers/:id` - Obtener detalles de un cliente específico
- `POST /api/customers` - Registrar un nuevo cliente
- `PUT /api/customers/:id` - Actualizar datos de un cliente
- `GET /api/customers/:id/orders` - Obtener historial de pedidos
- `GET /api/customers/:id/stats` - Obtener estadísticas del cliente

### Direcciones

- `GET /api/customers/:id/addresses` - Listar direcciones de un cliente
- `POST /api/customers/:id/addresses` - Añadir una nueva dirección
- `PUT /api/customers/:id/addresses/:addressId` - Actualizar dirección
- `DELETE /api/customers/:id/addresses/:addressId` - Eliminar dirección
- `PUT /api/customers/:id/addresses/:addressId/default` - Establecer como predeterminada

### Favoritos

- `GET /api/customers/:id/favorites` - Listar favoritos de un cliente
- `POST /api/customers/:id/favorites` - Añadir producto a favoritos
- `DELETE /api/customers/:id/favorites/:itemId` - Eliminar de favoritos
- `GET /api/customers/:id/recommendations` - Obtener recomendaciones