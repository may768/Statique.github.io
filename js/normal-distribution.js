document.getElementById("normalForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const μ = parseFloat(document.getElementById("mean").value);
  const σ = parseFloat(document.getElementById("stddev").value);
  const z1 = parseFloat(document.getElementById("z1").value);
  const z2raw = document.getElementById("z2").value.trim();
  const z2 = z2raw === "" ? null : parseFloat(z2raw);
  const tailType = document.getElementById("tailType").value;

  const outputDiv = document.getElementById("output");
  const plotDiv = document.getElementById("plot");

  if (isNaN(μ) || isNaN(σ) || isNaN(z1) || σ <= 0 || (z2raw !== "" && isNaN(z2))) {
    outputDiv.innerHTML = `<p style="color:red;">⚠️ Please enter valid numeric values. σ must be positive.</p>`;
    return;
  }

  // Convert X to Z if μ ≠ 0 or σ ≠ 1
  const standardize = x => (x - μ) / σ;

  const zLow = z2 !== null ? Math.min(z1, z2) : z1;
  const zHigh = z2 !== null ? Math.max(z1, z2) : z1;

  const cdf = z => 0.5 * (1 + erf(z / Math.sqrt(2)));

  let prob = 0, desc = "";
  if (tailType === "left") {
    prob = cdf(standardize(z1));
    desc = `P(X < ${z1})`;
  } else if (tailType === "right") {
    prob = 1 - cdf(standardize(z1));
    desc = `P(X > ${z1})`;
  } else if (tailType === "two" && z2 !== null) {
    prob = cdf(standardize(zHigh)) - cdf(standardize(zLow));
    desc = `P(${zLow} < X < ${zHigh})`;
  } else {
    outputDiv.innerHTML = `<p style="color:red;">⚠️ Two Z values are required for two-tailed probability.</p>`;
    return;
  }

  outputDiv.innerHTML = `
    <p><strong>${desc}</strong></p>
    <p>μ = ${μ}, σ = ${σ}</p>
    <p><strong>Probability:</strong> ${prob.toFixed(5)}</p>
  `;

  // Plot Normal Distribution with shaded area
  const x = [], y = [], shadedX = [], shadedY = [];
  for (let i = μ - 4 * σ; i <= μ + 4 * σ; i += 0.1) {
    const z = (i - μ) / σ;
    const pdf = (1 / (σ * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
    x.push(i);
    y.push(pdf);

    const inRange =
      (tailType === "left" && i <= z1) ||
      (tailType === "right" && i >= z1) ||
      (tailType === "two" && z2 !== null && i >= zLow && i <= zHigh);

    if (inRange) {
      shadedX.push(i);
      shadedY.push(pdf);
    }
  }

  const traceMain = {
    x, y,
    type: 'scatter',
    mode: 'lines',
    name: 'Normal Curve',
    line: { color: '#003366' }
  };

  const traceShade = {
    x: shadedX.concat([...shadedX].reverse()),
    y: shadedY.concat(Array(shadedY.length).fill(0)),
    fill: 'toself',
    type: 'scatter',
    mode: 'none',
    fillcolor: 'rgba(0,123,255,0.4)',
    name: 'Shaded Area'
  };

  const layout = {
    title: "Normal Distribution Curve",
    xaxis: { title: "X", zeroline: false },
    yaxis: { title: "Density", zeroline: false },
    showlegend: true
  };

  Plotly.newPlot(plotDiv, [traceMain, traceShade], layout);
});

// --- Error Function Approximation ---
function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592,
        a2 = -0.284496736,
        a3 = 1.421413741,
        a4 = -1.453152027,
        a5 = 1.061405429,
        p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
  return sign * y;
}
