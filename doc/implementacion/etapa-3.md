# Plan de Implementación: Etapa 3 - Sistema de Pedidos

## Introducción

En esta tercera etapa del desarrollo del backend para el sistema de restaurante, nos centraremos en implementar el núcleo del sistema de pedidos. Este componente es crucial ya que representa la funcionalidad central del negocio: la gestión completa del ciclo de vida de los pedidos desde su creación hasta su entrega.

La implementación del sistema de pedidos se basará en la arquitectura modular por dominios ya establecida en las etapas anteriores, manteniendo la separación clara entre las capas de datos, servicios, controladores y API.

## Objetivos de la Etapa 3

1. Implementar los modelos de datos relacionados con pedidos
2. Desarrollar la lógica de negocio para la gestión de pedidos
3. Crear los endpoints necesarios para el ciclo de vida completo de un pedido
4. Implementar el sistema de cambios de estado de pedidos
5. Desarrollar el cálculo de totales, impuestos y descuentos

## Modelos de Datos a Implementar

Según el schema de Prisma definido, trabajaremos con los siguientes modelos:

1. **Order**: Representa un pedido completo con sus datos generales
2. **OrderItem**: Representa cada producto individual dentro de un pedido
3. **OrderItemCustomization**: Almacena las personalizaciones de cada ítem
4. **OrderStatusHistory**: Registra el historial de cambios de estado de un pedido

## Archivos a Desarrollar

Basándonos en la arquitectura modular por dominios, necesitaremos implementar los siguientes archivos:

### Capa de Tipos/DTOs

```typescript
src/types/order.ts
```

Contendrá las interfaces TypeScript para:

- Tipos de estados de pedido (enum OrderStatus)
- Tipos de métodos de pago (enum PaymentMethod)
- DTOs para creación, actualización y respuesta de pedidos
- DTOs para items de pedido y personalizaciones

### Capa de Servicios

```typescript
src/services/order/orderService.ts
src/services/order/orderItemService.ts
src/services/order/orderStatusService.ts
```

Encapsularán la lógica de negocio para:

- Creación, consulta, actualización y cancelación de pedidos
- Gestión de items dentro de un pedido
- Transiciones de estado y validaciones correspondientes
- Cálculo de totales, impuestos y descuentos

### Capa de Controladores

```typescript
src/controllers/order/orderController.ts
src/controllers/order/orderItemController.ts
src/controllers/order/orderStatusController.ts
```

Manejarán las solicitudes HTTP para:

- Endpoints CRUD de pedidos
- Endpoints para gestionar items dentro de un pedido
- Endpoints para cambios de estado y seguimiento

### Capa de Validadores

```typescript
src/middleware/validation/orderValidators.ts
```

Implementará reglas de validación para:

- Creación de pedidos
- Actualización de pedidos
- Transiciones de estado válidas
- Validación de items y personalizaciones

### Capa de Rutas

```typescript
src/routes/orderRoutes.ts
```

Definirá los endpoints disponibles y aplicará los middlewares necesarios.

## Plan de Trabajo Detallado

### 1. Definición de Tipos y DTOs (3 días)

#### Actividades

- Definir enums para estados de pedido y métodos de pago
- Crear interfaces para DTO de pedidos
- Crear interfaces para DTO de items y personalizaciones
- Definir tipos para cálculos de precios y totales
- Documentar cada tipo con JSDoc

#### Entregables

- Archivo `src/types/order.ts` completo y documentado

### 2. Implementación de Servicios (7 días)

***Actividades***

***Order Service (4 días)***

- Implementar método de creación de pedidos
- Implementar consulta de pedidos con filtros
- Implementar actualización de datos básicos
- Implementar lógica de cálculo de totales
- Implementar sistema de cancelación

***Order Item Service (2 días)***

- Implementar gestión de items dentro de un pedido
- Implementar lógica para añadir/eliminar items
- Implementar actualización de cantidades

***Order Status Service (1 día)***

- Implementar sistema de transiciones de estado
- Implementar validación de cambios de estado permitidos
- Implementar registro de historial de cambios

***Entregables***

- Servicios implementados con tests unitarios
- Documentación de funciones y lógica de negocio

### 3. Implementación de Controladores (5 días)

***Actividades***

***Order Controller (3 días)***

- Implementar endpoint para creación de pedidos
- Implementar endpoints de consulta (listado, detalle)
- Implementar endpoint de actualización
- Implementar endpoint de cancelación

***Order Item Controller (1 día)***

- Implementar endpoints para gestión de items
- Implementar manejo de errores específicos

***Order Status Controller (1 día)***

- Implementar endpoint para cambio de estado
- Implementar endpoint para consulta de historial

***Entregables***

- Controladores implementados con manejo de errores
- Documentación de endpoints y respuestas

### 4. Implementación de Validadores (2 días)

***Actividades***

- Desarrollar reglas de validación para creación de pedidos
- Implementar validación de transiciones de estado
- Implementar validación de datos de pago
- Implementar validación de direcciones de entrega

***Entregables***

- Middleware de validación implementado
- Tests para escenarios de validación

### 5. Implementación de Rutas (1 día)

***Actividades***

- Definir rutas para todos los endpoints de pedidos
- Aplicar middleware de autenticación y autorización
- Aplicar validadores a las rutas correspondientes
- Integrar en el sistema de rutas principal

***Entregables***

- Archivo de rutas implementado
- Documentación de endpoints disponibles

### 6. Pruebas de Integración (3 días)

***Actividades***

- Desarrollar pruebas para el flujo completo de pedidos
- Probar escenarios de cálculo de precios
- Probar transiciones de estado válidas e inválidas
- Probar consultas filtradas y ordenadas

***Entregables***

