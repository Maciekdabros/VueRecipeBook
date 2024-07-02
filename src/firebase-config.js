import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth,browserLocalPersistence } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAC167E5lUof-LomQe8lK3Xmy4Aio57rG4",
  authDomain: "fir-app-ddabf.firebaseapp.com",
  projectId: "fir-app-ddabf",
  storageBucket: "fir-app-ddabf.appspot.com",
  messagingSenderId: "208594977167",
  appId: "1:208594977167:web:221cf2070dbf76e67e0bfa",
  measurementId: "G-R949M6C3GW"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
auth.setPersistence(browserLocalPersistence);

export { db, storage,auth };