import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal, Activity, Reminder, ReflectionSession } from '../types';

// Storage keys
const STORAGE_KEYS = {
  GOALS: 'goals',
  ACTIVITIES: 'activities',
  REMINDERS: 'reminders',
  REFLECTION_SESSIONS: 'reflection_sessions',
};

// Goals
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const goalsJson = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
    if (goalsJson) {
      const goals = JSON.parse(goalsJson);
      // Convert date strings back to Date objects
      return goals.map((goal: any) => ({
        ...goal,
        targetDate: new Date(goal.targetDate),
        createdAt: new Date(goal.createdAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar metas:', error);
    return [];
  }
};

export const saveGoals = async (goals: Goal[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Erro ao salvar metas:', error);
    throw error;
  }
};

// Activities
export const getActivities = async (): Promise<Activity[]> => {
  try {
    const activitiesJson = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (activitiesJson) {
      const activities = JSON.parse(activitiesJson);
      // Convert date strings back to Date objects
      return activities.map((activity: any) => ({
        ...activity,
        createdAt: new Date(activity.createdAt),
        completedAt: activity.completedAt ? new Date(activity.completedAt) : undefined,
      }));
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar atividades:', error);
    return [];
  }
};

export const saveActivities = async (activities: Activity[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (error) {
    console.error('Erro ao salvar atividades:', error);
    throw error;
  }
};

// Reminders
export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const remindersJson = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (remindersJson) {
      const reminders = JSON.parse(remindersJson);
      // Convert date strings back to Date objects
      return reminders.map((reminder: any) => ({
        ...reminder,
        createdAt: new Date(reminder.createdAt),
        completedAt: reminder.completedAt ? new Date(reminder.completedAt) : undefined,
      }));
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar lembretes:', error);
    return [];
  }
};

export const saveReminders = async (reminders: Reminder[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (error) {
    console.error('Erro ao salvar lembretes:', error);
    throw error;
  }
};

// Reflection Sessions
export const getReflectionSessions = async (): Promise<ReflectionSession[]> => {
  try {
    const sessionsJson = await AsyncStorage.getItem(STORAGE_KEYS.REFLECTION_SESSIONS);
    if (sessionsJson) {
      const sessions = JSON.parse(sessionsJson);
      // Convert date strings back to Date objects
      return sessions.map((session: any) => ({
        ...session,
        date: new Date(session.date),
      }));
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar sessões de reflexão:', error);
    return [];
  }
};

export const saveReflectionSessions = async (sessions: ReflectionSession[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REFLECTION_SESSIONS, JSON.stringify(sessions));
  } catch (error) {
    console.error('Erro ao salvar sessões de reflexão:', error);
    throw error;
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.GOALS),
      AsyncStorage.removeItem(STORAGE_KEYS.ACTIVITIES),
      AsyncStorage.removeItem(STORAGE_KEYS.REMINDERS),
      AsyncStorage.removeItem(STORAGE_KEYS.REFLECTION_SESSIONS),
    ]);
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    throw error;
  }
};
