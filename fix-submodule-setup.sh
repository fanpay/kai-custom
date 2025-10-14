#!/bin/bash

# Script para configurar content-type-migration como submódulo REAL
set -e

echo "🚀 Configurando content-type-migration como submódulo..."

# Paso 1: Push al repositorio remoto
echo "📤 1. Subiendo código al repositorio de GitHub..."
cd /tmp/content-type-migration-backup

if git push -u origin main; then
    echo "✅ Código subido exitosamente"
else
    echo "❌ Error: No se pudo subir el código"
    echo "   Asegúrate de haber creado el repositorio en GitHub:"
    echo "   https://github.com/fanpay/content-type-migration"
    exit 1
fi

# Paso 2: Volver al repositorio principal
echo "🔄 2. Configurando submódulo en kai-custom..."
cd /Users/fpayan/HUGE/KOERBER/tutorials/kontent.ai/kai-custom

# Paso 3: Agregar como submódulo real
echo "📦 3. Agregando submódulo..."
if git submodule add https://github.com/fanpay/content-type-migration.git custom-apps/content-type-migration; then
    echo "✅ Submódulo agregado correctamente"
else
    echo "❌ Error agregando submódulo"
    exit 1
fi

# Paso 4: Inicializar submódulo
echo "🔧 4. Inicializando submódulo..."
git submodule update --init --recursive custom-apps/content-type-migration

# Paso 5: Verificar que es un submódulo real
echo "🔍 5. Verificando configuración..."
if git submodule status | grep -q "content-type-migration"; then
    echo "✅ content-type-migration configurado correctamente como submódulo"
else
    echo "❌ Error en la configuración del submódulo"
    exit 1
fi

# Paso 6: Commit y push de los cambios
echo "💾 6. Guardando cambios..."
git add .gitmodules custom-apps/content-type-migration
git commit -m "Add content-type-migration as proper git submodule

- Convert to independent repository with separate version control
- Configure as git submodule like other custom apps
- Enable independent development and deployment"

git push origin main

echo ""
echo "🎉 ¡Configuración completada exitosamente!"
echo ""
echo "📊 Estado actual de submódulos:"
git submodule status
echo ""
echo "📁 Verificación - content-type-migration debe aparecer como submódulo:"
ls -la custom-apps/content-type-migration/.git 2>/dev/null && echo "✅ Es un submódulo (tiene .git)" || echo "❌ No es un submódulo"
echo ""
echo "🧹 Limpieza:"
echo "   rm -rf /tmp/content-type-migration-backup"
echo "   rm -rf /tmp/content-type-migration-current"