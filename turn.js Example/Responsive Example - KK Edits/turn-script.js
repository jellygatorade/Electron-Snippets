var flipbookElement = document.getElementById("flipbook-element");

window.addEventListener("resize", function (e) {
  flipbookElement.style.width = "";
  flipbookElement.style.height = "";
  $(flipbookElement).turn(
    "size",
    flipbookElement.clientWidth,
    flipbookElement.clientHeight
    // flipbookElement.clientWidth / 2,
    // flipbookElement.clientHeight / 2
  );
});

$(flipbookElement).turn({
  acceleration: true,
  autoCenter: true,
});
