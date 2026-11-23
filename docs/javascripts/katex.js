(function () {
  function render() {
    if (typeof renderMathInElement === "undefined") { setTimeout(render, 100); return; }
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });
  }
  if (typeof document$ !== "undefined") { document$.subscribe(render); }
  else { document.addEventListener("DOMContentLoaded", render); }
})();
