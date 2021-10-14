import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import radiology from "@/game/assets/tiles/radiology.json";

import collider from "@/game/assets/collider.png";
import combination_code from "@/game/assets/popups/locker_combo.png";
import messageBox from "@/game/assets/popups/messageBox.png";

import RoomTimer from "@/game/scenes/RoomTimer";
import MainTimerScene from "@/game/scenes/MainTimerScene";

class Radiology extends Scene {
  constructor() {
    super({ key: "Radiology" });
    this.bool = false;
  }

  preload() {
    Player.preload(this);
    this.load.tilemapTiledJSON("radiology", radiology);

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
    this.load.image("message box", messageBox);
  }

  create() {
    this.scene.launch("MainTimerScene");
    this.createPlayer();
    this.createMap();
    this.createSwitch();
    this.createXrayBoards();
    this.createColliders();
  }



  resizeCollider(obj, num) {
    obj.body.setSize(obj.width - num, obj.height - num, true);
  }

  resizeMapLayer(layer) {
    layer.displayWidth = this.sys.canvas.width;
    layer.displayHeight = this.sys.canvas.height;
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
    this.resizeMapLayer(floorLayer);
    this.resizeMapLayer(borderLayer);
    this.resizeMapLayer(wallLayer);
    this.resizeMapLayer(detailsLayer);
    this.resizeMapLayer(detailsAltLayer);
    this.resizeMapLayer(wallLayer2);
    this.resizeMapLayer(wallLayer2Alt);
    this.resizeMapLayer(wallLayer2Lab);
    this.resizeMapLayer(bedsLayer);
    this.resizeMapLayer(bedsLayerAlt);
    this.resizeMapLayer(detailsLayer2);

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
    const roomTimerLabel = this.add.text(100, 35, "", { fontSize: 20, backgroundColor:"black", padding: 10});
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
    setTimeout(() => {
      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.launch("MainScene");
        }
      )
    }, 2000)
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
      callback: () => this.resizeCollider(this.player, 20),
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

    this.resizeCollider(this.switch1, 20);
    this.resizeCollider(this.switch2, 20);
    this.resizeCollider(this.switch3, 20);
    this.resizeCollider(this.switch4, 20);
  }

  createXrayBoards() {
    this.Xray1 = this.physics.add
      .sprite(695, 22, "Xray 1")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(50, 25, true);

    this.Xray2 = this.physics.add
      .sprite(612, 300, "Xray 2")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(50, 25, true);

    this.Xray3 = this.physics.add
      .sprite(175, 300, "Xray 3")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(50, 25, true);
  }

  createMessageBox(text) {
    const clueBox = this.add.image("messageBox", messageBox);
    const textBox = this.add.text(
      clueBox.width * 0.5,
      clueBox.height * 0.5,
      text
    );
    textBox.runWordWrap();
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
      this.Xray1,
      this.onXrayCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.Xray2,
      this.onXrayCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.Xray3,
      this.onXrayCollision,
      null,
      this
    );
  }

  onSwitchCollision() {
    console.log("LIGHTSWITCH");
    this.width = this.sys.canvas.width;
    this.height = this.sys.canvas.height;
    const text = this.add
      .text(
        this.width * 0.5,
        this.height * 0.5,
        "Oh man, where'd the lights go? You've lost 5 minutes",
        {
          fontSize: 30,
          backgroundColor: "black",
          wordWrap: { width: 300, useAdvancedWrap: true },
          strokeThickness: 5,
          stroke: "#69070c",
          padding: {
            top: this.height * 0.4,
          },
          align: "center",
          fixedWidth: this.width,
          fixedHeight: this.height,
        }
      )
      .setOrigin(0.5, 0.5);
    // setTimeout;
  }

  onXrayCollision() {
    console.log("XRAY");
    const popUp = this.add.image(400, 300, "pop-up-image");
    setTimeout(() => {
      popUp.destroy();
      this.cameras.main.fadeOut(250, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("MainScene");
        }
      );
    }, 5000);
  }
}

export default Radiology;
