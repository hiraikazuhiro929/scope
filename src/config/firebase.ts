import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

//firebaseの設定
const firebaseConfig = {
    apiKey:"YourAPIKey",
    authDomain:"YourAuthDomain",
    projectId:"YourProjectId",
    storageBucket:"YourStorageBucket",
    messagingSenderId:"YourMessagingSenderId",
    appId:"YourAppId",
    measurementId:"YourMeasurementId"
};

const app=initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
export const storage=getStorage(app);