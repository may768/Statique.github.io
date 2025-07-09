document.getElementById("setForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const parseSet = (str) => new Set(str.split(",").map(s => s.trim()).filter(Boolean));

  const U = parseSet(document.getElementById("universalSet").value);
  const A = parseSet(document.getElementById("setA").value);
  const B = parseSet(document.getElementById("setB").value);
  const C = parseSet(document.getElementById("setC").value);

  const resultsDiv = document.getElementById("results");
  const vennDiv = document.getElementById("vennDiagram");

  // --- Utility Functions ---
  const union = (s1, s2) => new Set([...s1, ...s2]);
  const intersection = (s1, s2) => new Set([...s1].filter(x => s2.has(x)));
  const difference = (s1, s2) => new Set([...s1].filter(x => !s2.has(x)));
  const symmetricDiff = (s1, s2) => difference(union(s1, s2), intersection(s1, s2));
  const complement = (univ, s) => difference(univ, s);
  const display = (s) => `{ ${[...s].sort().join(", ")} }`;

  // --- Computations ---
  const results = [];

  results.push(`<strong>A ∪ B:</strong> ${display(union(A, B))}`);
  results.push(`<strong>A ∩ B:</strong> ${display(intersection(A, B))}`);
  results.push(`<strong>A - B:</strong> ${display(difference(A, B))}`);
  results.push(`<strong>B - A:</strong> ${display(difference(B, A))}`);
  results.push(`<strong>A Δ B (Symmetric Diff):</strong> ${display(symmetricDiff(A, B))}`);
  results.push(`<strong>A′ (Complement of A):</strong> ${display(complement(U, A))}`);
  results.push(`<strong>B′ (Complement of B):</strong> ${display(complement(U, B))}`);

  if (C.size > 0) {
    results.push(`<strong>A ∩ B ∩ C:</strong> ${display(intersection(intersection(A, B), C))}`);
    results.push(`<strong>A ∪ B ∪ C:</strong> ${display(union(union(A, B), C))}`);
    results.push(`<strong>C′ (Complement of C):</strong> ${display(complement(U, C))}`);
  }

  resultsDiv.innerHTML = results.map(r => `<p>${r}</p>`).join("");

  // --- Draw Circular Venn Diagram using venn.js ---
  vennDiv.innerHTML = ""; // Clear previous diagram

  let vennSets;

  if (C.size === 0) {
    const onlyA = difference(A, B);
    const onlyB = difference(B, A);
    const both = intersection(A, B);

    vennSets = [
      { sets: ['A'], size: onlyA.size + both.size },
      { sets: ['B'], size: onlyB.size + both.size },
      { sets: ['A', 'B'], size: both.size }
    ];
  } else {
    const ab = intersection(A, B);
    const bc = intersection(B, C);
    const ac = intersection(A, C);
    const abc = intersection(ab, C);

    vennSets = [
      { sets: ['A'], size: A.size },
      { sets: ['B'], size: B.size },
      { sets: ['C'], size: C.size },
      { sets: ['A', 'B'], size: ab.size },
      { sets: ['A', 'C'], size: ac.size },
      { sets: ['B', 'C'], size: bc.size },
      { sets: ['A', 'B', 'C'], size: abc.size }
    ];
  }

  // Draw diagram
  const chart = venn.VennDiagram().width(500).height(400);
  const diagram = d3.select("#vennDiagram").datum(vennSets).call(chart);

  // Add size labels inside each region
  diagram.selectAll("g")
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .text(function (d) {
      return d.size;
    })
    .attr("x", function (d) {
      return d.center ? d.center.x : 0;
    })
    .attr("y", function (d) {
      return d.center ? d.center.y : 0;
    })
    .style("fill", "#000")
    .style("font-size", "14px")
    .style("pointer-events", "none");
});
