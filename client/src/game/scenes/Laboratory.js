import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  nextSceneFunc,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import calendar_date from "@/game/assets/popups/calendar_date.png";

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
    this.load.image("testTubes", collider);

    //Specimen container
    this.load.image("specimenContainer", collider);

    //Pop UP
    this.load.image("cal pop-up", calendar_date);
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createCalendar();
    // this.createXrayBoards();
    // this.createColliders();
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

    //COLLIDER DEBUG COLOR
    // const debugGraphics = this.add.graphics().setAlpha(0.7);
    // borderLayer.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    // });
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

  //pickup here
  createCalendar() {
    this.calendar = this.physics.add
      .sprite(450, 60, "calendar")
      .setOrigin(0, 0)
      .setDepth(-2);
  }

  //   this.switch2 = this.physics.add
  //     .sprite(650, 30, "lightSwitch 2")
  //     .setOrigin(0, 0)
  //     .setDepth(-2);

  //   this.switch3 = this.physics.add
  //     .sprite(220, 305, "lightSwitch 3")
  //     .setOrigin(0, 0)
  //     .setDepth(-2);

  //   this.switch4 = this.physics.add
  //     .sprite(670, 305, "lightSwitch 4")
  //     .setOrigin(0, 0)
  //     .setDepth(-2);

  //   //SCALES COLLIDERS ON LIGHTSWITCHES TO APPROPRIATE SIZE
  //   const switches = [this.switch1, this.switch2, this.switch3, this.switch4];
  //   for (let i = 0; i < switches.length; i++) {
  //     resizeCollider(switches[i], 20, 20);
  //   }
  // }

  // createXrayBoards() {
  //   this.xray1 = this.physics.add
  //     .sprite(695, 22, "Xray 1")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(50, 25, true);

  //   this.xray2 = this.physics.add
  //     .sprite(612, 300, "Xray 2")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(50, 25, true);

  //   this.xray3 = this.physics.add
  //     .sprite(173, 300, "Xray 3")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(50, 25, true);
  // }

  createColliders() {
    this.physics.add.overlap(
      this.player,
      this.calendar,
      this.onSwitchCollision,
      null,
      this
    );
  }

  //   this.physics.add.overlap(
  //     this.player,
  //     this.switch2,
  //     this.onSwitchCollision,
  //     null,
  //     this
  //   );

  //   this.physics.add.overlap(
  //     this.player,
  //     this.switch3,
  //     this.onSwitchCollision,
  //     null,
  //     this
  //   );

  //   this.physics.add.overlap(
  //     this.player,
  //     this.switch4,
  //     this.onSwitchCollision,
  //     null,
  //     this
  //   );

  //   this.physics.add.overlap(
  //     this.player,
  //     this.xray1,
  //     this.onXrayCollision,
  //     null,
  //     this
  //   );

  //   this.physics.add.overlap(
  //     this.player,
  //     this.xray2,
  //     this.onXrayCollision,
  //     null,
  //     this
  //   );

  //   this.physics.add.overlap(
  //     this.player,
  //     this.xray3,
  //     this.onXrayCollision,
  //     null,
  //     this
  //   );
  // }

  onCalendarCollision() {
    const calPopUp = this.add.image(400, 300, "cal pop-up");

    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => calPopUp.destroy(),
      loop: false,
    });
    nextSceneFunc(this, "MainScene");
  }

  // onXrayCollision() {
  //   const popUp = this.add.image(400, 300, "pop-up-image");
  //   this.player.disableBody();
  //   this.time.addEvent({
  //     delay: 4750,
  //     callback: () => popUp.destroy(),
  //     loop: false,
  //   });
  //   nextSceneFunc(this, "MainScene");
  // }
}

export default Laboratory;
