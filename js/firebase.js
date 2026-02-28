import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
