import firebase from "firebase/compat/app";
import "firebase/compat/database";
const firebaseConfig = {
    apiKey: "AIzaSyA26UIoYIa_fklLd6Ad77ZiGdBMdCkzEv0",
    authDomain: "cultivator-d9052.firebaseapp.com",
    databaseURL: "https://cultivator-d9052-default-rtdb.firebaseio.com",
    projectId: "cultivator-d9052",
    storageBucket: "cultivator-d9052.appspot.com",
    messagingSenderId: "515776035748",
    appId: "1:515776035748:web:315a77ba51123df3f61f31"
};

firebase.initializeApp(firebaseConfig);
export const dataRef = firebase.database();
export default firebase;