import Phaser, { Scene } from "phaser";
import config from "../game";

export default class LosingScene extends Scene {
  constructor() {
    super("Losing");
  }

  create() {
    this.createBackground();
    this.createStory();
  }

  createBackground(){
    this.add.image(200, 200, "hospital2").setScale(0.9)
  }

  createStory(){

  }

}
