const codes = {
      normal: `int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(3, 4);
    return result;
}`,
      factorial: `int fact(int n) {
    if (n == 0) return 1;
    return n * fact(n - 1);
}

int main() {
    int result = fact(5);
    return result;
}`,
      fibonacci: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}

int main() {
    int result = fib(5);
    return result;
}`,
      gcd: `int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}

int main() {
    int result = gcd(28, 12);
    return result;
}`,
      sumArray: `int sumArray(int arr[], int n) {
    int sum = 0;
    for(int i=0; i<n; i++) sum += arr[i];
    return sum;
}

int main() {
    int arr[5] = {1,2,3,4,5};
    int result = sumArray(arr, 5);
    return result;
}`
    };

    let container = document.getElementById('graph');
    let nodes = new vis.DataSet([]);
    let edges = new vis.DataSet([]);
    let network;
    let steps = [];
    let stepIndex = 0;
    let previousLine = null;

    const options = {
      layout: {
        hierarchical: {
          direction: "UD",
          sortMethod: "directed",
          nodeSpacing: 150,
          levelSeparation: 120
        }
      },
      physics: false,
      edges: {
        arrows: 'to',
        font: { size: 14, color: "#fff", background: "#007bff", strokeWidth: 0, align: "middle" },
        smooth: true
      },
      nodes: {
        shape: 'box',
        margin: 10,
        color: { background: '#222', border: '#007bff', highlight: { background: '#333', border: '#00f' } },
        font: { color: "#fff" }
      }
    };

    function initGraph() {
      nodes.clear();
      edges.clear();
      network = new vis.Network(container, {nodes, edges}, options);
      document.getElementById("outputArea").textContent = "";
    }

    function highlightLine(lineNumber) {
      const code = document.getElementById("codeArea").textContent.split("\n");
      const highlightedCode = code.map((line, index) => {
        if (index === lineNumber) return `<span class="highlight-line">${line}</span>`;
        return line;
      }).join("\n");
      document.getElementById("codeArea").innerHTML = highlightedCode;
      Prism.highlightAll();
    }

    function loadFunction() {
      let func = document.getElementById("functionSelect").value;
      document.getElementById("codeArea").textContent = codes[func];
      Prism.highlightAll();
      initGraph();
      stepIndex = 0;

      if (func === "normal") {
        steps = [
          () => { nodes.add({id: 1, label: "main()"}); highlightLine(4); },
          () => { nodes.add({id: 2, label: "add(3,4)"}); highlightLine(0); },
          () => { edges.add({from: 1, to: 2, label: "call"}); highlightLine(5); },
          () => { edges.update({id: 3, from: 2, to: 1, label: "7"}) || edges.add({id:3, from: 2, to:1, label: "7"}); highlightLine(1); },
          () => { document.getElementById("outputArea").textContent = "Result: 7"; highlightLine(6); }
        ];
      } else if (func === "factorial") {
        steps = [
          () => { nodes.add({id: 1, label: "main()"}); highlightLine(6); },
          () => { nodes.add({id: 2, label: "fact(5)"}); highlightLine(0); },
          () => { edges.add({from: 1, to: 2, label: "call"}); highlightLine(7); },
          () => { nodes.add({id: 3, label: "fact(4)"}); highlightLine(0); },
          () => { edges.add({from: 2, to: 3, label: "call"}); highlightLine(2); },
          () => { nodes.add({id: 4, label: "fact(3)"}); highlightLine(0); },
          () => { edges.add({from: 3, to: 4, label: "call"}); highlightLine(2); },
          () => { nodes.add({id: 5, label: "fact(2)"}); highlightLine(0); },
          () => { edges.add({from: 4, to: 5, label: "call"}); highlightLine(2); },
          () => { nodes.add({id: 6, label: "fact(1)"}); highlightLine(0); },
          () => { edges.add({from: 5, to: 6, label: "call"}); highlightLine(2); },
          () => { nodes.add({id: 7, label: "fact(0)"}); highlightLine(0); },
          () => { edges.add({from: 6, to: 7, label: "call"}); highlightLine(1); },
          () => { edges.add({from: 7, to: 6, label: "1"}); highlightLine(1); },
          () => { edges.add({from: 6, to: 5, label: "1"}); highlightLine(1); },
          () => { edges.add({from: 5, to: 4, label: "2"}); highlightLine(1); },
          () => { edges.add({from: 4, to: 3, label: "6"}); highlightLine(1); },
          () => { edges.add({from: 3, to: 2, label: "24"}); highlightLine(1); },
          () => { edges.add({from: 2, to: 1, label: "120"}); highlightLine(1); },
          () => { document.getElementById("outputArea").textContent = "Result: 120"; highlightLine(7); }
        ];
      } else if (func === "fibonacci") {
        steps = [
          () => { nodes.add({id: 1, label: "main()"}); highlightLine(6); },
          () => { nodes.add({id: 2, label: "fib(5)"}); highlightLine(0); },
          () => { edges.add({from: 1, to: 2, label: "call"}); highlightLine(10); },
          () => { nodes.add({id: 3, label: "fib(4)"}); highlightLine(0); },
          () => { edges.add({from: 2, to: 3, label: "call"}); highlightLine(2); },
          () => { nodes.add({id: 4, label: "fib(3)"}); highlightLine(0); },
          () => { edges.add({from: 3, to: 4, label: "call"}); highlightLine(2); },
          () => { nodes.add({id: 5, label: "fib(2)"}); highlightLine(0); },
          () => { edges.add({from: 4, to: 5, label: "call"}); highlightLine(2); },
          () => { nodes.add({id: 6, label: "fib(1)"}); highlightLine(1); },
          () => { edges.add({from: 5, to: 6, label: "call"}); highlightLine(1); },
          () => { edges.add({from: 6, to: 5, label: "1"}); highlightLine(1); },
          () => { nodes.add({id: 7, label: "fib(0)"}); highlightLine(2); },
          () => { edges.add({from: 5, to: 7, label: "call"}); highlightLine(2); },
          () => { edges.add({from: 7, to: 5, label: "0"}); highlightLine(1); },
          () => { edges.add({from: 5, to: 4, label: "1"}); highlightLine(1); },
          () => { edges.add({from: 4, to: 3, label: "2"}); highlightLine(1); },
          () => { edges.add({from: 3, to: 2, label: "3"}); highlightLine(1); },
          () => { edges.add({from: 2, to: 1, label: "5"}); highlightLine(1); },
          () => { document.getElementById("outputArea").textContent = "Result: 5"; highlightLine(7); }
        ];
      } else if(func === "gcd") {
        steps = [
          () => { nodes.add({id: 1, label: "main()"}); highlightLine(6); },
          () => { nodes.add({id: 2, label: "gcd(28,12)"}); highlightLine(0); },
          () => { edges.add({from: 1, to: 2, label: "call"}); highlightLine(10); },
          () => { nodes.add({id: 3, label: "gcd(12,4)"}); highlightLine(0); },
          () => { edges.add({from: 2, to: 3, label: "call"}); highlightLine(2); },
          () => { nodes.add({id: 4, label: "gcd(4,0)"}); highlightLine(0); },
          () => { edges.add({from: 3, to: 4, label: "call"}); highlightLine(2); },
          () => { edges.add({from: 4, to: 3, label: "4"}); highlightLine(1); },
          () => { edges.add({from: 3, to: 2, label: "4"}); highlightLine(1); },
          () => { edges.add({from: 2, to: 1, label: "4"}); highlightLine(1); },
          () => { document.getElementById("outputArea").textContent = "GCD: 4"; highlightLine(7); }
        ];
    } 
}

    function nextStep() {
      if (stepIndex < steps.length) {
        steps[stepIndex]();
        stepIndex++;
      }
    }

    loadFunction();
