document.getElementById("combinatoricsForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const n = parseInt(document.getElementById("n").value);
  const r = parseInt(document.getElementById("r").value);
  const op = document.getElementById("operation").value;

  const resultBox = document.getElementById("result");
  const solutionBox = document.getElementById("solution");

  if (isNaN(n) || n < 0 || isNaN(r) || r < 0 || r > n) {
    resultBox.innerHTML = `<span style="color:red;"><strong>Error:</strong> Enter valid integers (r ≤ n and n ≥ 0).</span>`;
    solutionBox.innerHTML = '';
    return;
  }

  const fact = (x) => {
    if (x === 0 || x === 1) return 1;
    let res = 1;
    for (let i = 2; i <= x; i++) res *= i;
    return res;
  };

  let result = 0, solution = "";

  if (op === "nCr") {
    result = fact(n) / (fact(r) * fact(n - r));
    solution = `
      <strong>Combination Formula:</strong><br>
      nCr = n! / [r! × (n - r)!]<br><br>
      Substituting:<br>
      ${n}C${r} = ${n}! / (${r}! × (${n - r})!)<br>
      = ${fact(n)} / (${fact(r)} × ${fact(n - r)})<br><br>
      Final Answer: <strong>${result}</strong>
    `;
  } else if (op === "nPr") {
    result = fact(n) / fact(n - r);
    solution = `
      <strong>Permutation Formula:</strong><br>
      nPr = n! / (n - r)!<br><br>
      Substituting:<br>
      ${n}P${r} = ${n}! / (${n - r})!<br>
      = ${fact(n)} / ${fact(n - r)}<br><br>
      Final Answer: <strong>${result}</strong>
    `;
  } else if (op === "factorial") {
    result = fact(n);
    solution = `
      <strong>Factorial:</strong><br>
      ${n}! = ${result}
    `;
  }

  resultBox.innerHTML = `<strong>Result:</strong> ${result}`;
  solutionBox.innerHTML = solution;
});
