document.getElementById("bayesForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const pA = parseFloat(document.getElementById("pA").value);
  const pBgivenA = parseFloat(document.getElementById("pBgivenA").value);
  const pB = parseFloat(document.getElementById("pB").value);

  const resultBox = document.getElementById("result");
  const solutionBox = document.getElementById("solution");

  // ✅ Validation
  if (
    isNaN(pA) || isNaN(pBgivenA) || isNaN(pB) ||
    pA < 0 || pA > 1 ||
    pBgivenA < 0 || pBgivenA > 1 ||
    pB <= 0 || pB > 1
  ) {
    resultBox.innerHTML = `<span style="color:red;"><strong>Error:</strong> Please enter valid values between 0 and 1.</span>`;
    solutionBox.innerHTML = '';
    return;
  }

  const pAgivenB = (pA * pBgivenA) / pB;

  // ✅ Result
  resultBox.innerHTML = `
    <strong>Posterior Probability:</strong><br>
    P(A | B) = ${pAgivenB.toFixed(4)}
  `;

  // ✅ Step-by-step Explanation
  solutionBox.innerHTML = `
    <strong>Step-by-Step:</strong><br><br>
    Given:<br>
    - Prior: P(A) = ${pA}<br>
    - Likelihood: P(B | A) = ${pBgivenA}<br>
    - Marginal: P(B) = ${pB}<br><br>

    Bayes' Theorem formula:<br>
    <strong>P(A | B) = [P(A) × P(B | A)] / P(B)</strong><br><br>

    Substituting values:<br>
    P(A | B) = (${pA} × ${pBgivenA}) / ${pB} = ${pAgivenB.toFixed(4)}<br><br>

    Hence, the posterior probability of A given B is <strong>${pAgivenB.toFixed(4)}</strong>.
  `;
});
