# Plan de Implementación: Etapa 5 - Sistema de Entregas

## Introducción

La Etapa 5 del desarrollo del backend para el sistema de restaurante se centra en implementar el Sistema de Entregas, un componente vital que permitirá gestionar repartidores, zonas de entrega, asignación de pedidos y seguimiento de entregas. Esta etapa se integrará con el Sistema de Pedidos desarrollado previamente, permitiendo que los pedidos pasen de estar "listos" a ser "entregados" a través de un flujo gestionado por repartidores.

Este documento describe el plan detallado para implementar el Sistema de Entregas siguiendo la arquitectura modular por dominios establecida en el proyecto.

## Objetivos de la Etapa 5

1. Implementar la gestión completa de repartidores (altas, bajas, modificaciones)
2. Desarrollar el sistema de zonas de entrega con costos asociados
3. Crear el flujo de asignación de pedidos a repartidores
4. Implementar el seguimiento en tiempo real de pedidos en tránsito
5. Desarrollar el sistema de calificaciones para repartidores
6. Integrar con el Sistema de Pedidos existente

## Modelos de Datos a Implementar

Trabajaremos con los siguientes modelos definidos en el schema de Prisma:

1. **DeliveryDriver**: Información de los repartidores
2. **DeliveryZone**: Zonas geográficas de entrega con costos asociados
3. **DriverDeliveryZone**: Relación entre repartidores y zonas que cubren
4. **DriverRating**: Calificaciones de los repartidores

## Archivos a Desarrollar

### Capa de Tipos/DTOs

```ts
src/types/delivery.ts
```

Contendrá las interfaces TypeScript para:

- Enumeración de estados de repartidor (enum DriverStatus)
- DTOs para creación, actualización y respuesta de repartidores
- DTOs para zonas de entrega
- DTOs para calificaciones de repartidores

### Capa de Servicios

```ts
src/services/delivery/driverService.ts
src/services/delivery/zoneService.ts
src/services/delivery/assignmentService.ts
src/services/delivery/ratingService.ts
```

Implementarán la lógica de negocio para:

- Gestión de repartidores (CRUD)
- Gestión de zonas de entrega
- Asignación y seguimiento de pedidos
- Gestión de calificaciones de repartidores

### Capa de Controladores

```ts
src/controllers/delivery/driverController.ts
src/controllers/delivery/zoneController.ts
src/controllers/delivery/assignmentController.ts
src/controllers/delivery/ratingController.ts
```

Manejarán las solicitudes HTTP para:

- Endpoints de repartidores
- Endpoints de zonas de entrega
- Endpoints de asignación y seguimiento
- Endpoints de calificación

### Capa de Validadores

```ts
src/middleware/validation/delivery/driverValidators.ts
src/middleware/validation/delivery/zoneValidators.ts
src/middleware/validation/delivery/assignmentValidators.ts
src/middleware/validation/delivery/ratingValidators.ts
```

Implementarán reglas de validación para:

- Datos de repartidores
- Definición de zonas de entrega
- Asignación de pedidos
- Calificaciones y reseñas

### Capa de Rutas

```ts
src/routes/deliveryRoutes.ts
```

Definirá todos los endpoints relacionados con entregas.

## Plan de Trabajo Detallado

### 1. Definición de Tipos y DTOs (3 días)

#### Actividades

- Definir enumeración de estados de repartidor (AVAILABLE, BUSY, OFFLINE)
- Crear interfaces para DTO de repartidores
- Crear interfaces para DTO de zonas de entrega
- Crear interfaces para DTO de asignación de pedidos
- Crear interfaces para DTO de calificaciones
- Documentar cada tipo con JSDoc

#### Entregables

- Archivo `src/types/delivery.ts` completo y documentado

### 2. Implementación de Servicios (7 días)

#### Actividades

##### Driver Service (2 días)

- Implementar CRUD completo de repartidores
- Implementar funciones para cambio de estado
- Implementar consulta de pedidos asignados a un repartidor
- Implementar funciones de geolocalización básicas

##### Zone Service (2 días)

- Implementar CRUD de zonas de entrega
- Implementar cálculo de costos por zona
- Implementar verificación de dirección en zona
- Implementar asignación de zonas a repartidores

##### Assignment Service (2 días)

- Implementar asignación de pedidos a repartidores
- Implementar algoritmo de selección de repartidor óptimo
- Implementar actualización de estados de entrega
- Implementar registro de tiempos de entrega

