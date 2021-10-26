function directionsButton() {
  document.querySelector("#directions").setAttribute("value", "readMe");
}

document
  .getElementById("directions-button")
  .addEventListener("click", directionsButton, true);

export default directionsButton;
