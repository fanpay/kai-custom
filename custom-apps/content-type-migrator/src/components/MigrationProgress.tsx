
import type { MigrationStatus } from '@/types';

interface MigrationProgressProps {
  status: MigrationStatus;
}

export function MigrationProgress({ status }: Readonly<MigrationProgressProps>) {
  const getStatusColor = () => {
    switch (status.status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'analyzing':
      case 'migrating':
        return 'bg-kontent-primary';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'analyzing':
      case 'migrating':
        return (
          <div className="w-5 h-5">
            <div className="animate-spin rounded-full h-full w-full border-2 border-kontent-primary border-t-transparent"></div>
          </div>
        );
      default:
        return null;
    }
  };

  if (status.status === 'idle') {
    return null;
  }

  return (
    <div className="kontent-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold">Migration Progress</h3>
            <p className="text-sm text-gray-600">{status.currentStep}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStatusColor()}`}
            style={{ width: `${Math.max(0, Math.min(100, status.progress))}%` }}
          ></div>
        </div>

        {/* Progress Details */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>{status.progress.toFixed(0)}% complete</span>
          {status.totalSteps > 0 && (
            <span>Step {Math.ceil((status.progress / 100) * status.totalSteps)} of {status.totalSteps}</span>
          )}
        </div>

        {/* Warnings */}
        {status.warnings.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Warnings:</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <ul className="text-sm text-yellow-800 space-y-1">
                {status.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Errors */}
        {status.errors.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">Errors:</h4>
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <ul className="text-sm text-red-800 space-y-1">
                {status.errors.map((error, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Success Message */}
        {status.status === 'completed' && status.errors.length === 0 && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-800">Migration completed successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}