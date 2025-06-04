const checkbox = document.getElementById("toggle-degree");
const dot = document.getElementById("dot");

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    dot.style.transform = "translateX(30px)";
  } else {
    dot.style.transform = "translateX(0)";
  }
});

if (checkbox.checked) {
  dot.style.transform = "translateX(30px)";
}
