import Phaser, { Scene } from "phaser";
import config from "../game";

export default class VictoryScene extends Scene {
  constructor() {
    super("Victory");
  }

  create() {
    this.createBackground();
    this.createStory();
  }

  createBackground(){
    this.add.image(0, 0, "victory").setOrigin(0,0)
  }

  createStory() {
    this.add.text(100, 25, "At last...", {
      fontFamily: "GypsyCurse",
      fontSize: 125,
      color: "white",
    }).setShadow(5, 5, 'black', 5, false, true);
    this.add.text(100, 213, "...you stumble out of the hospital. The storm has cleared, and dawn approaches.", {
      fontSize: 20,
      wordWrap: {width: 900, useAdvancedWrap: true},
    }).setShadow(3, 3, 'black', 7, false, true)

    this.add.text(100, 345, "YOU !*$%ING DID IT!", {
      fontSize: 50,
      wordWrap: {width: 900, useAdvancedWrap: true},
      color: "white",
    }).setShadow(3, 3, 'black', 7, false, true)

    this.add.text(100, 465, "But now is not the time for celebration. Now is the time to flee before the Doctor returns! Go! Quickly!", {
      fontSize: 20,
      wordWrap: {width: 900, useAdvancedWrap: true},
    }).setShadow(3, 3, 'black', 7, false, true)
  }

}
