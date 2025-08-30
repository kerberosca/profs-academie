import { useState, useEffect } from 'react';
import { CalendrierEtude, CoursGouvernemental, NiveauScolaire, Matiere } from '../types/lms';

// Hook pour gérer les calendriers d'étude
export const useCalendriers = (filtres: { parentId?: string; enfantId?: string }) => {
  const [calendriers, setCalendriers] = useState<CalendrierEtude[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendriers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filtres.parentId) params.append('parentId', filtres.parentId);
        if (filtres.enfantId) params.append('enfantId', filtres.enfantId);

        const response = await fetch(`/api/lms/calendriers?${params}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des calendriers');
        
        const data = await response.json();
        setCalendriers(data.calendriers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendriers();
  }, [filtres.parentId, filtres.enfantId]);

  const createCalendrier = async (calendrierData: any): Promise<CalendrierEtude | null> => {
    try {
      const response = await fetch('/api/lms/calendriers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calendrierData)
      });

      if (!response.ok) throw new Error('Erreur lors de la création du calendrier');
      
      const result = await response.json();
      setCalendriers(prev => [result.calendrier, ...prev]);
      return result.calendrier;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return null;
    }
  };

  const deleteCalendrier = async (calendrierId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/lms/calendriers/${calendrierId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression du calendrier');
      
      setCalendriers(prev => prev.filter(c => c.id !== calendrierId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    }
  };

  return { calendriers, loading, error, createCalendrier, deleteCalendrier };
};

// Hook pour gérer les sessions d'étude
export const useSessions = (calendrierId: string) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/lms/sessions?calendrierId=${calendrierId}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des sessions');
        
        const data = await response.json();
        setSessions(data.sessions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (calendrierId) {
      fetchSessions();
    }
  }, [calendrierId]);

  const createSession = async (sessionData: any): Promise<any | null> => {
    try {
      const response = await fetch('/api/lms/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) throw new Error('Erreur lors de la création de la session');
      
      const result = await response.json();
      setSessions(prev => [result.session, ...prev]);
      return result.session;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return null;
    }
  };

  const updateSession = async (sessionId: string, sessionData: any): Promise<any | null> => {
    try {
      const response = await fetch(`/api/lms/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour de la session');
      
      const result = await response.json();
      setSessions(prev => prev.map(s => s.id === sessionId ? result.session : s));
      return result.session;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return null;
    }
  };

  return { sessions, loading, error, createSession, updateSession };
};

// Hook pour récupérer les cours gouvernementaux
export const useCoursGouvernementaux = (filtres: { niveauScolaire?: NiveauScolaire; matiere?: Matiere }) => {
  const [cours, setCours] = useState<CoursGouvernemental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCours = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filtres.niveauScolaire) params.append('niveauScolaire', filtres.niveauScolaire);
        if (filtres.matiere) params.append('matiere', filtres.matiere);

        const response = await fetch(`/api/lms/cours-gouvernementaux?${params}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des cours');
        
        const data = await response.json();
        setCours(data.cours);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchCours();
  }, [filtres.niveauScolaire, filtres.matiere]);

  return { cours, loading, error };
};

// Hook pour récupérer les enfants d'un parent
export const useEnfants = (parentId: string) => {
  const [enfants, setEnfants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnfants = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/lms/enfants?parentId=${parentId}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des enfants');
        
        const data = await response.json();
        setEnfants(data.enfants || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (parentId) {
      fetchEnfants();
    }
  }, [parentId]);

  return { enfants, loading, error };
};
