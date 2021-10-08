import { Scene } from "phaser";
import Player from "@/game/Player";

class MainScene extends Scene {
  constructor() {
    // super({ key: "MainScene" });
    super();
  }

  preload() {
    Player.preload(this);
  }

  create() {
    this.createPlayer();
  }

  update() {
    this.player.update();
  }

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 250, 250, "player1")
    );
  }
}

export default MainScene;
