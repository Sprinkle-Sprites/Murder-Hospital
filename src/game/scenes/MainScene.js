import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import MainTimer from "@/game/scenes/MainTimer";
import rollDie from "../Dice";

class MainScene extends Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    Player.preload(this);
  }

  //helper function to resize layers to fit the play area
  resizeMapLayer(layer) {
    layer.displayWidth = this.sys.canvas.width;
    layer.displayHeight = this.sys.canvas.height;
  }

  create() {
    this.cameras.main.fadeIn(250, 0, 0, 0);
    this.createMap();
    this.createPlayer();
  }

  resizeCollider(obj, num) {
    obj.body.setSize(obj.width - num, obj.height - num, true);
  }

  createMap() {
    const map = this.make.tilemap({ key: "board" });
    const tileset = map.addTilesetImage(
      "Interior-Hospital-A",
      "Interior-A",
      16,
      16,
      0,
      0
    );

    const floorTileset = map.addTilesetImage(
      "Laboratory-2",
      "floor",
      16,
      16,
      0,
      0
    );

    const waiting_Room = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );
    const icu = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );

    const patient_Room = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );

    const surgery = map.addTilesetImage(
      "Interior-Hospital-Alt",
      "Interior-Alt",
      16,
      16,
      0,
      0
    );

    const morgue = map.addTilesetImage(
      "Interior-Hospital-Alt",
      "Interior-Alt",
      16,
      16,
      0,
      0
    );

    const xRay = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );

    const lab = map.addTilesetImage("Laboratory-3", "Lab-3", 16, 16, 0, 0);

    const lockers = map.addTilesetImage(
      "Locker Room",
      "lockerRoom",
      16,
      16,
      0,
      0
    );

    const blood = map.addTilesetImage(
      "Interior-Hospital-Alt",
      "Interior-Alt",
      16,
      16,
      0,
      0
    );

    const pharmacy = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );

    //create layers
    const floorLayer = map.createLayer("Ground", floorTileset);
    const wallsLayer = map.createLayer("WallsLayer", tileset);
    const waitingRoom = map.createLayer("Waiting Room", waiting_Room);
    const icuRoom = map.createLayer("ICU", icu);
    const patientRoom = map.createLayer("Patient's Room", patient_Room);
    const surgeryRoom = map.createLayer("Surgery", surgery);
    const labRoom = map.createLayer("Laboratory", lab);
    const morgueRoom = map.createLayer("Morgue", morgue);
    const xRayRoom = map.createLayer("X-ray", xRay);
    const lockerRoom = map.createLayer("Locker Room", lockers);
    const bloodSplatter = map.createLayer("Blood", blood);
    const pharmacyRoom = map.createLayer("Pharmacy", pharmacy);
    this.player = this.createPlayer();

    this.add.text(70, 120, "ICU", { fontFamily: "Helvetica", color: "black" });
    this.add.text(240, 120, "Locker Room", {
      fontFamily: "Helvetica",
      color: "black",
    });
    this.add.text(450, 120, "Patients Room", {
      fontFamily: "Helvetica",
      color: "black",
    });
    this.add.text(685, 220, "Surgery", {
      fontFamily: "Helvetica",
      color: "black",
    });
    this.add.text(675, 400, "Laboratory", {
      fontFamily: "Helvetica",
      color: "black",
    });
    this.add.text(475, 530, "Pharmacy", {
      fontFamily: "Helvetica",
      color: "black",
    });
    this.add.text(200, 530, "Morgue", {
      fontFamily: "Helvetica",
      color: "black",
    });
    this.add.text(70, 275, "X-Ray", {
      fontFamily: "Helvetica",
      color: "black",
    });
    this.add.text(360, 325, "Waiting Room", {
      fontFamily: "Helvetica",
      color: "black",
    });

    //resize
    this.resizeMapLayer(floorLayer);
    this.resizeMapLayer(wallsLayer);
    this.resizeMapLayer(waitingRoom);
    this.resizeMapLayer(icuRoom);
    this.resizeMapLayer(patientRoom);
    this.resizeMapLayer(surgeryRoom);
    this.resizeMapLayer(labRoom);
    this.resizeMapLayer(morgueRoom);
    this.resizeMapLayer(xRayRoom);
    this.resizeMapLayer(lockerRoom);
    this.resizeMapLayer(bloodSplatter);
    this.resizeMapLayer(pharmacyRoom);

    //LAYER COLLIDERS
    wallsLayer.setCollisionByProperty({ collides: true });

    //count down timer
    const timerLabel = this.add.text(620, 35, "60", { fontSize: 20, backgroundColor:"black", padding: 10});
    this.mainTimer = new MainTimer(this, timerLabel);
    this.mainTimer.start(this.handleCountdownFinished.bind(this));

    //set colliders
    this.physics.add.collider(this.player, wallsLayer);
    // collider debuger
    // const debugGraphics = this.add.graphics().setAlpha(0.7);

    // wallsLayer.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });
  } //end of createMap

  handleCountdownFinished() {
    this.player.active = false;

    const { width, height } = this.scale;
    this.add
      .text(width * 0.5, height * 0.5, "You've been captured", {
        fontSize: 30,
      })
      .setOrigin(0.5);
  }

  createPlayer() {
    const player = this.physics.add.existing(
      new Player(this, 350, 250, "player1")
    );

    //scalling player's height and width
    player.displayHeight = 15;
    player.displayWidth = 15;

    this.time.addEvent({
      delay: 100,
      callback: () => this.resizeCollider(player, 20),
      callbackScope: this,
      loop: false,
    });

    return player;
  }

  update() {
    this.player.update();
    this.mainTimer.update();
  }
}

export default MainScene;
