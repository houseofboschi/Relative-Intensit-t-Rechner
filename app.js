document.addEventListener("DOMContentLoaded", () => {

/* ================= STORAGE ================= */

function getData(){
  return JSON.parse(localStorage.getItem("coachData")) || {};
}

function saveData(data){
  localStorage.setItem("coachData", JSON.stringify(data));
}

/* ================= RM TABLE ================= */

const rmPercent = {
  1:1.00,
  2:0.95,
  3:0.93,
  5:0.87
};

/* ================= ATHLETES ================= */

window.saveAthlete = function(){

  const name = athleteName.value.trim();
  if(!name) return;

  const data = getData();
  if(!data[name]) data[name] = {};

  saveData(data);
  loadAthletes();
};

function loadAthletes(){

  const select = athleteSelect;
  select.innerHTML="";

  Object.keys(getData()).forEach(a=>{
    select.innerHTML+=`<option>${a}</option>`;
  });
}

/* ================= EXERCISES ================= */

window.saveExercise = function(){

  const athlete = athleteSelect.value;
  const ex = exerciseName.value.trim();

  if(!athlete || !ex) return;

  const data = getData();

  if(!data[athlete][ex]){
    data[athlete][ex] = {};
  }

  saveData(data);
  loadExercises();
};

function loadExercises(){

  const athlete = athleteSelect.value;
  const select = exerciseSelect;
  select.innerHTML="";

  const exercises = getData()[athlete] || {};

  Object.keys(exercises).forEach(ex=>{
    select.innerHTML+=`<option>${ex}</option>`;
  });
}

/* ================= AUTO RM CALC ================= */

function autoFillRMs(pr){

  let baseRM = null;

  if(pr.rm1) baseRM = pr.rm1;
  else if(pr.rm2) baseRM = pr.rm2 / rmPercent[2];
  else if(pr.rm3) baseRM = pr.rm3 / rmPercent[3];
  else if(pr.rm5) baseRM = pr.rm5 / rmPercent[5];

  if(!baseRM) return pr;

  return {
    rm1: pr.rm1 || (baseRM*rmPercent[1]).toFixed(1),
    rm2: pr.rm2 || (baseRM*rmPercent[2]).toFixed(1),
    rm3: pr.rm3 || (baseRM*rmPercent[3]).toFixed(1),
    rm5: pr.rm5 || (baseRM*rmPercent[5]).toFixed(1)
  };
}

/* ================= LOAD PR ================= */

exerciseSelect.addEventListener("change", ()=>{

  const data = getData();
  const athlete = athleteSelect.value;
  const ex = exerciseSelect.value;

  let pr = data[athlete][ex] || {};

  pr = autoFillRMs(pr);

  rm1.value = pr.rm1 || "";
  rm2.value = pr.rm2 || "";
  rm3.value = pr.rm3 || "";
  rm5.value = pr.rm5 || "";

  calculate();
});

/* ================= SAVE PR ================= */

window.savePR = function(){

  const data = getData();
  const athlete = athleteSelect.value;
  const ex = exerciseSelect.value;

  data[athlete][ex] = {
    rm1: parseFloat(rm1.value)||null,
    rm2: parseFloat(rm2.value)||null,
    rm3: parseFloat(rm3.value)||null,
    rm5: parseFloat(rm5.value)||null
  };

  saveData(data);
};

/* ================= CALCULATOR ================= */

function calculate(){

  const rmWeight = parseFloat(rm1.value)||0;
  const RI = intensity.value/100;

  const tbody = resultTable;
  tbody.innerHTML="";

  for(let reps=1; reps<=10; reps++){

    const percent = (1 - (reps-1)*0.03) * RI;
    const weight = rmWeight * percent;

    tbody.innerHTML+=`
      <tr>
        <td>${reps}</td>
        <td>${(percent*100).toFixed(1)}%</td>
        <td>${weight.toFixed(1)}</td>
      </tr>`;
  }
}

document.querySelectorAll("input,select")
.forEach(el=>el.addEventListener("input",calculate));

/* INIT */

loadAthletes();
calculate();

});
