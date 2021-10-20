
// //load image files

let images = [
  " ",
  "dieRed1.png",
  "dieRed2.png",
  "dieRed3.png",
  "dieRed4.png",
  "dieRed5.png",
  "dieRed6.png",
  "dieRed7.png",
  "dieRed8.png",
];
// select all elements that have img
let dice = document.querySelectorAll("img");

let dieValue;

function rollDie() {
  // add a shake property to so that dice "shakes"
  dice.forEach((die) => {
    die.classList.add("shake");
  });

  // dieValue must be a number from 1 - 8
  dieValue = Math.floor(Math.random() * 8) + 1;

  setTimeout(() => {
    dice.forEach((die) => {
      die.classList.remove("shake");
    });

    document
      .querySelector("#die-1")
      .setAttribute("src", `/dice/${images[dieValue]}`);

    document.querySelector("#diceValue").setAttribute("value", `${dieValue}`);
  }, 1000);

  return dieValue;
}

document
  .getElementById("investigate-btn")
  .addEventListener("click", rollDie, true);

export default rollDie;

