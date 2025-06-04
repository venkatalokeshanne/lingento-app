// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Firebase configuration object - using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export the auth and db objects
export { auth, db };

// Helper to check if a user is a new user
const isNewUser = async (userId) => {
  try {
    const userMetadataRef = doc(db, 'user_metadata', userId);
    const userMetadata = await getDoc(userMetadataRef);
    return !userMetadata.exists();
  } catch (error) {
    console.error("Error checking if user is new:", error);
    return false;
  }
};

// Helper to create or update user metadata
const createOrUpdateUserMetadata = async (user, isNew = false) => {
  try {
    const userMetadataRef = doc(db, 'user_metadata', user.uid);
    const now = new Date();
    
    const userMetadata = await getDoc(userMetadataRef);
    
    if (!userMetadata.exists()) {
      // This is a new user
      await setDoc(userMetadataRef, {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        firstLogin: now,
        lastLogin: now,
        loginCount: 1,
        isNewUser: true,
        created: now,
        updated: now
      });
      return true; // Return true to indicate new user
    } else {
      // Existing user, update login info
      const data = userMetadata.data();
      await setDoc(userMetadataRef, {
        lastLogin: now,
        loginCount: (data.loginCount || 0) + 1,
        isNewUser: false,
        updated: now
      }, { merge: true });
      return false; // Return false to indicate existing user
    }
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return isNew; // Return the passed value if there was an error
  }
};

// Authentication helper functions
export const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const isNew = true;
    await createOrUpdateUserMetadata(userCredential.user, isNew);
    return { user: userCredential.user, error: null, isNewUser: isNew };
  } catch (error) {
    return { user: null, error: error.message, isNewUser: false };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const newUser = await isNewUser(userCredential.user.uid);
    await createOrUpdateUserMetadata(userCredential.user, newUser);
    return { user: userCredential.user, error: null, isNewUser: newUser };
  } catch (error) {
    return { user: null, error: error.message, isNewUser: false };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Google Authentication
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    // Add scopes for additional permissions if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account' // Force account selection even if one account is available
    });
    
    // Try with popup first, as it provides better UX when it works
    try {
      const result = await signInWithPopup(auth, provider);
      const newUser = await isNewUser(result.user.uid);
      await createOrUpdateUserMetadata(result.user, newUser);
      return { user: result.user, error: null, isNewUser: newUser };
    } catch (popupError) {
      console.error("Google popup sign-in failed, trying redirect:", popupError);
      
      // If we get specific popup errors, just return them
      if (['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/popup-blocked'].includes(popupError.code)) {
        return { 
          user: null, 
          error: popupError.code === 'auth/popup-closed-by-user' 
            ? 'Authentication was cancelled. Please try again.'
            : popupError.code === 'auth/cancelled-popup-request'
            ? 'Another authentication request is in progress.'
            : 'Popup was blocked by your browser. Please try again.' 
        };
      }
      
      throw popupError; // Let the outer catch handle other errors
    }
  } catch (error) {
    console.error("Google sign-in error:", error);
    return { user: null, error: error.message, isNewUser: false };
  }
};

// Facebook Authentication
export const signInWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    // Add scopes for additional permissions if needed
    provider.addScope('email');
    provider.addScope('public_profile');
    
    // Try with popup first, as it provides better UX when it works
    try {
      const result = await signInWithPopup(auth, provider);
      const newUser = await isNewUser(result.user.uid);
      await createOrUpdateUserMetadata(result.user, newUser);
      return { user: result.user, error: null, isNewUser: newUser };
    } catch (popupError) {
      console.error("Facebook popup sign-in failed, trying redirect:", popupError);
      
      // If we get specific popup errors, just return them
      if (['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/popup-blocked'].includes(popupError.code)) {
        return { 
          user: null, 
          error: popupError.code === 'auth/popup-closed-by-user' 
            ? 'Authentication was cancelled. Please try again.'
            : popupError.code === 'auth/cancelled-popup-request'
            ? 'Another authentication request is in progress.'
            : 'Popup was blocked by your browser. Please try again.' 
        };
      }
      
      throw popupError; // Let the outer catch handle other errors
    }
  } catch (error) {
    console.error("Facebook sign-in error:", error);
    return { user: null, error: error.message, isNewUser: false };
  }
};
