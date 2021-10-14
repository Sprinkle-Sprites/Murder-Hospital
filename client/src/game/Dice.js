<<<<<<< HEAD
// //load image files
=======
//load image files
>>>>>>> 26e717fc3a5ad0ef02b9ab82fd57d3437a231842

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

<<<<<<< HEAD
let dieValue;

=======
>>>>>>> 26e717fc3a5ad0ef02b9ab82fd57d3437a231842
function rollDie() {
  // add a shake property to so that dice "shakes"
  dice.forEach((die) => {
    die.classList.add("shake");
  });

<<<<<<< HEAD
  // dieValue must be a number from 1 - 8
  dieValue = Math.floor(Math.random() * 8) + 1;

=======
>>>>>>> 26e717fc3a5ad0ef02b9ab82fd57d3437a231842
  setTimeout(() => {
    dice.forEach((die) => {
      die.classList.remove("shake");
    });

<<<<<<< HEAD
    document
      .querySelector("#die-1")
      .setAttribute("src", `/dice/${images[dieValue]}`);

    document.querySelector("#diceValue").setAttribute("value", `${dieValue}`);
  }, 1000);

  return dieValue;
}

=======
    //dieValue must be a number from 1 - 8
    let dieValue = Math.floor(Math.random() * 8) + 1;
    console.log(dieValue); //connect dieValue to room

    document
      .querySelector("#die-1")
      .setAttribute("src", `/dice/${images[dieValue]}`);
  }, 1000);
}
>>>>>>> 26e717fc3a5ad0ef02b9ab82fd57d3437a231842
document
  .getElementById("investigate-btn")
  .addEventListener("click", rollDie, true);

<<<<<<< HEAD
=======
rollDie();

>>>>>>> 26e717fc3a5ad0ef02b9ab82fd57d3437a231842
export default rollDie;
