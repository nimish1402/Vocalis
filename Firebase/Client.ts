import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQsecDxp52FeEMqIxMwdxhKc2oFb57RM4",
  authDomain: "vocalis-220bd.firebaseapp.com",
  projectId: "vocalis-220bd",
  storageBucket: "vocalis-220bd.firebasestorage.app",
  messagingSenderId: "356394791403",
  appId: "1:356394791403:web:53665b9b9980428a9929ae",
  measurementId: "G-K6Z0MSR19F"
};

// Initialize Firebase (client-side)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);