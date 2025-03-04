# Plan de Implementación: Etapa 4 - Sistema de Clientes

## Introducción

La Etapa 4 del desarrollo del backend para el sistema de restaurante se centra en la implementación del Sistema de Clientes. Esta etapa es fundamental ya que establece las bases para gestionar toda la información relacionada con los clientes, sus direcciones y preferencias, lo que permitirá ofrecer una experiencia personalizada y optimizada.

Esta implementación seguirá la arquitectura modular por dominios establecida, manteniendo la clara separación entre las capas de datos, servicios, controladores y API.

## Objetivos de la Etapa 4

1. Implementar los modelos de datos relacionados con clientes
2. Desarrollar la lógica de negocio para la gestión de clientes
3. Crear los endpoints necesarios para el registro y administración de clientes
4. Implementar el sistema de gestión de direcciones múltiples
5. Desarrollar la funcionalidad de ítems favoritos
6. Integrar con el sistema de pedidos (implementado en la Etapa 3)

## Modelos de Datos a Implementar

Según el schema de Prisma definido, trabajaremos con los siguientes modelos:

1. **Customer**: Representa la información general de un cliente
2. **Address**: Almacena las direcciones asociadas a un cliente
3. **CustomerFavorite**: Registra los productos favoritos de un cliente

## Archivos a Desarrollar

### Capa de Tipos/DTOs

```ts
src/types/customer.ts
```

Contendrá las interfaces TypeScript para:

- DTOs para creación, actualización y respuesta de clientes
- DTOs para direcciones (creación, actualización, respuesta)
- DTOs para gestión de favoritos
- Tipos para filtros de búsqueda de clientes

### Capa de Servicios

```ts
src/services/customer/customerService.ts
src/services/customer/addressService.ts
src/services/customer/favoriteService.ts
```

Encapsularán la lógica de negocio para:

- Registro, consulta, actualización y eliminación de clientes
- Gestión de direcciones asociadas a un cliente
- Gestión de productos favoritos
- Búsqueda avanzada de clientes por diferentes criterios
- Integración con el sistema de pedidos

### Capa de Controladores

```ts
src/controllers/customer/customerController.ts
src/controllers/customer/addressController.ts
src/controllers/customer/favoriteController.ts
```

Manejarán las solicitudes HTTP para:

- Endpoints CRUD de clientes
- Endpoints para gestionar direcciones
- Endpoints para gestionar favoritos
- Endpoints para búsqueda y filtrado

### Capa de Validadores

```ts
src/middleware/validation/customerValidators.ts
src/middleware/validation/addressValidators.ts
```

Implementará reglas de validación para:

- Creación y actualización de clientes
- Validación de datos de contacto (email, teléfono)
- Validación de direcciones
- Validación para favoritos

### Capa de Rutas

```ts
src/routes/customerRoutes.ts
```

Definirá los endpoints disponibles y aplicará los middlewares necesarios.

## Plan de Trabajo Detallado

### 1. Definición de Tipos y DTOs (2 días)

***Actividades***

- Definir interfaces para DTOs de cliente
- Crear interfaces para DTOs de direcciones
- Crear interfaces para DTOs de favoritos
- Definir tipos para filtros de búsqueda
- Documentar cada tipo con JSDoc

***Entregables***

- Archivo `src/types/customer.ts` completo y documentado

### 2. Implementación de Servicios (5 días)

***Actividades***

***Customer Service (2 días)***

- Implementar método de registro de clientes
- Implementar consulta de clientes con filtros
- Implementar actualización de datos de cliente
- Implementar lógica para obtener historial de pedidos
- Implementar sistema de puntos de fidelidad (básico)

***Address Service (2 días)***

- Implementar gestión de múltiples direcciones
- Implementar lógica para dirección predeterminada
- Implementar validación de direcciones
- Implementar geocodificación básica (opcional)

***Favorite Service (1 día)***

- Implementar sistema para marcar/desmarcar favoritos
- Implementar consulta de favoritos
- Implementar recomendaciones básicas (opcional)

***Entregables***

- Servicios implementados con tests unitarios
- Documentación de funciones y lógica de negocio

### 3. Implementación de Controladores (4 días)

***Actividades***

***Customer Controller (2 días)***

- Implementar endpoint para registro de clientes
- Implementar endpoints de consulta (listado, detalle)
- Implementar endpoint de actualización
- Implementar endpoint para historial de pedidos

***Address Controller (1 día)***

- Implementar endpoints para gestión de direcciones
- Implementar manejo de errores específicos

***Favorite Controller (1 día)***

- Implementar endpoints para gestión de favoritos
- Implementar endpoint para recomendaciones

