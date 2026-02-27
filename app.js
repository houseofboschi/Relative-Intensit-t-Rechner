/* ===============================
   RM PROFILE
================================*/

const rmTable = {
  1:1.00, 2:0.95, 3:0.93, 4:0.90, 5:0.87,
  6:0.85, 7:0.83, 8:0.80, 9:0.77, 10:0.75
};

/* ===============================
   STORAGE
================================*/

function getData(){
  return JSON.parse(localStorage.getItem("prData") || "{}");
}

function saveData(data){
  localStorage.setItem("prData", JSON.stringify(data));
}

/* ===============================
   EXERCISES
================================*/

function addExercise(){
  const name = document.getElementById("newExercise").value;
  if(!name) return;

  const data = getData();
  if(!data[name]) data[name] = {};

  saveData(data);
  loadExercises();
}

function loadExercises(){
  const select = document.getElementById("exerciseSelect");
  select.innerHTML = "";

  const data = getData();

  Object.keys(data).forEach(ex=>{
    const opt = document.createElement("option");
    opt.value = ex;
    opt.textContent = ex;
    select.appendChild(opt);
  });

  updateFromExercise();
}

/* ===============================
   RM CALCULATION
================================*/

function estimateRM(weight, fromRM, targetRM){
  return weight * (rmTable[targetRM] / rmTable[fromRM]);
}

function updateRMOverview(){

  const weight = parseFloat(document.getElementById("rmWeight").value);
  const testRM = parseInt(document.getElementById("testRM").value);

  if(!weight || !testRM) return;

  const exercise =
    document.getElementById("exerciseSelect").value;

  const data = getData();
  const stored = data[exercise] || {};

  const rmTargets = [1,2,3,5];

  rmTargets.forEach(rm => {

    let value;

    // wenn gespeichert → benutzen
    if(stored[rm]){
      value = stored[rm];
    }
    // sonst berechnen
    else{
      value = estimateRM(weight, testRM, rm);
    }

    document.getElementById("rm"+rm)
      .textContent = value.toFixed(1);
  });
}

/* ===============================
   ROUNDING
================================*/

function roundStep(value, step){
  return Math.round(value / step) * step;
}

/* ===============================
   MAIN CALCULATION
================================*/

function calculate(){

  const rmWeight =
    parseFloat(document.getElementById("rmWeight").value);

  const testRM =
    parseInt(document.getElementById("testRM").value);

  const RI =
    parseFloat(document.getElementById("intensity").value)/100;

  const step =
    parseFloat(document.getElementById("roundStep").value);

  const tbody =
    document.getElementById("resultTable");

  tbody.innerHTML = "";

  for(let reps=1; reps<=10; reps++){

    let percent =
      (rmTable[reps] * RI) /
      rmTable[testRM];

    percent = roundStep(percent, step);

    const weight = rmWeight * percent;

    tbody.innerHTML += `
      <tr>
        <td>${reps}</td>
        <td>${(percent*100).toFixed(1)}%</td>
        <td>${weight.toFixed(1)}</td>
      </tr>
    `;
  }

  updateRMOverview();
}

/* ===============================
   EVENTS
================================*/

document.querySelectorAll("input,select")
  .forEach(el => el.addEventListener("input", calculate));

document.getElementById("exerciseSelect")
  .addEventListener("change", calculate);

/* ===============================
   INIT
================================*/

loadExercises();
calculate();
