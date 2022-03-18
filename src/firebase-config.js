import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCEo6rhfGKjhs5wLC9Qw5w6kzCEHymWQMo",
    authDomain: "emotionrecognize.firebaseapp.com",
    projectId: "emotionrecognize",
    storageBucket: "emotionrecognize.appspot.com",
    messagingSenderId: "391603914169",
    appId: "1:391603914169:web:57b4297eb91f991e7c2268",
    measurementId: "G-WZQZTNC8VJ"
  };
const app = initializeApp(firebaseConfig);
 const    db = getFirestore(app);
 export default db;