import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAChxwXK635vm74vxwvtHHKj7edmdh8cuM",
  authDomain: "magyar-kereso.firebaseapp.com",
  projectId: "magyar-kereso",
  storageBucket: "magyar-kereso.firebasestorage.app",
  messagingSenderId: "277617808585",
  appId: "1:277617808585:web:62ad6d17f5e88aa9532918",
  measurementId: "G-72V2Z5L3CP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Development környezetben CORS kezelés
if (process.env.NODE_ENV === 'development') {
  // Csak development környezetben
  console.log('Development mód - Storage CORS kezelés aktív');
}

// Analytics csak böngésző környezetben inicializálása
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null; 