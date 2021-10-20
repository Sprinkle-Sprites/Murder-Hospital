import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
  handleRoomCountdownFinished,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import RoomTimer from "@/game/scenes/RoomTimer";

class Radiology extends Scene {
  constructor() {
    super({ key: "Radiology" });
  }

  preload() {
    Player.preload(this);

    //LIGHTSWITCHES
    this.load.image("lightSwitch 1", collider);
    this.load.image("lightSwitch 2", collider);
    this.load.image("lightSwitch 3", collider);
    this.load.image("lightSwitch 4", collider);

    //XRAY BOARDS
    this.load.image("Xray 1", collider);
    this.load.image("Xray 2", collider);
    this.load.image("Xray 3", collider);

    //XRAY MACHINES
    this.load.image("Xray Machine 1");
    this.load.image("Xray Machine 2");
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createSwitch();
    this.createXrayBoards();
    this.createXrayMachines();
    this.createColliders();
    this.createTimer();
  }

  update() {
    this.player.update();
    this.roomTimer.update();
  }

  createMap() {
    const map = this.make.tilemap({ key: "radiology" });
    const InteriorA = map.addTilesetImage(
      "Interior-Hospital-1a",
      "Interior-A",
      16,
      16,
      0,
      0
    );

    const InteriorB = map.addTilesetImage(
      "Interior-Hospital-1b",
      "Interior-B",
      16,
      16,
      0,
      0
    );

    const InteriorC = map.addTilesetImage(
      "Interior-Hospital-1c",
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

    //LAYERS
    const floorLayer = map.createLayer("floor", InteriorB);
    const borderLayer = map.createLayer("border", InteriorA);
    const wallLayer = map.createLayer("wall", InteriorA);
    const detailsLayer = map.createLayer("details", InteriorC);
    const detailsAltLayer = map.createLayer("details alt", InteriorAlt);
    const wallLayer2 = map.createLayer("wall 2", InteriorC);
    const wallLayer2Alt = map.createLayer("wall 2 alt", InteriorAlt);
    const wallLayer2Lab = map.createLayer("wall 2 lab", Lab3);
    const bedsLayer = map.createLayer("beds", Lab3);
    const bedsLayerAlt = map.createLayer("beds alt", InteriorAlt);
    const detailsLayer2 = map.createLayer("details 2", InteriorAlt);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [
      floorLayer,
      borderLayer,
      wallLayer,
      detailsLayer,
      detailsAltLayer,
      wallLayer2,
      wallLayer2Alt,
      wallLayer2Lab,
      bedsLayer,
      bedsLayerAlt,
      detailsLayer2,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
      layers[i].setDepth(-1);
    }

    //LAYER COLLIDERS
    borderLayer.setCollisionByProperty({ collides: true });
    wallLayer.setCollisionByProperty({ collides: true });
    wallLayer2Lab.setCollisionByProperty({ collides: true });
    bedsLayer.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, borderLayer);
    this.physics.add.collider(this.player, wallLayer);
    this.physics.add.collider(this.player, wallLayer2Lab);
    this.physics.add.collider(this.player, bedsLayer);
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

  createTimer() {
    const roomTimerLabel = this.add.text(10, 610, "", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 5,
    });

    this.roomTimer = new RoomTimer(this, roomTimerLabel);
    this.roomTimer.start(handleRoomCountdownFinished.bind(this));
  }

  createSwitch() {
    this.switch1 = this.physics.add
      .sprite(205, 45, "lightSwitch 1")
      .setDepth(-2)
      .setSize(10, 10);

    this.switch2 = this.physics.add
      .sprite(665, 45, "lightSwitch 2")
      .setDepth(-2)
      .setSize(10, 10);

    this.switch3 = this.physics.add
      .sprite(235, 323, "lightSwitch 3")
      .setDepth(-2)
      .setSize(10, 10);

    this.switch4 = this.physics.add
      .sprite(685, 323, "lightSwitch 4")
      .setDepth(-2)
      .setSize(10, 10);
  }

  createXrayBoards() {
    this.xray1 = this.physics.add
      .sprite(710, 37, "Xray 1")
      .setDepth(-2)
      .setSize(50, 25);

    this.xray2 = this.physics.add
      .sprite(627, 315, "Xray 2")
      .setDepth(-2)
      .setSize(50, 25);

    this.xray3 = this.physics.add
      .sprite(188, 315, "Xray 3")
      .setDepth(-2)
      .setSize(50, 25);
  }

  createXrayMachines() {
    this.xrayMachine1 = this.physics.add
      .sprite(325, 440, "Xray Machine 1")
      .setDepth(-2)
      .setSize(60, 25);

    this.xrayMachine2 = this.physics.add
      .sprite(475, 43, "Xray Machine 2")
      .setDepth(-2)
      .setSize(60, 25);
  }

  createColliders() {
    //PLAYER AND SWITCH COLLIDERS
    this.physics.add.overlap(
      this.player,
      this.switch1,
      this.onSwitchCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.switch2,
      this.onSwitchCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.switch3,
      this.onSwitchCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.switch4,
      this.onSwitchCollision,
      null,
      this
    );

    //PLAYER AND XRAY COLLIDERS
    this.physics.add.overlap(
      this.player,
      this.xray1,
      this.onXrayCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.xray2,
      this.onXrayCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.xray3,
      this.onXrayCollision,
      null,
      this
    );

    //PLAYER AND XRAY MACHINE COLLIDERS
    this.physics.add.overlap(
      this.player,
      this.xrayMachine1,
      this.onXrayMachineCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.xrayMachine2,
      this.onXrayMachineCollision,
      null,
      this
    );
  }

  onSwitchCollision() {
    const lightSwitchMessage =
      "Oh man, where'd the lights go? You've lost 5 minutes";

    this.player.disableBody();
    createMessage(this, lightSwitchMessage);
    // this.mainTimer.minusFive();
    nextSceneFunc(this, "MainScene");
  }

  onXrayCollision() {
    const popUp = this.add.image(400, 300, "pop-up-image");
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => popUp.destroy(),
      loop: false,
    });

    nextSceneFunc(this, "MainScene");
  }

  onXrayMachineCollision() {
    const machineMessage = "Machine doesnt seem to work... Oh, well.";
    this.player.disableBody();
    createMessage(this, machineMessage);
    nextSceneFunc(this, "MainScene");
  }
}

export default Radiology;
