# Schema Prisma

// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ===== SISTEMA DE MENÚ (Modelos existentes actualizados) =====

model MenuItem {
  id                  Int      @id @default(autoincrement())
  name                String
  description         String?
  price               Float
  imageUrl            String?
  categoryId          Int
  isAvailable         Boolean  @default(true)
  isPopular           Boolean  @default(false)
  preparationTime     Int?     // Tiempo estimado de preparación en minutos
  ingredients         String?  // JSON con ingredientes, podrías crear una tabla separada para esto en el futuro
  nutritionalInfo     String?  // JSON con información nutricional
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  deletedAt           DateTime?
  
  // Relaciones
  category            Category @relation(fields: [categoryId], references: [id])
  customizationOptions CustomizationOption[]
  orderItems          OrderItem[]
  inventoryUsage      InventoryUsage[]
  promotion           Promotion? @relation(fields: [promotionId], references: [id])
  promotionId         Int?

  @@map("menu_items")
}

model Category {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  menuItems   MenuItem[]

  @@map("categories")
}

model CustomizationOption {
  id                  Int      @id @default(autoincrement())
  name                String
  price               Float    @default(0)
  isAvailable         Boolean  @default(true)
  groupName           String?
  isMutuallyExclusive Boolean  @default(false)
  menuItemId          Int
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  // Relaciones
  menuItem            MenuItem @relation(fields: [menuItemId], references: [id])
  orderItemCustomizations OrderItemCustomization[]

  @@map("customization_options")
}

// ===== SISTEMA DE PEDIDOS =====

enum OrderStatus {
  PENDING         // Pendiente
  CONFIRMED       // Confirmado
  PREPARING       // En preparación
  READY           // Listo para entrega
  ASSIGNED        // Asignado a repartidor
  IN_TRANSIT      // En camino
  DELIVERED       // Entregado
  CANCELLED       // Cancelado
  REJECTED        // Rechazado
}

