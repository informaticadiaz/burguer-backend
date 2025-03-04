# Archivos Necesarios para Backend Etapa 3 - Sistema de Pedidos

## Definiciones de Tipos

- `src/types/order.ts` - Enums (OrderStatus, PaymentMethod, PaymentStatus) e interfaces para DTOs de Order, OrderItem, OrderItemCustomization

## Servicios

- `src/services/order/orderService.ts` - Métodos CRUD para pedidos, lógica de transiciones de estado, cálculo de totales
- `src/services/order/orderItemService.ts` - Gestión de ítems dentro de un pedido, cálculo de subtotales
- `src/services/order/orderStatusService.ts` - Validación de transiciones de estado, registro de historial

## Controladores

- `src/controllers/order/orderController.ts` - Endpoints para CRUD de pedidos
- `src/controllers/order/orderItemController.ts` - Endpoints para gestión de ítems en pedidos
- `src/controllers/order/orderStatusController.ts` - Endpoints para cambios de estado e historial

## Validadores

- `src/middleware/validation/orderValidators.ts` - Reglas para validación de datos de pedidos, transiciones de estado

## Rutas

- `src/routes/orderRoutes.ts` - Definición de endpoints, aplicación de middleware de autenticación y autorización

## Tests

### Tests Unitarios
- `tests/unit/services/order/orderService.test.ts`
- `tests/unit/services/order/orderItemService.test.ts`
- `tests/unit/services/order/orderStatusService.test.ts`

### Tests de Integración
- `tests/integration/api/orders.test.ts`

## Actualización de Archivos Existentes

- `src/app.ts` - Integración de nuevas rutas de pedidos
- `src/routes/index.ts` - Inclusión de rutas de pedidos
- `prisma/schema.prisma` - Verificación/actualización de modelos de pedidos

## Documentación

- `docs/api/orders.md` - Documentación de API para sistema de pedidos
- `docs/guides/order-workflow.md` - Documentación del ciclo de vida de un pedido
- `README.md` - Actualización con nueva funcionalidad

## Estructura de Endpoints a Implementar

### Pedidos
- `GET /api/orders` - Listar pedidos con filtros
- `GET /api/orders/:id` - Obtener detalles de un pedido específico
- `POST /api/orders` - Crear un nuevo pedido
- `PUT /api/orders/:id` - Actualizar datos de un pedido
- `POST /api/orders/:id/status` - Cambiar el estado de un pedido
- `DELETE /api/orders/:id` - Cancelar un pedido

### Items de Pedido
- `POST /api/orders/:id/items` - Añadir item a un pedido existente
- `PUT /api/orders/:id/items/:itemId` - Actualizar un item
- `DELETE /api/orders/:id/items/:itemId` - Eliminar un item

### Historial de Estados
- `GET /api/orders/:id/history` - Ver historial de cambios de estado