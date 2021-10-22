import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  nextSceneFunc,
  createMessage,
  handleRoomCountdownFinished,
  changeDieClass,
} from "@/game/HelperFunctions";

import eventsCenter from "@/game/eventsCenter";
import eventEmitter from "../eventEmitter";
import collider from "@/game/assets/collider.png";
import calendar_date from "@/game/assets/popups/calendar_date.png";
import test_tube from "@/game/assets/popups/test_tube.png";
import specimen_flask from "@/game/assets/popups/specimen_flask.png";
import computerScreen from "@/game/assets/popups/computerScreen.png";
import RoomTimer from "@/game/scenes/RoomTimer";

//AUDIO
import calendarCrumble from "@/game/assets/audio/paper.wav";
import skeletonMovement from "@/game/assets/audio/movement.wav";
import testTubeGrab from "@/game/assets/audio/click.wav";
import beakerGrab from "@/game/assets/audio/beaker.wav";
import candyTray from "@/game/assets/audio/object-movement.wav";
import deskDrawer from "@/game/assets/audio/door-closing.wav";

class Laboratory extends Scene {
  constructor() {
    super({ key: "Laboratory" });
    this.password = null;
    this.collectedClues = [];
  }

  preload() {
    Player.preload(this);

    //Calendar
    this.load.image("calendar", collider);

    //Desk
    this.load.image("desk", collider);

    //skeleton
    this.load.image("skeleton", collider);

    //Test Tubes
    this.load.image("testTube", collider);

    //Specimen Flask
    this.load.image("specimen_flask", collider);

    //Candy Bar
    this.load.image("candyBar", collider);

    //Pop UP
    this.load.image("calendar_date", calendar_date);
    this.load.image("test_tube", test_tube);
    this.load.image("specimenFlask", specimen_flask);
    this.load.image("computerScreen", computerScreen);

    //AUDIO
    this.load.audio("calendar", calendarCrumble);
    this.load.audio("skeleton", skeletonMovement);
    this.load.audio("test tube", testTubeGrab);
    this.load.audio("beaker", beakerGrab);
    this.load.audio("candy", candyTray);
    this.load.audio("desk", deskDrawer);

    //REMOVES CONTAINER CLASS TO HIDE DIE/BUTTONS AND ADDS HIDE CLASS
    changeDieClass();
  }

  create() {
    this.createTitle();
    this.createPlayer();
    this.createMap();
    this.createCalendar();
    this.createSkeleton();
    this.createTestTube();
    this.createSpecimenFlask();
    this.createCandyBar();
    this.createDesk();
    this.createColliders();
    this.createTimer();
    this.createSounds();
  }

