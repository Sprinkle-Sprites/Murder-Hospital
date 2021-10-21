import { Scene } from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
  handleRoomCountdownFinished,
  createMessageForImage,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import RoomTimer from "@/game/scenes/RoomTimer";
import eventsCenter from "@/game/eventsCenter";

import poster from "@/game/assets/popups/hang-in-there-blood.png";
import ivBag from "@/game/assets/popups/iv-bag.png";

class ICU extends Scene {
  constructor() {
    super({ key: "ICU" });
  }

  preload() {
    Player.preload(this);

    //BLOOD COLLIDERS
    this.load.image("Blood pool 1", collider);
    this.load.image("Blood pool 2", collider);
    this.load.image("Blood pool 3", collider);
    this.load.image("Blood pool 4", collider);

    //IV BAG COLLIDERS
    this.load.image("IV bag 1", collider);
    this.load.image("IV bag 2", collider);

    //MONITOR COLLIDERS
    this.load.image("Monitor 1", collider);
    this.load.image("Monitor 2", collider);

    //POSTER COLLIDER
    this.load.image("poster-collider", collider);

    //POSTER IMAGE
    this.load.image("poster", poster);
    this.load.image("IVbag", ivBag);
  }

  create() {
    this.createTitle();
    this.createPlayer();
    this.createMap();
    this.createBlood();
    this.createIVs();
    this.createMonitors();
    this.createPoster();
    this.createColliders();
    this.createTimer();
  }

  update() {
    this.player.update();
    this.roomTimer.update();
  }

