import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// PEGA AQUÍ LO QUE COPIASTE DE LA CONSOLA DE FIREBASE
// (Reemplaza estos valores con los tuyos reales)
const firebaseConfig = {
  apiKey: "AIzaSyDhER4yRFJf6fjJo3digFM4ryEQN0Fj2MA", 
  authDomain: "power-service-61a76.firebaseapp.com",
  projectId: "power-service-61a76",
  storageBucket: "power-service-61a76.firebasestorage.app",
  messagingSenderId: "382798026504",
  appId: "1:382798026504:web:65d8601c74a435b460bebd"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos los servicios para usarlos en la app
export const db = getFirestore(app);
export const storage = getStorage(app);