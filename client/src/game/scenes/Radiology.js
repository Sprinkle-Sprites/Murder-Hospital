import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import combination_code from "@/game/assets/popups/locker_combo.png";

import RoomTimer from "@/game/scenes/RoomTimer";
// import MainTimerScene from "@/game/scenes/MainTimerScene";

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

    //POP UP
    this.load.image("pop-up-image", combination_code);
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createSwitch();
    this.createXrayBoards();
    this.createColliders();
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
    const floorLayer = map.createLayer("floor", InteriorB).setDepth(-1);
    const borderLayer = map.createLayer("border", InteriorA).setDepth(-1);
    const wallLayer = map.createLayer("wall", InteriorA).setDepth(-1);
    const detailsLayer = map.createLayer("details", InteriorC).setDepth(-1);
    const detailsAltLayer = map
      .createLayer("details alt", InteriorAlt)
      .setDepth(-1);
    const wallLayer2 = map.createLayer("wall 2", InteriorC).setDepth(-1);
    const wallLayer2Alt = map
      .createLayer("wall 2 alt", InteriorAlt)
      .setDepth(-1);
    const wallLayer2Lab = map.createLayer("wall 2 lab", Lab3).setDepth(-1);
    const bedsLayer = map.createLayer("beds", Lab3).setDepth(-1);
    const bedsLayerAlt = map.createLayer("beds alt", InteriorAlt).setDepth(-1);
    const detailsLayer2 = map
      .createLayer("details 2", InteriorAlt)
      .setDepth(-1);

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

    //COUNTDOWN TIMER
    const roomTimerLabel = this.add.text(10, 610, "", { fontSize: 20, backgroundColor:"black", padding: 5});
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

  createSwitch() {
    this.switch1 = this.physics.add
      .sprite(190, 30, "lightSwitch 1")
      .setOrigin(0, 0)
      .setDepth(-2);

    this.switch2 = this.physics.add
      .sprite(650, 30, "lightSwitch 2")
      .setOrigin(0, 0)
      .setDepth(-2);

    this.switch3 = this.physics.add
      .sprite(220, 305, "lightSwitch 3")
      .setOrigin(0, 0)
      .setDepth(-2);

    this.switch4 = this.physics.add
      .sprite(670, 305, "lightSwitch 4")
      .setOrigin(0, 0)
      .setDepth(-2);

    //SCALES COLLIDERS ON LIGHTSWITCHES TO APPROPRIATE SIZE
    const switches = [this.switch1, this.switch2, this.switch3, this.switch4];
    for (let i = 0; i < switches.length; i++) {
      resizeCollider(switches[i], 20, 20);
    }
  }

  createXrayBoards() {
    this.xray1 = this.physics.add
      .sprite(695, 22, "Xray 1")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(50, 25, true);

    this.xray2 = this.physics.add
      .sprite(612, 300, "Xray 2")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(50, 25, true);

    this.xray3 = this.physics.add
      .sprite(173, 300, "Xray 3")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(50, 25, true);
  }

  createColliders() {
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
  }

  onSwitchCollision() {
    const lightSwitchMessage =
      "Oh man, where'd the lights go? You've lost 5 minutes";

    this.player.disableBody();
    createMessage(this, lightSwitchMessage);
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
}

export default Radiology;
