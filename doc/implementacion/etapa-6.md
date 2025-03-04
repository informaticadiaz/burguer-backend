# Plan de Implementación: Etapa 6 - Sistema de Inventario y Proveedores

## Introducción

El sistema de inventario y proveedores constituye un componente fundamental para la gestión eficiente del restaurante, permitiendo controlar los insumos necesarios para la operación diaria, evitar pérdidas por falta de stock y optimizar la relación con los proveedores. Esta etapa permitirá al restaurante mantener un registro detallado de sus ingredientes, realizar un seguimiento de su uso, gestionar las compras y mantener relaciones organizadas con sus proveedores.

Este documento presenta el plan detallado para implementar la Etapa 6 del sistema de backend para el restaurante, siguiendo la arquitectura modular por dominios establecida en las etapas anteriores.

## Objetivos de la Etapa 6

1. Implementar el sistema de gestión de inventario
2. Desarrollar el módulo de administración de proveedores
3. Crear la funcionalidad de registro de transacciones de inventario
4. Implementar la relación entre ingredientes y productos del menú
5. Desarrollar alertas de stock bajo
6. Establecer el sistema de reportes de inventario

## Modelos de Datos a Implementar

Según el schema de Prisma definido, en esta etapa trabajaremos con los siguientes modelos:

1. **InventoryItem**: Representa cada ingrediente o insumo inventariable
2. **Supplier**: Almacena la información de proveedores
3. **InventoryTransaction**: Registra los movimientos de inventario (compras, usos, ajustes)
4. **InventoryUsage**: Define la relación entre productos del menú y los ingredientes que los componen

## Archivos a Desarrollar

### Capa de Tipos/DTOs

```
src/types/inventory.ts
```
Definirá las interfaces para:
- Tipos de transacciones (enum TransactionType)
- DTOs para la creación, actualización y consulta de items de inventario
- DTOs para la gestión de proveedores
- DTOs para el registro de transacciones
- DTOs para la relación entre productos e ingredientes

### Capa de Servicios

```
src/services/inventory/inventoryItemService.ts
src/services/inventory/supplierService.ts
src/services/inventory/transactionService.ts
src/services/inventory/inventoryUsageService.ts
src/services/inventory/reportService.ts
```

Encapsularán la lógica de negocio para:
- Gestión completa de ingredientes y suministros
- Administración de proveedores
- Registro y consulta de transacciones de inventario
- Configuración de relaciones entre ingredientes y productos
- Generación de reportes e indicadores de inventario

### Capa de Controladores

```ts
src/controllers/inventory/inventoryItemController.ts
src/controllers/inventory/supplierController.ts
src/controllers/inventory/transactionController.ts
src/controllers/inventory/inventoryUsageController.ts
src/controllers/inventory/reportController.ts
```

Manejarán las solicitudes HTTP para:

- Endpoints CRUD de items de inventario
- Endpoints CRUD de proveedores
- Endpoints para registro y consulta de transacciones
- Endpoints para gestión de relaciones entre productos e ingredientes
- Endpoints para reportes e indicadores

### Capa de Validadores

```ts
src/middleware/validation/inventoryValidators.ts
src/middleware/validation/supplierValidators.ts
src/middleware/validation/transactionValidators.ts
```

Implementarán reglas de validación para:

- Creación y actualización de items de inventario
- Gestión de proveedores
- Registro de transacciones con validaciones específicas por tipo

### Capa de Rutas

```ts
src/routes/inventoryRoutes.ts
```

Definirá todos los endpoints disponibles para el sistema de inventario y aplicará los middlewares correspondientes.

## Plan de Trabajo Detallado

### 1. Definición de Tipos y DTOs (4 días)

#### Actividades

- Definir enums para tipos de transacciones y unidades de medida
- Crear interfaces para DTO de items de inventario
- Crear interfaces para DTO de proveedores
- Definir interfaces para DTO de transacciones
- Desarrollar interfaces para la relación entre productos e ingredientes
- Documentar cada tipo con JSDoc

#### Entregables

- Archivo `src/types/inventory.ts` completo y documentado

### 2. Implementación de Servicios (10 días)

#### Actividades

##### Inventory Item Service (3 días)

- Implementar CRUD completo para items de inventario
- Desarrollar sistema de alertas de stock bajo
- Implementar búsqueda con filtros (por nombre, categoría, nivel de stock)
- Integrar con sistema de transacciones para actualización automática

