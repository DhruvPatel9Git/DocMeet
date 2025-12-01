import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCkbdrcJ6kQ3QzBSN5g7XXsyYQhbuz056k",
    authDomain: "docmeet-8474a.firebaseapp.com",
    projectId: "docmeet-8474a",
    storageBucket: "docmeet-8474a.firebasestorage.app",
    messagingSenderId: "134337328123",
    appId: "1:134337328123:web:51a8166d15c6f61c79d15e",
    measurementId: "G-KP4BQWT3YL"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configure Google provider settings
provider.setCustomParameters({
  prompt: 'select_account'
});

// Add language code if needed
provider.addScope('profile');
provider.addScope('email');

export { auth, provider, signInWithPopup };