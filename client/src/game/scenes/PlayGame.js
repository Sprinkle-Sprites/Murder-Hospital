import Phaser, { Scene } from "phaser";
import MainScene from "@/game/scenes/MainScene";
import MainTimer from "@/game/scenes/MainTimer"

class PlayGame extends Scene {
  constructor(){
    super({key: "GameScene"})
  }

  create(){
    this.scene.launch("MainScene");
    this.scene.launch("MainTimer");
}
}