##### Supplier Service (2 días)

- Implementar CRUD completo para proveedores
- Desarrollar búsqueda y filtrado de proveedores
- Implementar relación con items de inventario

##### Transaction Service (3 días)

- Implementar registro de diferentes tipos de transacciones
- Desarrollar lógica para actualización de niveles de stock
- Implementar validaciones según tipo de transacción
- Desarrollar consultas con filtros por fecha, tipo, item

##### Inventory Usage Service (1 día)

- Implementar configuración de relaciones entre productos e ingredientes
- Desarrollar cálculo de uso de inventario por producto vendido
- Integrar con sistema de pedidos para descuento automático de stock

##### Report Service (1 día)

- Implementar generación de reportes de inventario
- Desarrollar cálculo de rotación de inventario
- Implementar proyecciones de compra basadas en tendencias de uso

#### Entregables

- Servicios implementados con tests unitarios
- Documentación de funciones y lógica de negocio

### 3. Implementación de Controladores (8 días)

#### Actividades

##### Inventory Item Controller (2 días)

- Implementar endpoints CRUD para items de inventario
- Desarrollar endpoints para búsqueda con filtros
- Implementar endpoint para alertas de stock bajo

##### Supplier Controller (1 día)

- Implementar endpoints CRUD para proveedores
- Desarrollar endpoints de búsqueda con filtros
- Implementar endpoint para consulta de items por proveedor

##### Transaction Controller (2 días)

- Implementar endpoints para registro de diferentes tipos de transacciones
- Desarrollar endpoints de consulta con filtros
- Implementar endpoint para historial de transacciones por item

##### Inventory Usage Controller (1 día)

- Implementar endpoints para configuración de uso de ingredientes por producto
- Desarrollar endpoint para cálculo de costo de productos
- Implementar endpoint para impacto de ventas en inventario

##### Report Controller (2 días)

- Implementar endpoints para reportes predefinidos
- Desarrollar endpoints para métricas e indicadores
- Implementar endpoints para proyecciones y tendencias

#### Entregables

- Controladores implementados con manejo de errores
- Documentación de endpoints y respuestas

### 4. Implementación de Validadores (3 días)

#### Actividades

- Desarrollar reglas de validación para items de inventario
- Implementar validación para proveedores
- Desarrollar validaciones específicas para cada tipo de transacción
- Implementar validación para relaciones entre productos e ingredientes

#### Entregables

- Middleware de validación implementado
- Tests para escenarios de validación

### 5. Implementación de Rutas (2 días)

#### Actividades
- Definir rutas para todos los endpoints de inventario
- Aplicar middleware de autenticación y autorización
- Aplicar validadores a las rutas correspondientes
- Integrar en el sistema de rutas principal

#### Entregables
- Archivo de rutas implementado
- Documentación de endpoints disponibles

### 6. Pruebas de Integración (4 días)

#### Actividades
- Desarrollar pruebas para flujos completos de gestión de inventario
- Probar escenarios de transacciones y actualizaciones de stock
- Probar integración entre productos vendidos y descuento de inventario
- Probar generación de reportes y alertas

#### Entregables
- Suite de pruebas de integración
- Documentación de casos de prueba

### 7. Documentación y Finalización (3 días)

#### Actividades
- Completar documentación de API
- Documentar flujos de trabajo y lógica de inventario
- Actualizar README con información del nuevo módulo
- Revisar y refinar implementación

#### Entregables
- Documentación actualizada
- Pull request listo para revisión

## Estructura de Endpoints a Implementar

### Ítems de Inventario

- `GET /api/inventory` - Listar ítems de inventario con filtros
  - Query params: name, category, minStock, maxStock, supplier
  - Respuesta paginada

- `GET /api/inventory/:id` - Obtener detalles de un ítem específico
  - Incluye información de proveedor, historial de transacciones

- `POST /api/inventory` - Crear un nuevo ítem de inventario
  - Requiere autenticación y autorización (ADMIN, INVENTORY_MANAGER)
  - Valida datos básicos y unidad de medida

- `PUT /api/inventory/:id` - Actualizar datos de un ítem
  - Requiere autenticación y autorización
  - Permite actualizar datos descriptivos y configuración

- `GET /api/inventory/low-stock` - Obtener ítems con stock bajo
  - Basado en niveles mínimos configurados
  - Opción para agrupar por proveedor

