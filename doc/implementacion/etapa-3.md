# Plan de Implementación: Etapa 3 - Sistema de Pedidos

## Introducción

La Etapa 3 del desarrollo del backend para el sistema de restaurante se centra en la implementación del núcleo del sistema de pedidos. Este componente es crucial ya que representa la funcionalidad central del negocio: la gestión completa del ciclo de vida de los pedidos desde su creación hasta su entrega.

Esta etapa se construirá sobre las bases establecidas en las etapas anteriores (Etapa 1: Fundamentos y Categorías, y Etapa 2: Sistema de Menú y Autenticación), manteniendo la arquitectura modular por dominios y siguiendo los patrones de diseño ya implementados.

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

La implementación de esta etapa requiere la creación y modificación de los siguientes archivos, organizados según la arquitectura modular por dominios:

### 1. Definiciones de Tipos

- `src/types/order.ts`
  - Enums: OrderStatus, PaymentMethod, PaymentStatus
  - Interfaces para DTOs de Order, OrderItem, OrderItemCustomization
  - Tipos para filtros, cálculos y respuestas

### 2. Servicios

- `src/services/order/orderService.ts`
  - Métodos CRUD para pedidos
  - Lógica de transiciones de estado
  - Cálculo de totales, impuestos y descuentos
  
- `src/services/order/orderItemService.ts`
  - Gestión de ítems dentro de un pedido
  - Adición, eliminación y actualización de ítems
  - Cálculo de subtotales por ítem
  
- `src/services/order/orderStatusService.ts`
  - Validación de transiciones de estado
  - Registro de historial de cambios
  - Lógica específica por estado

### 3. Controladores

- `src/controllers/order/orderController.ts`
  - Endpoints para CRUD de pedidos
  - Manejo de respuestas y errores específicos
  
- `src/controllers/order/orderItemController.ts`
  - Endpoints para gestión de ítems en pedidos
  
- `src/controllers/order/orderStatusController.ts`
  - Endpoints para cambios de estado
  - Endpoints para consulta de historial

### 4. Validadores

- `src/middleware/validation/orderValidators.ts`
  - Reglas para validación de datos de pedidos
  - Validación de transiciones de estado
  - Validación de items y personalizaciones

### 5. Rutas

- `src/routes/orderRoutes.ts`
  - Definición de endpoints
  - Aplicación de middleware de autenticación y autorización
  - Integración con validadores

### 6. Tests

- `tests/unit/services/order/orderService.test.ts`
- `tests/unit/services/order/orderItemService.test.ts`
- `tests/unit/services/order/orderStatusService.test.ts`
- `tests/integration/api/orders.test.ts`

### 7. Actualizaciones de Archivos Existentes

- `src/app.ts` - Integración de nuevas rutas
- `prisma/schema.prisma` - Verificación/actualización de modelos de pedidos

## Plan de Trabajo Detallado

### Fase 1: Preparación y Planificación (2 días)

1. **Revisión de Modelos de Datos**
   - Verificar que los modelos en `schema.prisma` están correctamente definidos
   - Validar relaciones entre modelos (Order-OrderItem-MenuItem, etc.)
   - Confirmar tipos de datos y validaciones a nivel de base de datos

2. **Definición de Flujos de Trabajo**
   - Documentar el ciclo de vida completo de un pedido
   - Definir todas las transiciones de estado válidas
   - Establecer reglas de negocio para cálculos y validaciones

### Fase 2: Implementación de Tipos y Servicios (7 días)

1. **Creación de Tipos y DTOs**
   - Implementar enums para estados y métodos de pago
   - Crear interfaces para DTOs de entrada y salida
   - Definir tipos para filtros y cálculos

2. **Implementación de Servicios**
   - Desarrollar `orderService.ts` con lógica de negocio para pedidos
   - Implementar `orderItemService.ts` para gestión de ítems
   - Crear `orderStatusService.ts` para manejo de estados y transiciones
   - Implementar cálculos de precios, impuestos y descuentos
   - Desarrollar validaciones a nivel de servicio

### Fase 3: Desarrollo de Controladores y API (5 días)

1. **Implementación de Controladores**
   - Desarrollar `orderController.ts` para endpoints principales
   - Implementar `orderItemController.ts` para gestión de ítems
   - Crear `orderStatusController.ts` para cambios de estado
   - Manejar respuestas y errores específicos

