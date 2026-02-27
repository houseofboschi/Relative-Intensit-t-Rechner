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
   ATHLETES
================================*/
function getAthlete(){
  return document.getElementById("athleteSelect").value;
}

function addAthlete(){
  const name=document.getElementById("newAthlete").value;
  if(!name) return;

  const data=getData();
  if(!data[name]) data[name]={};

  saveData(data);
  loadAthletes();
}

function loadAthletes(){
  const select=document.getElementById("athleteSelect");
  select.innerHTML="";

  const data=getData();

  Object.keys(data).forEach(a=>{
    const opt=document.createElement("option");
    opt.value=a;
    opt.textContent=a;
    select.appendChild(opt);
  });

  loadExercises();
}

/* ===============================
   EXERCISES
================================*/
function addExercise(){

  const athlete=getAthlete();
  const name=document.getElementById("newExercise").value;
  if(!athlete||!name) return;

  const data=getData();

  if(!data[athlete][name]){
    data[athlete][name]={
      PRs:{},
      history:[]
    };
  }

  saveData(data);
  loadExercises();
}

function loadExercises(){

  const athlete=getAthlete();
  const select=document.getElementById("exerciseSelect");
  select.innerHTML="";

  const data=getData();
  if(!data[athlete]) return;

  Object.keys(data[athlete]).forEach(ex=>{
    const opt=document.createElement("option");
    opt.value=ex;
    opt.textContent=ex;
    select.appendChild(opt);
  });

  renderHistory();
}

/* ===============================
   RM OVERVIEW
================================*/
function estimateRM(weight, fromRM, targetRM){
  return weight * (rmTable[targetRM]/rmTable[fromRM]);
}

function updateRMOverview(){

  const weight=parseFloat(rmWeight.value);
  const testRM=parseInt(testRMInput.value);

  if(!weight||!testRM) return;

  [1,2,3,5].forEach(rm=>{
    const val=estimateRM(weight,testRM,rm);
    document.getElementById("rm"+rm)
      .textContent=val.toFixed(1);
  });
}

/* ===============================
   SAVE PR + HISTORY
================================*/
function savePR(){

  const athlete=getAthlete();
  const exercise=exerciseSelect.value;

  if(!athlete||!exercise) return;

  const weight=parseFloat(rmWeight.value);
  const rm=parseInt(testRMInput.value);

  if(!weight||!rm) return;

  const data=getData();
  const entry=data[athlete][exercise];

  entry.PRs[rm]=weight;

  entry.history.push({
    date:new Date().toLocaleDateString(),
    rm:rm,
    weight:weight
  });

  saveData(data);

  renderHistory();
}

/* ===============================
   HISTORY TABLE
================================*/
function renderHistory(){

  const athlete=getAthlete();
  const exercise=exerciseSelect.value;

  const tbody=document.getElementById("historyTable");
  tbody.innerHTML="";

  const data=getData();

  if(!data[athlete]?.[exercise]) return;

  const history=data[athlete][exercise].history;

  history.slice().reverse().forEach(h=>{
    tbody.innerHTML+=`
      <tr>
        <td>${h.date}</td>
        <td>${athlete}</td>
        <td>${exercise}</td>
        <td>${h.rm}RM</td>
        <td>${h.weight}</td>
      </tr>`;
  });

  renderGraph(history);
}

/* ===============================
   PROGRESS GRAPH
================================*/
let chart;

function renderGraph(history){

  const ctx=document.getElementById("progressChart");

  const labels=history.map(h=>h.date);
  const dataPoints=history.map(h=>h.weight);

  if(chart) chart.destroy();

  chart=new Chart(ctx,{
    type:"line",
    data:{
      labels:labels,
      datasets:[{
        label:"Gewicht Progression",
        data:dataPoints,
        tension:0.2
      }]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true}
      }
    }
  });
}

/* ===============================
   CALCULATOR
================================*/
function roundStep(value,step){
  return Math.round(value/step)*step;
}

function calculate(){

  const rmWeightVal=parseFloat(rmWeight.value);
  const testRM=parseInt(testRMInput.value);
  const RI=parseFloat(intensity.value)/100;
  const step=parseFloat(roundStepSelect.value);

  resultTable.innerHTML="";

  for(let reps=1;reps<=10;reps++){

    let percent=(rmTable[reps]*RI)/rmTable[testRM];
    percent=roundStep(percent,step);

    const weight=rmWeightVal*percent;

    resultTable.innerHTML+=`
      <tr>
        <td>${reps}</td>
        <td>${(percent*100).toFixed(1)}%</td>
        <td>${weight.toFixed(1)}</td>
      </tr>`;
  }

  updateRMOverview();
}

/* ===============================
   ELEMENT REFERENCES
================================*/
const rmWeight=document.getElementById("rmWeight");
const testRMInput=document.getElementById("testRM");
const intensity=document.getElementById("intensity");
const roundStepSelect=document.getElementById("roundStep");
const resultTable=document.getElementById("resultTable");
const exerciseSelect=document.getElementById("exerciseSelect");

/* ===============================
   EVENTS
================================*/
document.querySelectorAll("input,select")
.forEach(el=>el.addEventListener("input",calculate));

rmWeight.addEventListener("change",savePR);
testRMInput.addEventListener("change",savePR);

document.getElementById("athleteSelect")
.addEventListener("change",loadExercises);

exerciseSelect.addEventListener("change",renderHistory);

/* ===============================
   INIT
================================*/
loadAthletes();
calculate();
