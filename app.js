// 🔥 FIREBASE IMPORTS
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// 🔥 DEINE FIREBASE CONFIG HIER EINSETZEN
const firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
};


// INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



/* =========================
   PR SPEICHERN
========================= */

document.getElementById("savePR")
.addEventListener("click", async () => {

  const athlete =
    document.getElementById("athleteName").value;

  const exercise =
    document.getElementById("exerciseName").value;

  const value =
    parseFloat(document.getElementById("prValue").value);

  if(!athlete || !exercise || !value){
    alert("Bitte alle Felder ausfüllen");
    return;
  }

  await addDoc(collection(db,"leaderboard"),{
    athlete,
    exercise,
    value,
    timestamp: serverTimestamp()
  });

});



/* =========================
   🔥 REALTIME LEADERBOARD
========================= */

function startLeaderboardListener(){

  const table =
    document.getElementById("leaderboardBody");

  const q = query(
    collection(db,"leaderboard"),
    orderBy("value","desc"),
    limit(50)
  );

  onSnapshot(q,(snapshot)=>{

    table.innerHTML="";

    snapshot.forEach(doc=>{

      const d = doc.data();

      table.innerHTML += `
        <tr>
          <td>${d.athlete}</td>
          <td>${d.exercise}</td>
          <td>${d.value} kg</td>
        </tr>
      `;
    });

  });
}


// START LISTENER
startLeaderboardListener();