### Proveedores

- `GET /api/suppliers` - Listar proveedores con filtros
  - Query params: name, isActive, product
  - Respuesta paginada

- `GET /api/suppliers/:id` - Obtener detalles de un proveedor
  - Incluye productos suministrados

- `POST /api/suppliers` - Crear un nuevo proveedor
  - Requiere autenticación y autorización
  - Valida información de contacto

- `PUT /api/suppliers/:id` - Actualizar datos de un proveedor
  - Requiere autenticación y autorización
  - Permite actualizar información de contacto y estado

- `GET /api/suppliers/:id/inventory` - Obtener ítems suministrados por un proveedor
  - Respuesta paginada con filtros adicionales

### Transacciones

- `GET /api/inventory/transactions` - Listar transacciones con filtros
  - Query params: dateFrom, dateTo, type, itemId
  - Respuesta paginada

- `POST /api/inventory/transactions` - Registrar una nueva transacción
  - Requiere autenticación y autorización
  - Diferente validación según tipo (compra, uso, ajuste)
  - Actualiza automáticamente el stock del ítem

- `GET /api/inventory/:id/transactions` - Obtener historial de transacciones para un ítem
  - Respuesta paginada con filtros por tipo y fecha

### Uso de Inventario

- `GET /api/menu-items/:id/inventory` - Obtener ingredientes usados por un producto
  - Detalle de cantidades y costos

- `POST /api/menu-items/:id/inventory` - Configurar ingredientes para un producto
  - Requiere autenticación y autorización
  - Valida existencia de ingredientes y cantidades

- `PUT /api/menu-items/:id/inventory/:itemId` - Actualizar cantidad de un ingrediente
  - Requiere autenticación y autorización
  - Valida cantidad y disponibilidad

### Reportes

- `GET /api/inventory/reports/usage` - Obtener reporte de uso de inventario
  - Filtros por período, categoría, proveedor
  - Agrupación por producto, categoría o período

- `GET /api/inventory/reports/cost` - Obtener reporte de costos
  - Análisis de costos de inventario y productos
  - Tendencias y comparativas

- `GET /api/inventory/reports/projections` - Obtener proyecciones de consumo
  - Basado en histórico de ventas y uso
  - Sugerencias de compra

## Reglas de Negocio Importantes

### Gestión de Stock

- El stock debe actualizarse automáticamente con cada transacción registrada
- Los niveles de stock nunca deben ser negativos (excepto ajustes específicos)
- Cada ítem debe tener un nivel mínimo configurable para alertas
- El stock actual debe calcularse sumando todas las transacciones

### Tipos de Transacciones

Implementar validaciones específicas para cada tipo de transacción:

- **PURCHASE**: Incrementa stock, requiere proveedor y costo unitario
- **USAGE**: Decrementa stock, puede asociarse a un pedido específico
- **ADJUSTMENT**: Incrementa o decrementa stock, requiere justificación
- **WASTE**: Decrementa stock, requiere motivo (vencimiento, daño, etc.)
- **RETURN**: Incrementa stock, referencia a una compra anterior

### Cálculo de Costos

- Costo promedio ponderado para cada ítem basado en compras
- Costo de producto calculado sumando el costo de sus ingredientes
- Actualización automática de costos tras nuevas compras

### Relación con Productos

- Un producto puede requerir múltiples ingredientes en cantidades específicas
- La venta de un producto debe descontar automáticamente sus ingredientes
- Se debe validar disponibilidad de inventario antes de confirmar pedidos

## Integración con Otros Módulos

### Integración con Sistema de Menú (existente)
- Vinculación entre productos y sus ingredientes
- Cálculo de costo real de cada producto
- Verificación de disponibilidad basada en inventario

### Integración con Sistema de Pedidos (existente)
- Descuento automático de ingredientes al confirmar pedidos
- Validación de stock suficiente antes de aceptar pedidos
- Registro de uso de inventario vinculado a pedidos específicos

### Preparación para Integración con Reportes (etapa futura)
- Estructura para cálculo de márgenes reales basados en costos
- Datos para análisis de rentabilidad por producto
- Información para proyecciones y planificación

## Consideraciones Técnicas

### Transacciones de Base de Datos
- Usar transacciones para garantizar la integridad en actualizaciones de stock
- Asegurar atomicidad en operaciones que afecten múltiples registros

