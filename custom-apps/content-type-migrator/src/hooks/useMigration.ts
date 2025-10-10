import { useState, useCallback, useEffect } from 'react';
import { MigrationService } from '@/services/migrationService';
import { KontentService } from '@/services/kontentService';
import type {
  Environment,
  ContentType,
  MigrationConfig,
  MigrationResult,
  MigrationStatus,
} from '@/types';

/**
 * Hook for managing content type migration operations
 */
export function useMigration() {
  const [kontentService] = useState(() => new KontentService());
  const [migrationService] = useState(() => new MigrationService(kontentService));
  
  const [status, setStatus] = useState<MigrationStatus>({
    status: 'idle',
    progress: 0,
    currentStep: '',
    totalSteps: 0,
    errors: [],
    warnings: [],
  });
  
  const [sourceEnvironment, setSourceEnvironment] = useState<Environment | null>(null);
  const [targetEnvironment, setTargetEnvironment] = useState<Environment | null>(null);
  const [sourceContentTypes, setSourceContentTypes] = useState<ContentType[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);

  // Set up status update callback
  useEffect(() => {
    migrationService.setOnStatusUpdate(setStatus);
  }, [migrationService]);

  /**
   * Test connection to an environment
   */
  const testConnection = useCallback(async (environment: Environment): Promise<boolean> => {
    return await kontentService.testConnection(environment);
  }, [kontentService]);

  /**
   * Load content types from source environment
   */
  const loadSourceContentTypes = useCallback(async (environment: Environment) => {
    try {
      setStatus(prev => ({ ...prev, status: 'analyzing' }));
      const contentTypes = await kontentService.getContentTypes(environment);
      setSourceContentTypes(contentTypes);
      setSourceEnvironment(environment);
      setStatus(prev => ({ ...prev, status: 'idle' }));
      return contentTypes;
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        status: 'error', 
        errors: [`Failed to load content types: ${error}`] 
      }));
      throw error;
    }
  }, [kontentService]);

  /**
   * Perform dry run migration
   */
  const performDryRun = useCallback(async (config: MigrationConfig) => {
    try {
      setStatus(prev => ({ ...prev, status: 'analyzing' }));
      const result = await migrationService.dryRun(config);
      setStatus(prev => ({ ...prev, status: 'idle' }));
      return result;
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        status: 'error', 
        errors: [`Dry run failed: ${error}`] 
      }));
      throw error;
    }
  }, [migrationService]);

  /**
   * Execute migration
   */
  const executeMigration = useCallback(async (config: MigrationConfig): Promise<MigrationResult> => {
    try {
      setStatus(prev => ({ ...prev, status: 'migrating' }));
      const result = await migrationService.migrate(config);
      setMigrationResult(result);
      setStatus(prev => ({ 
        ...prev, 
        status: result.success ? 'completed' : 'error' 
      }));
      return result;
    } catch (error) {
      const errorResult: MigrationResult = {
        success: false,
        created: [],
        updated: [],
        skipped: [],
        errors: [{ contentType: 'GENERAL', error: String(error) }],
      };
      setMigrationResult(errorResult);
      setStatus(prev => ({ 
        ...prev, 
        status: 'error', 
        errors: [String(error)] 
      }));
      return errorResult;
    }
  }, [migrationService]);

  /**
   * Reset migration state
   */
  const resetMigration = useCallback(() => {
    setStatus({
      status: 'idle',
      progress: 0,
      currentStep: '',
      totalSteps: 0,
      errors: [],
      warnings: [],
    });
    setMigrationResult(null);
    setSelectedContentTypes([]);
  }, []);

  /**
   * Update selected content types
   */
  const updateSelectedContentTypes = useCallback((contentTypeCodenames: string[]) => {
    setSelectedContentTypes(contentTypeCodenames);
  }, []);

  /**
   * Set target environment
   */
  const updateTargetEnvironment = useCallback((environment: Environment) => {
    setTargetEnvironment(environment);
  }, []);

  /**
   * Create migration configuration from current state
   */
  const createMigrationConfig = useCallback((options: {
    includeContentGroups: boolean;
    overwriteExisting: boolean;
    dryRun: boolean;
  }): MigrationConfig | null => {
    if (!sourceEnvironment || !targetEnvironment || selectedContentTypes.length === 0) {
      return null;
    }

    return {
      sourceEnvironment,
      targetEnvironment,
      selectedContentTypes,
      options,
    };
  }, [sourceEnvironment, targetEnvironment, selectedContentTypes]);

  /**
   * Check if migration is ready to be executed
   */
  const isMigrationReady = useCallback((): boolean => {
    return !!(
      sourceEnvironment &&
      targetEnvironment &&
      selectedContentTypes.length > 0 &&
      status.status === 'idle'
    );
  }, [sourceEnvironment, targetEnvironment, selectedContentTypes, status.status]);

  return {
    // State
    status,
    sourceEnvironment,
    targetEnvironment,
    sourceContentTypes,
    selectedContentTypes,
    migrationResult,
    
    // Actions
    testConnection,
    loadSourceContentTypes,
    performDryRun,
    executeMigration,
    resetMigration,
    updateSelectedContentTypes,
    updateTargetEnvironment,
    createMigrationConfig,
    
    // Computed
    isMigrationReady,
  };
}