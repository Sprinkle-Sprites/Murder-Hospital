import Phaser from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import RoomTimer from "@/game/scenes/RoomTimer";

export default class Morgue extends Phaser.Scene {
  constructor() {
    super({ key: "Morgue" });
  }
  preload() {
    Player.preload(this);
  }

  create() {
    this.createPlayer();
    this.createMap();
  }

  createMap() {
    const map = this.make.tilemap({ key: "morgue" });
    const InteriorA = map.addTilesetImage(
      "Interior-Hospital-A",
      "Interior-A",
      16,
      16,
      0,
      0
    );

    const InteriorB = map.addTilesetImage(
      "Interior-Hospital-B",
      "Interior-B",
      16,
      16,
      0,
      0
    );

    const InteriorC = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );

    const InteriorAlt = map.addTilesetImage(
      "Interior-Hospital-Alt",
      "Interior-Alt",
      16,
      16,
      0,
      0
    );

    const Lab3 = map.addTilesetImage("Laboratory-3", "Lab-3", 16, 16, 0, 0);
    const Elevator = map.addTilesetImage(
      "Elevator-Doors-Alt",
      "Elevator",
      16,
      16,
      0,
      0
    );

    // LAYERS
    const floorLayer = map.createLayer("morgue-floor", InteriorB).setDepth(-1);
    const borderLayer = map
      .createLayer("morgue-border", InteriorA)
      .setDepth(-1);
    const wallLayer = map.createLayer("morgue-walls", InteriorA).setDepth(-1);
    const elevatorLayer = map.createLayer("elevator", Elevator).setDepth(-1);
    const morgueLabLayer = map.createLayer("morgue-lab", Lab3).setDepth(-1);
    const morgueAltLayer = map
      .createLayer("morgue-alt", InteriorAlt)
      .setDepth(-1);
    const morgueObjLayer = map
      .createLayer("morgue-objs", InteriorC)
      .setDepth(-1);

    // SCALE TILED MAP TO FIX WORLD SIZE
    const layers = [
      floorLayer,
      borderLayer,
      wallLayer,
      elevatorLayer,
      morgueLabLayer,
      morgueAltLayer,
      morgueObjLayer,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
    }

    // LAYER COLLIDERS
    borderLayer.setCollisionByProperty({ collides: true });
    wallLayer.setCollisionByProperty({ collides: true });
    morgueLabLayer.setCollisionByProperty({ collides: true });
    elevatorLayer.setCollisionByProperty({ collides: true });
    morgueAltLayer.setCollisionByProperty({ collides: true });
    morgueObjLayer.setCollisionByProperty({ collides: true });

    // INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, borderLayer);
    this.physics.add.collider(this.player, wallLayer);
    this.physics.add.collider(this.player, morgueLabLayer);
    this.physics.add.collider(this.player, elevatorLayer);
    this.physics.add.collider(this.player, morgueAltLayer);
    this.physics.add.collider(this.player, morgueObjLayer);

    //COLLIDER DEBUG
    // const debugGraphics = this.add.graphics().setAlpha(0.7);
    // wallLayer.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    // });
  } //end createMap

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 250, 250, "player1")
    );

    //ADJUSTS PLAYER SPRITE SIZE
    this.player.displayHeight = 20;
    this.player.displayWidth = 20;

    //ADJUSTS COLLIDER TO SURROUND PLAYER
    this.time.addEvent({
      delay: 100,
      callback: () => resizeCollider(this.player, 20, 20),
      callbackScope: this,
      loop: false,
    });
  }
  update() {
    this.player.update();
  }
}
