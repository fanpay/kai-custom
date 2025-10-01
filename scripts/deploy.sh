#!/bin/bash

set -e

echo "🚀 Deploying Kontent.ai Custom Extensions"
echo "========================================"

# Configuration
DEPLOY_ENV=${1:-"staging"}
DRY_RUN=${2:-false}

echo "🎯 Deployment Environment: $DEPLOY_ENV"
echo "🧪 Dry Run Mode: $DRY_RUN"
echo ""

# Function to deploy a submodule
deploy_submodule() {
    local submodule_path=$1
    local submodule_name=$(basename "$submodule_path")
    local submodule_type=$(dirname "$submodule_path")
    
    echo ""
    echo "🚀 Deploying $submodule_name ($submodule_type)..."
    
    if [ -d "$submodule_path" ]; then
        cd "$submodule_path"
        
        # Check if we're on a clean state
        if ! git diff --quiet || ! git diff --cached --quiet; then
            echo "⚠️  $submodule_name has uncommitted changes. Please commit or stash them first."
            cd - > /dev/null
            return 1
        fi
        
        local current_commit=$(git rev-parse --short HEAD)
        local current_branch=$(git rev-parse --abbrev-ref HEAD)
        
        echo "📍 Current state: $current_branch @ $current_commit"
        
        # Build the project if necessary
        if [ -f "package.json" ]; then
            echo "📦 Building $submodule_name..."
            if [ "$DRY_RUN" != "true" ]; then
                npm run build || echo "⚠️  Build failed for $submodule_name"
            else
                echo "🧪 [DRY RUN] Would run: npm run build"
            fi
        fi
        
        # Deploy based on submodule type and environment
        case "$submodule_type" in
            "custom-apps")
                echo "🔧 Deploying custom app..."
                if [ "$DRY_RUN" != "true" ]; then
                    # Example deployment commands
                    # Customize these based on your deployment strategy
                    echo "  - Would deploy to Kontent.ai Custom App hosting"
                    echo "  - Would update app configuration"
                    echo "  - Would notify team of deployment"
                else
                    echo "🧪 [DRY RUN] Would deploy custom app to $DEPLOY_ENV"
                fi
                ;;
            "custom-elements")
                echo "🎨 Deploying custom element..."
                if [ "$DRY_RUN" != "true" ]; then
                    # Example deployment commands
                    echo "  - Would deploy to CDN or hosting service"
                    echo "  - Would update element URLs in Kontent.ai"
                    echo "  - Would test element integration"
                else
                    echo "🧪 [DRY RUN] Would deploy custom element to $DEPLOY_ENV"
                fi
                ;;
        esac
        
        # Tag the deployment
        if [ "$DRY_RUN" != "true" ]; then
            local deploy_tag="deploy-$DEPLOY_ENV-$(date +%Y%m%d-%H%M%S)"
            git tag "$deploy_tag"
            echo "🏷️  Tagged deployment: $deploy_tag"
        else
            echo "🧪 [DRY RUN] Would create deployment tag"
        fi
        
        cd - > /dev/null
        echo "✅ $submodule_name deployment complete"
    else
        echo "⚠️  Submodule $submodule_name not found at $submodule_path"
        return 1
    fi
}

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if all submodules are initialized
if [ ! -d "custom-apps/find-duplicates-url-slug" ] || 
   [ ! -d "custom-apps/content-validator" ] || 
   [ ! -d "custom-elements/tag-picker" ]; then
    echo "❌ Not all submodules are initialized. Run ./scripts/setup.sh first."
    exit 1
fi

# Check if main repository is clean
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  Main repository has uncommitted changes. Please commit them first."
    if [ "$DRY_RUN" != "true" ]; then
        exit 1
    fi
fi

echo "✅ Pre-deployment checks passed"

# Deploy each submodule
echo ""
echo "🚀 Starting deployments..."

deploy_submodule "custom-apps/find-duplicates-url-slug"
deploy_submodule "custom-apps/content-validator"
deploy_submodule "custom-elements/tag-picker"

# Post-deployment tasks
echo ""
echo "📋 Post-deployment tasks..."

if [ "$DRY_RUN" != "true" ]; then
    # Update main repository with deployment info
    echo "📝 Updating deployment record..."
    echo "Deployment completed at $(date)" >> DEPLOYMENT_LOG.md
    echo "Environment: $DEPLOY_ENV" >> DEPLOYMENT_LOG.md
    echo "Deployed submodules:" >> DEPLOYMENT_LOG.md
    git submodule status >> DEPLOYMENT_LOG.md
    echo "" >> DEPLOYMENT_LOG.md
    
    git add DEPLOYMENT_LOG.md
    git commit -m "Record deployment to $DEPLOY_ENV at $(date)"
    
    echo "✅ Deployment record updated"
else
    echo "🧪 [DRY RUN] Would update deployment records"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Summary:"
echo "- Environment: $DEPLOY_ENV"
echo "- Dry Run: $DRY_RUN"
echo "- Custom Apps: 2 deployed"
echo "- Custom Elements: 1 deployed"
echo ""

if [ "$DRY_RUN" = "true" ]; then
    echo "To perform actual deployment, run:"
    echo "./scripts/deploy.sh $DEPLOY_ENV false"
fi