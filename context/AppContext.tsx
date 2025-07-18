import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, WorkoutSession, WorkoutType } from '@/types';

interface AppState {
  user: UserProfile | null;
  workoutHistory: WorkoutSession[];
  currentWorkout: WorkoutSession | null;
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'SET_WORKOUT_HISTORY'; payload: WorkoutSession[] }
  | { type: 'START_WORKOUT'; payload: WorkoutSession }
  | { type: 'UPDATE_CURRENT_WORKOUT'; payload: WorkoutSession }
  | { type: 'COMPLETE_WORKOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  workoutHistory: [],
  currentWorkout: null,
  isLoading: true,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  saveData: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => {},
  saveData: async () => {},
});

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_WORKOUT_HISTORY':
      return { ...state, workoutHistory: action.payload };
    case 'START_WORKOUT':
      return { ...state, currentWorkout: action.payload };
    case 'UPDATE_CURRENT_WORKOUT':
      return { ...state, currentWorkout: action.payload };
    case 'COMPLETE_WORKOUT':
      if (!state.currentWorkout) return state;
      return {
        ...state,
        workoutHistory: [...state.workoutHistory, state.currentWorkout],
        currentWorkout: null,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(state.user));
      await AsyncStorage.setItem('workoutHistory', JSON.stringify(state.workoutHistory));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const userProfile = await AsyncStorage.getItem('userProfile');
      const workoutHistory = await AsyncStorage.getItem('workoutHistory');

      if (userProfile) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(userProfile) });
      }

      if (workoutHistory) {
        dispatch({ type: 'SET_WORKOUT_HISTORY', payload: JSON.parse(workoutHistory) });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveData();
    }
  }, [state.user, state.workoutHistory]);

  return (
    <AppContext.Provider value={{ state, dispatch, saveData }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};