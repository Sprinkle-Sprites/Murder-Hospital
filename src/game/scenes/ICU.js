import { Scene } from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
  handleRoomCountdownFinished,
  changeDieFunc,
  onZoneCollision,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import RoomTimer from "@/game/scenes/RoomTimer";
import eventsCenter from "@/game/eventsCenter";
import eventEmitter from "../eventEmitter";

import poster from "@/game/assets/popups/hang-in-there-blood.png";
import ivBag from "@/game/assets/popups/iv-bag.png";

//AUDIO
import bloodSlip from "@/game/assets/audio/action-squelch03.wav";
import IVBloodBag from "@/game/assets/audio/object-plasticbag02.wav";
import monitorSound from "@/game/assets/audio/action-lighton01.wav";
import posterCrumble from "@/game/assets/audio/object-paperbagcrunch04.wav";

class ICU extends Scene {
  constructor() {
    super({ key: "ICU" });
    this.collectedClues = [];
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

    //AUDIO
    this.load.audio("blood", bloodSlip);
    this.load.audio("IVBag", IVBloodBag);
    this.load.audio("monitor", monitorSound);
    this.load.audio("poster", posterCrumble);

    //REMOVES CONTAINER CLASS TO HIDE DIE/BUTTONS AND ADDS HIDE CLASS
    changeDieFunc(this.scene);
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
    this.createSounds();
  }

  update() {
    this.player.update();
    this.roomTimer.update();

    //MOVES PLAYER ZONE WITH PLAYER
    this.zone.x = this.player.x;
    this.zone.y = this.player.y;
  }

  completed() {
    if (this.collectedClues.length === 4)
      //send a message to dice to lower prob of the ICU (dice # 8) being rolled
      eventEmitter.emit("completed", 8);
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

    //RADIUS
    this.zone = this.add.zone(this.x, this.y, 125, 125);
    this.physics.world.enable(this.zone);
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
      .sprite(423, 476, "Blood pool 3")
      // .setDepth(-2)
      .setSize(17, 17)
      .setScale(0.8, 0.5)
      .setVisible(false);
  }

  createIVs() {
    this.IVBag1 = this.physics.add
      .sprite(617, 55, "IV bag 1")
      .setDepth(-2)
      .setSize(15, 15)
      .setScale(0.7, 0.7);

    this.IVBag2 = this.physics.add
      .sprite(194, 542, "IV bag 2")
      // .setDepth(-2)
      .setSize(15, 15)
      .setScale(0.7, 0.7)
      .setVisible(false);
  }

  createMonitors() {
    this.monitor1 = this.physics.add
      .sprite(125, 63, "Monitor 1")
      // .setDepth(-2)
      .setSize(21, 25)
      .setScale(1.2, 1.3)
      .setVisible(false);

    this.monitor2 = this.physics.add
      .sprite(684, 63, "Monitor 2")
      .setDepth(-2)
      .setSize(21, 25)
      .setScale(1.2, 1.3);
  }

  createPoster() {
    this.posterC = this.physics.add
      .sprite(725, 440, "poster-collider")
      // .setDepth(-2)
      .setSize(20, 25, true)
      .setScale(1, 1.1)
      .setVisible(false);
  }

  createSounds() {
    this.slipSound = this.sound.add("blood");
    this.IVBloodBagSound = this.sound.add("IVBag");
    this.monitorTurnOnSound = this.sound.add("monitor");
    this.posterGrabSound = this.sound.add("poster");
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

    this.physics.add.overlap(
      this.player,
      this.blood3,
      this.onBloodCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.IVBag2,
      this.onIVCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.monitor1,
      this.onMonitorCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.posterC,
      this.onPosterCollision,
      null,
      this
    );

    //ZONES
    this.physics.add.overlap(
      this.zone,
      this.blood3,
      onZoneCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.zone,
      this.IVBag2,
      onZoneCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.zone,
      this.monitor1,
      onZoneCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.zone,
      this.posterC,
      onZoneCollision,
      null,
      this
    );
  }

  onBloodCollision() {
    this.player.disableBody();
    this.slipSound.play();

    const bloodMessage =
      "You slipped and fell in a pool of blood! YUCK! You Lose 5 minutes.";
    createMessage(this, bloodMessage, "center", 60, this.sys.canvas.height / 2);

    this.mainTimer.minusFive();

    if (!this.collectedClues.includes("bloodPool")) {
      this.collectedClues.push("bloodPool");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onIVCollision() {
    this.player.disableBody();
    this.IVBloodBagSound.play();

    const IVMessage =
      "Oh, hey, a bag of blood. If you lose a bunch later, maybe this will come in handy?";
    createMessage(this, IVMessage, "top", 50, this.sys.canvas.height / 2);

    setTimeout(() => {
      const popUp = this.add.image(400, 300, "IVbag").setScale(0.5, 0.5);
      this.time.addEvent({
        delay: 4750,
        callback: () => popUp.destroy(),
        loop: false,
      });
    });
    eventsCenter.emit("update-bank", "IVbag");

    if (!this.collectedClues.includes("ivBag")) {
      this.collectedClues.push("ivBag");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onMonitorCollision() {
    this.player.disableBody();
    this.monitorTurnOnSound.play();

    const monitorMessage = "How is this monitor supposed to help you?";
    createMessage(
      this,
      monitorMessage,
      "center",
      75,
      this.sys.canvas.height / 2
    );

    if (!this.collectedClues.includes("monitor")) {
      this.collectedClues.push("monitor");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onPosterCollision() {
    this.player.disableBody();
    this.posterGrabSound.play();

    const popUp = this.add.image(400, 300, "poster").setScale(0.5, 0.5);
    eventsCenter.emit("update-bank", "poster");
    this.time.addEvent({
      delay: 4750,
      callback: () => popUp.destroy(),
      loop: false,
    });

    if (!this.collectedClues.includes("poster")) {
      this.collectedClues.push("poster");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }
}

export default ICU;
