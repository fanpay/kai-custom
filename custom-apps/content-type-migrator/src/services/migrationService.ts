import { KontentService } from './kontentService';
import type { 
  ContentType, 
  MigrationConfig, 
  MigrationResult, 
  MigrationStatus,
  MigrationStep 
} from '@/types';

export class MigrationService {
  private kontentService: KontentService;
  private onStatusUpdate?: (status: MigrationStatus) => void;

  constructor(kontentService: KontentService) {
    this.kontentService = kontentService;
  }

  /**
   * Set callback for status updates
   */
  setOnStatusUpdate(callback: (status: MigrationStatus) => void) {
    this.onStatusUpdate = callback;
  }

  /**
   * Update migration status
   */
  private updateStatus(
    status: MigrationStatus['status'],
    step: MigrationStep,
    progress: number,
    errors: string[] = [],
    warnings: string[] = []
  ) {
    if (this.onStatusUpdate) {
      this.onStatusUpdate({
        status,
        currentStep: this.getStepDescription(step),
        progress,
        totalSteps: 7, // Total number of migration steps
        errors,
        warnings,
      });
    }
  }

  /**
   * Get human-readable step description
   */
  private getStepDescription(step: MigrationStep): string {
    const descriptions: Record<MigrationStep, string> = {
      connecting: 'Connecting to environments...',
      'analyzing-source': 'Analyzing source environment...',
      'analyzing-target': 'Analyzing target environment...',
      comparing: 'Comparing content types...',
      'migrating-types': 'Migrating content types...',
      validating: 'Validating migration results...',
      completed: 'Migration completed!',
    };
    return descriptions[step];
  }

  /**
   * Validate migration configuration
   */
  async validateConfiguration(config: MigrationConfig): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // Validate source environment
    if (!config.sourceEnvironment.id || !config.sourceEnvironment.apiKey) {
      errors.push('Source environment configuration is incomplete');
    }

    // Validate target environment  
    if (!config.targetEnvironment.id || !config.targetEnvironment.apiKey) {
      errors.push('Target environment configuration is incomplete');
    }

    // Validate selected content types
    if (!config.selectedContentTypes.length) {
      errors.push('No content types selected for migration');
    }

    // Test connections
    try {
      this.updateStatus('analyzing', 'connecting', 10);
      
      const sourceConnected = await this.kontentService.testConnection(config.sourceEnvironment);
      if (!sourceConnected) {
        errors.push('Cannot connect to source environment');
      }

      const targetConnected = await this.kontentService.testConnection(config.targetEnvironment);
      if (!targetConnected) {
        errors.push('Cannot connect to target environment');
      }
    } catch (error) {
      errors.push(`Connection test failed: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Perform dry run to preview migration changes
   */
  async dryRun(config: MigrationConfig): Promise<{
    toCreate: ContentType[];
    toUpdate: ContentType[];
    conflicts: Array<{ contentType: string; reason: string }>;
  }> {
    this.updateStatus('analyzing', 'analyzing-source', 20);
    
    // Get source content types
    await this.kontentService.getContentTypes(config.sourceEnvironment);

    this.updateStatus('analyzing', 'analyzing-target', 40);

    // Compare with target environment
    const comparison = await this.kontentService.compareContentTypes(
      config.sourceEnvironment,
      config.targetEnvironment,
      config.selectedContentTypes
    );

    this.updateStatus('analyzing', 'comparing', 60);

    return comparison;
  }

  /**
   * Execute the migration
   */
  async migrate(config: MigrationConfig): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      created: [],
      updated: [],
      skipped: [],
      errors: [],
    };

    try {
      // Step 1: Validate configuration
      this.updateStatus('analyzing', 'connecting', 5);
      const validation = await this.validateConfiguration(config);
      if (!validation.valid) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }

      // Step 2: Dry run to get migration plan
      this.updateStatus('analyzing', 'analyzing-source', 15);
      const plan = await this.dryRun(config);

      // Check for conflicts
      if (plan.conflicts.length > 0 && !config.options.dryRun) {
        result.errors = plan.conflicts.map(c => ({
          contentType: c.contentType,
          error: c.reason,
        }));
        throw new Error('Migration conflicts detected. Please resolve them before proceeding.');
      }

      // If dry run only, return early
      if (config.options.dryRun) {
        this.updateStatus('completed', 'completed', 100);
        return {
          ...result,
          success: true,
          created: plan.toCreate,
          updated: plan.toUpdate,
        };
      }

      // Step 3: Execute migrations
      this.updateStatus('migrating', 'migrating-types', 40);
      
      // Create new content types
      let processed = 0;
      const totalOperations = plan.toCreate.length + plan.toUpdate.length;

      for (const contentType of plan.toCreate) {
        try {
          await this.kontentService.createContentType(config.targetEnvironment, contentType);
          result.created.push(contentType);
          processed++;
          this.updateStatus(
            'migrating', 
            'migrating-types', 
            40 + (processed / totalOperations) * 40
          );
        } catch (error) {
          result.errors.push({
            contentType: contentType.codename,
            error: `Failed to create: ${error}`,
          });
        }
      }

      // Update existing content types
      for (const contentType of plan.toUpdate) {
        try {
          if (config.options.overwriteExisting) {
            await this.kontentService.updateContentType(config.targetEnvironment, contentType);
            result.updated.push(contentType);
          } else {
            result.skipped.push(contentType);
          }
          processed++;
          this.updateStatus(
            'migrating', 
            'migrating-types', 
            40 + (processed / totalOperations) * 40
          );
        } catch (error) {
          result.errors.push({
            contentType: contentType.codename,
            error: `Failed to update: ${error}`,
          });
        }
      }

      // Step 4: Validate results
      this.updateStatus('analyzing', 'validating', 90);
      
      // Verify created/updated content types exist in target
      for (const contentType of [...result.created, ...result.updated]) {
        const exists = await this.kontentService.contentTypeExists(
          config.targetEnvironment, 
          contentType.codename
        );
        if (!exists) {
          result.errors.push({
            contentType: contentType.codename,
            error: 'Content type was not found after migration',
          });
        }
      }

      this.updateStatus('completed', 'completed', 100);
      result.success = result.errors.length === 0;

    } catch (error) {
      this.updateStatus('error', 'completed', 100, [String(error)]);
      result.errors.push({
        contentType: 'GENERAL',
        error: String(error),
      });
    }

    return result;
  }

  /**
   * Cancel ongoing migration (if supported)
   */
  async cancelMigration(): Promise<void> {
    // Implementation would depend on how you want to handle cancellation
    // For now, just update status
    this.updateStatus('idle', 'completed', 0);
  }
}