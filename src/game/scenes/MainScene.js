import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import MainTimer from "@/game/scenes/MainTimer";

class MainScene extends Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    Player.preload(this);
  }

  create() {
    this.createPlayer();
    const map = this.make.tilemap({ key: "board" });
    const tileset = map.addTilesetImage(
      "Interior-Hospital-A",
      "tiles",
      16,
      16,
      0,
      0
    );

    const wallsLayer = map.createLayer("WallsLayer", tileset);

    wallsLayer.setCollisionByProperty({ collides: true });
    //count down timer
    const timerLabel = this.add.text(700, 35, "60", { fontSize: 30 });
    this.mainTimer = new MainTimer(this, timerLabel);
    this.mainTimer.start(this.handleCountdownFinished.bind(this));

    // collider debuger
    // const debugGraphics = this.add.graphics().setAlpha(0.7);

    // wallsLayer.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
  } //end of create

  handleCountdownFinished() {
    this.player.active = false;

    const { width, height } = this.scale;
    this.add
      .text(width * 0.5, height * 0.5, "You've been captured", {
        fontSize: 30,
      })
      .setOrigin(0.5);
  }

  update() {
    this.player.update();
    this.mainTimer.update();
  }

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 250, 250, "player1")
    );
  }
}

export default MainScene;
