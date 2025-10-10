import { ManagementClient } from '@kontent-ai/management-sdk';
import type { Environment, ContentType } from '@/types';

export class KontentService {
  private readonly managementClients: Map<string, ManagementClient> = new Map();

  /**
   * Create or get existing management client for an environment
   */
  private getManagementClient(environment: Environment): ManagementClient {
    const key = `${environment.id}-${environment.apiKey}`;
    
    if (!this.managementClients.has(key)) {
      const client = new ManagementClient({
        environmentId: environment.id,
        apiKey: environment.apiKey,
      });
      
      this.managementClients.set(key, client);
    }

    return this.managementClients.get(key)!;
  }

  /**
   * Test connection to a Kontent.ai environment
   */
  async testConnection(environment: Environment): Promise<boolean> {
    try {
      const client = this.getManagementClient(environment);
      await client.listContentTypes().toPromise();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all content types from an environment using direct API calls to handle pagination
   */
  async getContentTypes(environment: Environment): Promise<ContentType[]> {
    try {
      const allContentTypes: any[] = [];
      let continuationToken: string | null = null;
      
      // Use direct fetch API to handle pagination with x-continuation header
      do {
        const url = `https://manage.kontent.ai/v2/projects/${environment.id}/types`;
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${environment.apiKey}`,
          'Content-Type': 'application/json',
        };
        
        if (continuationToken) {
          headers['x-continuation'] = continuationToken;
        }
        
        const response = await fetch(url, {
          method: 'GET',
          headers,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        allContentTypes.push(...data.types);
        
        // Get continuation token for next page
        continuationToken = response.headers.get('x-continuation');
        
      } while (continuationToken);
      
      console.log(`Fetched ${allContentTypes.length} content types from environment ${environment.id}`);
      
      return allContentTypes.map((item: any) => ({
        id: item.id || '',
        name: item.name || '',
        codename: item.codename || '',
        last_modified: new Date(item.last_modified || Date.now()),
        elements: item.elements?.map((element: any) => ({
          id: element.id || '',
          name: element.name || '',
          codename: element.codename || '',
          type: element.type || '',
          is_required: element.is_required || false,
          is_non_localizable: element.is_non_localizable || false,
          guidelines: element.guidelines || '',
          options: element.options || [],
          allowed_content_types: element.allowed_content_types || [],
          validation: element.validation || null,
        })) || [],
        content_groups: item.content_groups?.map((group: any) => ({
          id: group.id || '',
          name: group.name || '',
          codename: group.codename || '',
        })) || [],
      }));
    } catch (error) {
      console.error('Failed to fetch content types:', error);
      throw new Error(`Failed to fetch content types: ${error}`);
    }
  }

  /**
   * Get a specific content type by codename
   */
  async getContentType(environment: Environment, codename: string): Promise<ContentType | null> {
    try {
      const contentTypes = await this.getContentTypes(environment);
      return contentTypes.find(ct => ct.codename === codename) || null;
    } catch (error) {
      console.error(`Failed to fetch content type ${codename}:`, error);
      return null;
    }
  }

  /**
   * Create a new content type in the target environment
   */
  async createContentType(environment: Environment, contentType: ContentType): Promise<boolean> {
    try {
      const client = this.getManagementClient(environment);
      
      await client
        .addContentType()
        .withData(() => ({
          codename: contentType.codename,
          name: contentType.name,
          elements: contentType.elements.map((element: any) => ({
            name: element.name,
            codename: element.codename,
            type: element.type,
          })),
        }))
        .toPromise();

      return true;
    } catch (error) {
      console.error(`Failed to create content type ${contentType.name}:`, error);
      throw new Error(`Failed to create content type: ${error}`);
    }
  }

  /**
   * Update an existing content type (simplified version)
   */
  async updateContentType(_environment: Environment, contentType: ContentType): Promise<boolean> {
    try {
      // For this demo, we'll just log that update is not implemented
      console.warn(`Update not implemented for content type: ${contentType.name}`);
      return false;
    } catch (error) {
      console.error(`Failed to update content type ${contentType.name}:`, error);
      throw new Error(`Failed to update content type: ${error}`);
    }
  }

  /**
   * Check if a content type exists in the environment
   */
  async contentTypeExists(environment: Environment, codename: string): Promise<boolean> {
    try {
      const contentType = await this.getContentType(environment, codename);
      return contentType !== null;
    } catch {
      return false;
    }
  }

  /**
   * Compare content types between two environments
   */
  async compareContentTypes(
    sourceEnv: Environment,
    targetEnv: Environment,
    contentTypeCodenames: string[]
  ): Promise<{
    toCreate: ContentType[];
    toUpdate: ContentType[];
    conflicts: Array<{ contentType: string; reason: string }>;
  }> {
    const toCreate: ContentType[] = [];
    const toUpdate: ContentType[] = [];
    const conflicts: Array<{ contentType: string; reason: string }> = [];

    try {
      const sourceTypes = await this.getContentTypes(sourceEnv);
      const targetTypes = await this.getContentTypes(targetEnv);

      for (const codename of contentTypeCodenames) {
        const sourceType = sourceTypes.find(ct => ct.codename === codename);
        if (!sourceType) {
          conflicts.push({
            contentType: codename,
            reason: 'Content type not found in source environment',
          });
          continue;
        }

        const targetType = targetTypes.find(ct => ct.codename === codename);
        
        if (!targetType) {
          toCreate.push(sourceType);
        } else if (sourceType.last_modified > targetType.last_modified) {
          toUpdate.push(sourceType);
        }
      }
    } catch (error) {
      conflicts.push({
        contentType: 'ALL',
        reason: `Error during comparison: ${error}`,
      });
    }

    return { toCreate, toUpdate, conflicts };
  }
}