- Suite de pruebas de integración
- Documentación de casos de prueba

### 7. Documentación y Finalización (2 días)

***Actividades***

- Completar documentación de API
- Documentar flujos de trabajo y estados
- Actualizar README con información del nuevo módulo
- Revisar y refinar implementación

***Entregables***

- Documentación actualizada
- Pull request listo para revisión

## Estructura de Endpoints a Implementar

### Pedidos

- `GET /api/orders` - Listar pedidos con filtros
  - Query params: status, dateFrom, dateTo, customerId, etc.
  - Respuesta paginada

- `GET /api/orders/:id` - Obtener detalles de un pedido específico
  - Incluye items, personalizaciones, historial de estados

- `POST /api/orders` - Crear un nuevo pedido
  - Requiere autenticación
  - Valida productos, dirección, método de pago

- `PUT /api/orders/:id` - Actualizar datos de un pedido
  - Limitado a campos específicos según el estado
  - Requiere autenticación y autorización

- `POST /api/orders/:id/status` - Cambiar el estado de un pedido
  - Valida transiciones permitidas
  - Registra en historial
  - Requiere autorización según el nuevo estado

- `DELETE /api/orders/:id` - Cancelar un pedido
  - Solo permitido en ciertos estados
  - Registro de motivo de cancelación
  - Requiere autorización

### Items de Pedido

- `POST /api/orders/:id/items` - Añadir item a un pedido existente
  - Solo disponible en ciertos estados
  - Recalcula totales

- `PUT /api/orders/:id/items/:itemId` - Actualizar un item
  - Actualización de cantidad o personalizaciones
  - Recalcula totales

- `DELETE /api/orders/:id/items/:itemId` - Eliminar un item
  - Solo disponible en ciertos estados
  - Recalcula totales

### Historial de Estados

- `GET /api/orders/:id/history` - Ver historial de cambios de estado
  - Incluye timestamps y usuario que realizó el cambio

## Reglas de Negocio Importantes

### Estados de Pedido

Implementar las transiciones permitidas según este diagrama:

```typescript
PENDING → CONFIRMED → PREPARING → READY → ASSIGNED → IN_TRANSIT → DELIVERED
    ↓                    ↓           ↓        ↓           ↓            ↓
CANCELLED            CANCELLED    CANCELLED  CANCELLED  CANCELLED   CANCELLED
```

### Cálculos de Precios

- Subtotal: Suma de (precio unitario × cantidad) para cada item
- Impuestos: Porcentaje configurable sobre el subtotal
- Costo de envío: Basado en la zona de entrega
- Descuentos: Aplicados según reglas de promoción
- Total: Subtotal + Impuestos + Costo de envío - Descuentos

### Reglas de Validación

- Un pedido debe tener al menos un item
- Dirección de entrega obligatoria para pedidos con envío
- Método de pago válido requerido
- Solo usuarios autorizados pueden cambiar ciertos estados
- Ciertas transiciones de estado requieren datos adicionales

## Integración con Otros Módulos

### Integración con Sistema de Menú (ya implementado)

- Validación de productos existentes y disponibles
- Verificación de precios actuales
- Obtención de información de categoría y personalización

### Preparación para Integración con Sistema de Clientes (próxima etapa)

- Estructura para asociar pedidos a clientes
- Campos para gestionar direcciones de entrega

### Preparación para Integración con Sistema de Entregas (próxima etapa)

- Estados relacionados con la asignación y seguimiento
- Campos para asociar repartidores

## Consideraciones Técnicas

### Transacciones de Base de Datos

- Usar transacciones para operaciones que afecten múltiples tablas
- Ejemplo: crear pedido con sus items y personalizaciones

### Optimización de Consultas

- Crear índices adecuados en tabla de pedidos (por estado, cliente, fechas)
- Implementar paginación eficiente para listados

### Concurrencia

- Manejar posibles condiciones de carrera en cambios de estado
- Implementar bloqueos optimistas para actualizaciones

## Estimación de Tiempos

| Tarea | Días Estimados |
|-------|----------------|
| Definición de Tipos y DTOs | 3 |
| Implementación de Servicios | 7 |
| Implementación de Controladores | 5 |
| Implementación de Validadores | 2 |
| Implementación de Rutas | 1 |
| Pruebas de Integración | 3 |
| Documentación y Finalización | 2 |
| **Total** | **23 días hábiles** |

## Criterios de Aceptación

- Todos los endpoints implementados y documentados
- Pruebas unitarias para servicios con cobertura >80%
- Pruebas de integración para flujos principales
- Validación correcta de transiciones de estado
- Cálculo preciso de totales, impuestos y descuentos
- Manejo adecuado de errores con mensajes descriptivos
- Integración correcta con el sistema de menú existente

## Riesgos y Mitigación

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Complejidad en el cálculo de precios | Alto | Media | Desarrollar tests específicos para diversos escenarios |
| Inconsistencias en transiciones de estado | Alto | Media | Implementar máquina de estados formal con validaciones estrictas |
| Rendimiento en consultas complejas | Medio | Baja | Diseñar índices adecuados desde el inicio |
| Integridad referencial con otros módulos | Medio | Media | Usar transacciones y validaciones a nivel de servicio |

## Conclusión

La implementación del sistema de pedidos representa un hito crucial en el desarrollo del backend del restaurante. Este módulo constituye el núcleo funcional del negocio y sentará las bases para las próximas etapas de desarrollo.

Al finalizar esta etapa, el sistema será capaz de gestionar el ciclo de vida completo de los pedidos, desde su creación hasta su entrega, con todas las validaciones y cálculos necesarios. La arquitectura modular por dominios nos permitirá evolucionar y extender esta funcionalidad en etapas posteriores.
