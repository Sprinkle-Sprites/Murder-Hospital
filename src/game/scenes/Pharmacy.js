import Phaser, { Scene } from "phaser";
// import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
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
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import pillBottle from "@/game/assets/popups/pill-bottle.png";
import keyPop from "@/game/assets/popups/key.png";
import bandagesPop from "@/game/assets/popups/bandages.png";
import twoDollarBill from "@/game/assets/popups/two-dollar-bill.png";
import RoomTimer from "@/game/scenes/RoomTimer";

//AUDIO
import pills from "@/game/assets/audio/pill-shake.wav";
import keys from "@/game/assets/audio/key-jingle.wav";
import boxUnlock from "@/game/assets/audio/action-unlock02.wav";
import bandaid from "@/game/assets/audio/object-paper02.wav";

class Pharmacy extends Scene {
  constructor() {
    super({ key: "Pharmacy" });
    this.combination = 0;
    this.collectedClues = [];
  }

  preload() {
    Player.preload(this);

    //Pills
    this.load.image("pills1", collider);

    //Cabinet
    this.load.image("cabinet", collider);

    //Cabinet2
    this.load.image("cabinet2", collider);

    //Lock Box
    this.load.image("lockBoax", collider);

    //TABLES

    //POPUPS
    this.load.image("pillBottle", pillBottle);
    this.load.image("key", keyPop);
    this.load.image("bandages", bandagesPop);
    this.load.image("twoDollar", twoDollarBill);

    //AUDIO
    this.load.audio("pills", pills);
    this.load.audio("keys", keys);
    this.load.audio("box", boxUnlock);
    this.load.audio("bandaid", bandaid);

    //REMOVES CONTAINER CLASS TO HIDE DIE/BUTTONS AND ADDS HIDE CLASS
    changeDieFunc(this.scene);
  }

  create() {
    this.createTitle();
    this.createPlayer();
    this.createMap();
    this.createPills();
    this.createCabinet();
    this.createLockBox();
    this.createCabinet2();
    this.createColliders();
    this.createTimer();
    this.createSounds();
  }

  createTitle() {
    this.add.text(365, 605, "PHARMACY", {
      fontFamily: "GypsyCurse",
      fontSize: 30,
      color: "red",
    });
  }

  createTimer() {
    const roomTimerLabel = this.add.text(10, 610, "", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 5,
    });

    // ROOM TIMER
    this.roomTimer = new RoomTimer(this, roomTimerLabel);
    this.roomTimer.start(handleRoomCountdownFinished.bind(this));

