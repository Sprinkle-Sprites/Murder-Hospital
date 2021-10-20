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
    this.createTimer();
    this.createPlayer();
    this.createMap();
    this.createBodyLocker();
    this.createDesk();
    this.createBoneSaw();
    this.createColliders();
  }

  update() {
    this.player.update();
    //this.roomTimer.update();
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
  } //end createMap

  handleRoomCountdownFinished() {
    this.player.active = false;
    const { width, height } = this.scale;
    this.add
      .text(width * 0.5, height * 0.5, "Time's up, your turn is over", {
        fontSize: 30,
        backgroundColor: "black",
      })
      .setOrigin(0.5);
    nextSceneFunc(this, "MainScene");
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

  createTimer() {
    // ROOM TIMER
    const roomTimerLabel = this.add.text(10, 610, "", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 5,
    });
    //this.roomTimer = new RoomTimer(this, roomTimerLabel);
    //this.roomTimer.start(this.handleRoomCountdownFinished.bind(this));
    // MAINTIMER
    this.mainTimer = this.scene.get("MainTimerScene").mainTimer;
  }

  createBodyLocker() {
    //LOCKED BODY DRAWER
    this.bodyLocker1 = this.physics.add
      .sprite(550, 23, "bodyLocker 1")
      .setOrigin(0, 0)
      .setDepth(-2);

    // UNLOCKED BODY DRAWER
    this.bodyLocker2 = this.physics.add
      .sprite(672, 23, "bodyLocker 2")
      .setOrigin(0, 0)
      .setDepth(-2);

    // UNLOCKED BODY DRAWER(2)
    this.bodyLocker3 = this.physics.add
      .sprite(260, 300, "bodyLocker 3")
      .setOrigin(0, 0)
      .setDepth(-2);

    //SCALES COLLIDERS ON BODY LOCKERS TO APPROPRIATE SIZE
    const bodyLockers = [this.bodyLocker1, this.bodyLocker2, this.bodyLocker3];
    for (let i = 0; i < bodyLockers.length; i++) {
      resizeCollider(bodyLockers[i], 5, 15);
    }
  }

  createDesk() {
    this.desk = this.physics.add
      .sprite(738, 540, "desk")
      .setOrigin(0, 0)
      .setDepth(-2);

    //SCALE COLLIDER ON NOTEBOOK ON DESK TO APPROPRIATE SIZE
    resizeCollider(this.desk, 10, 20);
  }

  createBoneSaw() {
    this.boneSaw = this.physics.add
      .sprite(357, 475, "bone saw")
      .setOrigin(0, 0)
      .setDepth(-2);

    //SCALE COLLIDER ON BONE SAW TO APPROPRIATE SIZE
    resizeCollider(this.boneSaw, 10, 15);
  }

  onNoteBookCollision() {}

  onLockedLockerCollision() {}

  onUnlockedBodyDrawer() {
    const lockedBodyMessage = `How dare you bother the dead?
     Sit out for 5 minutes and go call MeeMaw`;

    this.player.disableBody();
    createMessage(this, lockedBodyMessage);
    this.mainTimer.minusFive();
    nextSceneFunc(this, "MainScene");
  }

  onBoneSaw() {
    const boneSawMessage = `To be sawed or to not to be? That is the question. XOXO Dr.Scott`;
    this.player.disableBody();
    createMessage(this, boneSawMessage);
    nextSceneFunc(this, "MainScene");
  }

  createColliders() {
    //UNLOCKED BODY DRAWER PUNISHMENT
    this.physics.add.overlap(
      this.player,
      this.bodyLocker3,
      this.onUnlockedBodyDrawer,
      null,
      this
    );

    // BONE SAW MESSAGE FROM DOC
    this.physics.add.overlap(
      this.player,
      this.boneSaw,
      this.onBoneSaw,
      null,
      this
    );
  }
}
