# Nueva Arquitectura para el Backend de Restaurante

Este documento describe la arquitectura propuesta para el backend refactorizado del sistema de restaurante, incorporando todos los nuevos modelos y funcionalidades definidos en el schema de Prisma expandido.

## Estructura de Carpetas

```
restaurant-backend/
├── src/
│   ├── config/
│   │   ├── database.ts                   # Configuración de Prisma
│   │   ├── env.ts                        # Variables de entorno
│   │   └── logger.ts                     # Configuración de logging
│   ├── controllers/
│   │   ├── menu/                         # Controladores relacionados con el menú
│   │   │   ├── menuItemController.ts     # Gestión de ítems del menú
│   │   │   ├── categoryController.ts     # Gestión de categorías
│   │   │   └── customizationController.ts # Opciones de personalización
│   │   ├── order/                        # Controladores de pedidos
│   │   │   ├── orderController.ts        # Gestión de pedidos
│   │   │   ├── orderItemController.ts    # Ítems de pedidos
│   │   │   └── orderReviewController.ts  # Reseñas de pedidos
│   │   ├── customer/                     # Controladores de clientes
│   │   │   ├── customerController.ts     # Gestión de clientes
│   │   │   └── addressController.ts      # Direcciones de clientes
│   │   ├── delivery/                     # Controladores de entrega
│   │   │   ├── driverController.ts       # Gestión de repartidores
│   │   │   └── zoneController.ts         # Zonas de entrega
│   │   ├── inventory/                    # Controladores de inventario
│   │   │   ├── inventoryController.ts    # Gestión de inventario
│   │   │   ├── supplierController.ts     # Gestión de proveedores
│   │   │   └── transactionController.ts  # Transacciones de inventario
│   │   ├── promotion/                    # Controladores de promociones
│   │   │   ├── promotionController.ts    # Promociones 
│   │   │   └── promoCodeController.ts    # Códigos promocionales
│   │   ├── reservation/                  # Controladores de reservas
│   │   │   └── reservationController.ts  # Gestión de reservas
│   │   ├── system/                       # Controladores de sistema
│   │   │   ├── configController.ts       # Configuración
│   │   │   └── businessHoursController.ts# Horarios comerciales
│   │   └── auth/                         # Controladores de autenticación
│   │       ├── authController.ts         # Login, registro
│   │       └── userController.ts         # Gestión de usuarios del sistema
│   ├── services/
│   │   ├── menu/                         # Servicios relacionados con el menú
│   │   │   ├── menuItemService.ts
│   │   │   ├── categoryService.ts
│   │   │   └── customizationService.ts
│   │   ├── order/                        # Servicios de pedidos
│   │   │   ├── orderService.ts
│   │   │   ├── orderItemService.ts
│   │   │   └── reviewService.ts
│   │   ├── customer/                     # Servicios de clientes
│   │   │   ├── customerService.ts
│   │   │   └── addressService.ts
│   │   ├── delivery/                     # Servicios de entrega
│   │   │   ├── driverService.ts
│   │   │   └── zoneService.ts
│   │   ├── inventory/                    # Servicios de inventario
│   │   │   ├── inventoryService.ts
│   │   │   ├── supplierService.ts
│   │   │   └── transactionService.ts
│   │   ├── promotion/                    # Servicios de promociones
│   │   │   ├── promotionService.ts
│   │   │   └── promoCodeService.ts
│   │   ├── reservation/                  # Servicios de reservas
│   │   │   └── reservationService.ts
│   │   ├── system/                       # Servicios de sistema
│   │   │   ├── configService.ts
│   │   │   └── businessHoursService.ts
│   │   ├── auth/                         # Servicios de autenticación
│   │   │   ├── authService.ts
│   │   │   └── userService.ts
│   │   └── common/                       # Servicios comunes
│   │       ├── emailService.ts           # Servicio de emails
│   │       ├── notificationService.ts    # Notificaciones
│   │       └── paymentService.ts         # Procesamiento de pagos
│   ├── routes/
│   │   ├── menuRoutes.ts                 # Rutas de menú
│   │   ├── orderRoutes.ts                # Rutas de pedidos
│   │   ├── customerRoutes.ts             # Rutas de clientes
│   │   ├── deliveryRoutes.ts             # Rutas de entrega
│   │   ├── inventoryRoutes.ts            # Rutas de inventario
│   │   ├── promotionRoutes.ts            # Rutas de promociones
│   │   ├── reservationRoutes.ts          # Rutas de reservas
│   │   ├── systemRoutes.ts               # Rutas de sistema
│   │   └── authRoutes.ts                 # Rutas de autenticación
│   ├── middleware/
│   │   ├── auth.ts                       # Verificación de autenticación
│   │   ├── validation.ts                 # Validación de datos (request)
│   │   ├── errorHandler.ts               # Manejo de errores
│   │   ├── rateLimiter.ts                # Limitador de peticiones
│   │   └── logger.ts                     # Middleware de logging
│   ├── utils/
│   │   ├── validators/                   # Validadores por dominio
│   │   ├── formatters.ts                 # Formateadores de datos
│   │   ├── pagination.ts                 # Utilidades de paginación
│   │   ├── errors.ts                     # Clases de error personalizadas
│   │   └── helpers.ts                    # Funciones auxiliares
│   ├── types/
│   │   ├── menu.ts                       # Tipos para el menú
│   │   ├── order.ts                      # Tipos para pedidos
│   │   ├── customer.ts                   # Tipos para clientes
│   │   ├── delivery.ts                   # Tipos para entregas
│   │   ├── inventory.ts                  # Tipos para inventario
│   │   ├── promotion.ts                  # Tipos para promociones
│   │   ├── reservation.ts                # Tipos para reservas
│   │   ├── system.ts                     # Tipos para sistema
│   │   └── auth.ts                       # Tipos para autenticación
│   └── app.ts                            # Punto de entrada de la aplicación
├── prisma/
│   ├── schema.prisma                     # Schema de Prisma
│   ├── migrations/                       # Migraciones de base de datos
│   └── seed.ts                           # Script para seed de datos
├── tests/
│   ├── unit/                             # Tests unitarios
│   │   ├── services/                     # Tests de servicios
│   │   └── controllers/                  # Tests de controladores
│   └── integration/                      # Tests de integración
│       ├── api/                          # Tests de API
│       └── db/                           # Tests de base de datos
├── docs/
│   ├── api/                              # Documentación de la API
│   └── guides/                           # Guías de desarrollo
├── scripts/                              # Scripts útiles
├── .env.example                          # Ejemplo de variables de entorno
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Componentes Principales

### 1. Modelos de Datos

Los modelos de datos reflejan exactamente la estructura definida en el schema de Prisma, organizados en los siguientes dominios:

- **Sistema de Menú**: MenuItem, Category, CustomizationOption
- **Sistema de Pedidos**: Order, OrderItem, OrderItemCustomization, OrderStatusHistory
- **Sistema de Clientes**: Customer, Address, CustomerFavorite
- **Sistema de Entrega**: DeliveryDriver, DeliveryZone, DriverDeliveryZone, DriverRating
- **Sistema de Inventario**: InventoryItem, InventoryUsage, InventoryTransaction, Supplier
- **Sistema de Promociones**: Promotion, PromoCode
- **Sistema de Reseñas**: OrderReview
- **Sistema de Configuración**: SystemConfig, BusinessHours
- **Sistema de Reservas**: Reservation, Table
- **Sistema de Usuarios**: User

### 2. Capas de la Aplicación

#### Capa de Acceso a Datos
- **Prisma Client**: Gestiona todas las operaciones de base de datos

#### Capa de Servicios
- **Servicios de Dominio**: Implementan la lógica de negocio para cada dominio
- **Servicios Comunes**: Proporcionan funcionalidades compartidas entre dominios

#### Capa de API
- **Controladores**: Manejan las peticiones HTTP y delegan al servicio correspondiente
- **Middleware**: Procesan las peticiones antes de llegar a los controladores
- **Rutas**: Definen los endpoints disponibles en la API

### 3. Características Transversales

- **Autenticación y Autorización**: JWT para autenticación, roles para autorización
- **Validación**: Validación de datos de entrada en todas las peticiones
- **Manejo de Errores**: Sistema centralizado de manejo de errores
- **Logging**: Registro de eventos y errores
- **Paginación**: Para listados grandes
- **Cacheo**: Para mejorar rendimiento en datos frecuentemente accedidos

## API REST

### Estructura de Endpoints

#### Menú y Productos
- `GET /api/menu-items` - Listar ítems del menú
- `POST /api/menu-items` - Crear ítem
- `GET /api/menu-items/:id` - Obtener ítem específico
- `PUT /api/menu-items/:id` - Actualizar ítem
- `DELETE /api/menu-items/:id` - Eliminar ítem
- `GET /api/categories` - Listar categorías
- `GET /api/menu-items/category/:categoryId` - Ítems por categoría
- `GET /api/customizations/menu-item/:menuItemId` - Opciones de personalización

#### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/orders/:id` - Detalles de pedido
- `PUT /api/orders/:id/status` - Actualizar estado
- `GET /api/orders/customer/:customerId` - Pedidos por cliente
- `POST /api/orders/:id/review` - Añadir reseña