    // MAIN TIMER
    this.mainTimer = this.scene.get("MainTimerScene").mainTimer;
  }

  createMap() {
    const map = this.make.tilemap({ key: "pharmacy" });
    const InteriorA = map.addTilesetImage(
      "Interior-Hospital-A",
      "Interior-A",
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

    const lab2 = map.addTilesetImage("Laboratory-2", "floor", 16, 16, 0, 0);

    const lab3 = map.addTilesetImage("Laboratory-3", "Lab-3", 16, 16, 0, 0);

    const pharm4 = map.addTilesetImage(
      "Locker Room",
      "lockerRoom",
      16,
      16,
      0,
      0
    );

    //LAYERS
    this.floorLayer = map.createLayer("Floor", lab2);
    this.wallLayer = map.createLayer("Walls", InteriorA);
    this.pharmacyThings = map.createLayer("Pharmacy Things", InteriorC);
    this.pharmacyThings2 = map.createLayer("Pharmacy Things 2", lab3);
    this.pharmacyThings3 = map.createLayer("Pharmacy Things 3", InteriorAlt);
    this.pharmacyThings4 = map.createLayer("Pharmacy Things 4", pharm4);
    this.blood = map.createLayer("Blood", InteriorAlt);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [
      this.floorLayer,
      this.wallLayer,
      this.pharmacyThings,
      this.pharmacyThings2,
      this.pharmacyThings3,
      this.pharmacyThings4,
      this.blood,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
      layers[i].setDepth(-1);
    }
  }

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 350, 120, "player1")
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

  createPills() {
    this.pills = this.physics.add
      .sprite(132, 410, "pills1")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(50, 60, true);
  }

  createCabinet() {
    this.cabinet = this.physics.add
      .sprite(733, 245, "cabinet")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(40, 45, true);
  }

  createLockBox() {
    this.lockBox = this.physics.add
      .sprite(210, 60, "lockBox")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(30, 30, true);
  }

  createCabinet2() {
    this.cabinet2 = this.physics.add
      .sprite(715, 62, "cabinet2")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(55, 63, true);
  }

  createSounds() {
    this.pillSound = this.sound.add("pills");
    this.keySound = this.sound.add("keys");
    this.boxSound = this.sound.add("box");
    this.bandaidSound = this.sound.add("bandaid");
  }

  createColliders() {
    //LAYER COLLIDERS
    this.wallLayer.setCollisionByProperty({ collides: true });
    this.pharmacyThings.setCollisionByProperty({ collides: true });
    this.pharmacyThings2.setCollisionByProperty({ collides: true });
    this.pharmacyThings3.setCollisionByProperty({ collides: true });
    this.pharmacyThings4.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.collider(this.player, this.pharmacyThings);
    this.physics.add.collider(this.player, this.pharmacyThings2);
    this.physics.add.collider(this.player, this.pharmacyThings3);
    this.physics.add.collider(this.player, this.pharmacyThings4);

    this.physics.add.overlap(
      this.player,
      this.pills,
      this.onPillsCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.cabinet,
      this.onCabinetCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.lockBox,
      this.onLockBoxCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.cabinet2,
      this.onCabinet2Collision,
      null,
      this
    );
  }

  onPillsCollision() {
    this.player.disableBody();
    this.pillSound.play();

    const pillMessage =
      "You take a mystery pill. What were you thinking? Lose 5 minutes";
    createMessage(this, pillMessage, "top", 50, this.sys.canvas.height / 2);

    const pillsPopUp = this.add.image(400, 300, "pillBottle");
    this.time.addEvent({
      delay: 4750,
      callback: () => pillsPopUp.destroy(),
      loop: false,
    });

    eventsCenter.emit("update-bank", "pillBottle");
    this.mainTimer.minusFive();

    if (!this.collectedClues.includes("pillBottle")) {
      this.collectedClues.push("pillBottle");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onCabinetCollision() {
    this.player.disableBody();
    this.keySound.play();

    const keyPopUp = this.add.image(400, 300, "key").setScale(0.25, 0.25);
    this.time.addEvent({
      delay: 4750,
      callback: () => keyPopUp.destroy(),
      loop: false,
    });

    eventsCenter.emit("update-bank", "key");

    if (!this.collectedClues.includes("key")) {
      this.collectedClues.push("key");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onLockBoxCollision() {
    this.player.disableBody();
    this.boxSound.play();

    const enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    const text1 = this.add
      .text(
        400,
        300,
        "This box requires a four digit combination. Enter below...",
        {
          fixedWidth: 700,
          fixedHeight: 50,
          backgroundColor: "black",
          align: "center",
          wordWrap: { width: 300, useAdvancedWrap: true },
        }
      )
      .setOrigin(0.5, 0.5);

    const text2 = this.add
      .text(400, 370, "", {
        fixedWidth: 300,
        fixedHeight: 40,
        backgroundColor: "black",
        align: "center",
        wordWrap: { width: 300, useAdvancedWrap: true },
      })
      .setOrigin(0.5, 0.5);

    text2.setInteractive().on("pointerdown", () => {
      this.rexUI.edit(text2);
    });

    enter.on("down", () => {
      this.combination = parseInt(text2._text);
      text1.destroy();

      if (this.combination === 1022) {
        const popup = this.add.image(400, 300, "twoDollar");
        popup.setScale(0.25, 0.25);

        this.time.addEvent({
          delay: 4000,
          callback: () => popup.destroy(),
          loop: false,
        });
        eventsCenter.emit("update-bank", "twoDollar");

        if (!this.collectedClues.includes("twoDollar")) {
          this.collectedClues.push("twoDollar");
          this.completed();
        }

        nextSceneFunc(this, "MainScene");
      } else if (this.combination !== 1022 && !isNaN(this.combination)) {
        const wrongCodeMessage =
          "You try to open the lock box, but it won't budge. Better keep looking for the code";

        createMessage(
          this,
          wrongCodeMessage,
          "center",
          50,
          this.sys.canvas.height / 2
        );
        nextSceneFunc(this, "MainScene");
      }
      text2.destroy();
    });
  }

  onCabinet2Collision() {
    this.player.disableBody();
    this.bandaidSound.play();

    const bandagesPopUp = this.add
      .image(400, 300, "bandages")
      .setScale(0.5, 0.5);

    this.time.addEvent({
      delay: 4750,
      callback: () => bandagesPopUp.destroy(),
      loop: false,
    });
    eventsCenter.emit("update-bank", "bandages");

    if (!this.collectedClues.includes("bandages")) {
      this.collectedClues.push("bandages");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  update() {
    this.player.update();
    this.roomTimer.update();
  }

  completed() {
    if (this.collectedClues.length === 4)
      //send a message to dice to lower prob of the Pharmacy (dice # 5) being rolled
      eventEmitter.emit("completed", 5);
  }
}

export default Pharmacy;
