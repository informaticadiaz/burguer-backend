# Proceso de Migración de Schema Prisma

## Contexto

Este documento describe el proceso de migración realizado para actualizar el schema de Prisma en el proyecto del backend del sistema de restaurante. La migración se realizó para reemplazar un esquema antiguo por uno nuevo y más completo, con módulos adicionales para gestión de pedidos, clientes, inventario y más funcionalidades.

## Problema Inicial

El proyecto contaba con un esquema básico de Prisma que solo manejaba menús, categorías y opciones de personalización. Queríamos expandirlo para incluir un sistema completo de restaurante con delivery.

Al intentar implementar el nuevo schema, nos encontramos con varios errores de validación y problemas con las migraciones existentes.

## Proceso de Migración Paso a Paso

### 1. Actualización del Archivo schema.prisma

Primero, actualizamos el archivo `schema.prisma` con los nuevos modelos y relaciones.

```bash
# Editar el archivo schema.prisma con el nuevo esquema
nano prisma/schema.prisma
```

### 2. Primer Intento de Migración

Al intentar crear una nueva migración, encontramos un error de validación:

```bash
npx prisma migrate dev --name init_new_db
```

**Error encontrado**: Relación faltante entre los modelos `Reservation` y `Customer`.

```
Error: Prisma schema validation - (validate wasm)
Error code: P1012
error: Error validating field `customer` in model `Reservation`: The relation field `customer` on model `Reservation` is missing an opposite relation field on the model `Customer`. Either run `prisma format` or add it manually.
```

### 3. Corrección del Schema

Refactorizamos el schema para corregir las relaciones bidireccionales faltantes:

- Agregamos `reservations Reservation[]` al modelo `Customer`
- Agregamos la relación faltante a `menuItem` en el modelo `CustomerFavorite`
- Corregimos la cardinalidad de la relación `reviews` en el modelo `Order`

```bash
# Editar el archivo para corregir las relaciones
nano prisma/schema.prisma
```

### 4. Segundo Intento de Migración

Al intentar nuevamente, encontramos un error diferente relacionado con archivos de migración faltantes:

```bash
npx prisma migrate dev --name init_new_db
```

**Error encontrado**: Archivo de migración no encontrado.

```
Error: P3015
Could not find the migration file at prisma/migrations/20250225033211_update_category_id_to_string/migration.sql.
```

Esto indicaba una inconsistencia entre el historial de migraciones local y el estado de la base de datos.

### 5. Reseteo Completo de Migraciones

Para resolver el problema, decidimos reiniciar completamente las migraciones:

```bash
# Eliminar toda la carpeta de migraciones
rm -rf prisma/migrations

# Crear una nueva migración inicial
npx prisma migrate dev --name init
```

Prisma detectó la discrepancia (drift) entre el estado esperado y el actual de la base de datos:

```
- Drift detected: Your database schema is not in sync with your migration history.
[+] Added tables
  - categories
  - customization_options
  - menu_items
[*] Changed the `categories` table
  [+] Added unique index on columns (name)
[*] Changed the `customization_options` table
  [+] Added foreign key on columns (menuItemId)
[*] Changed the `menu_items` table
  [+] Added foreign key on columns (categoryId)
- The following migration(s) are applied to the database but missing from the local migrations directory: 20250224024950_init, 20250225033211_update_category_id_to_string
```

Al confirmar, Prisma:
1. Eliminó todos los datos y esquemas existentes
2. Aplicó una nueva migración inicial con todo el esquema actual
3. Sincronizó la base de datos con el nuevo esquema

### 6. Confirmación de Éxito

Después del proceso, Prisma generó los nuevos archivos de cliente y confirmó que la base de datos estaba sincronizada con el esquema:

```
Your database is now in sync with your schema.
✔ Generated Prisma Client (v5.22.0) to ./node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client in 533ms
```

## Resumen de Comandos Utilizados

```bash
# 1. Actualizar el schema.prisma con el nuevo esquema
nano prisma/schema.prisma

# 2. Intentar la migración (encontró error de relación)
npx prisma migrate dev --name init_new_db

# 3. Corregir el schema para arreglar las relaciones
nano prisma/schema.prisma

# 4. Intentar migración nuevamente (encontró error de archivo faltante)
npx prisma migrate dev --name init_new_db

# 5. Reseteo completo: eliminar carpeta de migraciones
rm -rf prisma/migrations

# 6. Crear una nueva migración inicial
npx prisma migrate dev --name init
```

## Lecciones Aprendidas

1. **Relaciones bidireccionales en Prisma**: Prisma requiere que las relaciones sean bidireccionales en la mayoría de los casos. Siempre que se define una relación en un modelo, debe existir la relación inversa en el otro modelo.

2. **Integridad del historial de migraciones**: Es crucial mantener intacto el historial de migraciones. Si se elimina un archivo de migración manualmente, puede causar problemas difíciles de resolver.

3. **Reseteo como última opción**: Eliminar todo el historial de migraciones y comenzar de nuevo es una solución efectiva pero drástica que debe usarse solo cuando otras opciones han fallado.

4. **Validación de esquema**: Es recomendable validar el esquema antes de intentar aplicar migraciones:
   ```bash
   npx prisma validate
   ```

## Próximos Pasos

1. Desarrollar los servicios y controladores para los nuevos modelos
2. Implementar las APIs para interactuar con estos modelos
3. Realizar pruebas exhaustivas para garantizar que todos los módulos funcionen correctamente
4. Documentar las nuevas funcionalidades para facilitar su uso por el equipo de frontend

---

Este proceso de migración ha establecido una base sólida para el desarrollo futuro del sistema de gestión de restaurante, con un esquema de base de datos robusto y bien estructurado.