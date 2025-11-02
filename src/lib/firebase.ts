import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDMjtQR2O9sldWOCtg-tVDb4t-8Bv3q0dY",
  authDomain: "yash-exe.firebaseapp.com",
  projectId: "yash-exe",
  storageBucket: "yash-exe.firebasestorage.app",
  messagingSenderId: "15598401831",
  appId: "1:15598401831:web:450da19ee470e57fd75102"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
