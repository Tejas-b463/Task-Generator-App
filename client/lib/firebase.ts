import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyAwgKTmQv-NbzkgTI8iPps_1ik17DSxEgs",
  authDomain: "task-generator-app.firebaseapp.com",
  projectId: "task-generator-app",
  storageBucket: "task-generator-app.firebasestorage.app",
  messagingSenderId: "322666917932",
  appId: "1:322666917932:web:c68be5298b0bfd62b1e189",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