enum PaymentMethod {
  CASH
  CREDIT_CARD
  DEBIT_CARD
  TRANSFER
  MERCADO_PAGO
  PAYPAL
  OTHER
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

model Order {
  id              Int           @id @default(autoincrement())
  orderNumber     String        @unique // Número legible para el cliente
  status          OrderStatus   @default(PENDING)
  customerId      Int?
  deliveryAddressId Int?
  deliveryNotes   String?
  deliveryCost    Float         @default(0)
  subtotal        Float
  taxAmount       Float
  discountAmount  Float         @default(0)
  tipAmount       Float         @default(0)
  total           Float
  paymentMethod   PaymentMethod
  paymentStatus   PaymentStatus @default(PENDING)
  paymentReference String?      // Referencia externa del pago
  deliveryDriverId Int?
  promoCodeId     Int?
  estimatedDeliveryTime DateTime?
  actualDeliveryTime   DateTime?
  createdAt       DateTime      @default(now())
  confirmedAt     DateTime?
  preparedAt      DateTime?
  readyAt         DateTime?
  assignedAt      DateTime?
  inTransitAt     DateTime?
  deliveredAt     DateTime?
  cancelledAt     DateTime?

  // Relaciones
  customer        Customer?     @relation(fields: [customerId], references: [id])
  address         Address?      @relation(fields: [deliveryAddressId], references: [id])
  driver          DeliveryDriver? @relation(fields: [deliveryDriverId], references: [id])
  promoCode       PromoCode?    @relation(fields: [promoCodeId], references: [id])
  items           OrderItem[]
  statusHistory   OrderStatusHistory[]
  reviews         OrderReview[]

  @@map("orders")
}

model OrderItem {
  id              Int      @id @default(autoincrement())
  orderId         Int
  menuItemId      Int
  quantity        Int
  unitPrice       Float
  totalPrice      Float
  notes           String?

  // Relaciones
  order           Order    @relation(fields: [orderId], references: [id])
  menuItem        MenuItem @relation(fields: [menuItemId], references: [id])
  customizations  OrderItemCustomization[]

  @@map("order_items")
}

model OrderItemCustomization {
  id                  Int      @id @default(autoincrement())
  orderItemId         Int
  customizationOptionId Int
  price               Float
  
  // Relaciones
  orderItem           OrderItem @relation(fields: [orderItemId], references: [id])
  customizationOption CustomizationOption @relation(fields: [customizationOptionId], references: [id])

  @@map("order_item_customizations")
}

model OrderStatusHistory {
  id              Int           @id @default(autoincrement())
  orderId         Int
  status          OrderStatus
  notes           String?
  createdAt       DateTime      @default(now())
  createdBy       String?       // Usuario que realizó el cambio

  // Relaciones
  order           Order         @relation(fields: [orderId], references: [id])

  @@map("order_status_history")
}

// ===== SISTEMA DE CLIENTES =====

model Customer {
  id              Int      @id @default(autoincrement())
  name            String
  email           String?  @unique
  phone           String
  loyaltyPoints   Int      @default(0)
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  lastOrderAt     DateTime?

  // Relaciones
  addresses       Address[]
  orders          Order[]
  reviews         OrderReview[]
  favoriteItems   CustomerFavorite[]

  @@map("customers")
}

model Address {
  id              Int      @id @default(autoincrement())
  customerId      Int
  street          String
  number          String
  apartment       String?
  city            String
  state           String
  postalCode      String?
  references      String?
  latitude        Float?
  longitude       Float?
  isDefault       Boolean  @default(false)
  
  // Relaciones
  customer        Customer @relation(fields: [customerId], references: [id])
  orders          Order[]

  @@map("addresses")
}

model CustomerFavorite {
  id              Int      @id @default(autoincrement())
  customerId      Int
  menuItemId      Int
  createdAt       DateTime @default(now())
  
  // Relaciones
  customer        Customer @relation(fields: [customerId], references: [id])
  
  @@unique([customerId, menuItemId])
  @@map("customer_favorites")
}

// ===== SISTEMA DE REPARTIDORES =====

enum DriverStatus {
  AVAILABLE
  BUSY
  OFFLINE
}

model DeliveryDriver {
  id              Int          @id @default(autoincrement())
  name            String
  email           String?      @unique
  phone           String
  vehicleType     String?
  vehiclePlate    String?
  status          DriverStatus @default(AVAILABLE)
  latitude        Float?
  longitude       Float?
  isActive        Boolean      @default(true)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  lastActiveAt    DateTime?
  notes           String?

  // Relaciones
  orders          Order[]
  ratings         DriverRating[]
  deliveryZones   DriverDeliveryZone[]

  @@map("delivery_drivers")
}

model DriverRating {
  id              Int      @id @default(autoincrement())
  driverId        Int
  rating          Int      // 1-5
  comment         String?
  orderId         Int
  createdAt       DateTime @default(now())
  
  // Relaciones
  driver          DeliveryDriver @relation(fields: [driverId], references: [id])

  @@map("driver_ratings")
}

model DeliveryZone {
  id              Int      @id @default(autoincrement())
  name            String
  coordinates     String   // GeoJSON del polígono
  isActive        Boolean  @default(true)
  deliveryCost    Float
  minimumOrder    Float?
  estimatedTime   Int?     // Tiempo estimado en minutos
  
  // Relaciones
  drivers         DriverDeliveryZone[]

  @@map("delivery_zones")
}

model DriverDeliveryZone {
  driverId        Int
  zoneId          Int
  
  // Relaciones
  driver          DeliveryDriver @relation(fields: [driverId], references: [id])
  zone            DeliveryZone @relation(fields: [zoneId], references: [id])

  @@id([driverId, zoneId])
  @@map("driver_delivery_zones")
}

// ===== SISTEMA DE INVENTARIO =====

model InventoryItem {
  id              Int      @id @default(autoincrement())
  name            String
  description     String?
  currentStock    Float
  unitOfMeasure   String
  minStockLevel   Float?
  costPerUnit     Float
  supplierId      Int?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relaciones
  supplier        Supplier? @relation(fields: [supplierId], references: [id])
  usages          InventoryUsage[]
  transactions    InventoryTransaction[]

  @@map("inventory_items")
}

model InventoryUsage {
  id              Int      @id @default(autoincrement())
  inventoryItemId Int
  menuItemId      Int
  quantity        Float    // Cantidad necesaria por unidad de producto
  
  // Relaciones
  inventoryItem   InventoryItem @relation(fields: [inventoryItemId], references: [id])
  menuItem        MenuItem @relation(fields: [menuItemId], references: [id])

  @@unique([inventoryItemId, menuItemId])
  @@map("inventory_usage")
}

enum TransactionType {
  PURCHASE
  USAGE
  ADJUSTMENT
  WASTE
  RETURN
}

model InventoryTransaction {
  id              Int             @id @default(autoincrement())
  inventoryItemId Int
  quantity        Float
  type            TransactionType
  notes           String?
  unitCost        Float?
  totalCost       Float?
  createdAt       DateTime        @default(now())
  createdBy       String?
  
  // Relaciones
  inventoryItem   InventoryItem @relation(fields: [inventoryItemId], references: [id])

  @@map("inventory_transactions")
}

model Supplier {
  id              Int      @id @default(autoincrement())
  name            String
  contactName     String?
  email           String?
  phone           String
  address         String?
  notes           String?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relaciones
  inventoryItems  InventoryItem[]

  @@map("suppliers")
}

// ===== SISTEMA DE PROMOCIONES Y DESCUENTOS =====

enum PromotionType {
  PERCENTAGE
  FIXED_AMOUNT
  BUY_X_GET_Y
  FREE_DELIVERY
  BUNDLE
}

model Promotion {
  id              Int           @id @default(autoincrement())
  name            String
  description     String?
  type            PromotionType
  value           Float         // Porcentaje o monto fijo
  minimumOrder    Float?        // Pedido mínimo para aplicar
  startDate       DateTime
  endDate         DateTime
  isActive        Boolean       @default(true)
  categoryId      Int?          // Si aplica a una categoría específica
  applicableItems MenuItem[]    // Si aplica a productos específicos
  
  // Relaciones
  promoCodes      PromoCode[]

  @@map("promotions")
}

model PromoCode {
  id              Int      @id @default(autoincrement())
  code            String   @unique
  promotionId     Int
  maxUses         Int?
  currentUses     Int      @default(0)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  
  // Relaciones
  promotion       Promotion @relation(fields: [promotionId], references: [id])
  orders          Order[]

  @@map("promo_codes")
}

// ===== SISTEMA DE RESEÑAS Y CALIFICACIONES =====

model OrderReview {
  id              Int      @id @default(autoincrement())
  orderId         Int      @unique
  customerId      Int
  foodRating      Int      // 1-5
  deliveryRating  Int?     // 1-5
  comment         String?
  createdAt       DateTime @default(now())
  
  // Relaciones
  order           Order    @relation(fields: [orderId], references: [id])
  customer        Customer @relation(fields: [customerId], references: [id])

  @@map("order_reviews")
}

// ===== SISTEMA DE CONFIGURACIÓN =====

model SystemConfig {
  id              Int      @id @default(autoincrement())
  key             String   @unique
  value           String
  description     String?
  updatedAt       DateTime @updatedAt

  @@map("system_config")
}

model BusinessHours {
  id              Int      @id @default(autoincrement())
  dayOfWeek       Int      // 0=Domingo, 1=Lunes, etc.
  openTime        String?  // Formato "HH:MM" o null si está cerrado
  closeTime       String?  // Formato "HH:MM" o null si está cerrado
  isOpen          Boolean  @default(true)

  @@unique([dayOfWeek])
  @@map("business_hours")
}

// ===== SISTEMA DE RESERVAS (opcional) =====

enum ReservationStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
}

model Reservation {
  id              Int               @id @default(autoincrement())
  customerId      Int
  date            DateTime
  partySize       Int
  status          ReservationStatus @default(PENDING)
  notes           String?
  tableId         Int?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  
  // Relaciones
  customer        Customer          @relation(fields: [customerId], references: [id])
  table           Table?            @relation(fields: [tableId], references: [id])

  @@map("reservations")
}

model Table {
  id              Int      @id @default(autoincrement())
  number          String
  capacity        Int
  isActive        Boolean  @default(true)
  
  // Relaciones
  reservations    Reservation[]

  @@map("tables")
}

// ===== SISTEMA DE USUARIOS (para el dashboard) =====

enum UserRole {
  ADMIN
  MANAGER
  STAFF
  KITCHEN
  DELIVERY_MANAGER
}

model User {
  id              Int      @id @default(autoincrement())
  name            String
  email           String   @unique
  password        String   // Almacenar hash, nunca contraseñas en texto plano
  role            UserRole @default(STAFF)
  isActive        Boolean  @default(true)
  lastLoginAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("users")
}
