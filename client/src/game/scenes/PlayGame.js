import Phaser, { Scene } from "phaser";
import MainScene from "@/game/scenes/MainScene";
import MainTimerScene from "@/game/scenes/MainTimerScene"

class PlayGame extends Scene {
  constructor(){
    super({key: "GameScene"})
  }

  create(){
    this.scene.launch("MainTimerScene");
    this.scene.launch("MainScene");
}
}
