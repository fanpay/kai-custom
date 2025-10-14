# Content Type Migration - Setup como Submódulo

Este documento te guía para completar la conversión de `content-type-migration` en un repositorio separado y submódulo.

## Pasos completados:
✅ Backup del código creado en `/tmp/content-type-migration-backup`
✅ Repositorio git local inicializado con .gitignore apropiado
✅ Código fuente limpio (sin node_modules)
✅ Commit inicial realizado
✅ Remote configurado para apuntar a GitHub
✅ Entrada en .gitmodules agregada

## Pasos pendientes:

### 1. Crear repositorio en GitHub
- Ve a https://github.com/fanpay
- Haz clic en "New repository"
- Nombre: `content-type-migration`
- Descripción: "Content Type Migration Tool for Kontent.ai - Custom App for migrating content types between environments"
- Público
- **NO** inicializar con README, .gitignore, o licencia (el repo local ya tiene contenido)

### 2. Ejecutar script de configuración automática
Una vez creado el repositorio en GitHub:
```bash
cd /Users/fpayan/HUGE/KOERBER/tutorials/kontent.ai/kai-custom
./fix-submodule-setup.sh
```

Este script automáticamente:
- Hace push del código limpio al repositorio de GitHub
- Configura content-type-migration como submódulo REAL (no carpeta regular)
- Verifica que funcione como los otros submódulos (find-duplicates-url-slug, model-visualizer, tag-picker)
- Hace commit y push de los cambios

### 5. Inicializar submódulos para otros desarrolladores
Cuando otros desarrolladores clonen el repositorio principal, necesitarán:
```bash
git submodule update --init --recursive
```

## Verificación
Para verificar que todo funcionó correctamente:
```bash
git submodule status
ls -la custom-apps/content-type-migration/
```

## Comandos útiles para submódulos
- Actualizar submódulo: `git submodule update --remote custom-apps/content-type-migration`
- Ver estado de submódulos: `git submodule status`
- Clonar con submódulos: `git clone --recursive <repo-url>`

## Notas importantes
- El archivo .gitmodules ya está actualizado
- El contenido del submódulo está en el repositorio separado
- Cada submódulo mantiene su propio historial de git
- Los cambios en el submódulo deben hacerse en su repositorio específico