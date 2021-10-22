import eventEmitter from "./eventEmitter";

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

//need to keep this array untouched for when the die rolls and all rooms need to be available
let rooms = [1, 2, 3, 4, 5, 6, 7, 8];
let roomsLeng = rooms.length;

let incompRooms = [1, 2, 3, 4, 5, 6, 7, 8];
let inCompRoomsLeng = incompRooms.length;

eventEmitter.on("completed", (roomNum) => {
  let idx = incompRooms.indexOf(roomNum);
  incompRooms.splice(idx, 1);
  inCompRoomsLeng = incompRooms.length;
});

// select all elements that have img
let dice = document.querySelectorAll("img");

let dieIdx;
let dieValue;
let count = 0;

function rollDie() {
  // add a shake property to so that dice "shakes"
  dice.forEach((die) => {
    die.classList.add("shake");
  });

  count++;

  if (count % 4 === 0 || incompRooms.length === 0) {
    dieIdx = Math.floor(Math.random() * roomsLeng);

    dieValue = rooms[dieIdx];
  } else {
    dieIdx = Math.floor(Math.random() * inCompRoomsLeng);

    dieValue = incompRooms[dieIdx];
  }
  // dieValue must be a number from 1 - 8

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