  createTitle() {
    this.add.text(385, 605, "I C U", {
      fontFamily: "GypsyCurse",
      fontSize: 30,
      color: "red",
    });
  }

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 400, 300, "player1")
    );

    //ADJUSTS PLAYER SPRITE SIZE
    this.player.displayHeight = 18;
    this.player.displayWidth = 18;

    //ADJUSTS COLLIDER TO SURROUND PLAYER
    this.time.addEvent({
      delay: 100,
      callback: () => resizeCollider(this.player, 20, 20),
      callbackScope: this,
      loop: false,
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
    const map = this.make.tilemap({ key: "ICU" });
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

    //MAP LAYERS
    this.floorLayer = map.createLayer("floor IHB", InteriorB);
    this.floorLayer2 = map.createLayer("floor 2 IHB", InteriorB);
    this.wallLayer = map.createLayer("wall IHA", InteriorA);
    this.wallLayer2 = map.createLayer("wall 2 IHC", InteriorC);
    this.borderLayer = map.createLayer("border IHA", InteriorA);
    this.detailsLayer = map.createLayer("details IHALT", InteriorAlt);
    this.bedsLayer = map.createLayer("beds IHC", InteriorC);
    this.bedsLayer2 = map.createLayer("beds 2 IHALT", InteriorAlt);
    this.furnitureLayer = map.createLayer("furniture IHC", InteriorC);
    this.furnitureLayer2 = map.createLayer("furniture IHALT", InteriorAlt);
    this.furnitureLayer3 = map.createLayer("furniture LAB3", Lab3);
    this.nurseStationLayer = map.createLayer("nurse station 3 LAB3", Lab3);
    this.nurseStationLayer2 = map.createLayer("nurse station LAB3", Lab3);
    this.nurseStationLayer3 = map.createLayer("nurse station 2 LAB3", Lab3);
    this.nurseStationLayer4 = map.createLayer("nurse station 4 IHC", InteriorC);

    //SCALE LAYERS TO SCENE SIZE AND SETS DEPTH SO PLAYER RENDERS ABOVE LAYERS
    const layers = [
      this.floorLayer,
      this.floorLayer2,
      this.wallLayer,
      this.wallLayer2,
      this.borderLayer,
      this.detailsLayer,
      this.bedsLayer,
      this.bedsLayer2,
      this.furnitureLayer,
      this.furnitureLayer2,
      this.furnitureLayer3,
      this.nurseStationLayer,
      this.nurseStationLayer2,
      this.nurseStationLayer3,
      this.nurseStationLayer4,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
      layers[i].setDepth(-1);
    }
  }

  createBlood() {
    this.blood1 = this.physics.add
      .sprite(530, 290, "Blood pool 1")
      .setDepth(-2)
      .setSize(20, 15);

    this.blood2 = this.physics.add
      .sprite(85, 490, "Blood pool 2")
      .setDepth(-2)
      .setSize(15, 10);

    this.blood3 = this.physics.add
      .sprite(420, 475, "Blood pool 3")
      .setDepth(-2)
      .setSize(15, 10);
  }

  createIVs() {
    this.IVBag1 = this.physics.add
      .sprite(617, 55, "IV bag 1")
      .setDepth(-2)
      .setSize(15, 10);

    this.IVBag2 = this.physics.add
      .sprite(193, 543, "IV bag 2")
      .setDepth(-2)
      .setSize(15, 10);
  }

  createMonitors() {
    this.monitor1 = this.physics.add
      .sprite(125, 63, "Monitor 1")
      .setDepth(-2)
      .setSize(25, 28);

    this.monitor2 = this.physics.add
      .sprite(685, 63, "Monitor 2")
      .setDepth(-2)
      .setSize(25, 28);
  }

  createPoster() {
    this.posterC = this.physics.add
      .sprite(725, 440, "poster-collider")
      .setDepth(-2)
      .setSize(20, 28, true);
  }

  createColliders() {
    //TILED LAYER COLLIDERS
    this.borderLayer.setCollisionByProperty({ collides: true });
    this.wallLayer.setCollisionByProperty({ collides: true });
    this.nurseStationLayer2.setCollisionByProperty({ collides: true });

    //PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, this.borderLayer);
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.collider(this.player, this.nurseStationLayer2);

    //PLAYER AND BLOOD COLLIDERS
    // this.physics.add.overlap(
    //   this.player,
    //   this.blood1,
    //   this.onBloodCollision,
    //   null,
    //   this
    // );

    // this.physics.add.overlap(
    //   this.player,
    //   this.blood2,
    //   this.onBloodCollision,
    //   null,
    //   this
    // );

    this.physics.add.overlap(
      this.player,
      this.blood3,
      this.onBloodCollision,
      null,
      this
    );

    //PLAYER AND IV BAG COLLIDERS
    // this.physics.add.overlap(
    //   this.player,
    //   this.IVBag1,
    //   this.onIVCollision,
    //   null,
    //   this
    // );

    this.physics.add.overlap(
      this.player,
      this.IVBag2,
      this.onIVCollision,
      null,
      this
    );

    //PLAYER AND MONITOR COLLIDERS
    this.physics.add.overlap(
      this.player,
      this.monitor1,
      this.onMonitorCollision,
      null,
      this
    );

    // this.physics.add.overlap(
    //   this.player,
    //   this.monitor2,
    //   this.onMonitorCollision,
    //   null,
    //   this
    // );

    //POSTER COLLIDER
    this.physics.add.overlap(
      this.player,
      this.posterC,
      this.onPosterCollision,
      null,
      this
    );
  }

  onBloodCollision() {
    this.player.disableBody();
    const bloodMessage =
      "You slipped and fell in a pool of blood! YUCK! You Lose 5 minutes.";
    createMessage(this, bloodMessage);
    this.mainTimer.minusFive();
    nextSceneFunc(this, "MainScene");
  }

  onIVCollision() {
    this.player.disableBody();
    const IVMessage =
      "Oh, hey, a bag of blood. If you lose a bunch later, maybe this will come in handy?";
    createMessageForImage(this, IVMessage);
    setTimeout(() => {
      const popUp = this.add.image(400, 300, "IVbag").setScale(0.5, 0.5);
      this.time.addEvent({
        delay: 4750,
        callback: () => popUp.destroy(),
        loop: false,
      });
    });
    eventsCenter.emit("update-bank", "IVbag");
    nextSceneFunc(this, "MainScene");
  }

  onMonitorCollision() {
    const monitorMessage = "How is this monitor supposed to help me?";
    this.player.disableBody();
    createMessage(this, monitorMessage);
    nextSceneFunc(this, "MainScene");
  }

  onPosterCollision() {
    const popUp = this.add.image(400, 300, "poster").setScale(0.5, 0.5);
    this.player.disableBody();
    eventsCenter.emit("update-bank", "poster");
    this.time.addEvent({
      delay: 4750,
      callback: () => popUp.destroy(),
      loop: false,
    });

    nextSceneFunc(this, "MainScene");
  }
}

export default ICU;
