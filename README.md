# Kontent.ai Custom Extensions Repository

This repository manages multiple Kontent.ai custom apps and custom elements using Git submodules. This approach allows for modular development and deployment while maintaining a unified structure.

## Repository Structure

```
kai-custom/
├── custom-apps/                    # Custom applications submodules
│   ├── find-duplicates-url-slug/   # Finds duplicate URL slugs
│   └── content-validator/          # Content validation app
├── custom-elements/                # Custom elements submodules
│   └── tag-picker/                # Advanced tag picker element
├── .gitmodules                     # Submodule configuration
├── README.md                       # This file
└── scripts/                        # Management scripts
    ├── setup.sh                    # Initial setup script
    ├── configure-git.sh            # Configure Git settings
    ├── update-all.sh               # Update all submodules
    └── deploy.sh                   # Deployment script
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

## Submodule Management

### Adding a New Submodule
```bash
# For custom apps
git submodule add <repository-url> custom-apps/<app-name>

# For custom elements
git submodule add <repository-url> custom-elements/<element-name>
```

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

### Find Duplicates URL Slug
Located in `custom-apps/find-duplicates-url-slug/`  
📁 **Repository:** https://github.com/fanpay/find-duplicates-url-slug

A Kontent.ai custom app to find and manage duplicate URL slugs across content items.

### Content Validator
Located in `custom-apps/content-validator/`  
📁 **Repository:** https://github.com/fanpay/content-validator

A custom app for validating content according to custom business rules.

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

### Submodule Not Found
```bash
git submodule update --init --recursive
```

### Submodule Commit Mismatch
```bash
git submodule update --remote
git add .
git commit -m "Update submodule references"
```

### Reset Submodule
```bash
git submodule deinit <submodule-path>
git rm <submodule-path>
git submodule add <repository-url> <submodule-path>
```

## Contributing

1. Fork the specific submodule repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request to the submodule repository
5. Once merged, update the main repository to reference the new commit

## License

Each submodule may have its own license. Please refer to individual submodule directories for licensing information.