***Entregables***

- Controladores implementados con manejo de errores
- Documentación de endpoints y respuestas

### 4. Implementación de Validadores (2 días)

***Actividades***

- Desarrollar reglas de validación para datos de cliente
- Implementar validación de formatos de email y teléfono
- Implementar validación de datos de dirección
- Implementar validación de coherencia geográfica

***Entregables***

- Middleware de validación implementado
- Tests para escenarios de validación

### 5. Implementación de Rutas (1 día)

***Actividades***

- Definir rutas para todos los endpoints de clientes
- Aplicar middleware de autenticación y autorización
- Aplicar validadores a las rutas correspondientes
- Integrar en el sistema de rutas principal

***Entregables***

- Archivo de rutas implementado
- Documentación de endpoints disponibles

### 6. Integración con Sistema de Pedidos (2 días)

***Actividades***

- Actualizar el servicio de pedidos para asociar clientes
- Implementar consulta de pedidos por cliente
- Verificar coherencia entre direcciones y pedidos
- Implementar lógica para direcciones recientes

***Entregables***

- Servicios de pedidos actualizados
- Tests de integración entre sistemas

### 7. Pruebas de Integración (2 días)

***Actividades***

- Desarrollar pruebas para el flujo completo de clientes
- Probar escenarios de múltiples direcciones
- Probar integración con el sistema de pedidos
- Probar búsquedas y filtros

***Entregables***

- Suite de pruebas de integración
- Documentación de casos de prueba

### 8. Documentación y Finalización (2 días)

***Actividades***

- Completar documentación de API
- Documentar flujos de trabajo principales
- Actualizar README con información del nuevo módulo
- Revisar y refinar implementación

***Entregables***

- Documentación actualizada
- Pull request listo para revisión

## Estructura de Endpoints a Implementar

### Clientes

- `GET /api/customers` - Listar clientes con filtros
  - Query params: name, email, phone, lastOrderDate, etc.
  - Respuesta paginada

- `GET /api/customers/:id` - Obtener detalles de un cliente específico
  - Incluye direcciones y favoritos

- `POST /api/customers` - Registrar un nuevo cliente
  - Valida formato de datos de contacto
  - Permite registro con dirección inicial

- `PUT /api/customers/:id` - Actualizar datos de un cliente
  - Requiere autenticación y autorización
  - Valida datos actualizados

- `GET /api/customers/:id/orders` - Obtener historial de pedidos
  - Filtros por fecha, estado, etc.
  - Respuesta paginada

- `GET /api/customers/:id/stats` - Obtener estadísticas del cliente
  - Total de pedidos, valor promedio, frecuencia, etc.
  - Puntos de fidelidad acumulados

### Direcciones

- `GET /api/customers/:id/addresses` - Listar direcciones de un cliente
  - Incluye indicador de dirección predeterminada

- `POST /api/customers/:id/addresses` - Añadir una nueva dirección
  - Validación de datos completos
  - Opción para establecer como predeterminada

- `PUT /api/customers/:id/addresses/:addressId` - Actualizar dirección
  - Validación de datos
  - Opción para cambiar a predeterminada

- `DELETE /api/customers/:id/addresses/:addressId` - Eliminar dirección
  - Validación para evitar eliminar la única dirección
  - Reajuste de dirección predeterminada si es necesario

- `PUT /api/customers/:id/addresses/:addressId/default` - Establecer como predeterminada
  - Actualiza estado de todas las direcciones

### Favoritos

- `GET /api/customers/:id/favorites` - Listar favoritos de un cliente
  - Incluye detalles de productos

- `POST /api/customers/:id/favorites` - Añadir producto a favoritos
  - Valida existencia del producto
  - Evita duplicados

- `DELETE /api/customers/:id/favorites/:itemId` - Eliminar de favoritos
  - Validación de existencia

- `GET /api/customers/:id/recommendations` - Obtener recomendaciones
  - Basadas en favoritos y pedidos anteriores

## Reglas de Negocio Importantes

### Gestión de Clientes

- Email único por cliente (validación a nivel de base de datos)
- Teléfono requerido para contacto
- Sistema básico de puntos de fidelidad (1 punto por cada $X gastados)
- Tracking de última fecha de pedido

### Gestión de Direcciones

- Un cliente puede tener múltiples direcciones
- Siempre debe existir una dirección marcada como predeterminada
- Si se elimina la dirección predeterminada, otra debe ser seleccionada automáticamente
- Validación de coherencia geográfica (ciudad/estado/código postal)

### Gestión de Favoritos

