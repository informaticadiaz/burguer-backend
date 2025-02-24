# Guía de Despliegue: Backend y Base de Datos en Render

## Índice

- [Configuración de Base de Datos PostgreSQL](#configuración-de-base-de-datos-postgresql)
- [Despliegue del Backend](#despliegue-del-backend)
- [Mejores Prácticas](#mejores-prácticas)
- [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
- [Resolución de Problemas Comunes](#resolución-de-problemas-comunes)

## Configuración de Base de Datos PostgreSQL

### Creación de la Base de Datos

1. Accede al Dashboard de Render
2. Selecciona "New +" → "PostgreSQL"
3. Configura los siguientes parámetros:
   - Name: `restaurant-menu-db`
   - Database: `restaurant_menu`
   - User: Dejar el generado automáticamente
   - Region: Seleccionar la más cercana a tus usuarios
   - PostgreSQL Version: 15 (recomendado)

### Configuración de Seguridad

1. Habilitar SSL/TLS
2. Configurar backup automático (Plan pagado)
3. Establecer reglas de firewall si es necesario
4. Guardar las credenciales de manera segura

### Consideraciones de Rendimiento

- Elegir el plan adecuado según las necesidades
- Monitorear el uso de conexiones
- Configurar pool de conexiones apropiadamente
- Implementar índices necesarios

## Despliegue del Backend

### Preparación del Proyecto

1. Asegúrate de tener los siguientes archivos:

   ```json
   - Dockerfile (opcional)
   - .dockerignore (si usas Docker)
   - .env.example
   - package.json
   - prisma/schema.prisma
   ```

2. Configura los scripts en package.json:

   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/app.js",
       "prisma:generate": "prisma generate",
       "prisma:migrate": "prisma migrate deploy"
     }
   }
   ```

### Configuración en Render

1. Crear nuevo Web Service
2. Conectar con repositorio de GitHub
3. Configurar build settings:

   ```js
   Build Command: npm install && npm run build && npx prisma generate
   Start Command: npm start
   ```

4. Variables de Entorno Necesarias:

   ```js
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=https://tu-frontend.vercel.app
   ```

### Configuración de CI/CD

1. Configurar automatic deploys
2. Establecer branch de producción
3. Configurar health checks
4. Establecer reglas de rollback

## Mejores Prácticas

### Seguridad

1. **Variables de Entorno**
   - No commitear archivos .env
   - Usar secrets management
   - Rotar credenciales regularmente

2. **Configuración de CORS**

   ```typescript
   app.use(cors({
     origin: process.env.CORS_ORIGIN,
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

3. **Rate Limiting**

   ```typescript
   import rateLimit from 'express-rate-limit';

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 100 // límite por IP
   });

   app.use(limiter);
   ```

### Performance

1. **Conexión a Base de Datos**

   ```typescript
   const prisma = new PrismaClient({
     log: ['query', 'info', 'warn', 'error'],
     datasources: {
       db: {
         url: process.env.DATABASE_URL
       }
     }
   });
   ```

2. **Compresión**

   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

3. **Caching**

   ```typescript
   import cache from 'memory-cache';

   const cacheMiddleware = (duration: number) => {
     return (req: Request, res: Response, next: NextFunction) => {
       const key = '__express__' + req.originalUrl;
       const cachedBody = cache.get(key);

       if (cachedBody) {
         res.send(cachedBody);
         return;
       }

       res.sendResponse = res.send;
       res.send = (body: any) => {
         cache.put(key, body, duration * 1000);
         res.sendResponse(body);
       };
       next();
     };
   };
   ```

## Monitoreo y Mantenimiento

### Logging

1. Configurar Winston para logs estructurados:

   ```typescript
   import winston from 'winston';

   const logger = winston.createLogger({
     level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.json()
     ),
     transports: [
       new winston.transports.Console(),
       new winston.transports.File({ filename: 'error.log', level: 'error' })
     ]
   });
   ```

2. Implementar middleware de logging:

   ```typescript
   app.use((req, res, next) => {
     logger.info(`${req.method} ${req.path}`, {
       query: req.query,
       ip: req.ip,
       userAgent: req.get('user-agent')
     });
     next();
   });
   ```

### Backups

1. Configurar backups automáticos en Render
2. Establecer política de retención
3. Probar proceso de restauración
4. Documentar procedimientos

### Monitoreo

1. Configurar alertas en Render
2. Monitorear métricas clave:
   - Uso de CPU/Memoria
   - Tiempo de respuesta
   - Tasa de errores
   - Conexiones activas a BD

## Resolución de Problemas Comunes

### Problemas de Conexión a BD

1. Verificar string de conexión
2. Comprobar límites de conexiones
3. Validar configuración SSL
4. Revisar logs de Prisma

### Errores de Build

1. Limpiar cache de build
2. Verificar versiones de dependencias
3. Comprobar scripts de build
4. Revisar logs de build

### Problemas de Performance

1. Analizar queries lentas
2. Revisar índices
3. Verificar conexiones activas
4. Optimizar consultas N+1

### Problemas de Memoria

1. Configurar límites adecuados
2. Implementar garbage collection
3. Monitorear memory leaks
4. Optimizar uso de recursos

---

## Comandos Útiles

### Database

```bash
# Aplicar migraciones
npx prisma migrate deploy

# Generar cliente Prisma
npx prisma generate

# Verificar estado de la base de datos
npx prisma db seed
```

### Monitoreo

```bash
# Ver logs en tiempo real
render logs --follow

# Verificar estado del servicio
curl https://tu-api.render.com/health

# Monitorear métricas
render metrics --service tu-servicio
```

---

## Referencias

- [Documentación de Render](https://render.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