2. **Implementación de Validadores**
   - Crear reglas de validación para datos de entrada
   - Implementar validación de transiciones de estado
   - Desarrollar validaciones para dirección, pago, etc.

3. **Configuración de Rutas**
   - Definir todos los endpoints del sistema de pedidos
   - Aplicar middleware de autenticación y autorización
   - Integrar validadores en las rutas

### Fase 4: Pruebas y Documentación (5 días)

1. **Desarrollo de Tests Unitarios**
   - Crear tests para servicios
   - Probar casos de éxito y error
   - Validar cálculos y transiciones de estado

2. **Desarrollo de Tests de Integración**
   - Probar el flujo completo de pedidos
   - Verificar endpoints y respuestas
   - Validar autenticación y autorización

3. **Documentación**
   - Actualizar documentación de API
   - Documentar flujos de trabajo y estados
   - Crear guía de uso del sistema de pedidos

### Fase 5: Integración y Revisión (4 días)

1. **Integración con Módulos Existentes**
   - Asegurar correcto funcionamiento con sistema de menú
   - Verificar integración con autenticación
   - Pruebas de integración completa

2. **Refinamiento y Optimización**
   - Revisión de código y optimizaciones
   - Mejora de consultas y rendimiento
   - Revisión de seguridad

3. **Preparación para Despliegue**
   - Actualización de migraciones
   - Verificación de configuración
   - Pruebas finales

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

## Reglas de Negocio Importantes

### Estados de Pedido

El sistema implementará las siguientes transiciones de estado:

- PENDING → CONFIRMED → PREPARING → READY → ASSIGNED → IN_TRANSIT → DELIVERED
- Cualquier estado puede transicionar a CANCELLED con las validaciones adecuadas

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

## Consideraciones Técnicas

### Transacciones de Base de Datos

- Implementar transacciones para operaciones que afecten múltiples tablas
- Garantizar consistencia en la creación y actualización de pedidos

### Optimización de Consultas

- Crear índices adecuados en la tabla de pedidos
- Implementar filtrado y paginación eficiente

### Seguridad

- Validar permisos según roles (ADMIN, MANAGER, STAFF, etc.)
- Implementar reglas de negocio para acceso a pedidos

### Manejo de Errores

- Implementar errores específicos del dominio
- Proporcionar mensajes descriptivos para facilitar depuración

## Estimación de Tiempo

| Fase | Duración Estimada |
|------|-------------------|
| Preparación y Planificación | 2 días |
| Implementación de Tipos y Servicios | 7 días |
| Desarrollo de Controladores y API | 5 días |
| Pruebas y Documentación | 5 días |
| Integración y Revisión | 4 días |
| **Total** | **23 días hábiles** |

## Criterios de Aceptación

1. Todos los endpoints implementados y funcionando correctamente
2. Transiciones de estado funcionando según reglas de negocio
3. Cálculos de precios, impuestos y descuentos precisos
4. Tests unitarios y de integración pasando con >80% de cobertura
5. Documentación completa y actualizada
6. Integración correcta con módulos existentes
7. Rendimiento adecuado en consultas con volumen de datos realista

## Riesgos y Mitigación

1. **Complejidad en cálculos de precios**
   - Mitigación: Implementar tests exhaustivos para diversos escenarios

2. **Inconsistencias en transiciones de estado**
   - Mitigación: Utilizar máquina de estados formal con validaciones estrictas

3. **Rendimiento en consultas complejas**
   - Mitigación: Diseñar índices adecuados y optimizar consultas desde el inicio

4. **Integridad referencial con otros módulos**
   - Mitigación: Implementar transacciones y validaciones completas

## Conclusión

La implementación del sistema de pedidos representa una etapa crucial en el desarrollo del backend del restaurante. Este módulo constituye el núcleo funcional del negocio y sentará las bases para las próximas etapas como el sistema de clientes y el sistema de entregas.

La arquitectura modular por dominios ya establecida facilitará la implementación progresiva y la evolución del sistema, permitiendo la integración fluida de nuevas funcionalidades en el futuro.

Una vez completada esta etapa, el sistema podrá gestionar el ciclo de vida completo de los pedidos, desde su creación hasta su entrega, con todas las validaciones y cálculos necesarios para el funcionamiento correcto de un sistema de restaurante con delivery.