##### Rating Service (1 día)

- Implementar sistema de calificaciones
- Implementar cálculo de promedios
- Implementar consulta de calificaciones históricas

#### Entregables

- Servicios implementados con tests unitarios
- Documentación de funciones y lógica de negocio

### 3. Implementación de Controladores (5 días)

#### Actividades

##### Driver Controller (2 días)

- Implementar endpoints CRUD de repartidores
- Implementar endpoint de cambio de estado
- Implementar endpoint para actualizar ubicación
- Implementar endpoint para consultar pedidos asignados

##### Zone Controller (1 día)

- Implementar endpoints CRUD de zonas
- Implementar endpoint para verificar cobertura
- Implementar endpoint para calcular costo de entrega

##### Assignment Controller (1.5 días)

- Implementar endpoint para asignar pedido
- Implementar endpoint para actualizar estado de entrega
- Implementar endpoint para consultar entregas en curso

##### Rating Controller (0.5 días)

- Implementar endpoint para calificar repartidor
- Implementar endpoint para consultar calificaciones

#### Entregables

- Controladores implementados con manejo de errores
- Documentación de endpoints y respuestas

### 4. Implementación de Validadores (2 días)

#### Actividades

- Desarrollar reglas de validación para datos de repartidores
- Implementar validación de zonas geográficas
- Implementar validación de asignaciones
- Implementar validación de calificaciones

#### Entregables

- Middleware de validación implementado
- Tests para escenarios de validación

### 5. Implementación de Rutas (1 día)

#### Actividades

- Definir rutas para todos los endpoints de entregas
- Aplicar middleware de autenticación y autorización
- Aplicar validadores a las rutas correspondientes
- Integrar en el sistema de rutas principal

#### Entregables

- Archivo de rutas implementado
- Documentación de endpoints disponibles

### 6. Integración con Sistema de Pedidos (3 días)

#### Actividades

- Modificar servicio de pedidos para soportar asignación a repartidores
- Implementar transiciones de estado adicionales en pedidos
- Actualizar controladores de pedidos para incluir información de entrega
- Desarrollar funciones de integración entre sistemas

#### Entregables

- Código de integración implementado
- Tests de integración entre sistemas

### 7. Pruebas de Integración (2 días)

#### Actividades

- Desarrollar pruebas para el flujo completo de entrega
- Probar escenarios de asignación y seguimiento
- Probar cálculo de costos por zona
- Probar sistema de calificaciones

#### Entregables

- Suite de pruebas de integración
- Documentación de casos de prueba

### 8. Documentación y Finalización (2 días)

#### Actividades

- Completar documentación de API
- Documentar flujos de trabajo y estados
- Actualizar README con información del nuevo módulo
- Revisar y refinar implementación

#### Entregables

- Documentación actualizada
- Pull request listo para revisión

## Estructura de Endpoints a Implementar

### Repartidores

- `GET /api/delivery/drivers` - Listar repartidores con filtros
  - Query params: status, zone, etc.
  - Respuesta paginada

- `GET /api/delivery/drivers/:id` - Obtener detalles de un repartidor específico
  - Incluye zonas asignadas, calificación promedio

- `POST /api/delivery/drivers` - Crear un nuevo repartidor
  - Requiere autenticación de admin
  - Valida datos personales y de contacto

- `PUT /api/delivery/drivers/:id` - Actualizar datos de un repartidor
  - Requiere autenticación de admin o del propio repartidor
  
- `PUT /api/delivery/drivers/:id/status` - Actualizar estado de un repartidor
  - Transiciones entre AVAILABLE, BUSY, OFFLINE
  - Requiere autenticación del repartidor o admin

- `PUT /api/delivery/drivers/:id/location` - Actualizar ubicación de un repartidor
  - Requiere autenticación del repartidor
  - Valida coordenadas geográficas

- `GET /api/delivery/drivers/:id/orders` - Listar pedidos asignados a un repartidor
  - Filtros por estado, fecha, etc.
  - Requiere autenticación del repartidor o admin

### Zonas de Entrega

- `GET /api/delivery/zones` - Listar zonas de entrega
  - Incluye información de cobertura y costos

- `GET /api/delivery/zones/:id` - Obtener detalles de una zona específica
  - Incluye datos geográficos completos

