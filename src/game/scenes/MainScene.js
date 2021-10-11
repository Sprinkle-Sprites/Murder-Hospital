import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";

class MainScene extends Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    Player.preload(this);
  }

  create() {
    this.createMap();
    this.createPlayer();
  }

  update() {
    this.player.update();
  }

  resizeCollider(obj, num) {
    obj.body.setSize(obj.width - num, obj.height - num, true);
  }

  createMap() {
    const map = this.make.tilemap({ key: "board" });
    const tileset = map.addTilesetImage(
      "Interior-Hospital-A",
      "tiles",
      16,
      16,
      0,
      0
    );

    //LAYERS
    const wallsLayer = map.createLayer("WallsLayer", tileset);

    //LAYER COLLIDERS
    wallsLayer.setCollisionByProperty({ collides: true });

    //COLLIDER DEBUG COLOR
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
  }

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 250, 250, "player1")
    );

    //ADJUSTS COLLIDER TO SURROUND PLAYER
    this.time.addEvent({
      delay: 100,
      callback: () => this.resizeCollider(this.player, 20),
      callbackScope: this,
      loop: false,
    });
  }
}

export default MainScene;
