# Documentación del Schema de Base de Datos para Sistema de Delivery de Restaurante

Este documento detalla la implementación del schema de base de datos para un sistema integral de delivery de restaurante usando PostgreSQL y Prisma ORM. La estructura está diseñada para soportar todas las operaciones esenciales de un restaurante moderno, desde la gestión del menú hasta el seguimiento de pedidos y entregas.

## Principales Sistemas Implementados

### 1. Sistema de Menú

El core del negocio, gestionando los productos disponibles para venta.

**Modelos principales:**

- `MenuItem`: Productos del menú con precios, descripciones e imágenes
- `Category`: Categorías para organizar los productos
- `CustomizationOption`: Opciones de personalización para productos (extras, modificaciones)

**Características:**

- Soporte para información nutricional y tiempos de preparación
- Gestión de disponibilidad de productos
- Relación con el sistema de inventario para control de stock
- Marcado de productos populares/destacados

### 2. Sistema de Pedidos

Gestiona el ciclo de vida completo de los pedidos, desde la creación hasta la entrega.

**Modelos principales:**

- `Order`: Pedido principal con estado, totales, notas, etc.
- `OrderItem`: Ítems individuales dentro de un pedido
- `OrderItemCustomization`: Personalizaciones aplicadas a cada ítem
- `OrderStatusHistory`: Registro histórico de cambios de estado

**Características:**

- Ciclo completo de estado de pedido (pendiente → preparación → en camino → entregado)
- Cálculo detallado de precios (subtotal, impuestos, descuentos, propinas)
- Múltiples métodos de pago y estados de pago
- Trazabilidad con timestamps para cada cambio de estado

### 3. Sistema de Clientes

Gestiona la información de los clientes y sus preferencias.

**Modelos principales:**

- `Customer`: Información básica del cliente
- `Address`: Direcciones de entrega asociadas a los clientes
- `CustomerFavorite`: Productos favoritos de los clientes

**Características:**

- Gestión de múltiples direcciones por cliente
- Sistema de puntos de fidelidad
- Historial de pedidos por cliente
- Gestión de preferencias y favoritos

### 4. Sistema de Repartidores

Gestiona los repartidores y las entregas.

**Modelos principales:**

- `DeliveryDriver`: Información de los repartidores
- `DriverRating`: Calificaciones recibidas por los repartidores
- `DeliveryZone`: Zonas geográficas de entrega
- `DriverDeliveryZone`: Relación entre repartidores y zonas asignadas

**Características:**

- Estados de disponibilidad de repartidores
- Seguimiento de ubicación en tiempo real
- Sistema de calificaciones
- Gestión de zonas de entrega con costos y tiempos estimados

### 5. Sistema de Inventario

Controla el stock de ingredientes y su relación con los productos.

**Modelos principales:**

- `InventoryItem`: Ingredientes y suministros en stock
- `InventoryUsage`: Relación entre productos y los ingredientes que utilizan
- `InventoryTransaction`: Movimientos de inventario (compras, usos, ajustes)
- `Supplier`: Proveedores de ingredientes

**Características:**

- Control de stock mínimo y alertas
- Registro de costos por unidad
- Seguimiento de uso de ingredientes por producto
- Registro histórico de transacciones de inventario

### 6. Sistema de Promociones y Descuentos

Gestiona ofertas, promociones y códigos de descuento.

**Modelos principales:**

- `Promotion`: Definición de promociones y sus reglas
- `PromoCode`: Códigos de descuento asociados a promociones

**Características:**

- Múltiples tipos de promoción (porcentaje, monto fijo, 2x1, envío gratis)
- Limitación por fechas de validez
- Aplicación específica a categorías o productos
- Seguimiento de uso de códigos promocionales

### 7. Sistema de Reseñas y Calificaciones

Gestiona el feedback de los clientes.

**Modelos principales:**

- `OrderReview`: Reseñas y calificaciones de pedidos
- `DriverRating`: Calificaciones específicas para repartidores

**Características:**

- Calificaciones separadas para comida y entrega
- Comentarios de clientes
- Vinculación con pedidos específicos

### 8. Sistema de Configuración

Gestiona parámetros y configuraciones del negocio.

**Modelos principales:**

- `SystemConfig`: Configuraciones generales del sistema
- `BusinessHours`: Horarios de operación del restaurante

**Características:**

- Configuración centralizada de parámetros del sistema
- Gestión de horarios de apertura y cierre por día

### 9. Sistema de Reservas (opcional)

Para restaurantes que ofrecen servicio en el local.

**Modelos principales:**

- `Reservation`: Reservas de clientes
- `Table`: Mesas disponibles en el restaurante

**Características:**

- Gestión de estados de reservas
- Asignación de mesas según capacidad
- Control de disponibilidad

### 10. Sistema de Usuarios (Dashboard)

Gestiona los usuarios que operan el sistema administrativo.

**Modelos principales:**

- `User`: Usuarios del sistema con roles y permisos

**Características:**

- Múltiples roles (administrador, gerente, staff, cocina, etc.)
- Control de acceso basado en roles
- Registro de actividad (último inicio de sesión)

## Relaciones Clave

El schema implementa diversas relaciones que permiten un funcionamiento integrado del sistema:

- **Pedidos ↔ Menú**: Los pedidos contienen referencias a los ítems del menú.
- **Pedidos ↔ Clientes**: Cada pedido está asociado a un cliente.
- **Pedidos ↔ Repartidores**: Los pedidos son asignados a repartidores para su entrega.
- **Productos ↔ Inventario**: Los productos consumen ingredientes del inventario.
- **Clientes ↔ Direcciones**: Los clientes pueden tener múltiples direcciones.
- **Promociones ↔ Productos**: Las promociones pueden aplicarse a productos específicos.

## Características Técnicas

- **Soft Delete**: Implementado para elementos críticos como `MenuItem` con campo `deletedAt`.
- **Auditoría**: Campos de `createdAt` y `updatedAt` para seguimiento de cambios.
- **Enumeraciones**: Uso de tipos enum de Prisma para campos con valores fijos (estados de pedido, roles, etc.).
- **Relaciones Múltiples**: Implementación de relaciones uno-a-uno, uno-a-muchos y muchos-a-muchos.
- **Índices**: Campos críticos para búsqueda están indexados para mejor rendimiento.
- **Integridad Referencial**: Relaciones con claves foráneas para mantener la integridad de datos.

## Extensibilidad

El schema está diseñado para ser extensible, permitiendo:

- Agregar nuevos tipos de promociones
- Expandir el sistema de inventario a un control más granular
- Implementar integración con plataformas externas de delivery
- Añadir sistemas de análisis y reportes avanzados
- Incorporar funcionalidades de marketing y CRM

## Próximos Pasos

Para implementar completamente este schema:

1. Ejecutar las migraciones de Prisma para crear las tablas en PostgreSQL
2. Crear seeders para datos iniciales (categorías, configuraciones)
3. Implementar los servicios en el backend para interactuar con estos modelos
4. Desarrollar las APIs correspondientes para exponer la funcionalidad
5. Actualizar el frontend para aprovechar estas nuevas capacidades

---

Esta estructura de base de datos proporciona una base sólida para un sistema completo de gestión de restaurante con delivery, balanceando la complejidad necesaria para cubrir todos los aspectos del negocio con la claridad y organización requeridas para un desarrollo y mantenimiento efectivos.
