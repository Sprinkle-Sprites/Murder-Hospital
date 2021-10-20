import Phaser from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  nextSceneFunc,
  handleRoomCountdownFinished,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import RoomTimer from "@/game/scenes/RoomTimer";

export default class Morgue extends Phaser.Scene {
  constructor() {
    super({ key: "Morgue" });
  }
  preload() {
    Player.preload(this);

    // BODY LOCKERS
    this.load.image("bodyLocker 1", collider);
    this.load.image("bodyLocker 2", collider);
    this.load.image("bodyLocker 3", collider);

    //DESK
    this.load.image("desk", collider);

    //BONE SAW
    this.load.image("bone saw", collider);

    //POP UPS
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createBodyLocker();
    this.createTimer();
  }

  createTimer() {
    const roomTimerLabel = this.add.text(10, 610, "", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 5,
    });

    this.roomTimer = new RoomTimer(this, roomTimerLabel);
    this.roomTimer.start(handleRoomCountdownFinished.bind(this));
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
    this.floorLayer = map.createLayer("morgue-floor", InteriorB);
    this.borderLayer = map.createLayer("morgue-border", InteriorA);
    this.wallLayer = map.createLayer("morgue-walls", InteriorA);
    this.elevatorLayer = map.createLayer("elevator", Elevator);
    this.morgueLabLayer = map.createLayer("morgue-lab", Lab3);
    this.morgueAltLayer = map.createLayer("morgue-alt", InteriorAlt);
    this.morgueObjLayer = map.createLayer("morgue-objs", InteriorC);

    // SCALE TILED MAP TO FIX WORLD SIZE
    const layers = [
      this.floorLayer,
      this.borderLayer,
      this.wallLayer,
      this.elevatorLayer,
      this.morgueLabLayer,
      this.morgueAltLayer,
      this.morgueObjLayer,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
      layers[i].setDepth(-1);
    }
  } //end createMap

  createBodyLocker() {
    //locked body drawer
    this.bodyLocker1 = this.physics.add
      .sprite(550, 23, "bodyLocker 1")
      .setOrigin(0, 0)
      .setDepth(-2);

    this.bodyLocker2 = this.physics.add
      .sprite(672, 23, "bodyLocker 2")
      .setOrigin(0, 0)
      .setDepth(-2);

    //SCALES COLLIDERS ON BODY LOCKERS TO APPROPRIATE SIZE
    const bodyLockers = [this.bodyLocker1, this.bodyLocker2];
    for (let i = 0; i < bodyLockers.length; i++) {
      resizeCollider(bodyLockers[i], 0, 15);
    }
  }

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

  createColliders() {
    // LAYER COLLIDERS
    this.borderLayer.setCollisionByProperty({ collides: true });
    this.wallLayer.setCollisionByProperty({ collides: true });
    this.morgueLabLayer.setCollisionByProperty({ collides: true });
    this.elevatorLayer.setCollisionByProperty({ collides: true });
    this.morgueAltLayer.setCollisionByProperty({ collides: true });
    this.morgueObjLayer.setCollisionByProperty({ collides: true });

    // INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, this.borderLayer);
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.collider(this.player, this.morgueLabLayer);
    this.physics.add.collider(this.player, this.elevatorLayer);
    this.physics.add.collider(this.player, this.morgueAltLayer);
    this.physics.add.collider(this.player, this.morgueObjLayer);
  }

  update() {
    this.player.update();
    this.roomTimer.update();
  }
}
