'use client';
import { useState, useCallback } from 'react';
import { 
  LearningPlan, 
  GenerateLearningPlanRequest, 
  PlanWeekRequest 
} from '../types/lms';

interface LearningPlanState {
  currentPlan: LearningPlan | null;
  loading: boolean;
  error: string | null;
}

export function useLearningPlan() {
  const [state, setState] = useState<LearningPlanState>({
    currentPlan: null,
    loading: false,
    error: null
  });

  const generatePlan = useCallback(async (request: GenerateLearningPlanRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/learning-plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération du plan');
      }

      const plan: LearningPlan = await response.json();
      setState(prev => ({ 
        ...prev, 
        currentPlan: plan, 
        loading: false 
      }));

      return plan;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, []);

  const planWeek = useCallback(async (request: PlanWeekRequest) => {
    // Placeholder pour la fonctionnalité future
    console.log('Planifier cette semaine:', request);
    // TODO: Implémenter la logique de planification
  }, []);

  const clearPlan = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      currentPlan: null, 
      error: null 
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    generatePlan,
    planWeek,
    clearPlan,
    clearError
  };
}
