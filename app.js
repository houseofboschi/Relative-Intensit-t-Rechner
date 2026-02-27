document.addEventListener("DOMContentLoaded", () => {

const rmTable = {
  1:1.00,2:0.95,3:0.93,4:0.90,5:0.87,
  6:0.85,7:0.83,8:0.80,9:0.77,10:0.75
};

/* ======================
   LOCAL STORAGE (PRs)
====================== */

function getPRs(){
  return JSON.parse(localStorage.getItem("prs")) || {};
}

function savePR(){

  const name = document.getElementById("exerciseName").value.trim();
  const weight = parseFloat(document.getElementById("rmWeight").value);

  if(!name || !weight) return;

  const prs = getPRs();
  prs[name] = weight;

  localStorage.setItem("prs", JSON.stringify(prs));

  loadExerciseList();
}

window.savePR = savePR;

function loadExerciseList(){

  const select = document.getElementById("exerciseSelect");
  const prs = getPRs();

  select.innerHTML = "<option>Übung wählen</option>";

  Object.keys(prs).forEach(ex => {
    const opt = document.createElement("option");
    opt.value = ex;
    opt.textContent = ex;
    select.appendChild(opt);
  });
}

document.getElementById("exerciseSelect")
.addEventListener("change", e => {

  const prs = getPRs();
  const weight = prs[e.target.value];

  if(weight){
    document.getElementById("rmWeight").value = weight;
    calculate();
  }
});

/* ======================
   CALCULATOR
====================== */

function roundStep(value, step){
  return Math.round(value / step) * step;
}

function calculate(){

  const rmWeight =
    parseFloat(document.getElementById("rmWeight").value) || 0;

  const testRM =
    parseInt(document.getElementById("testRM").value) || 1;

  const RI =
    parseFloat(document.getElementById("intensity").value)/100;

  const step =
    parseFloat(document.getElementById("roundStep").value);

  const tbody = document.getElementById("resultTable");
  tbody.innerHTML = "";

  for(let reps=1; reps<=10; reps++){

    let percent =
      (rmTable[reps]*RI)/rmTable[testRM];

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
}

document.querySelectorAll("input,select")
.forEach(el => el.addEventListener("input", calculate));

loadExerciseList();
calculate();

});
