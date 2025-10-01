#!/bin/bash

set -e

echo "⚙️  Configuring Git Settings for Personal Account"
echo "================================================"

# Configuration
PERSONAL_EMAIL="f.payan@uniandes.edu.co"
PERSONAL_NAME="Fabian Payan"

# Function to configure a repository
configure_repo() {
    local repo_path=$1
    local repo_name=$(basename "$repo_path")
    
    echo "🔧 Configuring $repo_name..."
    
    if [ -d "$repo_path" ]; then
        cd "$repo_path"
        
        # Set local Git configuration
        git config --local user.email "$PERSONAL_EMAIL"
        git config --local user.name "$PERSONAL_NAME"
        
        # Verify configuration
        local current_email=$(git config --local user.email)
        local current_name=$(git config --local user.name)
        
        if [ "$current_email" = "$PERSONAL_EMAIL" ]; then
            echo "✅ $repo_name configured: $current_name <$current_email>"
        else
            echo "❌ Failed to configure $repo_name"
        fi
        
        cd - > /dev/null
    else
        echo "⚠️  Repository $repo_name not found at $repo_path"
    fi
}

# Configure main repository
echo ""
echo "📁 Configuring main repository..."
configure_repo "."

# Configure each submodule
echo ""
echo "📦 Configuring submodules..."
configure_repo "custom-apps/find-duplicates-url-slug"
configure_repo "custom-apps/content-validator"
configure_repo "custom-elements/tag-picker"

echo ""
echo "📊 Configuration Summary:"
echo "========================"
echo "Global Git config (for corporate work):"
git config --global user.name
git config --global user.email
echo ""
echo "Local Git config (for this project):"
git config --local user.name
git config --local user.email

echo ""
echo "🎉 Git configuration complete!"
echo ""
echo "ℹ️  Note: This ensures you use your personal email for this project"
echo "   while keeping your corporate email as the global default."
echo ""