#### Clientes
- `GET /api/customers` - Listar clientes
- `POST /api/customers` - Registrar cliente
- `GET /api/customers/:id` - Detalles de cliente
- `GET /api/customers/:id/addresses` - Direcciones de cliente
- `POST /api/customers/:id/addresses` - Añadir dirección

#### Entrega
- `GET /api/delivery/drivers` - Listar repartidores
- `GET /api/delivery/drivers/:id/orders` - Pedidos asignados
- `PUT /api/delivery/drivers/:id/status` - Actualizar estado
- `GET /api/delivery/zones` - Listar zonas de entrega

#### Inventario
- `GET /api/inventory` - Listar inventario
- `POST /api/inventory/transactions` - Registrar transacción
- `GET /api/inventory/low-stock` - Ítems con stock bajo
- `GET /api/suppliers` - Listar proveedores

#### Promociones
- `GET /api/promotions` - Listar promociones
- `POST /api/promotions` - Crear promoción
- `GET /api/promo-codes/validate/:code` - Validar código promocional

#### Sistema
- `GET /api/config/:key` - Obtener configuración
- `PUT /api/config/:key` - Actualizar configuración
- `GET /api/business-hours` - Obtener horarios comerciales

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (admin)
- `GET /api/users` - Listar usuarios (admin)
- `PUT /api/users/:id/role` - Cambiar rol (admin)

