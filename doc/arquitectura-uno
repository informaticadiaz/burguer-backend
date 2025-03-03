# Guía Arquitectónica del Backend de Restaurante: Una Perspectiva para Desarrolladores Junior

## Introducción

Este documento ofrece una visión general de la arquitectura del backend para nuestro sistema de gestión de restaurante. Está diseñado para ayudar a desarrolladores junior a comprender la estructura, los componentes clave y los procesos fundamentales del sistema, a la vez que proporciona contexto teórico para las decisiones arquitectónicas.

## Estructura de Carpetas y sus Funcionalidades

### `/src` - Código Fuente

El corazón de nuestra aplicación donde reside todo el código.

#### `/src/config`

Esta carpeta contiene archivos de configuración que centralizan parámetros importantes del sistema.

- `database.ts` - Configuración de la conexión a la base de datos mediante Prisma
- `env.ts` - Gestión de variables de entorno
- `logger.ts` - Configuración del sistema de registro de eventos

**Fundamento teórico:** La centralización de la configuración sigue el principio de "Single Source of Truth", reduciendo la duplicación y facilitando los cambios globales. Este enfoque permite modificar el comportamiento del sistema sin alterar el código fuente.

#### `/src/controllers`

Los controladores manejan las solicitudes HTTP, coordinan la lógica de negocio y devuelven respuestas apropiadas.

- `/menu` - Controladores para gestión del menú y productos
- `/order` - Controladores para gestión de pedidos
- `/customer` - Controladores para gestión de clientes
- `/delivery` - Controladores para gestión de entregas y repartidores
- `/inventory` - Controladores para gestión de inventario
- `/promotion` - Controladores para promociones y descuentos
- `/reservation` - Controladores para reservas
- `/system` - Controladores para configuración del sistema
- `/auth` - Controladores para autenticación y usuarios

**Fundamento teórico:** Los controladores implementan el patrón MVC (Modelo-Vista-Controlador), actuando como intermediarios entre las solicitudes del cliente y la lógica de negocio. Esta separación mejora la mantenibilidad y testabilidad del código al aislar las responsabilidades.

#### `/src/services`

Contienen la lógica de negocio de la aplicación, independiente de la capa de presentación.

- Carpetas organizadas por dominios (`/menu`, `/order`, etc.)
- `/common` - Servicios compartidos entre dominios (notificaciones, pagos, etc.)

**Fundamento teórico:** Los servicios implementan el patrón de "Separation of Concerns" separando la lógica de negocio de otras responsabilidades. Esto facilita la reutilización de código y simplifica la implementación de pruebas unitarias.

#### `/src/routes`

Define los puntos de entrada de la API y conecta rutas con controladores.

- Archivos separados por dominio funcional (`menuRoutes.ts`, `orderRoutes.ts`, etc.)

**Fundamento teórico:** La organización de rutas por dominio implementa el principio de "Cohesión Funcional", agrupando funcionalidades relacionadas. Este enfoque mejora la navegabilidad del código y facilita encontrar rutas específicas.

#### `/src/middleware`

Funciones que procesan las solicitudes antes de llegar a los controladores.

- `auth.ts` - Verificación de autenticación
- `validation.ts` - Validación de datos de entrada
- `errorHandler.ts` - Manejo centralizado de errores
- `rateLimiter.ts` - Prevención de ataques por exceso de solicitudes
- `logger.ts` - Registro de solicitudes

**Fundamento teórico:** Los middleware implementan el patrón "Chain of Responsibility", donde cada componente procesa la solicitud y decide si pasarla al siguiente en la cadena. Esto permite añadir funcionalidades transversales sin modificar los controladores.

#### `/src/utils`

Funciones utilitarias reutilizables en toda la aplicación.

- `/validators` - Validadores específicos por dominio
- `formatters.ts` - Funciones para formatear datos
- `pagination.ts` - Utilidades para paginación
- `errors.ts` - Clases personalizadas de error
- `helpers.ts` - Funciones auxiliares generales