- Un cliente puede marcar múltiples productos como favoritos
- No se permiten duplicados en favoritos
- Los favoritos pueden usarse para generar recomendaciones

## Integración con Otros Módulos

### Integración con Sistema de Pedidos (ya implementado en Etapa 3)

- Asociación de pedidos a clientes
- Uso de direcciones de cliente para entrega
- Historial de pedidos por cliente

### Preparación para Integración con Sistema de Promociones (futura etapa)

- Estructura para gestionar puntos de fidelidad
- Campos para promociones personalizadas

## Consideraciones Técnicas

### Seguridad de Datos

- Protección de información personal (email, teléfono)
- Validación de acceso a datos de clientes
- Posible implementación de visualización parcial de datos sensibles

### Optimización de Consultas

- Índices adecuados en tabla de clientes (email, teléfono, última fecha de pedido)
- Implementar paginación eficiente para listados de clientes

### Geocodificación (opcional)

- Integración básica con servicios de geocodificación
- Almacenamiento de coordenadas para facilitar entregas

## Estimación de Tiempos

| Tarea | Días Estimados |
|-------|----------------|
| Definición de Tipos y DTOs | 2 |
| Implementación de Servicios | 5 |
| Implementación de Controladores | 4 |
| Implementación de Validadores | 2 |
| Implementación de Rutas | 1 |
| Integración con Sistema de Pedidos | 2 |
| Pruebas de Integración | 2 |
| Documentación y Finalización | 2 |
| **Total** | **20 días hábiles** |

## Listado de Archivos Implicados en esta Etapa

### Nuevos Archivos

1. **Tipos**
   - `src/types/customer.ts` - Tipos y DTOs para clientes, direcciones y favoritos

2. **Servicios**
   - `src/services/customer/customerService.ts` - Lógica de negocio para clientes
   - `src/services/customer/addressService.ts` - Gestión de direcciones
   - `src/services/customer/favoriteService.ts` - Gestión de favoritos

3. **Controladores**
   - `src/controllers/customer/customerController.ts` - Endpoints para clientes
   - `src/controllers/customer/addressController.ts` - Endpoints para direcciones
   - `src/controllers/customer/favoriteController.ts` - Endpoints para favoritos

4. **Validadores**
   - `src/middleware/validation/customerValidators.ts` - Reglas para clientes
   - `src/middleware/validation/addressValidators.ts` - Reglas para direcciones

5. **Rutas**
   - `src/routes/customerRoutes.ts` - Definición de endpoints

6. **Tests**
   - `tests/unit/services/customer/customerService.test.ts`
   - `tests/unit/services/customer/addressService.test.ts`
   - `tests/unit/services/customer/favoriteService.test.ts`
   - `tests/integration/api/customer.test.ts`

### Archivos a Modificar

1. **Sistema de Pedidos**
   - `src/services/order/orderService.ts` - Actualizar para asociar clientes
   - `src/controllers/order/orderController.ts` - Añadir filtros por cliente

2. **Configuración General**
   - `src/routes/index.ts` - Incluir nuevas rutas
   - `src/app.ts` - Actualizar configuración si es necesario

3. **Documentación**
   - `README.md` - Actualizar con documentación del nuevo módulo
   - `docs/api/customer.md` - Documentación de la API de clientes

## Criterios de Aceptación

- Todos los endpoints implementados y documentados
- Pruebas unitarias para servicios con cobertura >80%
- Pruebas de integración para flujos principales
- Validación correcta de datos de cliente y direcciones
- Integración correcta con el sistema de pedidos
- Manejo adecuado de errores con mensajes descriptivos
- Documentación completa de la API

## Riesgos y Mitigación

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Protección inadecuada de datos personales | Alto | Media | Implementar políticas de acceso estrictas y ofuscación parcial |
| Direcciones inválidas o inconsistentes | Medio | Alta | Validación exhaustiva y normalización de direcciones |
| Rendimiento en búsquedas complejas | Medio | Baja | Diseñar índices adecuados y estrategias de caché |
| Duplicidad de clientes | Medio | Media | Implementar detección de posibles duplicados y proceso de validación |

## Conclusión

La implementación del sistema de clientes representa un componente esencial para el backend del restaurante. Este módulo permitirá personalizar la experiencia de usuario, facilitar el proceso de pedidos y sentar las bases para estrategias de fidelización.

Al finalizar esta etapa, el sistema será capaz de gestionar toda la información relacionada con los clientes, sus direcciones y preferencias, integrándose perfectamente con el sistema de pedidos implementado en la etapa anterior. La arquitectura modular permitirá extender esta funcionalidad en etapas posteriores, especialmente para el sistema de promociones y fidelización.
