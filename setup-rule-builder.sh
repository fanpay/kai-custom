#!/bin/bash

# Script adaptado de fix-submodule-setup.sh para configurar rule-builder como submódulo
set -e

echo "🚀 Configurando rule-builder como submódulo..."

# Paso 0: Verificar que estamos en el directorio correcto
if [[ ! -f ".gitmodules" ]]; then
    echo "❌ Error: Debes ejecutar este script desde la raíz del repositorio kai-custom"
    exit 1
fi

# Paso 1: Remover del tracking del repo principal
echo "🗑️  1. Removiendo rule-builder del tracking principal..."
git rm -r --cached custom-elements/rule-builder 2>/dev/null || echo "   Ya estaba removido o no está en tracking"

# Paso 2: Inicializar repositorio git en rule-builder
echo "📦 2. Inicializando repositorio git..."
cd custom-elements/rule-builder
git init
git add .
git commit -m "Initial commit: Visual Rule Builder custom element

Features:
- React + TypeScript implementation
- Visual rule builder with conditions and actions
- Kontent.ai Custom Element integration
- HTTPS support for local development
- Personalization signals support (location, weather, user attributes)"

# Paso 3: Agregar remoto
echo "🌐 3. Configurando repositorio remoto..."
git remote add origin https://github.com/fanpay/rule-builder.git

# Paso 4: Pausa para crear el repositorio en GitHub
echo ""
echo "⏸️  4. ACCIÓN REQUERIDA:"
echo "   🌟 Ve a https://github.com/new"
echo "   📝 Nombre del repositorio: rule-builder"
echo "   👤 Owner: fanpay"
echo "   🔓 Visibilidad: Public o Private (tu elección)"
echo "   ❌ NO inicialices con README, .gitignore o licencia"
echo ""
read -p "Presiona ENTER cuando hayas creado el repositorio en GitHub... " -r

# Paso 5: Push al repositorio remoto
echo "📤 5. Subiendo código a GitHub..."
if git push -u origin main; then
    echo "✅ Código subido exitosamente"
else
    echo "❌ Error: No se pudo subir el código"
    echo "   ¿Creaste el repositorio en GitHub?"
    exit 1
fi

# Paso 6: Volver al repositorio principal
echo "🔄 6. Configurando submódulo en kai-custom..."
cd /Users/fpayan/HUGE/KOERBER/tutorials/kontent.ai/kai-custom

# Paso 7: Remover directorio (git submodule add lo clonará de nuevo)
echo "🗑️  7. Removiendo directorio local..."
rm -rf custom-elements/rule-builder

# Paso 8: Agregar como submódulo real
echo "📦 8. Agregando submódulo..."
if git submodule add https://github.com/fanpay/rule-builder.git custom-elements/rule-builder; then
    echo "✅ Submódulo agregado correctamente"
else
    echo "⚠️  Podría estar parcialmente configurado, continuando..."
fi

# Paso 9: Inicializar submódulo
echo "🔧 9. Inicializando submódulo..."
git submodule update --init --recursive custom-elements/rule-builder

# Paso 10: Verificar que es un submódulo real
echo "🔍 10. Verificando configuración..."
if git submodule status | grep -q "rule-builder"; then
    echo "✅ rule-builder configurado correctamente como submódulo"
else
    echo "❌ Error en la configuración del submódulo"
    exit 1
fi

# Paso 11: Commit y push de los cambios
echo "💾 11. Guardando cambios..."
git add .gitmodules custom-elements/rule-builder
git commit -m "Add rule-builder as proper git submodule

- Convert Visual Rule Builder to independent repository
- Configure as git submodule like other custom elements
- Enable independent development and deployment
- Maintain consistent project structure"

git push origin main

echo ""
echo "🎉 ¡Configuración completada exitosamente!"
echo ""
echo "📊 Estado actual de submódulos:"
git submodule status
echo ""
echo "📁 Verificación - rule-builder debe aparecer como submódulo:"
ls -la custom-elements/rule-builder/.git 2>/dev/null && echo "✅ Es un submódulo (tiene .git)" || echo "❌ No es un submódulo"
echo ""
echo "📋 Próximos pasos para otros desarrolladores:"
echo "   git clone <repo-url>"
echo "   git submodule update --init --recursive"
echo ""
echo "🔄 Para actualizar el submódulo en el futuro:"
echo "   cd custom-elements/rule-builder"
echo "   git pull origin main"
echo "   cd ../.."
echo "   git add custom-elements/rule-builder"
echo "   git commit -m 'Update rule-builder submodule'"
