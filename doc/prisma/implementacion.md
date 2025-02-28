# Prisma y Render: Configuración de Base de Datos - Guía Completa

Esta guía proporciona todos los pasos necesarios para crear, configurar y conectar una base de datos PostgreSQL en Render usando Prisma como ORM para tu aplicación.

## Índice

- [Prisma y Render: Configuración de Base de Datos - Guía Completa](#prisma-y-render-configuración-de-base-de-datos---guía-completa)
  - [Índice](#índice)
  - [Requisitos Previos](#requisitos-previos)
  - [Crear una Base de Datos en Render](#crear-una-base-de-datos-en-render)
  - [Configurar Prisma en tu Proyecto](#configurar-prisma-en-tu-proyecto)
  - [Definir tu Esquema Prisma](#definir-tu-esquema-prisma)
  - [Inicializar la Base de Datos con Prisma](#inicializar-la-base-de-datos-con-prisma)
  - [Conectar tu Aplicación a la Base de Datos](#conectar-tu-aplicación-a-la-base-de-datos)
  - [Desplegar tu Aplicación en Render](#desplegar-tu-aplicación-en-render)
  - [Migrar Datos de otra Base de Datos (Opcional)](#migrar-datos-de-otra-base-de-datos-opcional)
  - [Consideraciones de Seguridad](#consideraciones-de-seguridad)
  - [Solución de Problemas Comunes](#solución-de-problemas-comunes)
  - [Recursos Adicionales](#recursos-adicionales)

## Requisitos Previos

- Una cuenta en [Render](https://render.com/)
- Node.js y npm instalados en tu máquina local
- Git para control de versiones
- Conocimientos básicos de SQL y bases de datos relacionales

## Crear una Base de Datos en Render

1. **Inicia sesión** en tu cuenta de Render.

2. **Crea una nueva base de datos PostgreSQL**:
   - Haz clic en "New +" en el dashboard
   - Selecciona "PostgreSQL"

3. **Configura tu base de datos**:
   - **Nombre**: Introduce un nombre para tu servicio (ej. `mi-aplicacion-db`)
   - **Base de datos**: Nombre para tu base de datos (ej. `mi_aplicacion`)
   - **Usuario**: Se generará automáticamente
   - **Región**: Selecciona la más cercana a tus usuarios
   - **Plan**: Selecciona el plan adecuado para tus necesidades (hay opciones gratuitas para desarrollo)

4. **Crea la base de datos** haciendo clic en "Create Database"

5. **Guarda la información de conexión**:
   - Una vez creada, Render mostrará la información de conexión
   - Guarda el **Internal Database URL** y **External Database URL**
   - Estas URLs tienen el formato: `postgresql://usuario:contraseña@host:puerto/nombre_db`

## Configurar Prisma en tu Proyecto

1. **Inicia un proyecto** de Node.js (si aún no tienes uno):

   ```bash
   mkdir mi-proyecto
   cd mi-proyecto
   npm init -y
   ```

2. **Instala Prisma** como dependencia de desarrollo:

   ```bash
   npm install prisma --save-dev
   ```

3. **Inicializa Prisma** en tu proyecto:

   ```bash
   npx prisma init
   ```

   Esto creará:
   - Una carpeta `prisma` con un archivo `schema.prisma`
   - Un archivo `.env` para variables de entorno

4. **Configura la URL de conexión** en el archivo `.env`:

   ```sql
   DATABASE_URL="postgresql://usuario:contraseña@host:puerto/nombre_db?schema=public"
   ```

   Sustituye con la información proporcionada por Render. Para desarrollo local, usa la URL externa.

## Definir tu Esquema Prisma

Edita el archivo `prisma/schema.prisma` para definir tus modelos:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Define tus modelos aquí
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Personaliza estos modelos según las necesidades de tu aplicación.

## Inicializar la Base de Datos con Prisma

1. **Generar una migración** basada en tu esquema:

   ```bash
   npx prisma migrate dev --name init
   ```

   Esto:
   - Crea un archivo de migración SQL en `prisma/migrations`
   - Aplica la migración a tu base de datos
   - Genera el cliente Prisma

2. **Verificar la estructura** de la base de datos con Prisma Studio:

   ```bash
   npx prisma studio
   ```

   Se abrirá una interfaz web en `http://localhost:5555` donde podrás explorar y editar tus datos.

## Conectar tu Aplicación a la Base de Datos

1. **Instala el cliente** de Prisma:

   ```bash
   npm install @prisma/client
   ```

2. **Crea un archivo** para la instancia del cliente (por ejemplo, `prisma.js`):

   ```javascript
   // prisma.js
   const { PrismaClient } = require('@prisma/client');
   
   const prisma = new PrismaClient();
   
   module.exports = prisma;
   ```

3. **Utiliza el cliente** en tu aplicación:

   ```javascript
   // Ejemplo de uso en Express
   const express = require('express');
   const prisma = require('./prisma');
   
   const app = express();
   app.use(express.json());
   
   // Crear un usuario
   app.post('/users', async (req, res) => {
     try {
       const user = await prisma.user.create({
         data: req.body,
       });
       res.json(user);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   
   // Obtener todos los usuarios
   app.get('/users', async (req, res) => {
     try {
       const users = await prisma.user.findMany();
       res.json(users);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
   });
   ```

## Desplegar tu Aplicación en Render

1. **Prepara tu aplicación** para producción:
   - Asegúrate de que tu código esté en un repositorio Git
   - Incluye un `Procfile` o configura los comandos de inicio en `package.json`

2. **Crea un nuevo Web Service** en Render:
   - Conecta tu repositorio Git
   - Configura Build Command (ej. `npm install && npx prisma generate`)
   - Configura Start Command (ej. `npm start`)

3. **Configura las variables** de entorno:
   - Añade `DATABASE_URL` usando la URL interna proporcionada por Render
   - Añade cualquier otra variable de entorno que necesite tu aplicación

4. **Implementa el servicio**:
   - Haz clic en "Create Web Service"
   - Render desplegará automáticamente tu aplicación

5. **Configura el despliegue automático** de migraciones (opcional):
   - Actualiza el Build Command para incluir las migraciones:

   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy
   ```

## Migrar Datos de otra Base de Datos (Opcional)

Si necesitas migrar datos de una base de datos existente (por ejemplo, de Railway a Render):

1. **Crea un script** de migración (guárdalo como `migrate-data.js`):

   ```javascript
   const { PrismaClient } = require('@prisma/client');

   // Conexión a la base de datos de origen
   const sourcePrisma = new PrismaClient({
     datasources: {
       db: {
         url: "postgresql://usuario:contraseña@host-origen:puerto/db-origen"
       }
     }
   });

   // Conexión a la base de datos de destino (Render)
   const targetPrisma = new PrismaClient({
     datasources: {
       db: {
         url: "postgresql://usuario:contraseña@host-render:puerto/db-render"
       }
     }
   });

   async function migrateData() {
     try {
       console.log('Iniciando migración de datos...');

       // Ejemplo: Migrar usuarios
       const users = await sourcePrisma.user.findMany();
       console.log(`Encontrados ${users.length} usuarios para migrar...`);

       for (const user of users) {
         // Eliminar campos generados automáticamente
         const { id, createdAt, updatedAt, ...userData } = user;
         
         // Crear en la nueva base de datos
         await targetPrisma.user.create({
           data: {
             ...userData,
             id: id  // Mantener mismo ID para preservar relaciones
           }
         });
       }
       console.log('¡Usuarios migrados exitosamente!');

       // Repite para otros modelos...

       console.log('¡Migración de datos completada con éxito!');
     } catch (error) {
       console.error('Error migrando datos:', error);
     } finally {
       await sourcePrisma.$disconnect();
       await targetPrisma.$disconnect();
     }
   }

   migrateData();
   ```

2. **Ejecuta el script** de migración:

   ```bash
   node migrate-data.js
   ```

3. **Verifica los datos** migrados:

   ```bash
   npx prisma studio
   ```

## Consideraciones de Seguridad

1. **No comitees las credenciales** de base de datos en tu repositorio:
   - Asegúrate de que `.env` esté en tu `.gitignore`

2. **Usa variables de entorno** para todas las credenciales.

3. **Configura SSL** para la conexión de la base de datos:

   ```bash
   DATABASE_URL="postgresql://usuario:contraseña@host:puerto/nombre_db?schema=public&sslmode=require"
   ```

4. **Implementa timeouts** para las conexiones a la base de datos:

   ```javascript
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
     // Configurar timeout de conexión
     log: ['query', 'info', 'warn', 'error'],
   });
   ```

5. **Restringe el acceso** a tu base de datos:
   - Usa la URL interna de Render para servicios desplegados en Render
   - Configura IP allowlisting en Render si accedes desde fuera

## Solución de Problemas Comunes

1. **Error de conexión**:

   ```bash
   Error: P1001: Can't reach database server at `host:port`
   ```

   **Solución**: Verifica que:
   - La URL de la base de datos sea correcta
   - La base de datos esté en ejecución
   - Los firewall no bloqueen la conexión

2. **Error de migración**:

   ```bash
   Error: P3014: Prisma Migrate could not create the shadow database
   ```

   **Solución**:
   - Usa `prisma db push` en lugar de `prisma migrate dev` para entornos de desarrollo
   - Verifica los permisos del usuario de la base de datos

3. **Error de esquema**:

   ```bash
   Error: P2002: Unique constraint failed on the fields: (`email`)
   ```

   **Solución**: Los datos que intentas insertar violan restricciones de unicidad. Verifica tus datos.

4. **Problemas de rendimiento**:

   **Solución**:
   - Añade índices a tu esquema
   - Optimiza tus consultas
   - Considera usar un plan de mayor rendimiento en Render

---

## Recursos Adicionales

- [Documentación oficial de Prisma](https://www.prisma.io/docs/)
- [Documentación de Render para PostgreSQL](https://render.com/docs/databases)
- [Mejores prácticas de seguridad para bases de datos](https://render.com/docs/security)

Con esta guía, deberías poder configurar completamente una base de datos PostgreSQL en Render utilizando Prisma como ORM para tu aplicación Node.js.
