import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  nextSceneFunc,
  createMessage,
  handleRoomCountdownFinished,
} from "@/game/HelperFunctions";

import eventsCenter from "@/game/eventsCenter";
import collider from "@/game/assets/collider.png";
import calendar_date from "@/game/assets/popups/calendar_date.png";
import test_tube from "@/game/assets/popups/test_tube.png";
import specimen_flask from "@/game/assets/popups/specimen_flask.png";
import computerScreen from "@/game/assets/popups/computerScreen.png";

import RoomTimer from "@/game/scenes/RoomTimer";

class Laboratory extends Scene {
  constructor() {
    super({ key: "Laboratory" });
    this.password = null;
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
    this.floorLayer = map.createLayer("floors", InteriorB);
    this.wallLayer = map.createLayer("Walls", InteriorA);
    this.blood = map.createLayer("Blood", InteriorAlt);

    this.computer = map.createLayer("Computer", Lab_Office);
    this.labOffice = map.createLayer("Lab Office", Lab_Office);
    this.labStuff = map.createLayer("Lab Stuff", Lab3);

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
      layers[i].setDepth(-1);
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
      .sprite(445, 170, "testTube")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(25, 35, true);
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
    const calPopUp = this.add.image(400, 300, "calendar_date");
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => calPopUp.destroy(),
      loop: false,
    });

    eventsCenter.emit("update-bank", "calendar_date");
    nextSceneFunc(this, "MainScene");
  }

  onSkeletonCollision() {
    const skeletonMessage = "I'm just a bag of bones. Wanna dance?";
    this.player.disableBody();
    createMessage(this, skeletonMessage);
    nextSceneFunc(this, "MainScene");
  }

  onTestTubeCollision() {
    const testTubePopUp = this.add.image(400, 300, "test_tube");
    testTubePopUp.setScale(0.25, 0.25);
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => testTubePopUp.destroy(),
      loop: false,
    });

    eventsCenter.emit("update-bank", "test_tube");
    nextSceneFunc(this, "MainScene");
  }

  onSpecimenFlaskCollision() {
    const specimenFalskPopUp = this.add.image(400, 300, "specimenFlask");
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => specimenFalskPopUp.destroy(),
      loop: false,
    });

    eventsCenter.emit("update-bank", "specimenFlask");
    nextSceneFunc(this, "MainScene");
  }

  onCandyBarCollision() {
    const candyBarMessage =
      "Here's a snack on the surgical tray. You eat it. Are you crazy? Don't eat weird snacks from evil doctors. Take 5 minutes to recover.";
    this.player.disableBody();
    this.mainTimer.minusFive();
    createMessage(this, candyBarMessage);
    nextSceneFunc(this, "MainScene");
  }

  onDeskCollision() {
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
        this.player.disableBody();
        this.time.addEvent({
          delay: 4000,
          callback: () => popup.destroy(),
          loop: false,
        });

        eventsCenter.emit("update-bank", "computerScreen");
        nextSceneFunc(this, "MainScene");
      } else if (this.password !== "SUE" && this.password !== "") {
        const wrongCodeMessage = "INCORRECT";
        this.player.disableBody();
        createMessage(this, wrongCodeMessage);
        nextSceneFunc(this, "MainScene");
      }

      text2.destroy();
    });
  }
}

export default Laboratory;