- `POST /api/delivery/zones` - Crear una nueva zona de entrega
  - Requiere autenticación de admin
  - Valida datos geográficos y costos

- `PUT /api/delivery/zones/:id` - Actualizar una zona de entrega
  - Requiere autenticación de admin

- `DELETE /api/delivery/zones/:id` - Eliminar una zona de entrega
  - Requiere autenticación de admin
  - Verificación de dependencias

- `POST /api/delivery/zones/check-coverage` - Verificar si una dirección está en zona de cobertura
  - Devuelve zona aplicable y costo de entrega

### Asignación y Seguimiento

- `POST /api/delivery/orders/:orderId/assign` - Asignar un pedido a un repartidor
  - Requiere autenticación de admin o manager
  - Opcionalmente selecciona repartidor automáticamente

- `PUT /api/delivery/orders/:orderId/status` - Actualizar estado de entrega
  - Transiciones entre ASSIGNED, IN_TRANSIT, DELIVERED
  - Requiere autenticación del repartidor asignado

- `GET /api/delivery/orders/active` - Listar entregas activas
  - Filtros por zona, repartidor, estado
  - Requiere autenticación de admin o manager

- `GET /api/delivery/orders/:orderId/tracking` - Obtener información de seguimiento
  - Incluye ubicación actual, tiempo estimado

### Calificaciones

- `POST /api/delivery/drivers/:driverId/ratings` - Calificar a un repartidor
  - Requiere autenticación del cliente que recibió el pedido
  - Valida calificación numérica y comentarios

- `GET /api/delivery/drivers/:driverId/ratings` - Obtener calificaciones de un repartidor
  - Incluye estadísticas agregadas
  - Paginación de reseñas

## Reglas de Negocio Importantes

### Estados de Repartidor

Implementar las transiciones permitidas según este diagrama:

```ts
OFFLINE <----> AVAILABLE <----> BUSY
```

Reglas:

- Un repartidor BUSY solo puede pasar a AVAILABLE cuando no tiene pedidos asignados activos
- Un repartidor puede pasar a OFFLINE solo cuando no tiene pedidos asignados activos
- Solo repartidores en estado AVAILABLE pueden recibir nuevas asignaciones

### Asignación de Pedidos

- Solo pedidos en estado READY pueden ser asignados a repartidores
- La asignación automática considera:
  - Repartidores disponibles (AVAILABLE)
  - Cobertura de zona del repartidor
  - Carga actual (número de pedidos activos)
  - Proximidad a la ubicación del restaurante/cliente
  - Calificación del repartidor

### Seguimiento y Actualización de Estados

- Un pedido asignado debe seguir esta secuencia:
  1. ASSIGNED: Repartidor ha aceptado el pedido
  2. IN_TRANSIT: Repartidor ha recogido el pedido y está en camino
  3. DELIVERED: Pedido entregado al cliente

- Cada cambio de estado debe registrar:
  - Timestamp
  - Ubicación geográfica
  - Usuario que realizó el cambio
  - Notas adicionales (opcionales)

### Zonas y Costos de Entrega

- Las zonas se definen como polígonos geográficos en formato GeoJSON
- Cada zona tiene un costo base de entrega
- El costo puede variar según:
  - Distancia (en zonas grandes)
  - Hora del día (horas pico)
  - Condiciones climáticas (opcional)

### Sistema de Calificaciones

- Los clientes pueden calificar al repartidor después de recibir un pedido
- La calificación es de 1 a 5 estrellas
- Se puede incluir un comentario opcional
- Solo se permite una calificación por entrega
- El promedio de calificaciones afecta la prioridad en la asignación automática

## Integración con Otros Módulos

### Integración con Sistema de Pedidos

- Extender estados de pedido para incluir ASSIGNED, IN_TRANSIT, DELIVERED
- Añadir referencia a repartidor asignado en modelo de Order
- Implementar notificaciones entre sistemas para cambios de estado

### Preparación para Integración con Sistema de Clientes

- Estructura para asociar calificaciones a clientes específicos
- Almacenar preferencias de cliente sobre repartidores

## Consideraciones Técnicas

### Manejo de Datos Geoespaciales

- Utilizar tipos geoespaciales de PostgreSQL para almacenar ubicaciones
- Implementar funciones para cálculo de distancias y verificación de contención en zonas
- Optimizar consultas espaciales con índices adecuados

### Actualización en Tiempo Real