**Fundamento teórico:** Las utilidades implementan el principio DRY (Don't Repeat Yourself), centralizando funcionalidades comunes para reducir la duplicación de código y asegurar consistencia en su comportamiento.

#### `/src/types`

Definiciones de tipos TypeScript para garantizar consistencia en toda la aplicación.

- Archivos organizados por dominio funcional

**Fundamento teórico:** Los tipos estáticos proporcionan seguridad en tiempo de compilación, documentación implícita y mejoran la experiencia de desarrollo mediante autocompletado.

### `/prisma` - Gestión de Base de Datos

- `schema.prisma` - Define la estructura de la base de datos
- `/migrations` - Cambios incrementales en la estructura de la base de datos
- `seed.ts` - Script para poblar datos iniciales

**Fundamento teórico:** Prisma implementa el patrón ORM (Object-Relational Mapping), que permite trabajar con la base de datos usando objetos en lugar de SQL directo. Esto reduce el riesgo de inyección SQL y mejora la productividad del desarrollador.

### `/tests` - Pruebas Automatizadas

- `/unit` - Pruebas de unidades individuales
- `/integration` - Pruebas de múltiples componentes trabajando juntos

**Fundamento teórico:** La pirámide de pruebas sugiere tener más pruebas unitarias (rápidas y enfocadas) que pruebas de integración (más lentas pero más completas). Las pruebas automatizadas garantizan que el código siga funcionando correctamente después de cambios.

## Procesos Clave del Backend

### 1. Gestión de Pedidos

El flujo de un pedido pasa por varias etapas desde su creación hasta la entrega:

1. **Creación del pedido** (Controller -> Service -> Database)
   - Validación de datos de entrada
   - Verificación de disponibilidad de productos
   - Cálculo de precios y aplicación de promociones
   - Persistencia en la base de datos

2. **Actualización de estados** (mediante el patrón State)
   - Cada cambio de estado se registra en `OrderStatusHistory`
   - Notificaciones enviadas en cambios relevantes

3. **Asignación a repartidores** (si aplica)
   - Selección de repartidor disponible
   - Actualización del estado del pedido
   - Notificación al repartidor

**Fundamento teórico:** El proceso de pedidos implementa el patrón State, donde el comportamiento del objeto cambia según su estado interno. También utiliza el patrón Observer para notificaciones, permitiendo que múltiples componentes reaccionen a cambios de estado sin acoplamientos fuertes.

### 2. Gestión de Inventario

El inventario se actualiza automáticamente con cada pedido:

1. **Recepción de mercancía**
   - Registro de nuevos productos
   - Actualización de niveles de inventario
   - Registro de costos

2. **Consumo con pedidos**
   - Reducción de inventario al confirmar pedidos
   - Alertas de stock bajo
   - Seguimiento de uso de ingredientes

**Fundamento teórico:** La gestión de inventario implementa el patrón Repository para abstraer la persistencia y recuperación de datos, facilitando la sustitución de la implementación sin cambiar la lógica de negocio.

### 3. Autenticación y Autorización

1. **Proceso de autenticación**
   - Verificación de credenciales
   - Generación de tokens JWT
   - Gestión de refresh tokens

2. **Control de acceso basado en roles**
   - Middleware que verifica permisos
   - Diferentes niveles de acceso por rol

**Fundamento teórico:** La seguridad implementa el patrón JWT (JSON Web Tokens) que permite autenticación stateless, y RBAC (Role-Based Access Control) para autorización. Estos enfoques son escalables y reducen la carga en la base de datos.

## Capas de la Aplicación

Nuestra arquitectura sigue un modelo de capas que separa responsabilidades:

### 1. Capa de Presentación (Routes y Controllers)

- Recibe solicitudes HTTP
- Valida datos de entrada
- Devuelve respuestas apropiadas
- No contiene lógica de negocio

### 2. Capa de Lógica de Negocio (Services)

- Implementa reglas de negocio
- Coordina operaciones complejas
- Independiente de la presentación
- Usa transacciones para operaciones atómicas

### 3. Capa de Acceso a Datos (Prisma Client)

- Interactúa con la base de datos
- Abstrae consultas SQL
- Garantiza integridad de datos

**Fundamento teórico:** La arquitectura en capas implementa el principio de "Separation of Concerns", donde cada capa tiene responsabilidades específicas. Esto mejora la mantenibilidad, testabilidad y escalabilidad del sistema.

## El Flujo de una Solicitud HTTP

Para entender mejor cómo funciona el sistema, sigamos el flujo de una solicitud desde que llega hasta que se devuelve la respuesta:

1. **La solicitud llega al servidor**
   - Express recibe la solicitud HTTP

2. **Middleware global**
   - Logging de la solicitud
   - Verificación de autenticación (si aplica)
   - Validación de datos

3. **Enrutamiento**
   - El router identifica el controlador correspondiente

4. **Controlador**
   - Extrae parámetros y cuerpo de la solicitud
   - Llama al servicio apropiado

5. **Servicio**
   - Implementa la lógica de negocio
   - Interactúa con la base de datos mediante Prisma
   - Maneja excepciones y casos especiales

6. **Respuesta**
   - El controlador formatea la respuesta
   - Se envía al cliente con el código HTTP apropiado

**Fundamento teórico:** Este flujo implementa el patrón Pipe and Filter, donde cada componente procesa la solicitud y la pasa al siguiente. Esta arquitectura permite insertar o modificar componentes con impacto mínimo en el resto del sistema.

## Estrategias de Desarrollo y Despliegue

### Desarrollo Basado en Características

El desarrollo se organiza en fases y características, siguiendo un enfoque incremental:

1. **Fase 1: Núcleo del Sistema**
2. **Fase 2: Funcionalidades de Delivery**
3. **Fase 3: Promociones y Fidelización**
4. **Fase 4: Gestión Avanzada**
5. **Fase 5: Características Adicionales**

**Fundamento teórico:** El desarrollo incremental permite entregar valor más rápidamente y adaptarse a cambios en los requisitos. Este enfoque reduce el riesgo de proyectos grandes al dividirlos en partes manejables.

### Entornos y Despliegue

El sistema usa múltiples entornos para garantizar la calidad:

- **Desarrollo**: Para desarrollo local
- **Staging**: Para pruebas antes de producción
- **Producción**: Entorno de usuario final

**Fundamento teórico:** La estrategia de múltiples entornos implementa el principio de "fail fast", detectando problemas temprano cuando son menos costosos de resolver. La integración continua (CI) y el despliegue continuo (CD) automatizan este proceso.

## Conceptos Teóricos Fundamentales

### Arquitectura Hexagonal (Puertos y Adaptadores)

Nuestro sistema se inspira en la arquitectura hexagonal, que separa:

- **Núcleo de la aplicación**: Lógica de negocio pura (services)
- **Puertos**: Interfaces que define el núcleo (interfaces de servicios)
- **Adaptadores**: Implementaciones específicas para tecnologías (controladores, repositorios)

Esta separación permite cambiar tecnologías (base de datos, frameworks, etc.) sin afectar la lógica central.

### Principios SOLID

El código sigue los principios SOLID:

- **S** - Responsabilidad única (cada clase tiene una única razón para cambiar)
- **O** - Abierto/cerrado (abierto para extensión, cerrado para modificación)
- **L** - Sustitución de Liskov (las subclases deben poder sustituir a sus clases base)
- **I** - Segregación de interfaces (interfaces específicas son mejores que una general)
- **D** - Inversión de dependencias (depender de abstracciones, no implementaciones)

### Domain-Driven Design (DDD)

La organización por dominios funcionales (menu, order, customer, etc.) refleja principios de DDD:

- **Contextos delimitados**: Separación clara entre dominios
- **Lenguaje ubicuo**: Terminología consistente entre código y negocio
- **Agregados**: Grupos de entidades tratadas como una unidad (Order y sus OrderItems)

## Consejos Para Desarrolladores Junior

1. **Estudia los flujos completos**: Sigue el código desde la ruta hasta la base de datos y de vuelta
2. **Entiende los patrones utilizados**: Reconocer patrones te ayudará a entender el código más rápido
3. **Aprende Prisma**: La manipulación de datos es central en esta aplicación
4. **Ejecuta las pruebas**: Las pruebas son excelente documentación ejecutable
5. **Pregunta sobre decisiones arquitectónicas**: Entender el "por qué" mejora tu formación como desarrollador

## Recursos de Aprendizaje

Para profundizar tus conocimientos:

- **Prisma**: [Documentación oficial](https://www.prisma.io/docs/)
- **Arquitectura en Node.js**: "Node.js Design Patterns" por Mario Casciaro
- **TypeScript**: "Programming TypeScript" por Boris Cherny
- **Patrones de diseño**: "Head First Design Patterns" para conceptos generales
- **REST API**: "RESTful Web APIs" por Leonard Richardson

## Conclusión

Esta arquitectura está diseñada para equilibrar estructura y flexibilidad, permitiendo un desarrollo ágil sin sacrificar la calidad. A medida que avanzas como desarrollador, verás cómo estos patrones y principios te permiten construir sistemas más robustos y mantenibles.

La organización modular por dominios te permite concentrarte en áreas específicas sin tener que entender todo el sistema desde el principio. Comienza por una funcionalidad simple como categorías o clientes, y gradualmente avanza hacia procesos más complejos como pedidos.