function factorial(k) {
  return k <= 1 ? 1 : k * factorial(k - 1);
}

function binomialCoeff(n, k) {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

function binomialPMF(n, p, x) {
  return binomialCoeff(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
}

function binomialCDF(n, p, x) {
  let sum = 0;
  for (let k = 0; k <= x; k++) {
    sum += binomialPMF(n, p, k);
  }
  return sum;
}

document.getElementById("binomialForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const n = parseInt(document.getElementById("n").value);
  const p = parseFloat(document.getElementById("p").value);
  const x = parseInt(document.getElementById("x").value);

  const resultBox = document.getElementById("result");
  const explanationBox = document.getElementById("explanation");
  const chartDiv = document.getElementById("chart");

  // Input validation
  if (isNaN(n) || isNaN(p) || isNaN(x) || n <= 0 || p < 0 || p > 1 || x < 0 || x > n) {
    resultBox.innerHTML = "<p style='color:red'>❌ Please enter valid inputs. Ensure 0 ≤ p ≤ 1 and 0 ≤ x ≤ n.</p>";
    explanationBox.innerHTML = "";
    chartDiv.innerHTML = "";
    return;
  }

  // Calculation
  const pmf = binomialPMF(n, p, x);
  const cdf = binomialCDF(n, p, x);

  resultBox.innerHTML = `
    <h3>Results:</h3>
    <p><strong>P(X = ${x}) =</strong> ${pmf.toFixed(6)}</p>
    <p><strong>P(X ≤ ${x}) =</strong> ${cdf.toFixed(6)}</p>
  `;

  explanationBox.innerHTML = `
    <h3>Step-by-Step Explanation:</h3>
    <p><strong>PMF Formula:</strong> P(X = x) = C(n, x) × p^x × (1 - p)^(n - x)</p>
    <p>→ C(${n}, ${x}) = ${binomialCoeff(n, x)}</p>
    <p>→ p^${x} = ${Math.pow(p, x).toFixed(6)}</p>
    <p>→ (1 - p)^${n - x} = ${Math.pow(1 - p, n - x).toFixed(6)}</p>
    <p><strong>Therefore, P(X = ${x}) =</strong> ${pmf.toFixed(6)}</p>
  `;

  // Plot PMF Bar Chart
  const x_vals = [...Array(n + 1).keys()];
  const y_vals = x_vals.map(k => binomialPMF(n, p, k));

  Plotly.newPlot(chartDiv, [{
    x: x_vals,
    y: y_vals,
    type: "bar",
    marker: { color: x_vals.map(k => k === x ? "#0077cc" : "#aac") }
  }], {
    title: `Binomial Distribution (n = ${n}, p = ${p})`,
    xaxis: { title: "Number of Successes (x)" },
    yaxis: { title: "P(X = x)" }
  });
});
