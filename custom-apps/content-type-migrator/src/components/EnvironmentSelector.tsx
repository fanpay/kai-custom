import { useState } from 'react';
import type { Environment } from '@/types';

interface EnvironmentSelectorProps {
  environment: Environment | null;
  onEnvironmentChange: (environment: Environment) => void;
  onTestConnection: (environment: Environment) => Promise<boolean>;
  label: string;
  placeholder?: string;
}

export function EnvironmentSelector({
  environment,
  onEnvironmentChange,
  onTestConnection,
  label,
  placeholder = "Enter environment ID...",
}: EnvironmentSelectorProps) {
  const [formData, setFormData] = useState<Partial<Environment>>({
    id: environment?.id || '',
    name: environment?.name || '',
    apiKey: environment?.apiKey || '',
    previewApiKey: environment?.previewApiKey || '',
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: keyof Environment, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setConnectionStatus('idle'); // Reset connection status on change
  };

  const handleTestConnection = async () => {
    if (!formData.id || !formData.apiKey) {
      setConnectionStatus('error');
      return;
    }

    setIsTestingConnection(true);
    try {
      const testEnv: Environment = {
        id: formData.id!,
        name: formData.name || formData.id!,
        apiKey: formData.apiKey!,
        previewApiKey: formData.previewApiKey,
      };

      const success = await onTestConnection(testEnv);
      setConnectionStatus(success ? 'success' : 'error');
      
      if (success) {
        onEnvironmentChange(testEnv);
      }
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const isFormValid = formData.id && formData.apiKey;

  return (
    <div className="kontent-card">
      <h3 className="text-lg font-semibold mb-4">{label}</h3>
      
      <div className="space-y-4">
        {/* Environment ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Environment ID *
          </label>
          <input
            type="text"
            className="kontent-input"
            placeholder={placeholder}
            value={formData.id || ''}
            onChange={(e) => handleInputChange('id', e.target.value)}
          />
        </div>

        {/* Environment Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Environment Name
          </label>
          <input
            type="text"
            className="kontent-input"
            placeholder="Environment name (optional)"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        {/* Management API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Management API Key *
          </label>
          <input
            type="password"
            className="kontent-input"
            placeholder="Enter Management API Key"
            value={formData.apiKey || ''}
            onChange={(e) => handleInputChange('apiKey', e.target.value)}
          />
        </div>

        {/* Preview API Key (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preview API Key (optional)
          </label>
          <input
            type="password"
            className="kontent-input"
            placeholder="Enter Preview API Key"
            value={formData.previewApiKey || ''}
            onChange={(e) => handleInputChange('previewApiKey', e.target.value)}
          />
        </div>

        {/* Test Connection Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTestConnection}
            disabled={!isFormValid || isTestingConnection}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              !isFormValid || isTestingConnection
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'kontent-button-secondary'
            }`}
          >
            {isTestingConnection ? 'Testing...' : 'Test Connection'}
          </button>

          {/* Connection Status Indicator */}
          {connectionStatus === 'success' && (
            <div className="flex items-center text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Connected
            </div>
          )}
          {connectionStatus === 'error' && (
            <div className="flex items-center text-red-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Connection failed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}