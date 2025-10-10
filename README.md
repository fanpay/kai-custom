# Kontent.ai Custom Apps and Elements Repository

This repository manages multiple Kontent.ai custom apps and custom elements using Git submodules. This approach allows for modular development and deployment while maintaining a unified structure.

## Repository Structure

```
kai-custom/
├── custom-apps/                            # Custom applications submodules
│   ├── content-type-migrator/              # Content type migration tool
│   ├── find-duplicates-url-slug/           # Finds duplicate URL slugs
│   └── model-visualizer/                   # Model visualization tool
├── custom-elements/                        # Custom elements submodules
│   └── tag-picker/                         # Advanced tag picker element
├── .gitmodules                             # Submodule configuration
├── README.md                               # This file
└── scripts/                                # Management scripts
    ├── setup.sh                            # Initial setup script
    ├── configure-git.sh                    # Configure Git settings
    ├── update-all.sh                       # Update all submodules
    └── deploy.sh                           # Deployment script
```

## Getting Started

### Initial Clone
When cloning this repository, you need to initialize and update submodules:

```bash
git clone https://github.com/fanpay/kai-custom.git
cd kai-custom
git submodule update --init --recursive
```

### Alternative: Clone with Submodules
```bash
git clone --recurse-submodules https://github.com/fanpay/kai-custom.git
```

## Git Configuration

This repository is configured to use a personal email address (`f.payan@uniandes.edu.co`) while maintaining the global Git configuration for corporate work.

### Automatic Configuration
The setup script automatically configures the correct email for this repository and all submodules.

### Manual Configuration
If you need to reconfigure Git settings:
```bash
# Configure personal email for this project
./scripts/configure-git.sh

# Or manually for individual repositories
git config --local user.email "f.payan@uniandes.edu.co"
git config --local user.name "Fabian Payan"
```

### Verification
```bash
# Check global configuration (corporate)
git config --global user.email

# Check local configuration (personal)
git config --local user.email
```

## Adding New Modules (For Developers)

### Prerequisites
Before adding a new module, ensure you have:
- A separate GitHub repository for your module
- The repository contains a complete, working Kontent.ai custom app or custom element
- Proper documentation in the module's README
- The module is tested and ready for integration

### Step-by-Step Guide: Adding a Custom App

1. **Navigate to the main repository**
   ```bash
   cd /path/to/kai-custom
   ```

2. **Add the repository as a submodule**
   ```bash
   git submodule add https://github.com/[username]/[your-app-name] custom-apps/[your-app-name]
   ```

3. **Commit the submodule addition**
   ```bash
   git add .gitmodules custom-apps/[your-app-name]
   git commit -m "Add [your-app-name] as submodule in custom-apps"
   ```

4. **Push changes to remote**
   ```bash
   git push origin main
   ```

5. **Update the README** (this file)
   - Add your app to the "Custom Apps" section below
   - Include the repository URL and brief description
   - Update the repository structure diagram if needed

### Step-by-Step Guide: Adding a Custom Element

1. **Navigate to the main repository**
   ```bash
   cd /path/to/kai-custom
   ```

2. **Add the repository as a submodule**
   ```bash
   git submodule add https://github.com/[username]/[your-element-name] custom-elements/[your-element-name]
   ```

3. **Commit the submodule addition**
   ```bash
   git add .gitmodules custom-elements/[your-element-name]
   git commit -m "Add [your-element-name] as submodule in custom-elements"
   ```

4. **Push changes to remote**
   ```bash
   git push origin main
   ```

5. **Update the README** (this file)
   - Add your element to the "Custom Elements" section below
   - Include the repository URL and brief description
   - Update the repository structure diagram if needed

### Example: Complete Workflow

Here's a complete example of adding a new custom app called "content-scheduler":

```bash
# 1. Navigate to main repository
cd /Users/yourname/kai-custom

# 2. Add submodule
git submodule add https://github.com/yourname/content-scheduler custom-apps/content-scheduler

# 3. Verify the addition
ls custom-apps/
# Should show: content-validator/ find-duplicates-url-slug/ model-visualizer/ content-scheduler/

# 4. Check git status
git status
# Should show: modified .gitmodules and new custom-apps/content-scheduler

# 5. Commit changes
git add .gitmodules custom-apps/content-scheduler
git commit -m "Add content-scheduler as submodule in custom-apps"

# 6. Push to remote
git push origin main

# 7. Verify submodule configuration
cat .gitmodules
```

### Important Notes for Developers