  createTitle() {
    this.add.text(360, 605, "LABORATORY", {
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

    //ROOM TIMER
    this.roomTimer = new RoomTimer(this, roomTimerLabel);
    this.roomTimer.start(handleRoomCountdownFinished.bind(this));

    // MAIN TIMER
    this.mainTimer = this.scene.get("MainTimerScene").mainTimer;
  }

  createMap() {
    const map = this.make.tilemap({ key: "Laboratory" });
    //need for walls
    const InteriorA = map.addTilesetImage(
      "Interior-Hospital-A",
      "Interior-A",
      16,
      16,
      0,
      0
    );

    //need for floors
    const InteriorB = map.addTilesetImage(
      "Interior-Hospital-B",
      "Interior-B",
      16,
      16,
      0,
      0
    );

    //need blood
    const InteriorAlt = map.addTilesetImage(
      "Interior-Hospital-Alt",
      "Interior-Alt",
      16,
      16,
      0,
      0
    );

    //need lab stuff
    const Lab3 = map.addTilesetImage("Laboratory-3", "Lab-3", 16, 16, 0, 0);

    //need add lockerroom for computer & Lab office
    const Lab_Office = map.addTilesetImage(
      "Locker Room",
      "lockerRoom",
      16,
      16,
      0,
      0
    );

    //LAYERS
    this.floorLayer = map.createLayer("floors", InteriorB).setDepth(-1);
    this.wallLayer = map.createLayer("Walls", InteriorA).setDepth(-1);
    this.blood = map.createLayer("Blood", InteriorAlt).setDepth(-1);

    this.computer = map.createLayer("Computer", Lab_Office).setDepth(0);
    this.labOffice = map.createLayer("Lab Office", Lab_Office).setDepth(-1);
    this.labStuff = map.createLayer("Lab Stuff", Lab3).setDepth(-1);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [
      this.floorLayer,
      this.wallLayer,
      this.blood,
      this.computer,
      this.labOffice,
      this.labStuff,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
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

  update() {
    this.player.update();
    this.roomTimer.update();
  }

  completed() {
    if (this.collectedClues.length === 6)
      //send a message to dice to lower prob of the laboratory (dice # 4) being rolled
      eventEmitter.emit("completed", 4);
  }

  createCalendar() {
    this.calendar1 = this.physics.add
      .sprite(450, 60, "calendar")
      .setOrigin(0, 0)
      .setDepth(-2);
  }

  createSkeleton() {
    this.skeleton = this.physics.add
      .sprite(390, 60, "skeleton")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(25, 35, true);
  }

  createTestTube() {
    this.testTube = this.physics.add
      .sprite(445, 178, "testTube")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(25, 50, true);
  }

  createSpecimenFlask() {
    this.specimenFlask = this.physics.add
      .sprite(590, 435, "specimen_flask")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(25, 35, true);
  }

  createCandyBar() {
    this.candyBar = this.physics.add
      .sprite(468, 435, "candyBar")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(25, 35, true);
  }

  createDesk() {
    this.desk = this.physics.add
      .sprite(710, 110, "desk")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(25, 35, true);
  }

  createSounds() {
    this.calendarSound = this.sound.add("calendar");
    this.skeletonSound = this.sound.add("skeleton");
    this.testTubeSound = this.sound.add("test tube");
    this.beakerSound = this.sound.add("beaker");
    this.candySound = this.sound.add("candy");
    this.deskSound = this.sound.add("desk");
  }

  createColliders() {
    //LAYER COLLIDERS
    this.wallLayer.setCollisionByProperty({ collides: true });
    this.blood.setCollisionByProperty({ collides: true });
    this.computer.setCollisionByProperty({ collides: true });
    this.labOffice.setCollisionByProperty({ collides: true });
    this.labStuff.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, this.blood);
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.collider(this.player, this.computer);
    this.physics.add.collider(this.player, this.labOffice);
    this.physics.add.collider(this.player, this.labStuff);

    this.physics.add.overlap(
      this.player,
      this.calendar1,
      this.onCalendarCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.skeleton,
      this.onSkeletonCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.testTube,
      this.onTestTubeCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.specimenFlask,
      this.onSpecimenFlaskCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.candyBar,
      this.onCandyBarCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.desk,
      this.onDeskCollision,
      null,
      this
    );
  }

  onCalendarCollision() {
    this.player.disableBody();
    this.calendarSound.play();

    const calPopUp = this.add
      .image(400, 300, "calendar_date")
      .setScale(0.7, 0.7);
    this.time.addEvent({
      delay: 4750,
      callback: () => calPopUp.destroy(),
      loop: false,
    });

    eventsCenter.emit("update-bank", "calendar_date");

    if (!this.collectedClues.includes("calendar_date")) {
      this.collectedClues.push("calendar_date");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onSkeletonCollision() {
    this.player.disableBody();
    this.skeletonSound.play();

    const skeletonMessage = "I'm just a bag of bones. Wanna dance?";
    createMessage(this, skeletonMessage);

    if (!this.collectedClues.includes("skeleton")) {
      this.collectedClues.push("skeleton");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onTestTubeCollision() {
    this.player.disableBody();
    this.testTubeSound.play();

    const testTubePopUp = this.add.image(400, 300, "test_tube");
    testTubePopUp.setScale(0.25, 0.25);
    this.time.addEvent({
      delay: 4750,
      callback: () => testTubePopUp.destroy(),
      loop: false,
    });

    eventsCenter.emit("update-bank", "test_tube");

    if (!this.collectedClues.includes("test_tube")) {
      this.collectedClues.push("test_tube");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onSpecimenFlaskCollision() {
    this.player.disableBody();
    this.beakerSound.play();

    const specimenFalskPopUp = this.add.image(400, 300, "specimenFlask");
    this.time.addEvent({
      delay: 4750,
      callback: () => specimenFalskPopUp.destroy(),
      loop: false,
    });
    eventsCenter.emit("update-bank", "specimenFlask");

    if (!this.collectedClues.includes("specimenFlask")) {
      this.collectedClues.push("specimenFlask");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onCandyBarCollision() {
    this.player.disableBody();
    this.candySound.play();

    const candyBarMessage =
      "Here's a snack on the surgical tray. You eat it. Are you crazy? Don't eat weird snacks from evil doctors. Take 5 minutes to recover.";
    this.mainTimer.minusFive();
    createMessage(this, candyBarMessage);

    if (!this.collectedClues.includes("candyBar")) {
      this.collectedClues.push("candyBar");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onDeskCollision() {
    this.player.disableBody();
    this.deskSound.play();

    const text1 = this.add
      .text(400, 300, "PASSWORD:", {
        fixedWidth: 700,
        fixedHeight: 50,
        backgroundColor: "black",
        align: "center",
        wordWrap: { width: 300, useAdvancedWrap: true },
      })
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

    const enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    enter.on("down", () => {
      this.password = text2._text.toUpperCase();
      text1.destroy();

      if (this.password === "SUE") {
        const popup = this.add.image(400, 300, "computerScreen");
        popup.setScale(0.25, 0.25);
        this.time.addEvent({
          delay: 4000,
          callback: () => popup.destroy(),
          loop: false,
        });

        eventsCenter.emit("update-bank", "computerScreen");

        if (!this.collectedClues.includes("computerScreen")) {
          this.collectedClues.push("computerScreen");
          this.completed();
        }

        nextSceneFunc(this, "MainScene");
      } else if (this.password !== "SUE" && this.password !== "") {
        const wrongCodeMessage = "INCORRECT";
        createMessage(this, wrongCodeMessage);
        nextSceneFunc(this, "MainScene");
      }

      text2.destroy();
    });
  }
}

export default Laboratory;
