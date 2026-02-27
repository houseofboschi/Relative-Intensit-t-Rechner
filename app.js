document.addEventListener("DOMContentLoaded", () => {

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

function roundStep(value, step){
  return Math.round(value / step) * step;
}

function calculate(){

  const rmWeight =
    parseFloat(document.getElementById("rmWeight").value) || 0;

  const testRM =
    parseInt(document.getElementById("testRM").value) || 1;

  const RI =
    parseFloat(document.getElementById("intensity").value) / 100;

  const step =
    parseFloat(document.getElementById("roundStep").value);

  const tbody = document.getElementById("resultTable");
  tbody.innerHTML = "";

  for(let reps = 1; reps <= 10; reps++){

    let percent =
      (rmTable[reps] * RI) / rmTable[testRM];

    percent = roundStep(percent, step);

    const weight = rmWeight * percent;

    const row = `
      <tr>
        <td>${reps}</td>
        <td>${(percent*100).toFixed(1)}%</td>
        <td>${weight.toFixed(1)}</td>
      </tr>
    `;

    tbody.innerHTML += row;
  }
}

// Live Update
document.querySelectorAll("input,select")
  .forEach(el => el.addEventListener("input", calculate));

calculate();

});
