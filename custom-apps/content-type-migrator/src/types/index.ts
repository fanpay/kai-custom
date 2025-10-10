export interface Environment {
  id: string;
  name: string;
  apiKey: string;
  previewApiKey?: string;
}

export interface ContentTypeElement {
  id: string;
  name: string;
  codename: string;
  type: string;
  is_required: boolean;
  is_non_localizable?: boolean;
  guidelines?: string;
  options?: any[];
  allowed_content_types?: string[];
  validation?: any;
}

export interface ContentType {
  id: string;
  name: string;
  codename: string;
  last_modified: Date;
  elements: ContentTypeElement[];
  content_groups?: ContentGroup[];
}

export interface ContentGroup {
  id: string;
  name: string;
  codename: string;
}

export interface MigrationStatus {
  status: 'idle' | 'analyzing' | 'migrating' | 'completed' | 'error';
  progress: number;
  currentStep: string;
  totalSteps: number;
  errors: string[];
  warnings: string[];
}

export interface MigrationConfig {
  sourceEnvironment: Environment;
  targetEnvironment: Environment;
  selectedContentTypes: string[];
  options: {
    includeContentGroups: boolean;
    overwriteExisting: boolean;
    dryRun: boolean;
  };
}

export interface MigrationResult {
  success: boolean;
  created: ContentType[];
  updated: ContentType[];
  skipped: ContentType[];
  errors: Array<{
    contentType: string;
    error: string;
  }>;
}

export interface KontentContext {
  projectId: string;
  userId: string;
  variant?: 'published' | 'draft';
}

export type MigrationStep = 
  | 'connecting'
  | 'analyzing-source'
  | 'analyzing-target' 
  | 'comparing'
  | 'migrating-types'
  | 'validating'
  | 'completed';