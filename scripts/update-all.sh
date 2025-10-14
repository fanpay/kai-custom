#!/bin/bash

set -e

echo "🔄 Updating All Submodules"
echo "=========================="

# Function to update and show status of a submodule
update_submodule() {
    local submodule_path=$1
    local submodule_name=$(basename "$submodule_path")
    
    echo ""
    echo "🔄 Updating $submodule_name..."
    
    if [ -d "$submodule_path" ]; then
        # Get current commit before update
        cd "$submodule_path"
        local old_commit=$(git rev-parse HEAD)
        local old_commit_short=$(git rev-parse --short HEAD)
        cd - > /dev/null
        
        # Update the submodule
        git submodule update --remote "$submodule_path"
        
        # Get new commit after update
        cd "$submodule_path"
        local new_commit=$(git rev-parse HEAD)
        local new_commit_short=$(git rev-parse --short HEAD)
        cd - > /dev/null
        
        if [ "$old_commit" != "$new_commit" ]; then
            echo "✅ $submodule_name updated: $old_commit_short → $new_commit_short"
            
            # Show what changed
            echo "📝 Recent changes in $submodule_name:"
            cd "$submodule_path"
            git log --oneline --no-merges "$old_commit..$new_commit" | head -5
            cd - > /dev/null
        else
            echo "ℹ️  $submodule_name already up to date ($new_commit_short)"
        fi
    else
        echo "⚠️  Submodule $submodule_name not found at $submodule_path"
    fi
}

# Update each submodule
echo "📥 Updating submodules to latest commits..."
update_submodule "custom-apps/find-duplicates-url-slug"
update_submodule "custom-apps/model-visualizer"
update_submodule "custom-apps/content-type-migration"
update_submodule "custom-elements/tag-picker"

echo ""
echo "📊 Submodule Status Summary:"
echo "============================"
git submodule status

echo ""
echo "💾 Committing submodule updates..."
if git diff --cached --quiet; then
    if git diff --quiet; then
        echo "ℹ️  No changes to commit"
    else
        git add .gitmodules
        git add custom-apps custom-elements
        git commit -m "Update submodules to latest versions

- Updated custom-apps/find-duplicates-url-slug
- Updated custom-apps/model-visualizer  
- Updated custom-apps/content-type-migration
- Updated custom-elements/tag-picker

$(date)"
        echo "✅ Submodule updates committed"
    fi
else
    echo "ℹ️  Changes already staged"
fi

echo ""
echo "🎉 All submodules updated successfully!"
echo ""
echo "Next steps:"
echo "1. Review the changes in each submodule"
echo "2. Test the updated functionality"
echo "3. Push changes: git push origin main"
echo ""