- Preparar estructura para futura implementación de WebSockets
- Implementar mecanismos de polling eficiente mientras tanto
- Optimizar actualizaciones frecuentes de ubicación

### Escalabilidad

- Diseñar para manejar gran cantidad de repartidores simultáneos
- Optimizar consultas geoespaciales frecuentes
- Implementar caché para datos consultados frecuentemente

## Estimación de Tiempos

| Tarea | Días Estimados |
|-------|----------------|
| Definición de Tipos y DTOs | 3 |
| Implementación de Servicios | 7 |
| Implementación de Controladores | 5 |
| Implementación de Validadores | 2 |
| Implementación de Rutas | 1 |
| Integración con Sistema de Pedidos | 3 |
| Pruebas de Integración | 2 |
| Documentación y Finalización | 2 |
| **Total** | **25 días hábiles** |

## Criterios de Aceptación

- Todos los endpoints implementados y documentados
- Pruebas unitarias para servicios con cobertura >80%
- Pruebas de integración para flujos principales
- Implementación correcta de las transiciones de estado
- Sistema de asignación automática funcionando correctamente
- Integración completa con el Sistema de Pedidos
- Manejo eficiente de datos geoespaciales
- Documentación completa de API y flujos de trabajo

## Riesgos y Mitigación

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Complejidad en manejo de datos geoespaciales | Alto | Media | Investigar y documentar uso de funciones geoespaciales de PostgreSQL/Prisma |
| Rendimiento en consultas espaciales | Medio | Alta | Implementar índices espaciales y optimizaciones desde el inicio |
| Precisión en seguimiento en tiempo real | Alto | Media | Establecer intervalos de actualización óptimos, implementar interpolación |
| Conflictos en asignación concurrente | Alto | Baja | Implementar bloqueos o control de concurrencia en asignaciones |
| Integración con Sistema de Pedidos | Medio | Media | Diseñar tests de integración exhaustivos, implementar rollback automático |

## Listado de Archivos a Implementar

1. **Types**
   - `src/types/delivery.ts`

2. **Servicios**
   - `src/services/delivery/driverService.ts`
   - `src/services/delivery/zoneService.ts`
   - `src/services/delivery/assignmentService.ts`
   - `src/services/delivery/ratingService.ts`

3. **Controladores**
   - `src/controllers/delivery/driverController.ts`
   - `src/controllers/delivery/zoneController.ts`
   - `src/controllers/delivery/assignmentController.ts`
   - `src/controllers/delivery/ratingController.ts`

4. **Validadores**
   - `src/middleware/validation/delivery/driverValidators.ts`
   - `src/middleware/validation/delivery/zoneValidators.ts`
   - `src/middleware/validation/delivery/assignmentValidators.ts`
   - `src/middleware/validation/delivery/ratingValidators.ts`

5. **Rutas**
   - `src/routes/deliveryRoutes.ts`

6. **Tests**
   - `src/tests/unit/services/delivery/driverService.test.ts`
   - `src/tests/unit/services/delivery/zoneService.test.ts`
   - `src/tests/unit/services/delivery/assignmentService.test.ts`
   - `src/tests/unit/services/delivery/ratingService.test.ts`
   - `src/tests/integration/api/delivery/driver.test.ts`
   - `src/tests/integration/api/delivery/zone.test.ts`
   - `src/tests/integration/api/delivery/assignment.test.ts`
   - `src/tests/integration/api/delivery/rating.test.ts`

7. **Modificaciones en Archivos Existentes**
   - `src/services/order/orderService.ts` (para integración con entregas)
   - `src/controllers/order/orderController.ts` (para integración con entregas)
   - `src/routes/orderRoutes.ts` (para nuevos endpoints de asignación)
   - `src/app.ts` (para incluir nuevas rutas)

## Conclusión

La implementación del Sistema de Entregas representa un componente crucial para completar el flujo operativo del restaurante. Esta etapa permitirá gestionar la última parte del ciclo de vida de un pedido: la entrega al cliente.

Al finalizar la Etapa 5, el sistema contará con la capacidad de gestionar repartidores, zonas de entrega, asignación de pedidos y seguimiento en tiempo real, proporcionando una experiencia completa tanto para el restaurante como para los clientes.

La arquitectura modular por dominios nos permitirá mantener la claridad y separación de responsabilidades, facilitando el mantenimiento y la extensión futura del sistema.
