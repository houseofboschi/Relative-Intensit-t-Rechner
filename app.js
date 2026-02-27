/* ======================
   RM BASIS TABELLE
====================== */

const rmTable = {
  1:1.00,
  2:0.95,
  3:0.93,
  4:0.90,
  5:0.87,
  6:0.85,
  7:0.83,
  8:0.80,
  9:0.77,
  10:0.75
};

/* ======================
   LOCAL STORAGE
====================== */

function getExercises(){
  return JSON.parse(localStorage.getItem("exercises") || "{}");
}

function saveExercises(data){
  localStorage.setItem("exercises", JSON.stringify(data));
}

/* ======================
   ÜBUNGEN
====================== */

function saveExercise(){
  const name = document.getElementById("exerciseName").value.trim();
  if(!name) return;

  const data = getExercises();

  if(!data[name]){
    data[name] = {};
    saveExercises(data);
    loadExerciseList();
  }
}

function loadExerciseList(){
  const select = document.getElementById("exerciseSelect");
  select.innerHTML="";

  const data = getExercises();

  Object.keys(data).forEach(name=>{
    const opt=document.createElement("option");
    opt.value=name;
    opt.textContent=name;
    select.appendChild(opt);
  });

  loadPRs();
}

/* ======================
   PR HANDLING
====================== */

function loadPRs(){
  const name=document.getElementById("exerciseSelect").value;
  const data=getExercises();

  const prs=data[name]||{};

  rm1.value=prs.rm1||"";
  rm2.value=prs.rm2||"";
  rm3.value=prs.rm3||"";
  rm5.value=prs.rm5||"";

  autoFillPRs();
}

function savePRs(){
  const name=document.getElementById("exerciseSelect").value;
  if(!name) return;

  const data=getExercises();

  data[name]={
    rm1:parseFloat(rm1.value)||null,
    rm2:parseFloat(rm2.value)||null,
    rm3:parseFloat(rm3.value)||null,
    rm5:parseFloat(rm5.value)||null
  };

  saveExercises(data);
}

/* ======================
   AUTO BERECHNUNG PRs
====================== */

function estimateRM(weight, reps, target){
  const oneRM = weight / rmTable[reps];
  return oneRM * rmTable[target];
}

function autoFillPRs(){

  const values={
    1:parseFloat(rm1.value),
    2:parseFloat(rm2.value),
    3:parseFloat(rm3.value),
    5:parseFloat(rm5.value)
  };

  const knownRep = Object.keys(values).find(r=>values[r]);

  if(!knownRep) return;

  const knownWeight=values[knownRep];

  [1,2,3,5].forEach(r=>{
    if(!values[r]){
      const calc=estimateRM(knownWeight,knownRep,r);
      document.getElementById("rm"+r).value=calc.toFixed(1);
    }
  });
}

/* ======================
   RM BERECHNUNGSTABELLE
====================== */

function roundStep(value,step){
  return Math.round(value/step)*step;
}

function calculate(){

  const rmWeight=parseFloat(rmWeightInput.value);
  const testRM=parseInt(testRMSelect.value);
  const RI=parseFloat(intensity.value)/100;
  const step=parseFloat(roundStepSelect.value);

  if(!rmWeight) return;

  resultTable.innerHTML="";

  for(let reps=1;reps<=10;reps++){

    let percent=(rmTable[reps]*RI)/rmTable[testRM];
    percent=roundStep(percent,step);

    let weight=rmWeight*percent;

    resultTable.innerHTML+=`
      <tr>
        <td>${reps}</td>
        <td>${(percent*100).toFixed(1)}%</td>
        <td>${weight.toFixed(1)}</td>
      </tr>
    `;
  }
}

/* ======================
   EVENTS
====================== */

const rm1=document.getElementById("rm1");
const rm2=document.getElementById("rm2");
const rm3=document.getElementById("rm3");
const rm5=document.getElementById("rm5");

const rmWeightInput=document.getElementById("rmWeight");
const testRMSelect=document.getElementById("testRM");
const roundStepSelect=document.getElementById("roundStep");

[rm1,rm2,rm3,rm5].forEach(el=>{
  el.addEventListener("input",()=>{
    autoFillPRs();
    savePRs();
  });
});

document.querySelectorAll("input,select")
  .forEach(el=>el.addEventListener("input",calculate));

document.getElementById("exerciseSelect")
  .addEventListener("change",loadPRs);

/* INIT */

loadExerciseList();
calculate();
