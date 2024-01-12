
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDuNvvORPX2ANb_PsGXFFrwz8ncsOvoMnw",
  authDomain: "webcars-39dd1.firebaseapp.com",
  projectId: "webcars-39dd1",
  storageBucket: "webcars-39dd1.appspot.com",
  messagingSenderId: "987974106825",
  appId: "1:987974106825:web:91095781ab72ccf2e9d718"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage }