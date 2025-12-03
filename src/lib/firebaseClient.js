// lib/firebaseClient.js
import { auth } from './firebase';

export function getFirebaseAuth() {
  if (typeof window === 'undefined') return null;
  return auth;
}

export default getFirebaseAuth;
