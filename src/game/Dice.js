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

let dice = document.querySelectorAll("img");

function rollDie() {
  //   return Math.ceil(Math.random() * 8);
  dice.forEach(function(die) {
    die.classList.add("shake");
  });
  setTimeout(function() {
    dice.forEach(function(die) {
      die.classList.remove("shake");
    });
    let dieOneValue = Math.floor(Math.random() * 8);

    console.log(dieOneValue);
    document
      .querySelector("#die-1")
      .setAttribute("src", `/dice/${images[dieOneValue]}`);
  }, 1000);
}

rollDie();

export default rollDie;
