# Issue: Refactorización Inicial del Backend

## Título

Refactorización de la arquitectura del backend para sistema de restaurante

## Descripción

Necesitamos refactorizar el backend actual para seguir la nueva arquitectura propuesta en el documento "Nueva Arquitectura para el Backend de Restaurante.md". Esto servirá como base para implementar las nuevas funcionalidades definidas en el schema de Prisma expandido.

## Objetivos

- Crear una estructura de carpetas modular y escalable
- Refactorizar los modelos, servicios y controladores existentes
- Mejorar la configuración central de la aplicación
- Establecer las bases para el desarrollo futuro de las nuevas funcionalidades

## Tareas

### 1. Preparación y estructura base

- [ ] Revisar y actualizar `package.json` con las dependencias necesarias
- [ ] Crear la nueva estructura de carpetas según la arquitectura propuesta
- [ ] Actualizar los archivos de configuración en `src/config/`
  - [ ] Revisar `database.ts` para optimizar la conexión con Prisma
  - [ ] Actualizar `env.ts` para centralizar todas las variables de entorno
  - [ ] Crear/actualizar `logger.ts` para la configuración de logging

### 2. Migración del Schema de Prisma

- [ ] Actualizar `schema.prisma` para incluir los modelos existentes con las mejoras propuestas
- [ ] Ejecutar la migración para actualizar la base de datos
- [ ] Verificar que los cambios no afecten los datos existentes

### 3. Refactorización de servicios existentes

- [ ] Mover e implementar `menuItemService.ts` (refactorizado de `menuService.ts`)
- [ ] Mover e implementar `categoryService.ts`
- [ ] Mover e implementar `customizationService.ts`
- [ ] Crear interfaces y tipos definidos para los servicios

### 4. Refactorización de controladores existentes

- [ ] Mover e implementar `menuItemController.ts` (refactorizado de `menuController.ts`)
- [ ] Mover e implementar `categoryController.ts`
- [ ] Mover e implementar `customizationController.ts`
- [ ] Asegurar que los controladores usen correctamente los servicios refactorizados

### 5. Refactorización de middleware

- [ ] Mejorar `errorHandler.ts` para soportar todos los tipos de errores
- [ ] Actualizar `validation.ts` para organizarlo por dominio
- [ ] Implementar middleware de logging
- [ ] Asegurar que el middleware de autenticación funcione correctamente

### 6. Refactorización de rutas

- [ ] Mover e implementar las rutas para menú, categorías y opciones de personalización
- [ ] Crear un archivo de índice de rutas para cada dominio funcional
- [ ] Actualizar la configuración de rutas en `app.ts`

### 7. Pruebas y validación

- [ ] Implementar pruebas unitarias para los servicios refactorizados
- [ ] Implementar pruebas de integración para las API refactorizadas
- [ ] Validar que la funcionalidad existente sigue funcionando correctamente

### 8. Documentación

- [ ] Actualizar README con instrucciones para la nueva estructura
- [ ] Documentar el proceso de migración para futuros desarrolladores
- [ ] Actualizar la documentación de API si existe

## Prioridad

Alta - Esta refactorización es crítica para el desarrollo futuro del sistema

## Estimación

2-3 semanas para la refactorización completa

## Dependencias

Ninguna, este es el punto de partida para las nuevas funcionalidades

## Notas

- Mantener la aplicación funcionando durante todo el proceso de refactorización
- Seguir un enfoque incremental, completando una parte a la vez
- Realizar commits frecuentes y específicos para facilitar el seguimiento de cambios
