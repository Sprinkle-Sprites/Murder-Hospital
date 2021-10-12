// import { createApp } from "vue";
// import App from "./App.vue";

// createApp(App).mount("#app");

/** @type {import("../typings/phaser")} */

//Bring in all the scenes

import "phaser";
import config from "./config/game";
import MainScene from "./scenes/MainScene";
import Preloader from "./scenes/Preloader";
import Radiology from "./scenes/Radiology";

class Game extends Phaser.Game {
  constructor() {
    //Add the config file to the game
    super(config);
    //Add all the scenes
    this.scene.add("Preloader", Preloader);
    this.scene.add("MainScene", MainScene);
    this.scene.add("Radiology", Radiology);
    //Start the game with the preloader
    this.scene.start("Preloader");
  }
}

//Create new instance of game
window.onload = function () {
  window.game = new Game();
};
