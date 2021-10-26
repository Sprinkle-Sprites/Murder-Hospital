import Phaser from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  nextSceneFunc,
  handleRoomCountdownFinished,
  createMessage,
  changeDieFunc,
  onZoneCollision,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import RoomTimer from "@/game/scenes/RoomTimer";
import password from "@/game/assets/popups/password.png";
import toeTag from "@/game/assets/popups/toeTag.png";
import eventsCenter from "@/game/eventsCenter";
import eventEmitter from "../eventEmitter";
import directions from "@/game/assets/popups/directionsFinal.png";

export default class Morgue extends Phaser.Scene {
  constructor() {
    super({ key: "Morgue" });
    this.check = false;
    this.collectedClues = [];
  }

  preload() {
    Player.preload(this);
    this.load.image("directionsPopUp", directions);

    // BODY LOCKERS
    this.load.image("bodyLocker 1", collider);
    this.load.image("bodyLocker 2", collider);
    this.load.image("bodyLocker 3", collider);

    //notebook
    this.load.image("notebook", collider);

    //BONE SAW
    this.load.image("bone saw", collider);

    //POP UPS
    this.load.image("password", password);
    this.load.image("toeTag", toeTag);

    //REMOVES CONTAINER CLASS TO HIDE DIE/BUTTONS AND ADDS HIDE CLASS
    changeDieFunc(this.scene);
  }

  create() {
    this.createTitle();
    this.createTimer();
    this.createPlayer();
    this.createMap();
    this.createBodyLocker();
    this.createNotebook();
    this.createBoneSaw();
    this.createColliders();
    this.createSounds();
    eventsCenter.on("confirmation-check", this.returnConfirmation, this);
  }

  createTitle() {
    this.add.text(360, 605, "MORGUE", {
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
      //send a message to dice to lower prob of the morgue (dice # 7) being rolled
      eventEmitter.emit("completed", 7);
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

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 250, 100, "player1")
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

  createBodyLocker() {
    //LOCKED BODY DRAWER
    this.bodyLocker1 = this.physics.add
      .sprite(566, 37, "bodyLocker 1")
      // .setDepth(-2)
      .setSize(20, 24)
      .setScale(1.5, 0.7)
      .setVisible(false);

    // UNLOCKED BODY DRAWER
    this.bodyLocker2 = this.physics.add
      .sprite(672, 23, "bodyLocker 2")
      .setOrigin(0, 0)
      .setDepth(-2);

    // UNLOCKED BODY DRAWER(2)
    this.bodyLocker3 = this.physics.add
      .sprite(275, 315, "bodyLocker 3")
      // .setDepth(-2)
      .setSize(20, 24)
      .setScale(1.5, 1)
      .setVisible(false);
  }

  createNotebook() {
    this.notebook = this.physics.add
      .sprite(755, 556, "notebook")
      // .setDepth(-2)
      .setSize(20, 25)
      .setScale(0.9, 0.5)
      .setVisible(false);
  }

  createBoneSaw() {
    this.boneSaw = this.physics.add
      .sprite(374, 491, "bone saw")
      // .setDepth(-2)
      .setSize(23, 20)
      .setScale(1.1, 0.4)
      .setVisible(false);
  }

  createSounds() {
    this.bodyLockerSound = this.sound.add("body locker");
    this.bodyLockerSound2 = this.sound.add("body locker 2");
    this.loveNoteSound = this.sound.add("love note");
    this.notebookSound = this.sound.add("notebook");
    this.photoSound = this.sound.add("photo");
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

    //UNLOCKED BODY DRAWER PUNISHMENT
    this.physics.add.overlap(
      this.player,
      this.bodyLocker3,
      this.onUnlockedBodyDrawerCollision,
      null,
      this
    );

    // BONE SAW MESSAGE FROM DOC
    this.physics.add.overlap(
      this.player,
      this.boneSaw,
      this.onBoneSawCollision,
      null,
      this
    );

    // locked drawer with toetag
    this.physics.add.overlap(
      this.player,
      this.bodyLocker1,
      this.onLockedLockerCollision,
      null,
      this
    );

    //notebook with picture with password
    this.physics.add.overlap(
      this.player,
      this.notebook,
      this.onNoteBookCollision,
      null,
      this
    );

    //ZONES
    this.physics.add.overlap(
      this.zone,
      this.bodyLocker3,
      onZoneCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.zone,
      this.boneSaw,
      onZoneCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.zone,
      this.bodyLocker1,
      onZoneCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.zone,
      this.notebook,
      onZoneCollision,
      null,
      this
    );
  }

  onNoteBookCollision() {
    this.roomTimer.stop();
    this.player.disableBody();
    this.notebookSound.play();

    const openMessage =
      "You find a picture of a creepy family. On the back... who's this??";
    createMessage(this, openMessage, "top", 75, this.sys.canvas.height / 2);

    setTimeout(() => {
      this.photoSound.play();
      const popUp = this.add.image(400, 325, "password").setScale(0.5, 0.5);

      this.time.addEvent({
        delay: 4750,
        callback: () => popUp.destroy(),
        loop: false,
      });
      eventsCenter.emit("update-bank", "password");

      if (!this.collectedClues.includes("password")) {
        this.collectedClues.push("password");
        this.completed();
      }

      nextSceneFunc(this, "MainScene");
    }, 3000);
  }

  onLockedLockerCollision() {
    this.roomTimer.stop();
    this.player.disableBody();
    this.bodyLockerSound.play();

    eventsCenter.emit("check-key", "key");
    if (this.check) {
      const openMessage =
        "You are able to open the morgue drawer with the key you retrieved in the pharmacy...";
      createMessage(this, openMessage, "top", 50, this.sys.canvas.height / 2);

      setTimeout(() => {
        const popUp = this.add.image(400, 300, "toeTag").setScale(0.7, 0.7);
        this.time.addEvent({
          delay: 4750,
          callback: () => popUp.destroy(),
          loop: false,
        });
        eventsCenter.emit("update-bank", "toeTag");

        if (!this.collectedClues.includes("toeTag")) {
          this.collectedClues.push("toeTag");
          this.completed();
        }

        nextSceneFunc(this, "MainScene");
      }, 3000);
    } else {
      const drawerMessage = "Huh? Why would a body drawer need to be locked?";
      createMessage(
        this,
        drawerMessage,
        "center",
        100,
        this.sys.canvas.height / 2
      );

      nextSceneFunc(this, "MainScene");
    }
  }

  onUnlockedBodyDrawerCollision() {
    this.roomTimer.stop();
    this.player.disableBody();
    this.bodyLockerSound2.play();

    //WRAPED ALL ACTIONS TO RUN AFTER SOUND FINSIHES PLAYING
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        const lockedBodyMessage = `How dare you bother the dead? Sit out for 5 minutes and go call MeeMaw`;
        createMessage(
          this,
          lockedBodyMessage,
          "center",
          50,
          this.sys.canvas.height / 2
        );
        this.mainTimer.minusFive();

        if (!this.collectedClues.includes("ghostDrawer")) {
          this.collectedClues.push("ghostDrawer");
          this.completed();
        }

        nextSceneFunc(this, "MainScene");
      },
      loop: false,
    });
  }

  onBoneSawCollision() {
    this.roomTimer.stop();
    this.player.disableBody();
    this.loveNoteSound.play();

    const boneSawMessage = `To be sawed or to not to be? That is the question. XOXO Dr.Scott`;
    createMessage(
      this,
      boneSawMessage,
      "center",
      75,
      this.sys.canvas.height / 2
    );

    if (!this.collectedClues.includes("bone saw")) {
      this.collectedClues.push("bone saw");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
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
