import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

// Configuração do Firebase usando expo-constants
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "your-api-key",
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || "your-project.firebaseapp.com",
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || "your-project-id",
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || "your-project.appspot.com",
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || "123456789",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "your-app-id",
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;
