import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getStorage} from "firebase/storage";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDt2bYYHK40Dso7zkUuvJT826wZuq0ZvRo",
  authDomain: "projetweb-b468d.firebaseapp.com",
  projectId: "projetweb-b468d",
  storageBucket: "projetweb-b468d.appspot.com",
  messagingSenderId: "547397068071",
  appId: "1:547397068071:web:481340310b06d418a67502",
  measurementId: "G-5V69EGJHT2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage =getStorage(app)

export const auth = getAuth(app);


export default app;
