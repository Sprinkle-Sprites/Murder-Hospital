import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import pillsPop from "@/game/assets/popups/pills.jpeg";
import keyPop from "@/game/assets/popups/key.png";
import bandagesPop from "@/game/assets/popups/bandages.png";

import RoomTimer from "@/game/scenes/RoomTimer";

class Pharmacy extends Scene {
  constructor() {
    super({ key: "pharmacy" });
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
    this.load.image("pills popup", pillsPop);
    this.load.image("key popup", keyPop);
    this.load.image("bandages popup", bandagesPop);
    // this.load.image("soap", bar_of_soap);
    // this.load.image("scapel", scapel)
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createPills();
    this.createCabinet();
    this.createLockBox();
    this.createCabinet2();
    // this.createCannister();
    // this.createSink();
    // this.createTable();
    this.createColliders();
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
    const floorLayer = map.createLayer("Floor", lab2).setDepth(-1);
    const wallLayer = map.createLayer("Walls", InteriorA).setDepth(-1);
    const pharmacyThings = map
      .createLayer("Pharmacy Things", InteriorC)
      .setDepth(-1);
    const pharmacyThings2 = map
      .createLayer("Pharmacy Things 2", lab3)
      .setDepth(-1);
    const pharmacyThings3 = map
      .createLayer("Pharmacy Things 3", InteriorAlt)
      .setDepth(-1);
    const pharmacyThings4 = map
      .createLayer("Pharmacy Things 4", pharm4)
      .setDepth(-1);
    const blood = map.createLayer("Blood", InteriorAlt).setDepth(-1);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [
      floorLayer,
      wallLayer,
      pharmacyThings,
      pharmacyThings2,
      pharmacyThings3,
      pharmacyThings4,
      blood,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
    }

    //LAYER COLLIDERS
    wallLayer.setCollisionByProperty({ collides: true });
    pharmacyThings.setCollisionByProperty({ collides: true });
    pharmacyThings2.setCollisionByProperty({ collides: true });
    pharmacyThings3.setCollisionByProperty({ collides: true });
    pharmacyThings4.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, wallLayer);
    this.physics.add.collider(this.player, pharmacyThings);
    this.physics.add.collider(this.player, pharmacyThings2);
    this.physics.add.collider(this.player, pharmacyThings3);
    this.physics.add.collider(this.player, pharmacyThings4);

    //COUNTDOWN TIMER
    const roomTimerLabel = this.add.text(10, 610, "", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 5,
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
  // createCannister() {
  //   this.cannister1 = this.physics.add
  //     .sprite(50, 72, "gasCannister1")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(22, 32, true);

  //   this.cannister2 = this.physics.add
  //     .sprite(740, 195, "gasCannister2")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(22, 30, true);

  //   this.cannister3 = this.physics.add
  //     .sprite(330, 395, "gasCannister3")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(22, 30, true);
  // }

  // createSink() {
  //   this.sink1 = this.physics.add
  //     .sprite(45, 160, "sink1")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(45, 83, true);

  //   this.sink2 = this.physics.add
  //     .sprite(260, 130, "sink2")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(30, 94, true);

  //   this.sink3 = this.physics.add
  //     .sprite(165, 535, "sink3")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(103, 40, true);

  //   this.sink4 = this.physics.add
  //     .sprite(740, 130, "sink4")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(41, 29, true);

  //   this.sink5 = this.physics.add
  //     .sprite(740, 460, "sink5")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(41, 29, true);
  // }

  // createTable() {
  //   this.table1 = this.physics.add
  //     .sprite(400, 188, "table1")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(30, 30, true);

  //   this.table2 = this.physics.add
  //     .sprite(620, 114, "table2")
  //     .setOrigin(0, 0)
  //     .setDepth(-2)
  //     .setSize(30, 30, true);
  // }

  createColliders() {
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
    const pillsPopUp = this.add.image(400, 300, "pills popup");
    pillsPopUp.setScale(0.75, 0.75);
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => pillsPopUp.destroy(),
      loop: false,
    });
    nextSceneFunc(this, "MainScene");
  }

  onCabinetCollision() {
    const keyPopUp = this.add.image(400, 300, "key popup");
    keyPopUp.setScale(0.25, 0.25);
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => keyPop.destroy(),
      loop: false,
    });
    nextSceneFunc(this, "MainScene");
  }

  onLockBoxCollision() {
    console.log("need entry for combonation lock");
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => keyPop.destroy(),
      loop: false,
    });
    nextSceneFunc(this, "MainScene");
  }

  onCabinet2Collision() {
    const bandagesPopUp = this.add.image(400, 300, "bandages popup");
    // bandagesPopUp.setScale(0.25, 0.25);
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => bandagesPopUp.destroy(),
      loop: false,
    });
    nextSceneFunc(this, "MainScene");
  }

  // onCannisterCollision() {
  //   const cannisterMessage = "Huh, it's a gas cannister. It's heavy.";
  //   this.player.disableBody();
  //   createMessage(this, cannisterMessage);
  //   nextSceneFunc(this, "MainScene");
  // }

  // onSinkCollision() {
  //   const popUp = this.add.image(400, 300, "soap").setScale(0.5, 0.5);
  //   this.player.disableBody();
  //   this.time.addEvent({
  //     delay: 4750,
  //     callback: () => popUp.destroy(),
  //     loop: false,
  //   });
  //   nextSceneFunc(this, "MainScene");
  // }

  // onTableCollision() {
  //   const popUp = this.add.image(400, 300, "scapel").setScale(0.5, 0.5);
  //   this.player.disableBody();
  //   this.time.addEvent({
  //     delay: 4750,
  //     callback: () => popUp.destroy(),
  //     loop: false,
  //   });
  //   nextSceneFunc(this, "MainScene");
  // }

  update() {
    this.player.update();
    this.roomTimer.update();
  }
}

export default Pharmacy;
