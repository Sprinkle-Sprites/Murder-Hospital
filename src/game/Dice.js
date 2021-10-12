// load dice images
let images = [
  "dieRed1.png",
  "dieRed2.png",
  "dieRed3.png",
  "dieRed4.png",
  "dieRed5.png",
  "dieRed6.png",
  "dieRed7.png",
  "dieRed8.png",
];

//return list of elements that include "img"
let dice = document.querySelectorAll("img");

function rollDie() {
  //give dice shake property to simulate shaking die
  dice.forEach((die) => {
    die.classList.add("shake");
  });

  // have dice change after a second
  setTimeout(() => {
    dice.forEach(function(die) {
      die.classList.remove("shake");
    });
    let dieValue = Math.floor(Math.random() * 8);

    //console.log(dieValue); //use die value to connect to room

    document
      .querySelector("#die-1")
      .setAttribute("src", `/dice/${images[dieValue]}`);
  }, 1000);
}
document
  .getElementById("investigate-btn")
  .addEventListener("click", rollDie, true);

export default rollDie;
