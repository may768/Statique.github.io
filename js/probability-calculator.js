document.getElementById("probForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const pA = parseFloat(document.getElementById("pA").value);
  const pB = parseFloat(document.getElementById("pB").value);
  const pABInput = document.getElementById("pAB").value;
  const eventType = document.getElementById("eventType").value;

  const resultBox = document.getElementById("result");
  const solutionBox = document.getElementById("solution");

  if (
    isNaN(pA) || isNaN(pB) ||
    pA < 0 || pA > 1 ||
    pB < 0 || pB > 1
  ) {
    resultBox.innerHTML = `<span style="color:red;"><strong>Error:</strong> Please enter valid probabilities between 0 and 1.</span>`;
    solutionBox.innerHTML = '';
    return;
  }

  let pAB;

  if (pABInput) {
    pAB = parseFloat(pABInput);
    if (isNaN(pAB) || pAB < 0 || pAB > 1) {
      resultBox.innerHTML = `<span style="color:red;"><strong>Error:</strong> P(A ∩ B) must be a number between 0 and 1.</span>`;
      solutionBox.innerHTML = '';
      return;
    }
  } else {
    pAB = eventType === "independent" ? (pA * pB) : null;
  }

  const pUnion = pAB !== null ? (pA + pB - pAB) : null;
  const pA_given_B = pAB !== null ? (pAB / pB) : null;

  resultBox.innerHTML = `
    <strong>Results:</strong><br>
    P(A) = ${pA}<br>
    P(B) = ${pB}<br>
    ${pAB !== null ? `P(A ∩ B) = ${pAB.toFixed(4)}<br>` : ''}
    ${pUnion !== null ? `P(A ∪ B) = ${pUnion.toFixed(4)}<br>` : ''}
    ${pA_given_B !== null ? `P(A | B) = ${pA_given_B.toFixed(4)}<br>` : ''}
  `;

  // Step-by-step Solution
  let explanation = `
    <strong>Step-by-Step Solution:</strong><br><br>
    Given:<br>
    P(A) = ${pA}<br>
    P(B) = ${pB}<br>
  `;

  if (pABInput) {
    explanation += `P(A ∩ B) = ${pAB}<br>`;
  } else if (eventType === "independent") {
    explanation += `Since A and B are independent:<br>
    P(A ∩ B) = P(A) × P(B) = ${pA} × ${pB} = ${pAB.toFixed(4)}<br>`;
  } else {
    explanation += `No P(A ∩ B) provided. Cannot compute union or conditional probability.<br>`;
  }

  if (pUnion !== null) {
    explanation += `<br>P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = ${pA} + ${pB} - ${pAB.toFixed(4)} = ${pUnion.toFixed(4)}<br>`;
  }

  if (pA_given_B !== null) {
    explanation += `<br>P(A | B) = P(A ∩ B) / P(B) = ${pAB.toFixed(4)} / ${pB} = ${pA_given_B.toFixed(4)}<br>`;
  }

  solutionBox.innerHTML = explanation;
});
