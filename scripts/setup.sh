#!/bin/bash

set -e

echo "🚀 Setting up Kontent.ai Custom Extensions Repository"
echo "=================================================="

# Initialize and update all submodules
echo "📥 Initializing submodules..."
git submodule update --init --recursive

# Configure personal email for this repository and submodules
echo "⚙️  Configuring Git settings for personal account..."
git config --local user.email "f.payan@uniandes.edu.co"
git config --local user.name "Fabian Payan"

# Check if submodules were initialized successfully
if [ $? -eq 0 ]; then
    echo "✅ Submodules initialized successfully"
else
    echo "❌ Failed to initialize submodules"
    exit 1
fi

# Function to setup individual submodule
setup_submodule() {
    local submodule_path=$1
    local submodule_name=$(basename "$submodule_path")
    
    echo "🔧 Setting up $submodule_name..."
    
    if [ -d "$submodule_path" ]; then
        cd "$submodule_path"
        
        # Configure Git settings for personal account
        git config --local user.email "f.payan@uniandes.edu.co"
        git config --local user.name "Fabian Payan"
        
        # Check if package.json exists (Node.js project)
        if [ -f "package.json" ]; then
            echo "📦 Installing npm dependencies for $submodule_name..."
            npm install
        fi
        
        # Check if requirements.txt exists (Python project)
        if [ -f "requirements.txt" ]; then
            echo "🐍 Installing Python dependencies for $submodule_name..."
            pip install -r requirements.txt
        fi
        
        # Check if composer.json exists (PHP project)
        if [ -f "composer.json" ]; then
            echo "🎼 Installing Composer dependencies for $submodule_name..."
            composer install
        fi
        
        cd - > /dev/null
        echo "✅ $submodule_name setup complete"
    else
        echo "⚠️  Submodule $submodule_name not found at $submodule_path"
    fi
}

# Setup each submodule
echo ""
echo "🔧 Setting up individual submodules..."
setup_submodule "custom-apps/find-duplicates-url-slug"
setup_submodule "custom-apps/content-type-migration"
setup_submodule "custom-elements/tag-picker"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Review the README.md for detailed usage instructions"
echo "2. Navigate to individual submodules to start development"
echo "3. Use 'git submodule update --remote' to update submodules"
echo ""