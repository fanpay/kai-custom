#!/bin/bash

# Script para completar la configuración del submódulo content-type-migration
# Ejecuta este script DESPUÉS de crear el repositorio en GitHub

set -e

echo "🚀 Completando configuración del submódulo content-type-migration..."

# Verificar que estamos en el directorio correcto
if [[ ! -f ".gitmodules" ]]; then
    echo "❌ Error: Debes ejecutar este script desde la raíz del repositorio kai-custom"
    exit 1
fi

# Paso 1: Hacer push del código al repositorio remoto
echo "📤 Subiendo código a GitHub..."
cd /tmp/content-type-migration-backup

if git push -u origin main; then
    echo "✅ Código subido correctamente a GitHub"
else
    echo "❌ Error: No se pudo subir el código. ¿Creaste el repositorio en GitHub?"
    echo "   Ve a https://github.com/fanpay y crea el repositorio 'content-type-migration'"
    exit 1
fi

# Volver al directorio principal
cd /Users/fpayan/HUGE/KOERBER/tutorials/kontent.ai/kai-custom

# Paso 2: Agregar el submódulo
echo "📦 Agregando submódulo..."
if git submodule add https://github.com/fanpay/content-type-migration.git custom-apps/content-type-migration; then
    echo "✅ Submódulo agregado correctamente"
else
    echo "⚠️ El submódulo podría estar parcialmente configurado. Continuando..."
fi

# Paso 3: Inicializar y actualizar submódulos
echo "🔄 Inicializando submódulos..."
git submodule update --init --recursive

# Paso 4: Hacer commit de los cambios
echo "💾 Haciendo commit de los cambios..."
git add .gitmodules custom-apps/content-type-migration
git commit -m "Add content-type-migration as submodule

- Convert content-type-migration to separate repository
- Configure as git submodule for modular development
- Maintain independent version control and deployment"

# Paso 5: Push al repositorio principal
echo "📤 Subiendo cambios al repositorio principal..."
git push origin main

# Verificación final
echo "🔍 Verificando configuración..."
git submodule status

echo ""
echo "🎉 ¡Configuración completada exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. El submódulo content-type-migration está configurado"
echo "2. Otros desarrolladores deben ejecutar: git submodule update --init --recursive"
echo "3. Para actualizar el submódulo: git submodule update --remote custom-apps/content-type-migration"
echo "4. Para trabajar en el submódulo: cd custom-apps/content-type-migration && git checkout main"
echo ""
echo "📁 Archivos importantes:"
echo "- Submódulo: custom-apps/content-type-migration/"
echo "- Configuración: .gitmodules"
echo "- Documentación: CONTENT_TYPE_MIGRATION_SETUP.md"
echo ""
echo "🗑️  Puedes eliminar el backup cuando confirmes que todo funciona:"
echo "   rm -rf /tmp/content-type-migration-backup"