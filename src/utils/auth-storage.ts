import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type StoredAuthSession = {
  token: string;
  name: string;
  email: string;
};

const AUTH_STORAGE_KEY = 'auth_session';
let memorySession: StoredAuthSession | null = null;

function isMissingNativeStorageError(error: unknown) {
  return error instanceof Error && error.message.includes('Native module is null');
}

function readWebStorage() {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const value = localStorage.getItem(AUTH_STORAGE_KEY);
  return value ? (JSON.parse(value) as StoredAuthSession) : null;
}

function writeWebStorage(session: StoredAuthSession) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }
}

function clearWebStorage() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export async function storeAuthSession(session: StoredAuthSession) {
  memorySession = session;

  if (Platform.OS === 'web') {
    writeWebStorage(session);
    return;
  }

  try {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    if (!isMissingNativeStorageError(error)) {
      throw error;
    }
  }
}

export async function getStoredAuthSession() {
  if (Platform.OS === 'web') {
    return readWebStorage() ?? memorySession;
  }

  try {
    const value = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

    if (!value) {
      return memorySession;
    }

    const parsedValue = JSON.parse(value) as StoredAuthSession;
    memorySession = parsedValue;
    return parsedValue;
  } catch (error) {
    if (!isMissingNativeStorageError(error)) {
      throw error;
    }

    return memorySession;
  }
}

export async function clearStoredAuthSession() {
  memorySession = null;

  if (Platform.OS === 'web') {
    clearWebStorage();
    return;
  }

  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    if (!isMissingNativeStorageError(error)) {
      throw error;
    }
  }
}
