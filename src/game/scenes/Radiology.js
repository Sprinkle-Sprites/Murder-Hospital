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
import combination_code from "@/game/assets/popups/locker_combo.png";
import eventsCenter from "@/game/eventsCenter";
import eventEmitter from "../eventEmitter";

class Radiology extends Scene {
  constructor() {
    super({ key: "Radiology" });
    this.collectedClues = [];
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

    //POP UP
    this.load.image("comboCode", combination_code);
  }

  create() {
    this.createTitle();
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

  completed() {
    if (this.collectedClues.length === 3)
      //send a message to dice to lower prob of the radiology (dice # 3) being rolled
      eventEmitter.emit("completed", 3);
  }

  createTitle() {
    this.add.text(360, 605, "X-RAY ROOM", {
      fontFamily: "GypsyCurse",
      fontSize: 30,
      color: "red",
    });
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
    this.floorLayer = map.createLayer("floor", InteriorB);
    this.borderLayer = map.createLayer("border", InteriorA);
    this.wallLayer = map.createLayer("wall", InteriorA);
    this.detailsLayer = map.createLayer("details", InteriorC);
    this.detailsAltLayer = map.createLayer("details alt", InteriorAlt);
    this.wallLayer2 = map.createLayer("wall 2", InteriorC);
    this.wallLayer2Alt = map.createLayer("wall 2 alt", InteriorAlt);
    this.wallLayer2Lab = map.createLayer("wall 2 lab", Lab3);
    this.bedsLayer = map.createLayer("beds", Lab3);
    this.bedsLayerAlt = map.createLayer("beds alt", InteriorAlt);
    this.detailsLayer2 = map.createLayer("details 2", InteriorAlt);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [
      this.floorLayer,
      this.borderLayer,
      this.wallLayer,
      this.detailsLayer,
      this.detailsAltLayer,
      this.wallLayer2,
      this.wallLayer2Alt,
      this.wallLayer2Lab,
      this.bedsLayer,
      this.bedsLayerAlt,
      this.detailsLayer2,
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

  createTimer() {
    const roomTimerLabel = this.add.text(10, 610, "", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 5,
    });

    this.roomTimer = new RoomTimer(this, roomTimerLabel);
    this.roomTimer.start(handleRoomCountdownFinished.bind(this));

    this.mainTimer = this.scene.get("MainTimerScene").mainTimer;
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
    //LAYER COLLIDERS
    this.borderLayer.setCollisionByProperty({ collides: true });
    this.wallLayer.setCollisionByProperty({ collides: true });
    this.wallLayer2Lab.setCollisionByProperty({ collides: true });
    this.bedsLayer.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, this.borderLayer);
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.collider(this.player, this.wallLayer2Lab);
    this.physics.add.collider(this.player, this.bedsLayer);

    //PLAYER AND SWITCH COLLIDERS
    this.physics.add.overlap(
      this.player,
      this.switch1,
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

    //PLAYER AND XRAY MACHINE COLLIDERS
    this.physics.add.overlap(
      this.player,
      this.xrayMachine1,
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
    this.mainTimer.minusFive();

    if (!this.collectedClues.includes("switch")) {
      this.collectedClues.push("switch");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onXrayCollision() {
    const popUp = this.add.image(400, 300, "comboCode");
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => popUp.destroy(),
      loop: false,
    });

    eventsCenter.emit("update-bank", "comboCode");

    if (!this.collectedClues.includes("comboCode")) {
      this.collectedClues.push("comboCode");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onXrayMachineCollision() {
    const machineMessage = "Machine doesnt seem to work... Oh, well.";
    this.player.disableBody();
    createMessage(this, machineMessage);

    if (!this.collectedClues.includes("machine")) {
      this.collectedClues.push("machine");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }
}

export default Radiology;
