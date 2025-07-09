document.getElementById("poissonForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const lambda = parseFloat(document.getElementById("lambda").value);
  const xVal = parseInt(document.getElementById("xValue").value);
  const resultBox = document.getElementById("result");
  const plotBox = document.getElementById("plot");

  if (isNaN(lambda) || isNaN(xVal) || lambda <= 0 || xVal < 0) {
    resultBox.innerHTML = `<span style="color:red;"><strong>Error:</strong> Please enter valid values. λ must be > 0 and x ≥ 0.</span>`;
    plotBox.innerHTML = "";
    return;
  }

  // Factorial function
  const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);

  // PMF: P(X = x)
  const poissonPMF = (λ, x) => (Math.pow(λ, x) * Math.exp(-λ)) / factorial(x);

  // CDF: P(X ≤ x)
  const poissonCDF = (λ, x) => {
    let sum = 0;
    for (let k = 0; k <= x; k++) {
      sum += poissonPMF(λ, k);
    }
    return sum;
  };

  const pmf = poissonPMF(lambda, xVal);
  const cdf = poissonCDF(lambda, xVal);

  // 📘 Step-by-step solution
  const solutionHTML = `
    <strong>📘 Poisson Distribution Calculation</strong><br><br>

    <strong>Step 1: Given</strong><br>
    Mean (λ) = ${lambda}<br>
    x = ${xVal}<br><br>

    <strong>Step 2: Use the Poisson PMF Formula</strong><br>
    P(X = x) = (λ^x · e^(−λ)) / x!<br><br>

    <strong>Step 3: Plug in values</strong><br>
    P(X = ${xVal}) = (${lambda}<sup>${xVal}</sup> · e<sup>−${lambda}</sup>) / ${xVal}!<br>
    = (${Math.pow(lambda, xVal).toFixed(4)} · ${Math.exp(-lambda).toFixed(6)}) / ${factorial(xVal)}<br>
    = <strong>${pmf.toFixed(6)}</strong><br><br>

    <strong>Step 4: Poisson CDF (Cumulative Probability)</strong><br>
    P(X ≤ ${xVal}) = Σ P(X = k), for k = 0 to ${xVal}<br>
    Calculating each term:<br>
    ${Array.from({ length: xVal + 1 }, (_, k) => 
      `P(X = ${k}) = (${lambda}<sup>${k}</sup> · e<sup>−${lambda}</sup>) / ${k}! = ${(poissonPMF(lambda, k)).toFixed(6)}`
    ).join("<br>")}<br><br>

    Total cumulative probability: <strong>P(X ≤ ${xVal}) = ${cdf.toFixed(6)}</strong>
  `;

  resultBox.innerHTML = solutionHTML;

  // 📊 Plot the distribution
  const maxX = Math.max(xVal + 10, Math.ceil(lambda * 2));
  const xValues = Array.from({ length: maxX + 1 }, (_, i) => i);
  const yValues = xValues.map(x => poissonPMF(lambda, x));

  const trace = {
    x: xValues,
    y: yValues,
    type: "bar",
    marker: {
      color: xValues.map(x => x === xVal ? "#e63946" : "#0057b7")
    },
    name: "P(X = x)"
  };

  const layout = {
    title: `Poisson Distribution (λ = ${lambda})`,
    xaxis: { title: "x" },
    yaxis: { title: "P(X = x)" },
    bargap: 0.05
  };

  Plotly.newPlot("plot", [trace], layout);
});
