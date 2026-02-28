import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMAmfE-kfnX-g1T08Ad0Uw3kmLKs2fH30",
  authDomain: "ri-calculator.firebaseapp.com",
  projectId: "ri-calculator",
  storageBucket: "ri-calculator.firebasestorage.app",
  messagingSenderId: "640294756569",
  appId: "1:640294756569:web:e9902b040c6749f7abdec8"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
