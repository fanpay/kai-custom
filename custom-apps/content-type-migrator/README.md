# Content Type Migrator

A powerful Kontent.ai custom app for migrating content types between environments. Built with modern React, TypeScript, and the Kontent.ai Management SDK.

![Content Type Migrator Screenshot](screenshot.png)

## Features

- 🔄 **Content Type Migration**: Seamlessly migrate content types between Kontent.ai environments
- 🔍 **Smart Comparison**: Automatically detects differences and conflicts between source and target environments
- 📋 **Selective Migration**: Choose exactly which content types to migrate
- 🔒 **Safe Operations**: Built-in dry run mode to preview changes before applying them
- ⚡ **Real-time Progress**: Live progress tracking with detailed status updates
- 🛡️ **Error Handling**: Comprehensive error reporting and conflict resolution
- 📊 **Migration Summary**: Detailed reports of what was created, updated, or skipped

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Kontent.ai project with Management API access
- Management API keys for both source and target environments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fanpay/content-type-migrator.git
   cd content-type-migrator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate SSL certificates for local development**
   ```bash
   # macOS/Linux
   openssl req -x509 -newkey rsa:2048 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/CN=localhost"
   
   # Or use mkcert (recommended)
   mkcert localhost
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `https://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be available in the `dist/` directory.

## Usage

### 1. Environment Setup

Configure your source and target environments by providing:
- **Environment ID**: Your Kontent.ai environment identifier
- **Management API Key**: API key with content management permissions
- **Environment Name** (optional): A friendly name for identification

Click "Test Connection" to verify your credentials.

### 2. Content Type Selection

Once connected to the source environment:
- Browse available content types
- Use checkboxes to select which types to migrate
- View content type details including element count and last modified date
- Use "Select All" or "Deselect All" for bulk operations

### 3. Migration Options

Configure migration behavior:
- **Include content groups**: Migrate content group definitions along with content types
- **Overwrite existing**: Update content types that already exist in the target environment
- **Dry run**: Preview changes without making actual modifications

### 4. Execute Migration

- Click "Start Migration" to begin the process
- Monitor real-time progress with detailed status updates
- View comprehensive results including created, updated, skipped, and error details

## Configuration

### Environment Variables

Create a `.env` file for local development:

```env
# Development settings
VITE_DEV_PROJECT_ID=your-project-id
VITE_DEV_USER_ID=your-user-id
VITE_DEV_VARIANT=draft

# API endpoints (optional)
VITE_KONTENT_MANAGEMENT_URL=https://manage.kontent.ai
VITE_KONTENT_DELIVERY_URL=https://deliver.kontent.ai
```

### Custom App Registration

To use this as a Kontent.ai custom app:

1. **Register the app** in your Kontent.ai project settings
2. **Set the app URL** to your deployed application
3. **Configure permissions** for content model management
4. **Add to your environment** where you want to use it

## Development

### Project Structure

```
src/
├── components/           # React components
│   ├── EnvironmentSelector.tsx
│   ├── ContentTypeList.tsx
│   ├── MigrationProgress.tsx
│   └── MigrationSummary.tsx
├── hooks/               # Custom React hooks
│   ├── useKontentContext.ts
│   └── useMigration.ts
├── services/            # Business logic services
│   ├── kontentService.ts
│   └── migrationService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript type checking

### Code Quality

This project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Tailwind CSS** for styling
- **Vite** for fast development and building

## API Reference

### KontentService

Main service for interacting with Kontent.ai Management API:

```typescript
// Test connection to environment
await kontentService.testConnection(environment);

// Get all content types
const contentTypes = await kontentService.getContentTypes(environment);

// Create new content type
await kontentService.createContentType(environment, contentType);

// Compare environments
const comparison = await kontentService.compareContentTypes(
  sourceEnv, 
  targetEnv, 
  contentTypeCodenames
);
```

### MigrationService

Handles the migration process:

```typescript
// Validate migration configuration
const validation = await migrationService.validateConfiguration(config);

// Perform dry run
const preview = await migrationService.dryRun(config);

// Execute migration
const result = await migrationService.migrate(config);
```

## Deployment

### Netlify Deployment

This app is configured for easy deployment to Netlify:

1. **Connect your repository** to Netlify
2. **Set build command**: `npm run build`
3. **Set publish directory**: `dist`
4. **Deploy** - Netlify will automatically build and deploy

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your preferred hosting service

3. **Configure HTTPS** - Required for Kontent.ai custom apps

## Security Considerations

- ✅ Always use HTTPS for production deployments
- ✅ Store API keys securely and never commit them to version control
- ✅ Validate all user inputs and API responses
- ✅ Use the principle of least privilege for API key permissions
- ✅ Implement proper error handling to avoid exposing sensitive information

## Troubleshooting

### Common Issues

**Connection Failed**
- Verify environment ID and API key are correct
- Ensure API key has management permissions
- Check network connectivity and firewall settings

**Migration Errors**
- Review error messages in the migration summary
- Check for content type naming conflicts
- Verify element compatibility between environments

**Performance Issues**
- Large content models may take longer to migrate
- Consider migrating in smaller batches for better performance
- Check network speed and API rate limits

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG=true
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 **Email**: f.payan@uniandes.edu.co
- 🐛 **Issues**: [GitHub Issues](https://github.com/fanpay/content-type-migrator/issues)
- 📖 **Documentation**: [Kontent.ai Docs](https://kontent.ai/learn/)

## Acknowledgments

- Built with [Kontent.ai Management SDK](https://github.com/kontent-ai/management-sdk-js)
- Inspired by [Kontent.ai Data Ops](https://github.com/kontent-ai/data-ops)
- UI components built with [Tailwind CSS](https://tailwindcss.com)

---

**Made with ❤️ by [Fabian Payan](https://github.com/fanpay)**