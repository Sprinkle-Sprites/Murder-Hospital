function exitButton() {
  document.querySelector("#leave-button").setAttribute("value", "leave")
}

document
  .getElementById("try-to-leave")
  .addEventListener("click", exitButton, true);

  export default exitButton
