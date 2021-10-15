import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import bar_of_soap from "@/game/assets/popups/bar_of_soap.png"
import rubber_glove from "@/game/assets/popups/rubber_glove.png"

import RoomTimer from "@/game/scenes/RoomTimer";

export default class Surgery extends Scene {
  constructor() {
    super ({key: "Surgery"});
  }

  preload() {
    Player.preload(this);

    //GURNEYS
    this.load.image("gurney1", collider);
    this.load.image("gurney2", collider);
    this.load.image("gurney3", collider);

    //GAS CANNISTERS
    this.load.image("gasCannister1", collider);
    this.load.image("gasCannister2", collider);
    this.load.image("gasCannister3", collider);
    this.load.image("gasCannister4", collider);

    //SINKS
    this.load.image("sink1", collider);
    this.load.image("sink2", collider);
    this.load.image("sink3", collider);
    this.load.image("sink4", collider);
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createGurney();
    this.createCannister();
    this.createSink();
  }

  createMap() {
    const map = this.make.tilemap({ key: "surgery" });
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

    //LAYERS
    const floorLayer = map.createLayer("surgeryFloor", InteriorB).setDepth(-1);
    const wallLayer = map.createLayer("surgeryWalls", InteriorA).setDepth(-1);
    const backgroundLayer = map.createLayer("surgeryBackground", InteriorAlt).setDepth(-1);
    const detailsAltLayer = map
      .createLayer("surgeryDetailsAlt", InteriorAlt)
      .setDepth(-1);
    const detailsCLayer = map
      .createLayer("surgeryDetailsC", InteriorC)
      .setDepth(-1);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [
      floorLayer,
      wallLayer,
      backgroundLayer,
      detailsAltLayer,
      detailsCLayer,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
    }

    //LAYER COLLIDERS
    wallLayer.setCollisionByProperty({ collides: true });
    detailsAltLayer.setCollisionByProperty({ collides: true });
    detailsCLayer.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, wallLayer);
    this.physics.add.collider(this.player, detailsAltLayer);
    this.physics.add.collider(this.player, detailsCLayer);

    //COUNTDOWN TIMER
    const roomTimerLabel = this.add.text(0, 610, "", { fontSize: 20, backgroundColor:"black", padding: 5});
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
        fontSize: 30, backgroundColor: "black"
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

  createGurney() {
    this.gurney1 = this.physics.add
      .sprite(190, 30, "gurney1")
      .setOrigin(0, 0)
      .setDepth(-2);

    this.gurney2 = this.physics.add
      .sprite(490, 30, "gurney2")
      .setOrigin(0, 0)
      .setDepth(-2);

      this.gurney3 = this.physics.add
      .sprite(220, 305, "gurney3")
      .setOrigin(0, 0)
      .setDepth(-2);

     //need to scale to appropriate size here
  }

  createCannister(){
    // this.cannister1 = this.physics.add
    //   .sprite(550, 305, "gasCannister1")
    //   .setOrigin(0, 0)
    //   .setDepth(-2);

    // this.cannister2 = this.physics.add
    //   .sprite(400, 200, "gasCannister2")
    //   .setOrigin(0, 0)
    //   .setDepth(-2);

    // this.cannister3 = this.physics.add
    //   .sprite(400, 100, "gasCannister3")
    //   .setOrigin(0, 0)
    //   .setDepth(-2);

    // this.cannister4 = this.physics.add
    //   .sprite(200, 700, "gasCannister4")
    //   .setOrigin(0, 0)
    //   .setDepth(-2);

    //need to scale to appropriate size here
  }

  createSink(){
    // this.sink1 = this.physics.add
    //   .sprite(100, 200, "sink1")
    //   .setOrigin(0, 0)
    //   .setDepth(-2);

    // this.sink2 = this.physics.add
    //   .sprite(150, 250, "sink2")
    //   .setOrigin(0, 0)
    //   .setDepth(-2);

    // this.sink3 = this.physics.add
    //   .sprite(200, 300, "sink3")
    //   .setOrigin(0, 0)
    //   .setDepth(-2);

    // this.sink4 = this.physics.add
    //   .sprite(250, 350, "sink4")
    //   .setOrigin(0, 0)
    //   .setDepth(-2);

    //need to scale to appropriate size here
  }

  createColliders(){
    //where they collide
  }

  //then, on collision functions for gurney, gas cannister and sink

}
