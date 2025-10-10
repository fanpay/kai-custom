import { useState } from 'react';
import { EnvironmentSelector } from './components/EnvironmentSelector';
import { ContentTypeList } from './components/ContentTypeList';
import { MigrationProgress } from './components/MigrationProgress';
import { MigrationSummary } from './components/MigrationSummary';
import { useMigration } from './hooks/useMigration';
import type { Environment } from './types';
import './index.css';

function App() {
  const {
    status,
    sourceEnvironment,
    targetEnvironment,
    sourceContentTypes,
    selectedContentTypes,
    migrationResult,
    testConnection,
    loadSourceContentTypes,
    executeMigration,
    resetMigration,
    updateSelectedContentTypes,
    updateTargetEnvironment,
    createMigrationConfig,
    isMigrationReady,
  } = useMigration();

  const [migrationOptions, setMigrationOptions] = useState({
    includeContentGroups: true,
    overwriteExisting: false,
    dryRun: false,
  });

  const handleSourceEnvironmentChange = async (environment: Environment) => {
    try {
      await loadSourceContentTypes(environment);
    } catch (error) {
      console.error('Failed to load source content types:', error);
    }
  };

  const handleStartMigration = async () => {
    const config = createMigrationConfig(migrationOptions);
    if (!config) {
      alert('Please configure both environments and select content types');
      return;
    }

    try {
      await executeMigration(config);
    } catch (error) {
      console.error('Migration failed:', error);
    }
  };

  const currentStep = (() => {
    if (migrationResult) return 'complete';
    if (status.status !== 'idle') return 'migration';
    if (sourceEnvironment && targetEnvironment && selectedContentTypes.length > 0) return 'ready';
    if (sourceEnvironment && sourceContentTypes.length > 0) return 'content-selection';
    if (sourceEnvironment) return 'target-setup';
    return 'source-setup';
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-kontent-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Type Migrator</h1>
              <p className="text-sm text-gray-600">Migrate content types between Kontent.ai environments</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Progress Indicator */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Migration Progress</h2>
              <div className="flex space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentStep === 'source-setup' ? 'bg-kontent-primary' : currentStep === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${currentStep === 'target-setup' ? 'bg-kontent-primary' : ['ready', 'content-selection', 'migration', 'complete'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${currentStep === 'content-selection' ? 'bg-kontent-primary' : ['ready', 'migration', 'complete'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${currentStep === 'ready' ? 'bg-kontent-primary' : ['migration', 'complete'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${currentStep === 'migration' ? 'bg-kontent-primary' : currentStep === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${currentStep === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Source Setup</span>
              <span>Target Setup</span>
              <span>Content Selection</span>
              <span>Ready</span>
              <span>Migration</span>
              <span>Complete</span>
            </div>
          </div>

          {/* Migration Result */}
          {migrationResult && (
            <MigrationSummary 
              result={migrationResult}
              onReset={resetMigration}
            />
          )}

          {/* Active Migration Progress */}
          {status.status !== 'idle' && !migrationResult && (
            <MigrationProgress status={status} />
          )}

          {/* Environment Setup */}
          {!migrationResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Source Environment */}
              <EnvironmentSelector
                environment={sourceEnvironment}
                onEnvironmentChange={handleSourceEnvironmentChange}
                onTestConnection={testConnection}
                label="Source Environment"
                placeholder="Source environment ID..."
              />

              {/* Target Environment */}
              <EnvironmentSelector
                environment={targetEnvironment}
                onEnvironmentChange={updateTargetEnvironment}
                onTestConnection={testConnection}
                label="Target Environment"
                placeholder="Target environment ID..."
              />
            </div>
          )}

          {/* Content Type Selection */}
          {sourceContentTypes.length > 0 && !migrationResult && (
            <ContentTypeList
              contentTypes={sourceContentTypes}
              selectedTypes={selectedContentTypes}
              onSelectionChange={updateSelectedContentTypes}
              isLoading={status.status === 'analyzing' && status.currentStep.includes('source')}
            />
          )}

          {/* Migration Options */}
          {sourceEnvironment && targetEnvironment && selectedContentTypes.length > 0 && !migrationResult && (
            <div className="kontent-card">
              <h3 className="text-lg font-semibold mb-4">Migration Options</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={migrationOptions.includeContentGroups}
                    onChange={(e) => setMigrationOptions(prev => ({ ...prev, includeContentGroups: e.target.checked }))}
                    className="h-4 w-4 text-kontent-primary focus:ring-kontent-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include content groups</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={migrationOptions.overwriteExisting}
                    onChange={(e) => setMigrationOptions(prev => ({ ...prev, overwriteExisting: e.target.checked }))}
                    className="h-4 w-4 text-kontent-primary focus:ring-kontent-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Overwrite existing content types</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={migrationOptions.dryRun}
                    onChange={(e) => setMigrationOptions(prev => ({ ...prev, dryRun: e.target.checked }))}
                    className="h-4 w-4 text-kontent-primary focus:ring-kontent-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Dry run (preview changes only)</span>
                </label>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleStartMigration}
                  disabled={!isMigrationReady() || status.status !== 'idle'}
                  className={`flex-1 py-3 px-6 rounded font-medium transition-colors ${
                    isMigrationReady() && status.status === 'idle'
                      ? 'kontent-button-primary'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {migrationOptions.dryRun ? 'Preview Migration' : 'Start Migration'}
                </button>
                
                <button
                  onClick={resetMigration}
                  className="px-6 py-3 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Help Section */}
          {!migrationResult && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">How to use this tool</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-2">1. Configure Source Environment</h4>
                  <p>Enter your source environment ID and Management API key. Test the connection to ensure it's working.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Configure Target Environment</h4>
                  <p>Enter your target environment ID and Management API key. This is where content types will be migrated to.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3. Select Content Types</h4>
                  <p>Choose which content types you want to migrate from the source to target environment.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">4. Start Migration</h4>
                  <p>Configure options and start the migration. Use dry run to preview changes before applying them.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;