import { useEffect, useState } from 'react';
import type { KontentContext } from '@/types';

/**
 * Hook to get Kontent.ai context from the custom app environment
 */
export function useKontentContext(): { context: KontentContext | null; isLoading: boolean } {
  const [context, setContext] = useState<KontentContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real Kontent.ai custom app, you would get this from the Smart Link SDK
    // For development, we'll use mock data or URL parameters
    
    const getContextFromURL = (): KontentContext | null => {
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get('projectId');
      const userId = urlParams.get('userId');
      const variant = urlParams.get('variant') as 'published' | 'draft' | null;

      if (projectId && userId) {
        return {
          projectId,
          userId,
          variant: variant || undefined,
        };
      }
      return null;
    };

    const getContextFromSmartLink = async (): Promise<KontentContext | null> => {
      try {
        // In production, you would initialize Smart Link SDK here
        // const KontentSmartLink = await import('@kontent-ai/smart-link');
        // const sdk = KontentSmartLink.initialize();
        // return await sdk.getContext();
        
        // For now, return mock context for development
        return {
          projectId: 'mock-project-id',
          userId: 'mock-user-id',
          variant: 'draft',
        };
      } catch (error) {
        console.error('Failed to get context from Smart Link:', error);
        return null;
      }
    };

    const initializeContext = async () => {
      setIsLoading(true);
      
      // Try to get context from URL parameters first (for development)
      let ctx = getContextFromURL();
      
      // If not available in URL, try Smart Link SDK (production)
      ctx ??= await getContextFromSmartLink();
      
      setContext(ctx);
      setIsLoading(false);
    };

    initializeContext();
  }, []);

  return { context, isLoading };
}

/**
 * Simplified version that just returns context without loading state
 */
export function useKontentContextValue(): KontentContext | null {
  const { context } = useKontentContext();
  return context;
}