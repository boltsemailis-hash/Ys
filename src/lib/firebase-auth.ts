import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export const signUp = async (credentials: RegisterCredentials) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      email: credentials.email,
      fullName: credentials.fullName || '',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    toast.success('Account created successfully!');
    return { user, error: null };
  } catch (error: any) {
    const message = error.message || 'Sign up failed';
    toast.error(message);
    return { user: null, error: message };
  }
};

export const signIn = async (credentials: LoginCredentials) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    toast.success('Signed in successfully');
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    const message = error.message || 'Sign in failed';
    toast.error(message);
    return { user: null, error: message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    toast.success('Signed out successfully');
    return { error: null };
  } catch (error: any) {
    const message = error.message || 'Sign out failed';
    toast.error(message);
    return { error: message };
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const getUserData = async (userId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
