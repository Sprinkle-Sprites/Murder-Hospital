import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  nextSceneFunc,
  createMessage,
} from "@/game/HelperFunctions";

import eventsCenter from "@/game/eventsCenter";
import collider from "@/game/assets/collider.png";
import calendar_date from "@/game/assets/popups/calendar_date.png";
import test_tube from "@/game/assets/popups/test_tube.jpeg";
import specimen_flask from "@/game/assets/popups/specimen_flask.png";

import RoomTimer from "@/game/scenes/RoomTimer";

class Laboratory extends Scene {
  constructor() {
    super({ key: "Laboratory" });
  }

  preload() {
    Player.preload(this);

    //Calendar
    this.load.image("calendar", collider);

    //computer
    this.load.image("computer", collider);

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
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createCalendar();
    this.createSkeleton();
    this.createTestTube();
    this.createSpecimenFlask();
    this.createCandyBar();
    this.createColliders();
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
    const floorLayer = map.createLayer("floors", InteriorB).setDepth(-2);
    const wallLayer = map.createLayer("Walls", InteriorA).setDepth(-2);
    const blood = map.createLayer("Blood", InteriorAlt).setDepth(-2);

    const computer = map.createLayer("Computer", Lab_Office).setDepth(-1);
    const labOffice = map.createLayer("Lab Office", Lab_Office).setDepth(-2);
    const labStuff = map.createLayer("Lab Stuff", Lab3).setDepth(-2);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [
      floorLayer,
      wallLayer,
      blood,
      computer,
      labOffice,
      labStuff,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
    }

    //LAYER COLLIDERS
    wallLayer.setCollisionByProperty({ collides: true });
    blood.setCollisionByProperty({ collides: true });
    computer.setCollisionByProperty({ collides: true });
    labOffice.setCollisionByProperty({ collides: true });
    labStuff.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, blood);
    this.physics.add.collider(this.player, wallLayer);
    this.physics.add.collider(this.player, computer);
    this.physics.add.collider(this.player, labOffice);
    this.physics.add.collider(this.player, labStuff);

    //COUNTDOWN TIMER
    const roomTimerLabel = this.add.text(100, 35, "", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 10,
    });
    this.roomTimer = new RoomTimer(this, roomTimerLabel);
    this.roomTimer.start(this.handleRoomCountdownFinished.bind(this));
  }

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

  createColliders() {
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
      "Here's a snack on the surgical tray. You eat it. Are you crazy? Don't eat weird snakcs from evil doctors. You have to recover for a turn.";
    this.player.disableBody();
    createMessage(this, candyBarMessage);
    nextSceneFunc(this, "MainScene");
  }
}

export default Laboratory;