import Phaser, { Scene } from "phaser";
import eventsCenter from "@/game/eventsCenter";
import eventEmitter from "../eventEmitter";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
  createMessageForImage,
  handleRoomCountdownFinished,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import flowers from "@/game/assets/popups/flowers.png";
import blanket from "@/game/assets/popups/blanket.png";
import paperScrap from "@/game/assets/popups/paperScrap.png";

import RoomTimer from "@/game/scenes/RoomTimer";

class PatientRoom extends Scene {
  constructor() {
    super({ key: "PatientRoom" });
    this.check = false;
  }

  preload() {
    Player.preload(this);

    //Flowers
    this.load.image("flowers1", collider);
    this.load.image("flowers2", collider);

    //Beds
    this.load.image("bed1", collider);
    this.load.image("bed2", collider);

    //Creepy Doll
    this.load.image("creepy", collider);

    //Locked Drawer
    this.load.image("drawer1", collider);
    this.load.image("drawer2", collider);
    this.load.image("drawer3", collider);

    //Popups
    this.load.image("flowers", flowers);
    this.load.image("blanket", blanket);
    this.load.image("paperScrap", paperScrap);
  }

  create() {
    this.createTitle();
    this.createPlayer();
    this.createMap();
    this.createFlower();
    this.createBed();
    this.createDoll();
    this.createDrawer();
    this.createColliders();
    this.createTimer();
    eventsCenter.on("confirmation-check", this.returnConfirmation, this);
  }

  createTitle() {
    this.add.text(320, 605, "THE PATIENT'S ROOM", {
      fontFamily: "GypsyCurse",
      fontSize: 30,
      color: "red",
    });
  }

  createTimer() {
    const roomTimerLabel = this.add.text(10, 610, "", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 10,
    });

    // ROOM TIMER
    this.roomTimer = new RoomTimer(this, roomTimerLabel);
    this.roomTimer.start(handleRoomCountdownFinished.bind(this));

    // MAIN TIMER
    this.mainTimer = this.scene.get("MainTimerScene").mainTimer;
  }

  createMap() {
    const map = this.make.tilemap({ key: "patient" });
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

    const CreepyDoll = map.addTilesetImage(
      "creepy_toys",
      "Creepy-Doll",
      16,
      16,
      0,
      0
    );

    //LAYERS
    this.floorLayer = map.createLayer("patientsFloor", InteriorB);
    this.wallLayer = map.createLayer("patientsWall", InteriorA);
    this.backgroundLayer = map.createLayer("patientsBackground", InteriorAlt);
    this.detailsCLayer = map.createLayer("patientsDetailsC", InteriorC);
    this.detailsLabLayer = map.createLayer("patientsDetailsLab", Lab3);
    this.creepyDollLayer = map.createLayer("patientsCreepyDoll", CreepyDoll);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [
      this.floorLayer,
      this.wallLayer,
      this.backgroundLayer,
      this.detailsCLayer,
      this.detailsLabLayer,
      this.creepyDollLayer,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
      layers[i].setDepth(-1);
    }
  }

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 400, 300, "player1")
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
    this.roomTimer.update();
  }

  completed() {
    if (this.collectedClues.length === 4)
      //send a message to dice to lower prob of the Patient Room (index 0) being rolled
      eventEmitter.emit("completed", 0);
  }

  createFlower() {
    this.flowers1 = this.physics.add
      .sprite(40, 360, "flowers1")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(31, 33, true);

    this.flowers2 = this.physics.add
      .sprite(620, 440, "flowers2")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(31, 43, true);
  }

  createBed() {
    this.bed1 = this.physics.add
      .sprite(58, 335, "bed1")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(58, 31, true);

    this.bed2 = this.physics.add
      .sprite(715, 516, "bed2")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(58, 31, true);
  }

  createDoll() {
    this.doll = this.physics.add
      .sprite(585, 290, "creepy")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(25, 25, true);
  }

  createDrawer() {
    this.drawer1 = this.physics.add
      .sprite(40, 150, "drawer1")
      .setOrigin(0, 0)
      .setDepth(-2);

    this.drawer2 = this.physics.add
      .sprite(670, 285, "drawer2")
      .setOrigin(0, 0)
      .setDepth(-2);

    this.drawer3 = this.physics.add
      .sprite(490, 53, "drawer3")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(30, 37, true);
  }

  createColliders() {
    //LAYER COLLIDERS
    this.wallLayer.setCollisionByProperty({ collides: true });
    this.detailsCLayer.setCollisionByProperty({ collides: true });
    this.detailsLabLayer.setCollisionByProperty({ collides: true });
    this.backgroundLayer.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.collider(this.player, this.detailsCLayer);
    this.physics.add.collider(this.player, this.detailsLabLayer);
    this.physics.add.collider(this.player, this.backgroundLayer);

    this.physics.add.overlap(
      this.player,
      this.flowers1,
      this.onFlowerCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.bed2,
      this.onBedCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.doll,
      this.onDollCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.drawer3,
      this.onDrawerCollision,
      null,
      this
    );
  }

  onFlowerCollision() {
    const popUp = this.add.image(400, 300, "flowers").setScale(0.5, 0.5);
    this.player.disableBody();
    eventsCenter.emit("update-bank", "flowers");
    this.time.addEvent({
      delay: 4750,
      callback: () => popUp.destroy(),
      loop: false,
    });

    if (!this.collectedClues.includes("flowers")) {
      this.collectedClues.push("flowers");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onBedCollision() {
    const popUp = this.add.image(400, 300, "blanket").setScale(0.5, 0.5);
    this.player.disableBody();
    eventsCenter.emit("update-bank", "blanket");
    this.time.addEvent({
      delay: 4750,
      callback: () => popUp.destroy(),
      loop: false,
    });

    if (!this.collectedClues.includes("blanket")) {
      this.collectedClues.push("blanket");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onDollCollision() {
    const dollMessage =
      "You find a creepy doll and gaze deeply into its eyes. What you see there so haunts you, you have to sit in the corner and cry. Lose 5 minutes.";
    this.player.disableBody();
    createMessage(this, dollMessage);
    this.mainTimer.minusFive();

    if (!this.collectedClues.includes("creepyDoll")) {
      this.collectedClues.push("creepyDoll");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onDrawerCollision() {
    eventsCenter.emit("check-scapel", "scapel");

    if (this.check) {
      this.player.disableBody();
      const openMessage =
        "You are able to open the box with the scapel you retrieved in the surgery...";
      createMessageForImage(this, openMessage);
      setTimeout(() => {
        const popUp = this.add.image(400, 300, "paperScrap").setScale(0.5, 0.5);
        this.time.addEvent({
          delay: 4750,
          callback: () => popUp.destroy(),
          loop: false,
        });
        eventsCenter.emit("update-bank", "paperScrap");

        if (!this.collectedClues.includes("paperScrap")) {
          this.collectedClues.push("paperScrap");
          this.completed();
        }

        nextSceneFunc(this, "MainScene");
      }, 3000);
    } else {
      const drawerMessage =
        "The drawer appears to be jammed. Maybe there's something to open it with.";
      this.player.disableBody();
      createMessage(this, drawerMessage);
      nextSceneFunc(this, "MainScene");
    }
  }

  returnConfirmation(bool) {
    this.check = bool;
  }
}

export default PatientRoom;
