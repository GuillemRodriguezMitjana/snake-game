import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB4k1zjefWVbYdmvqGLufJZPPf_uh5z4YA",
  authDomain: "snake-game-fb9db.firebaseapp.com",
  projectId: "snake-game-fb9db",
  storageBucket: "snake-game-fb9db.firebasestorage.app",
  messagingSenderId: "746151158355",
  appId: "1:746151158355:web:d49bf41a54724cc1e01ca6",
  measurementId: "G-1GENBWZ9HT",
  databaseURL:
    "https://snake-game-fb9db-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;