- **Repository Structure**: Ensure your module repository has proper structure with `package.json`, `README.md`, and deployment configuration
- **Naming Convention**: Use kebab-case for directory names (e.g., `content-scheduler`, `tag-picker`)
- **Documentation**: Each module must have comprehensive README with setup and usage instructions
- **Dependencies**: Ensure your module can be built and deployed independently
- **Testing**: Test your module thoroughly before adding it as a submodule

## Submodule Management

### Updating Submodules
```bash
# Update all submodules to latest commits
git submodule update --remote

# Update a specific submodule
git submodule update --remote custom-apps/find-duplicates-url-slug
```

### Working with Submodules
```bash
# Enter a submodule directory
cd custom-apps/find-duplicates-url-slug

# Make changes and commit as usual
git add .
git commit -m "Your changes"
git push origin main

# Return to main repository and commit the submodule update
cd ../../
git add custom-apps/find-duplicates-url-slug
git commit -m "Update find-duplicates-url-slug submodule"
git push
```

## Custom Apps

### Content Type Migrator
Located in `custom-apps/content-type-migrator/`  
📁 **Repository:** Built-in (not a separate submodule)

A powerful Kontent.ai custom app for migrating content types between environments. Features real-time progress tracking, dry-run capabilities, and comprehensive error handling.

### Find Duplicates URL Slug
Located in `custom-apps/find-duplicates-url-slug/`  
📁 **Repository:** https://github.com/fanpay/find-duplicates-url-slug

A Kontent.ai custom app to find and manage duplicate URL slugs across content items.

### Model Visualizer
Located in `custom-apps/model-visualizer/`  
📁 **Repository:** https://github.com/fanpay/model-visualizer

A visualization tool for Kontent.ai content models and their relationships.

## Custom Elements

### Tag Picker
Located in `custom-elements/tag-picker/`  
📁 **Repository:** https://github.com/fanpay/tag-picker

An advanced tag selection custom element with enhanced functionality.

## Best Practices

### Development Workflow

1. **Feature Development**: Work within individual submodule directories
2. **Testing**: Test each submodule independently
3. **Versioning**: Use semantic versioning for each submodule
4. **Integration**: Update the main repository to point to tested versions

### Deployment Strategy

1. Deploy individual submodules to their respective hosting environments
2. Update the main repository to reference the deployed versions
3. Use the main repository as a configuration management tool

### Branch Management

- Each submodule maintains its own branching strategy
- The main repository typically tracks the `main` branch of each submodule
- Use specific commits or tags for production deployments

## Scripts

### Setup Script
Run `./scripts/setup.sh` to:
- Initialize all submodules
- Install dependencies for each submodule
- Set up development environment
- Configure Git settings for personal account

### Git Configuration Script
Run `./scripts/configure-git.sh` to:
- Configure personal email for this repository and all submodules
- Verify Git configuration settings
- Show configuration summary

### Update Script
Run `./scripts/update-all.sh` to:
- Pull latest changes from all submodules
- Update the main repository references

### Deployment Script
Run `./scripts/deploy.sh` to:
- Deploy all submodules
- Update deployment configurations

## Troubleshooting

### Common Issues When Adding Submodules

#### Error: "already exists in the index"
If you get this error, the path already exists. Remove it first:
```bash
git rm --cached custom-apps/[module-name]
rm -rf custom-apps/[module-name]
git submodule add https://github.com/[username]/[repo] custom-apps/[module-name]
```

#### Error: "repository does not exist"
Ensure the repository URL is correct and you have access:
```bash
# Test repository access
git ls-remote https://github.com/[username]/[repo]
```

#### Submodule shows as "modified" after adding
This is normal. Commit the changes:
```bash
git add .gitmodules custom-apps/[module-name]
git commit -m "Add [module-name] as submodule"
```

### General Submodule Issues

#### Submodule Not Found
```bash
git submodule update --init --recursive
```

#### Submodule Commit Mismatch
```bash
git submodule update --remote
git add .
git commit -m "Update submodule references"
```

#### Reset Submodule
```bash
git submodule deinit <submodule-path>
git rm <submodule-path>
git submodule add <repository-url> <submodule-path>
```

#### Check Submodule Status
```bash
# See all submodules and their status
git submodule status

# See submodule configuration
cat .gitmodules
```

## Contributing

1. Fork the specific submodule repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request to the submodule repository
5. Once merged, update the main repository to reference the new commit

## License

Each submodule may have its own license. Please refer to individual submodule directories for licensing information.