# Guía de Creación de Datos de Prueba para API de Menú

Esta guía describe dos métodos para crear datos de prueba en la base de datos: usando endpoints HTTP directamente y usando un script de seed con Prisma.

## Método 1: Usando Endpoints HTTP

### 1. Crear Categorías

```bash
# Crear categoría de Hamburguesas
curl -X POST http://localhost:3000/api/categories \
-H "Content-Type: application/json" \
-d '{
  "name": "Hamburguesas",
  "description": "Nuestras deliciosas hamburguesas",
  "order": 1,
  "isActive": true
}'

# Crear categoría de Bebidas
curl -X POST http://localhost:3000/api/categories \
-H "Content-Type: application/json" \
-d '{
  "name": "Bebidas",
  "description": "Refrescantes bebidas",
  "order": 2,
  "isActive": true
}'

# Crear categoría de Postres
curl -X POST http://localhost:3000/api/categories \
-H "Content-Type: application/json" \
-d '{
  "name": "Postres",
  "description": "Deliciosos postres caseros",
  "order": 3,
  "isActive": true
}'
```

### 2. Crear Items del Menú

```bash
# Crear Hamburguesa Clásica
curl -X POST http://localhost:3000/api/menu-items \
-H "Content-Type: application/json" \
-d '{
  "name": "Hamburguesa Clásica",
  "description": "Deliciosa hamburguesa con lechuga, tomate y cebolla",
  "price": 8.99,
  "categoryId": 1,
  "isPopular": true,
  "isAvailable": true
}'

# Crear Coca-Cola
curl -X POST http://localhost:3000/api/menu-items \
-H "Content-Type: application/json" \
-d '{
  "name": "Coca-Cola",
  "description": "Bebida refrescante",
  "price": 2.50,
  "categoryId": 2,
  "isPopular": false,
  "isAvailable": true
}'
```

### 3. Crear Opciones de Personalización

```bash
# Agregar extras para la Hamburguesa Clásica
curl -X POST http://localhost:3000/api/customizations/menu-item/1 \
-H "Content-Type: application/json" \
-d '{
  "name": "Queso Extra",
  "price": 1.50,
  "isAvailable": true
}'

curl -X POST http://localhost:3000/api/customizations/menu-item/1 \
-H "Content-Type: application/json" \
-d '{
  "name": "Bacon",
  "price": 2.00,
  "isAvailable": true
}'
```

## Método 2: Usando Script de Seed con Prisma

### 1. Crear archivo de seed

Crear un archivo `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Crear categorías
  const burgersCategory = await prisma.category.create({
    data: {
      name: 'Hamburguesas',
      description: 'Nuestras deliciosas hamburguesas',
      order: 1,
      isActive: true,
    },
  })

  const drinksCategory = await prisma.category.create({
    data: {
      name: 'Bebidas',
      description: 'Refrescantes bebidas',
      order: 2,
      isActive: true,
    },
  })

  const dessertsCategory = await prisma.category.create({
    data: {
      name: 'Postres',
      description: 'Deliciosos postres caseros',
      order: 3,
      isActive: true,
    },
  })

  // Crear items del menú con personalizaciones
  await prisma.menuItem.create({
    data: {
      name: 'Hamburguesa Clásica',
      description: 'Deliciosa hamburguesa con lechuga, tomate y cebolla',
      price: 8.99,
      categoryId: burgersCategory.id,
      isPopular: true,
      isAvailable: true,
      customizationOptions: {
        create: [
          {
            name: 'Queso Extra',
            price: 1.50,
            isAvailable: true
          },
          {
            name: 'Bacon',
            price: 2.00,
            isAvailable: true
          }
        ]
      }
    },
  })

  await prisma.menuItem.create({
    data: {
      name: 'Coca-Cola',
      description: 'Bebida refrescante',
      price: 2.50,
      categoryId: drinksCategory.id,
      isPopular: false,
      isAvailable: true,
      customizationOptions: {
        create: [
          {
            name: 'Con Hielo',
            price: 0,
            isAvailable: true,
            isMutuallyExclusive: true,
            groupName: 'ice_preference'
          },
          {
            name: 'Sin Hielo',
            price: 0,
            isAvailable: true,
            isMutuallyExclusive: true,
            groupName: 'ice_preference'
          }
        ]
      }
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 2. Configurar el script de seed

Agregar en `package.json`:

```json
{
  "scripts": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### 3. Ejecutar el seed

```bash
npm run seed
# o
pnpm run seed
```

## Verificación de Datos

Después de crear los datos de prueba, puedes verificarlos usando los siguientes endpoints:

```bash
# Obtener todas las categorías
curl http://localhost:3000/api/categories

# Obtener todos los items del menú
curl http://localhost:3000/api/menu-items

# Obtener las opciones de personalización de un item específico
curl http://localhost:3000/api/customizations/menu-item/1
```

## Notas Importantes

1. Si usas el método HTTP (Método 1):
   - Debes crear las categorías antes que los items del menú
   - Los IDs son importantes para las relaciones
   - Debes manejar los errores manualmente

2. Si usas el script de seed (Método 2):
   - Es más mantenible y reusable
   - Las relaciones se manejan automáticamente
   - Puedes ejecutarlo múltiples veces limpiando la base de datos
   - Es más fácil de versionar con git

3. Para ambiente de desarrollo:
   - El Método 2 (script de seed) es más recomendado
   - Puedes tener diferentes seeds para diferentes ambientes
   - Es más fácil de mantener y actualizar