### Optimización de Consultas
- Crear índices adecuados en tablas de inventario y transacciones
- Optimizar consultas para reportes que pueden ser intensivos

### Concurrencia
- Manejar posibles condiciones de carrera en actualizaciones de stock
- Implementar bloqueos optimistas para prevenir inconsistencias

### Seguridad
- Restringir acciones críticas a roles específicos (ADMIN, INVENTORY_MANAGER)
- Mantener un registro detallado de todas las transacciones para auditoría

## Estimación de Tiempos

| Tarea | Días Estimados |
|-------|----------------|
| Definición de Tipos y DTOs | 4 |
| Implementación de Servicios | 10 |
| Implementación de Controladores | 8 |
| Implementación de Validadores | 3 |
| Implementación de Rutas | 2 |
| Pruebas de Integración | 4 |
| Documentación y Finalización | 3 |
| **Total** | **34 días hábiles** |

## Criterios de Aceptación

- Todos los endpoints implementados y documentados
- Sistema capaz de mantener registro preciso del inventario
- Integración correcta con sistemas de menú y pedidos
- Alertas de stock bajo funcionando correctamente
- Transacciones registrando adecuadamente todos los movimientos
- Cálculos de costos precisos y actualizados
- Reportes proporcionando información útil para toma de decisiones
- Tests cubriendo los principales flujos y casos de borde

## Riesgos y Mitigación

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Complejidad en transacciones concurrentes | Alto | Media | Implementar bloqueos optimistas y tests específicos |
| Inconsistencias en cálculo de stock | Alto | Media | Desarrollar validaciones cruzadas y conciliaciones automáticas |
| Rendimiento en reportes complejos | Medio | Alta | Diseñar consultas optimizadas y considerar agregaciones precalculadas |
| Dificultad en la integración con pedidos | Alto | Media | Definir claramente interfaces y desarrollar tests exhaustivos |
| Errores en descuento automático de inventario | Alto | Media | Implementar sistema de logs detallados y capacidad de rectificación |

## Lista Completa de Archivos a Implementar

### Tipos y DTOs
1. `src/types/inventory.ts`

### Servicios
2. `src/services/inventory/inventoryItemService.ts`
3. `src/services/inventory/supplierService.ts`
4. `src/services/inventory/transactionService.ts`
5. `src/services/inventory/inventoryUsageService.ts`
6. `src/services/inventory/reportService.ts`

### Controladores
7. `src/controllers/inventory/inventoryItemController.ts`
8. `src/controllers/inventory/supplierController.ts`
9. `src/controllers/inventory/transactionController.ts`
10. `src/controllers/inventory/inventoryUsageController.ts`
11. `src/controllers/inventory/reportController.ts`

### Validadores
12. `src/middleware/validation/inventoryValidators.ts`
13. `src/middleware/validation/supplierValidators.ts`
14. `src/middleware/validation/transactionValidators.ts`

### Rutas
15. `src/routes/inventoryRoutes.ts`

### Tests
16. `src/tests/unit/services/inventory/inventoryItemService.test.ts`
17. `src/tests/unit/services/inventory/supplierService.test.ts`
18. `src/tests/unit/services/inventory/transactionService.test.ts`
19. `src/tests/unit/services/inventory/inventoryUsageService.test.ts`
20. `src/tests/unit/services/inventory/reportService.test.ts`
21. `src/tests/integration/api/inventory.test.ts`
22. `src/tests/integration/api/suppliers.test.ts`
23. `src/tests/integration/api/inventoryTransactions.test.ts`

### Documentación
24. `docs/api/inventory.md`
25. `docs/guides/inventory-management.md`

## Conclusión

La implementación del sistema de inventario y proveedores representa un componente crítico para la gestión eficiente del restaurante. Este módulo permitirá controlar los costos, evitar pérdidas por falta de stock, y optimizar las relaciones con proveedores. 

Al finalizar esta etapa, el sistema tendrá la capacidad de gestionar inventario de manera integral, con un registro detallado de todos los movimientos, cálculo preciso de costos, y la generación de reportes para la toma de decisiones. La arquitectura modular por dominios facilitará la integración con los módulos existentes y la extensión hacia funcionalidades futuras.

Esta etapa impactará positivamente en la rentabilidad del negocio al permitir un mejor control de costos y una gestión más eficiente de los recursos.