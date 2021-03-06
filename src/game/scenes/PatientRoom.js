import Phaser, { Scene } from "phaser";
import eventsCenter from "@/game/eventsCenter";
import eventEmitter from "../eventEmitter";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
  handleRoomCountdownFinished,
  changeDieFunc,
  onZoneCollision,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import flowers from "@/game/assets/popups/flowers.png";
import blanket from "@/game/assets/popups/blanket.png";
import paperScrap from "@/game/assets/popups/paperScrap.png";
import RoomTimer from "@/game/scenes/RoomTimer";
import directions from "@/game/assets/popups/directionsFinal.png";

class PatientRoom extends Scene {
  constructor() {
    super({ key: "PatientRoom" });
    this.check = false;
    this.collectedClues = [];
  }

  preload() {
    Player.preload(this);
    this.load.image("directionsPopUp", directions);

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

    //REMOVES CONTAINER CLASS TO HIDE DIE/BUTTONS AND ADDS HIDE CLASS
    changeDieFunc(this.scene);
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
    this.createSounds();
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

    //RADIUS
    this.zone = this.add.zone(this.x, this.y, 125, 125);
    this.physics.world.enable(this.zone);
  }

  update() {
    this.player.update();
    this.roomTimer.update();
    this.getDirections();

    //MOVES PLAYER ZONE WITH PLAYER
    this.zone.x = this.player.x;
    this.zone.y = this.player.y;
  }

  completed() {
    if (this.collectedClues.length === 4)
      //send a message to dice to lower prob of the Patient Room (dice # 1) being rolled
      eventEmitter.emit("completed", 1);
  }

  createFlower() {
    this.flowers1 = this.physics.add
      .sprite(55, 370, "flowers1")
      // .setDepth(-2)
      .setSize(25, 20)
      .setScale(0.7, 0.9)
      .setVisible(false);

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
      .sprite(725, 530, "bed2")
      // .setDepth(-2)
      .setSize(18, 24)
      .setScale(2, 1)
      .setVisible(false);
  }

  createDoll() {
    this.doll = this.physics.add
      .sprite(602, 310, "creepy")
      // .setDepth(-2)
      .setSize(23, 23)
      .setScale(0.8, 0.8)
      .setVisible(false);
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
      .sprite(505, 74, "drawer3")
      // .setDepth(-2)
      .setSize(25, 25)
      .setScale(1.2, 0.4)
      .setVisible(false);
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

    //ZONES
    this.physics.add.overlap(
      this.zone,
      this.flowers1,
      onZoneCollision,
      null,
      this
    );

    this.physics.add.overlap(this.zone, this.bed2, onZoneCollision, null, this);

    this.physics.add.overlap(this.zone, this.doll, onZoneCollision, null, this);

    this.physics.add.overlap(
      this.zone,
      this.drawer3,
      onZoneCollision,
      null,
      this
    );
  }

  createSounds() {
    this.flowerWaterSound = this.sound.add("flower");
    this.bedSheetSound = this.sound.add("sheets");
    this.dollSound = this.sound.add("doll");
    this.lockedDrawerSound = this.sound.add("locked drawer");
    this.openedDrawerSound = this.sound.add("opened drawer");
  }

  onFlowerCollision() {
    this.roomTimer.stop();
    this.player.disableBody();
    this.flowerWaterSound.play();

    const popUp = this.add.image(400, 300, "flowers").setScale(0.5, 0.5);
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
    this.roomTimer.stop();
    this.player.disableBody();
    this.bedSheetSound.play();

    const popUp = this.add.image(400, 300, "blanket").setScale(0.5, 0.5);
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
    this.roomTimer.stop();
    this.player.disableBody();
    this.dollSound.play();

    const dollMessage =
      // "You find a creepy doll and gaze deeply into its eyes. What you see there so haunts you, you have to sit in the corner and cry. Lose 5 minutes.";
      "You get hypnotized by the creepy doll. You need five minutes to recover.";
    createMessage(this, dollMessage, "center", 50, this.sys.canvas.height / 2);
    this.mainTimer.minusFive();

    if (!this.collectedClues.includes("creepyDoll")) {
      this.collectedClues.push("creepyDoll");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onDrawerCollision() {
    this.roomTimer.stop();
    this.player.disableBody();

    eventsCenter.emit("check-scapel", "scapel");

    if (this.check) {
      this.openedDrawerSound.play();

      const openMessage =
        "You are able to open the box with the scapel you retrieved in the surgery...";
      createMessage(this, openMessage, "top", 50, this.sys.canvas.height / 2);

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
      this.lockedDrawerSound.play();

      const drawerMessage =
        "The drawer appears to be jammed. Maybe there's something to open it with.";

      createMessage(
        this,
        drawerMessage,
        "center",
        50,
        this.sys.canvas.height / 2
      );
      nextSceneFunc(this, "MainScene");
    }
  }

  returnConfirmation(bool) {
    this.check = bool;
  }

  getDirections() {
    let value = document.getElementById("directions").getAttribute("value");

    if (value === "readMe") {
      const popUp1 = this.add
        .image(400, 320, "directionsPopUp")
        .setScale(0.95, 0.9);
      this.input.on("pointerdown", () => {
        popUp1.destroy();
      });

      document.querySelector("#directions").setAttribute("value", "wait");
    } else {
      return;
    }
  }
}

export default PatientRoom;
