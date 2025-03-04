# Desarrollar Backend Etapa 2

## Objetivo

Esta segunda etapa se centra en expandir la funcionalidad del backend para completar el **Sistema de Menú** e implementar el **Sistema de Autenticación de Usuarios**. Estos componentes son fundamentales y permitirán probar el backend con una aplicación frontend real.

## Funcionalidades a implementar

### 1. Sistema de Menú (Completar)

#### 1.1 Productos (MenuItem)

- **Servicio**:
  - Métodos CRUD completos
  - Búsqueda con filtros (por categoría, disponibilidad, precio, etc.)
  - Ordenamiento y paginación
  - Manejo de imágenes (referencias a URLs)

- **Controlador**:
  - Endpoints para listado, detalle, creación, actualización y eliminación
  - Soporte para búsqueda y filtros vía query params
  - Respuestas paginadas

- **Validadores**:
  - Reglas para todos los campos (nombre, precio, descripción, etc.)
  - Validación específica para referencias a categorías existentes

- **Rutas**:
  - GET /api/menu-items
  - GET /api/menu-items/:id
  - POST /api/menu-items
  - PUT /api/menu-items/:id
  - DELETE /api/menu-items/:id
  - GET /api/menu-items/category/:categoryId

#### 1.2 Opciones de Personalización

- **Servicio**:
  - CRUD para opciones de personalización
  - Gestión de grupos de opciones mutuamente excluyentes

- **Controlador**:
  - Endpoints para gestionar opciones de personalización
  - Asociación con productos específicos

- **Validadores**:
  - Validación para precios, nombres y comportamiento
  - Reglas para opciones mutuamente excluyentes

- **Rutas**:
  - GET /api/menu-items/:id/customizations
  - POST /api/menu-items/:id/customizations
  - PUT /api/customizations/:id
  - DELETE /api/customizations/:id

### 2. Sistema de Autenticación y Usuarios

#### 2.1 Gestión de Usuarios

- **Servicio**:
  - Registro de usuarios
  - Consulta, actualización y desactivación
  - Cambio de contraseña
  - Gestión de roles

- **Controlador**:
  - Endpoints para administración de usuarios
  - Filtros para listado

- **Validadores**:
  - Reglas para validación de contraseñas
  - Validación de emails y datos personales
  - Reglas para asignación de roles

- **Rutas**:
  - GET /api/users (admin)
  - GET /api/users/:id (admin/propietario)
  - POST /api/users (admin)
  - PUT /api/users/:id (admin/propietario)
  - DELETE /api/users/:id (admin)
  - PUT /api/users/:id/role (admin)

#### 2.2 Autenticación

- **Servicio**:
  - Login con JWT
  - Refresco de tokens
  - Logout (invalidación de tokens)
  - Perfil de usuario

- **Controlador**:
  - Endpoints para login/logout
  - Endpoint para refrescar tokens
  - Endpoint para datos de perfil

- **Validadores**:
  - Validación de credenciales
  - Validación de tokens

- **Rutas**:
  - POST /api/auth/login
  - POST /api/auth/refresh-token
  - POST /api/auth/logout
  - GET /api/auth/profile
  - PUT /api/auth/change-password

## Partes a desarrollar en esta etapa

1. **Tipos y DTOs**:
   - Ampliación de los tipos existentes en `types/menu.ts`
   - Creación/completado de tipos en `types/auth.ts`

2. **Servicios**:
   - Implementación de `menuItemService.ts`
   - Implementación de `customizationService.ts`
   - Implementación de `userService.ts`
   - Implementación de `authService.ts`

3. **Controladores**:
   - Implementación de `menuItemController.ts`
   - Implementación de `customizationController.ts`
   - Implementación de `userController.ts`
   - Implementación de `authController.ts`

4. **Validadores**:
   - Implementación de `menuItemValidators.ts`
   - Implementación de `customizationValidators.ts`
   - Implementación de `userValidators.ts`
   - Implementación de `authValidators.ts`

5. **Rutas**:
   - Implementación de `menuItemRoutes.ts`
   - Actualización de `routes/index.ts` para incluir las nuevas rutas
   - Implementación de `authRoutes.ts`
   - Implementación de `userRoutes.ts`

## Tareas específicas

### MenuItem (Productos)

1. Implementar el tipo `MenuItemDTO` y relacionados
2. Crear el servicio con métodos CRUD y búsqueda
3. Implementar el controlador con endpoints REST
4. Desarrollar validadores para entradas de API
5. Configurar rutas con protección adecuada

### Opciones de Personalización

1. Implementar el tipo `CustomizationOptionDTO` y relacionados
2. Crear el servicio para gestión de opciones
3. Implementar el controlador con endpoints
4. Desarrollar validadores específicos
5. Configurar rutas asociadas a productos

### Autenticación y Usuarios

1. Implementar los tipos necesarios para auth y usuarios
2. Crear servicios para gestión de usuarios y autenticación
3. Implementar controladores para registro, login y perfil
4. Desarrollar validadores para credenciales y datos de usuario
5. Configurar rutas con distintos niveles de acceso

## Beneficios al completar esta etapa

- Sistema de menú totalmente funcional (categorías, productos, personalizaciones)
- Autenticación completa para proteger rutas
- Gestión de usuarios y perfiles
- Backend suficientemente completo para integrarse con un frontend básico

## Pruebas recomendadas

1. **Pruebas de integración** para CRUD de productos
2. **Pruebas de autenticación** para verificar protección de rutas
3. **Pruebas de validación** para confirmar reglas de negocio
4. **Pruebas de búsqueda/filtrado** para menú items

## Consideraciones para implementación

- Mantener coherencia con patrones de código ya establecidos
- Asegurar que toda nueva funcionalidad incluya logging adecuado
- Documentar cada nuevo endpoint para referencia
- Implementar primero los tipos y servicios, luego controladores y rutas
