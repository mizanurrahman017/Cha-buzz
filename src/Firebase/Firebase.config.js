import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5gztUbwisGsDLIIT00_9F1i2Iko-c-vA",
  authDomain: "cha-buzz.firebaseapp.com",
  projectId: "cha-buzz",
  storageBucket: "cha-buzz.firebasestorage.app",
  messagingSenderId: "703105629785",
  appId: "1:703105629785:web:c9e93124458f7bf1ccbb48",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;