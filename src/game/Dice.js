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

let roomNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

let rooms = roomNumbers.length;
// select all elements that have img
let dice = document.querySelectorAll("img");

let dieIdx;
let dieValue;

function rollDie() {
  // add a shake property to so that dice "shakes"
  dice.forEach((die) => {
    die.classList.add("shake");
  });

  // dieValue must be a number from 1 - 8
  dieIdx = Math.floor(Math.random() * rooms) + 1;

  dieValue = roomNumbers[dieIdx];

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
