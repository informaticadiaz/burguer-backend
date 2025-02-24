# Script para Corregir Importaciones en TypeScript

Este documento explica el script `fix-imports.js` que soluciona problemas de importación en proyectos TypeScript configurados con resolución de módulos `"node16"` o `"nodenext"`.

## Problema que resuelve

En las configuraciones modernas de TypeScript con `"moduleResolution": "node16"` o `"moduleResolution": "nodenext"`, las importaciones relativas requieren extensiones de archivo explícitas:

```typescript
// Incorrecto en 'node16'/'nodenext':
import { menuService } from '../services/menuService';

// Correcto:
import { menuService } from '../services/menuService.js';
```

## El Script

```javascript
// fix-imports.js
// Este script encuentra y corrige importaciones relativas en el directorio src
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else if (res.endsWith('.ts') || res.endsWith('.tsx')) {
      yield res;
    }
  }
}

// Esta expresión regular coincide con importaciones relativas sin extensiones de archivo
const importRegex = /from\s+['"](\.[^'"]*)['"]/g;

async function fixImports() {
  try {
    console.log('Corrigiendo importaciones de TypeScript...');
    
    for await (const filePath of getFiles('./src')) {
      let content = await readFile(filePath, 'utf8');
      let modified = false;
      
      // Reemplaza todas las importaciones relativas para agregar la extensión .js
      // Nota: Agregamos .js (no .ts) porque es lo que utilizará el JavaScript compilado
      content = content.replace(importRegex, (match, importPath) => {
        // No modificar si ya tiene una extensión
        if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
          return match;
        }
        
        modified = true;
        return `from '${importPath}.js'`;
      });
      
      if (modified) {
        await writeFile(filePath, content, 'utf8');
        console.log(`Importaciones corregidas en: ${filePath}`);
      }
    }
    
    console.log('¡Todas las importaciones fueron corregidas exitosamente!');
  } catch (error) {
    console.error('Error al corregir importaciones:', error);
  }
}

fixImports();
```

## Explicación Detallada

### Funciones Principales

1. **`getFiles(dir)`**: Un generador asíncrono que recorre recursivamente directorios para encontrar archivos TypeScript (`.ts` o `.tsx`).

2. **`importRegex`**: Una expresión regular que identifica declaraciones de importación con rutas relativas que no tienen extensiones de archivo.

3. **`fixImports()`**: La función principal que procesa cada archivo y actualiza las importaciones.

### Proceso del Script

1. **Recorrido de archivos**:
   - El script comienza en el directorio `./src`
   - Recorre recursivamente todos los subdirectorios
   - Selecciona solo archivos `.ts` y `.tsx`

2. **Análisis de cada archivo**:
   - Lee el contenido del archivo
   - Utiliza una expresión regular para encontrar importaciones relativas sin extensiones

3. **Modificación de importaciones**:
   - Para cada coincidencia, verifica si ya tiene una extensión
   - Si no tiene extensión, agrega `.js` (no `.ts`)
   - Actualiza el contenido del archivo solo si se realizaron cambios

4. **Guardado de cambios**:
   - Si se modificó el archivo, guarda los cambios
   - Muestra un mensaje para cada archivo actualizado

### ¿Por qué .js y no .ts?

Aunque estás trabajando con archivos TypeScript (.ts), el script agrega extensiones `.js` porque:

1. Cuando TypeScript compila tu código, genera archivos JavaScript (.js)
2. Las importaciones en el código compilado deben apuntar a archivos `.js`, no `.ts`
3. El compilador de TypeScript espera que las importaciones relativas ya tengan la extensión correcta para el código compilado

## Cómo Usar el Script

1. **Crear el archivo script**:
   - Guarda el código anterior en un archivo llamado `fix-imports.js` en la raíz de tu proyecto

2. **Ejecutar el script**:

   ```bash
   node fix-imports.js
   ```

3. **Verificar los resultados**:
   - El script mostrará cada archivo modificado
   - Al finalizar, intentar compilar el proyecto con `npm run build`

## Alternativas

Si prefieres no usar este script, tienes dos opciones:

1. **Cambiar la configuración de TypeScript**:
   - Modificar `tsconfig.json` para usar `"moduleResolution": "Node"` en lugar de `"node16"` o `"nodenext"`

2. **Editar manualmente las importaciones**:
   - Agregar `.js` a todas las importaciones relativas en tu código

## Consideraciones

- Este script debe ejecutarse cada vez que agregues nuevas importaciones relativas sin extensiones
- No modifica importaciones de módulos de node_modules (como 'express', '@prisma/client', etc.)
- Es seguro ejecutarlo múltiples veces, ya que verifica si una importación ya tiene extensión antes de modificarla
