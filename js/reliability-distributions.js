// js/reliability-distributions.js

document.addEventListener("DOMContentLoaded", () => {
  const distSelect = document.getElementById("distribution");
  const paramDiv = document.getElementById("parameters");
  const form = document.getElementById("reliabilityForm");
  const result = document.getElementById("result");
  const plot = document.getElementById("plot");

  const updateParamFields = () => {
    const dist = distSelect.value;
    let html = "";
    if (dist === "exponential") {
      html = `<label for="lambda">λ (rate parameter):</label>
              <input type="number" id="lambda" step="any" required placeholder="e.g., 0.2" />`;
    } else if (dist === "gamma") {
      html = `<label for="alpha">α (shape):</label>
              <input type="number" id="alpha" step="any" required placeholder="e.g., 2" />
              <label for="beta">β (rate):</label>
              <input type="number" id="beta" step="any" required placeholder="e.g., 0.5" />`;
    } else if (dist === "weibull") {
      html = `<label for="shape">k (shape):</label>
              <input type="number" id="shape" step="any" required placeholder="e.g., 1.5" />
              <label for="scale">λ (scale):</label>
              <input type="number" id="scale" step="any" required placeholder="e.g., 3" />`;
    }
    paramDiv.innerHTML = html;
  };

  distSelect.addEventListener("change", updateParamFields);
  updateParamFields();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const dist = distSelect.value;
    const x = parseFloat(document.getElementById("xValue").value);
    if (isNaN(x) || x < 0) {
      result.innerHTML = `<p style="color:red;">Please enter a valid x ≥ 0.</p>`;
      return;
    }

    let pdf = 0, cdf = 0, explanation = "";
    const points = [], labels = [];

    if (dist === "exponential") {
      const lambda = parseFloat(document.getElementById("lambda").value);
      pdf = lambda * Math.exp(-lambda * x);
      cdf = 1 - Math.exp(-lambda * x);
      explanation = `PDF = λe<sup>-λx</sup> = ${lambda}e<sup>-${lambda}×${x}</sup> = ${pdf.toFixed(6)}<br>
                     CDF = 1 - e<sup>-λx</sup> = ${cdf.toFixed(6)}`;

      for (let t = 0; t <= x * 2; t += 0.1) {
        points.push(lambda * Math.exp(-lambda * t));
        labels.push(t);
      }
    }
    else if (dist === "gamma") {
      const alpha = parseFloat(document.getElementById("alpha").value);
      const beta = parseFloat(document.getElementById("beta").value);
      const gamma = (n) => (n <= 1 ? 1 : (n - 1) * gamma(n - 1));

      pdf = Math.pow(beta, alpha) * Math.pow(x, alpha - 1) * Math.exp(-beta * x) / gamma(alpha);
      explanation = `PDF = (β<sup>α</sup> x<sup>α-1</sup> e<sup>-βx</sup>) / Γ(α) = ${pdf.toFixed(6)}<br>
                     CDF not implemented.`;
      for (let t = 0; t <= x * 2; t += 0.1) {
        points.push(Math.pow(beta, alpha) * Math.pow(t, alpha - 1) * Math.exp(-beta * t) / gamma(alpha));
        labels.push(t);
      }
    }
    else if (dist === "weibull") {
      const k = parseFloat(document.getElementById("shape").value);
      const lambda = parseFloat(document.getElementById("scale").value);

      pdf = (k / lambda) * Math.pow(x / lambda, k - 1) * Math.exp(-Math.pow(x / lambda, k));
      cdf = 1 - Math.exp(-Math.pow(x / lambda, k));

      explanation = `PDF = (k/λ)(x/λ)<sup>k-1</sup>e<sup>-(x/λ)<sup>k</sup></sup> = ${pdf.toFixed(6)}<br>
                     CDF = 1 - e<sup>-(x/λ)<sup>k</sup></sup> = ${cdf.toFixed(6)}`;

      for (let t = 0.1; t <= x * 2; t += 0.1) {
        points.push((k / lambda) * Math.pow(t / lambda, k - 1) * Math.exp(-Math.pow(t / lambda, k)));
        labels.push(t);
      }
    }

    result.innerHTML = `<h3>📘 Results</h3>
      <p><strong>PDF at x = ${x}:</strong> ${pdf.toFixed(6)}</p>
      <p><strong>CDF at x = ${x}:</strong> ${cdf.toFixed(6)}</p>
      <p><strong>📝 Explanation:</strong><br>${explanation}</p>`;

    Plotly.newPlot(plot, [{
      x: labels,
      y: points,
      type: "scatter",
      mode: "lines",
      line: { color: "#0057b7" },
      name: "PDF"
    }], {
      title: `${dist.charAt(0).toUpperCase() + dist.slice(1)} PDF`,
      xaxis: { title: "x" },
      yaxis: { title: "Density" }
    });
  });
});
