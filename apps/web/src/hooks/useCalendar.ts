import { useState, useEffect, useReducer, useCallback } from 'react';
import { 
  Child, 
  Course, 
  CalendarWeek, 
  CalendarEvent, 
  CalendarState, 
  CalendarAction,
  GenerateWeekRequest,
  CreateEventRequest,
  UpdateEventRequest
} from '../types/lms';

// Reducer pour gérer l'état du calendrier
function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'SET_SELECTED_CHILD':
      return { ...state, selectedChild: action.payload };
    case 'SET_SELECTED_WEEK':
      return { ...state, selectedWeek: action.payload };
    case 'SET_AVAILABLE_COURSES':
      return { ...state, availableCourses: action.payload };
    case 'SET_HOURS_PER_WEEK':
      return { ...state, hoursPerWeek: action.payload };
    case 'ADD_EVENT':
      return {
        ...state,
        selectedWeek: state.selectedWeek ? {
          ...state.selectedWeek,
          events: [...state.selectedWeek.events, action.payload]
        } : null
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        selectedWeek: state.selectedWeek ? {
          ...state.selectedWeek,
          events: state.selectedWeek.events.map(event =>
            event.id === action.payload.id
              ? { ...event, ...action.payload.event }
              : event
          )
        } : null
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        selectedWeek: state.selectedWeek ? {
          ...state.selectedWeek,
          events: state.selectedWeek.events.filter(event => event.id !== action.payload)
        } : null
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Hook principal pour la gestion du calendrier
export function useCalendar() {
  const [state, dispatch] = useReducer(calendarReducer, {
    selectedChild: null,
    selectedWeek: null,
    availableCourses: [],
    hoursPerWeek: 15, // Valeur par défaut
    loading: false,
    error: null
  });

  // Récupérer un enfant par ID
  const fetchChild = useCallback(async (childId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await fetch(`/api/children/${childId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'enfant');
      }

      const child: Child = await response.json();
      dispatch({ type: 'SET_SELECTED_CHILD', payload: child });

      // Récupérer automatiquement les cours disponibles pour ce niveau
      await fetchAvailableCourses(child.grade);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erreur inconnue' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Récupérer les cours disponibles pour un niveau
  const fetchAvailableCourses = useCallback(async (grade: string) => {
    try {
      const response = await fetch(`/api/courses?grade=${grade}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des cours');
      }

      const data = await response.json();
      dispatch({ type: 'SET_AVAILABLE_COURSES', payload: data.courses });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erreur inconnue' });
    }
  }, []);

  // Définir le nombre d'heures par semaine
  const setHoursPerWeek = useCallback((hours: number) => {
    dispatch({ type: 'SET_HOURS_PER_WEEK', payload: hours });
  }, []);

  // Générer automatiquement une semaine
  const generateWeek = useCallback(async (childId: string, weekStartISO: string, hoursPerWeek?: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const hours = hoursPerWeek || state.hoursPerWeek;

      const response = await fetch('/api/calendars/weeks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, weekStartISO, hoursPerWeek: hours })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération de la semaine');
      }

      const calendarWeek: CalendarWeek = await response.json();
      dispatch({ type: 'SET_SELECTED_WEEK', payload: calendarWeek });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erreur inconnue' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.hoursPerWeek]);

  // Créer une semaine vide
  const createEmptyWeek = useCallback(async (childId: string, weekStartISO: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await fetch('/api/calendars/weeks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, weekStartISO, events: [] })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la semaine');
      }

      const calendarWeek: CalendarWeek = await response.json();
      dispatch({ type: 'SET_SELECTED_WEEK', payload: calendarWeek });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erreur inconnue' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Ajouter un événement
  const addEvent = useCallback(async (eventData: CreateEventRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await fetch('/api/calendars/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'événement');
      }

      const { event } = await response.json();
      dispatch({ type: 'ADD_EVENT', payload: event });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erreur inconnue' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Mettre à jour un événement
  const updateEvent = useCallback(async (eventId: string, updateData: UpdateEventRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await fetch(`/api/calendars/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'événement');
      }

      const { event } = await response.json();
      dispatch({ 
        type: 'UPDATE_EVENT', 
        payload: { id: eventId, event: { startISO: event.startISO, endISO: event.endISO } }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erreur inconnue' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Supprimer un événement
  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await fetch(`/api/calendars/events/${eventId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'événement');
      }

      dispatch({ type: 'DELETE_EVENT', payload: eventId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erreur inconnue' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return {
    ...state,
    fetchChild,
    fetchAvailableCourses,
    setHoursPerWeek,
    generateWeek,
    createEmptyWeek,
    addEvent,
    updateEvent,
    deleteEvent
  };
}
