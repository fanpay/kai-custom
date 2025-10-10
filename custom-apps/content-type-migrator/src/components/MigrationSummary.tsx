
import type { MigrationResult } from '@/types';

interface MigrationSummaryProps {
  result: MigrationResult;
  onReset: () => void;
}

export function MigrationSummary({ result, onReset }: Readonly<MigrationSummaryProps>) {
  return (
    <div className="kontent-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {result.success ? (
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <div>
              <h3 className="text-xl font-semibold">
                Migration {result.success ? 'Completed' : 'Failed'}
              </h3>
              <p className="text-sm text-gray-600">
                {result.success 
                  ? 'Content types have been migrated successfully'
                  : 'Migration completed with errors'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="kontent-button-primary"
          >
            Start New Migration
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Created */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{result.created.length}</div>
            <div className="text-sm text-green-800">Created</div>
          </div>

          {/* Updated */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{result.updated.length}</div>
            <div className="text-sm text-blue-800">Updated</div>
          </div>

          {/* Skipped */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{result.skipped.length}</div>
            <div className="text-sm text-yellow-800">Skipped</div>
          </div>

          {/* Errors */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{result.errors.length}</div>
            <div className="text-sm text-red-800">Errors</div>
          </div>
        </div>

        {/* Created Content Types */}
        {result.created.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-green-800 mb-3">
              Created Content Types ({result.created.length})
            </h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-2">
                {result.created.map((contentType) => (
                  <div key={contentType.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{contentType.name}</span>
                      <span className="text-sm text-gray-600 ml-2 font-mono">
                        ({contentType.codename})
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {contentType.elements.length} elements
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Updated Content Types */}
        {result.updated.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-blue-800 mb-3">
              Updated Content Types ({result.updated.length})
            </h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2">
                {result.updated.map((contentType) => (
                  <div key={contentType.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{contentType.name}</span>
                      <span className="text-sm text-gray-600 ml-2 font-mono">
                        ({contentType.codename})
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {contentType.elements.length} elements
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skipped Content Types */}
        {result.skipped.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-yellow-800 mb-3">
              Skipped Content Types ({result.skipped.length})
            </h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="space-y-2">
                {result.skipped.map((contentType) => (
                  <div key={contentType.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{contentType.name}</span>
                      <span className="text-sm text-gray-600 ml-2 font-mono">
                        ({contentType.codename})
                      </span>
                    </div>
                    <span className="text-xs text-yellow-600">Already exists</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Errors */}
        {result.errors.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-red-800 mb-3">
              Errors ({result.errors.length})
            </h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="space-y-3">
                {result.errors.map((error, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <div className="font-medium text-red-800">{error.contentType}</div>
                      <div className="text-sm text-red-700 mt-1">{error.error}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        {result.success && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Next Steps</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Verify the migrated content types in your target environment</li>
              <li>• Update any content items that reference the migrated content types</li>
              <li>• Test your content workflows with the new content types</li>
              <li>• Consider migrating related content items if needed</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}