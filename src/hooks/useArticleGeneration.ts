import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startArticleGeneration, checkArticleStatus } from '../services/articleGeneration';

interface UseArticleGenerationOptions {
  onSuccess?: (article: string) => void;
  onError?: (error: Error) => void;
  pollingInterval?: number;
}

export function useArticleGeneration(options: UseArticleGenerationOptions = {}) {
  const { onSuccess, onError, pollingInterval = 5000 } = options;
  const [isPolling, setIsPolling] = useState(false);

  const mutation = useMutation({
    mutationFn: async (params: any) => {
      try {
        // Start the article generation
        const jobId = await startArticleGeneration(params);
        setIsPolling(true);

        // Create a polling function
        const pollStatus = async (): Promise<string> => {
          const status = await checkArticleStatus(jobId);

          switch (status.type) {
            case 'complete':
              setIsPolling(false);
              if (!status.output) {
                throw new Error('No article content received');
              }
              return status.output;

            case 'failed':
              setIsPolling(false);
              throw new Error(status.error || 'Article generation failed');

            case 'running':
              // Continue polling
              await new Promise(resolve => setTimeout(resolve, pollingInterval));
              return pollStatus();

            default:
              setIsPolling(false);
              throw new Error('Unknown status type');
          }
        };

        // Start polling
        const article = await pollStatus();
        return article;
      } catch (error) {
        setIsPolling(false);
        throw error;
      }
    },
    onSuccess: (article) => {
      onSuccess?.(article);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const generateArticle = useCallback((params: any) => {
    mutation.mutate(params);
  }, [mutation]);

  return {
    generateArticle,
    isLoading: mutation.isPending || isPolling,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}
