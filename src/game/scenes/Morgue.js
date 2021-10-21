import Phaser from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  nextSceneFunc,
  handleRoomCountdownFinished,
  createMessageForImage,
  createMessage
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import RoomTimer from "@/game/scenes/RoomTimer";
import password from "@/game/assets/popups/password.png";
import toeTag from "@/game/assets/popups/toeTag.png";
import eventsCenter from "@/game/eventsCenter";

export default class Morgue extends Phaser.Scene {
  constructor() {
    super({ key: "Morgue" });
    this.check = false;
  }

  preload() {
    Player.preload(this);

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
    eventsCenter.on("confirmation-check", this.returnConfirmation, this);
  }

  createTitle() {
    this.add.text(360, 618, "MORGUE", {
      fontFamily: "Inconsolata",
      fontSize: 20,
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

  // // LAYER COLLIDERS
  // borderLayer.setCollisionByProperty({ collides: true });
  // wallLayer.setCollisionByProperty({ collides: true });
  // morgueLabLayer.setCollisionByProperty({ collides: true });
  // elevatorLayer.setCollisionByProperty({ collides: true });
  // morgueAltLayer.setCollisionByProperty({ collides: true });
  // morgueObjLayer.setCollisionByProperty({ collides: true });

  // // INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
  // this.physics.add.collider(this.player, borderLayer);
  // this.physics.add.collider(this.player, wallLayer);
  // this.physics.add.collider(this.player, morgueLabLayer);
  // this.physics.add.collider(this.player, elevatorLayer);
  // this.physics.add.collider(this.player, morgueAltLayer);
  // this.physics.add.collider(this.player, morgueObjLayer);
  // } //end createMap

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

  createNotebook() {
    this.notebook = this.physics.add
      .sprite(738, 540, "notebook")
      .setOrigin(0, 0)
      .setDepth(-2);

    //SCALE COLLIDER ON NOTEBOOK TO APPROPRIATE SIZE
    resizeCollider(this.notebook, 5, 20);
  }

  createBoneSaw() {
    this.boneSaw = this.physics.add
      .sprite(357, 475, "bone saw")
      .setOrigin(0, 0)
      .setDepth(-2);

    //SCALE COLLIDER ON BONE SAW TO APPROPRIATE SIZE
    resizeCollider(this.boneSaw, 5, 10);
  }

  onNoteBookCollision() {
    this.player.disableBody();
    const openMessage =
      "You find a picture of a creepy family. On the back...who's this??";
    createMessageForImage(this, openMessage);
    setTimeout(() => {
      const popUp = this.add.image(400, 300, "password").setScale(0.5, 0.5);
      this.time.addEvent({
        delay: 4750,
        callback: () => popUp.destroy(),
        loop: false,
      });
      eventsCenter.emit("update-bank", "password");
      nextSceneFunc(this, "MainScene");
    }, 3000);
  }

  onLockedLockerCollision() {
    eventsCenter.emit("check-key", "key");

    if (this.check) {
      this.player.disableBody();
      const openMessage =
        "You are able to open the morgue drawer with the key you retrieved in the pharmacy...";
      createMessageForImage(this, openMessage);
      setTimeout(() => {
        const popUp = this.add.image(400, 300, "toeTag");
        this.player.disableBody();
        this.time.addEvent({
          delay: 4750,
          callback: () => popUp.destroy(),
          loop: false,
        });
        eventsCenter.emit("update-bank", "toeTag");
        nextSceneFunc(this, "MainScene");
      }, 3000);
    } else {
      const drawerMessage = "Huh? Why would a body drawer need to be locked?";
      this.player.disableBody();
      createMessage(this, drawerMessage);
      nextSceneFunc(this, "MainScene");
    }
  }

  onUnlockedBodyDrawer() {
    const lockedBodyMessage = `How dare you bother the dead? Sit out for 5 minutes and go call MeeMaw`;

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
  }

  returnConfirmation(bool) {
    this.check = bool;
  }
}
