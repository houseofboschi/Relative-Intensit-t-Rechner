import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================
   WORKOUT LISTE LADEN
========================= */

export async function loadWorkouts(){

  const snapshot =
    await getDocs(collection(db,"workouts"));

  const select =
    document.getElementById("workoutSelect");

  select.innerHTML = "";

  snapshot.forEach(docSnap => {

    const workout = docSnap.data();

    const option = document.createElement("option");
    option.value = docSnap.id;
    option.textContent =
      `${workout.date} — ${workout.title}`;

    select.appendChild(option);
  });

  select.addEventListener("change", e =>
    showWorkout(e.target.value)
  );
}


/* =========================
   WORKOUT DETAILS ANZEIGEN
========================= */

async function showWorkout(id){

  const snap =
    await getDoc(doc(db,"workouts",id));

  const workout = snap.data();

  const container =
    document.getElementById("workoutDetails");

  let html = `<h3>${workout.title}</h3>`;

  workout.parts.forEach(p => {
    html += `
      <p>
        <b>${p.exercise}</b><br>
        ${p.sets} Sätze × ${p.reps} Reps @ ${p.intensity}%
      </p>
    `;
  });

  container.innerHTML = html;
}