## Seguridad

### Autenticación
- JWT (JSON Web Tokens) para autenticación
- Refreshing tokens para mantener sesiones
- Almacenamiento seguro de contraseñas (hash + salt)

### Autorización
- Sistema basado en roles (ADMIN, MANAGER, STAFF, KITCHEN, DELIVERY_MANAGER)
- Middleware para verificar permisos por ruta

### Protección de Datos
- Validación de todas las entradas de usuario
- Sanitización de datos para prevenir inyecciones
- Rate limiting para prevenir ataques de fuerza bruta

## Estrategia de Despliegue

### Entornos
- **Desarrollo**: Para desarrollo y pruebas locales
- **Staging**: Para pruebas antes de producción
- **Producción**: Entorno de producción

### Pipeline de CI/CD
- Tests automáticos en cada push
- Migraciones automáticas en despliegue
- Rollback automático en caso de fallos

### Monitorización
- Logging de errores y eventos importantes
- Alertas para situaciones críticas
- Métricas de rendimiento

## Integraciones

### Externas
- Servicios de pago (Mercado Pago, PayPal)
- Servicios de notificaciones (correos, SMS, push)
- Servicios de mapas para seguimiento de entregas

### Webhooks
- Endpoints para recibir notificaciones de servicios externos
- Callbacks para confirmar pagos procesados

## Escalabilidad

### Estrategias
- Índices adecuados en la base de datos
- Cacheo de datos frecuentemente accedidos
- Posibilidad de escalar horizontalmente

## Plan de Implementación por Fases

### Fase 1: Núcleo del Sistema
- Refactorización de modelos existentes (MenuItem, Category, CustomizationOption)
- Implementación del sistema de pedidos básico
- Implementación del sistema de clientes

### Fase 2: Funcionalidades de Delivery
- Sistema de repartidores
- Zonas de entrega
- Seguimiento de pedidos

### Fase 3: Funcionalidades de Promoción y Fidelización
- Promociones y códigos de descuento
- Programa de fidelización de clientes
- Reseñas y calificaciones

### Fase 4: Gestión Avanzada
- Sistema de inventario
- Gestión de proveedores
- Dashboard administrativo

### Fase 5: Características Adicionales
- Reservas
- Integraciones con plataformas externas
- Analíticas avanzadas