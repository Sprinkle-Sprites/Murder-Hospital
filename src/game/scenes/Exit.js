import Phaser, { Scene } from "phaser";
import eventsCenter from "@/game/eventsCenter";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";

class Exit extends Scene {
  constructor() {
    super({ key: "Exit" });
    this.combination = 0;
  }

  preload() {
    Player.preload(this);

    //exit panel
    this.load.image("panel", collider);

    //REMOVES CONTAINER CLASS TO HIDE DIE/BUTTONS AND ADDS HIDE CLASS
    document.getElementById("die").classList.remove("container");
    document.getElementById("die").classList.add("hide");
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createPanel();
    this.createColliders();
  }

  createMap() {
    const map = this.make.tilemap({ key: "exit" });
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
    const floorLayer = map.createLayer("exitFloors", InteriorB).setDepth(-1);
    const wallLayer = map.createLayer("exitWalls", InteriorA).setDepth(-1);
    const backgroundLayer = map
      .createLayer("exitBackground", InteriorAlt)
      .setDepth(-1);
    const detailsCLayer = map
      .createLayer("exitDetailsC", InteriorC)
      .setDepth(-1);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [floorLayer, wallLayer, backgroundLayer, detailsCLayer];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
    }

    //LAYER COLLIDERS
    wallLayer.setCollisionByProperty({ collides: true });
    detailsCLayer.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, wallLayer);
    this.physics.add.collider(this.player, detailsCLayer);

    // //COLLIDER DEBUG COLOR
    // const debugGraphics = this.add.graphics().setAlpha(0.7);
    // detailsAltLayer.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    // });
  }

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 380, 520, "player1")
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

  createPanel() {
    this.panel = this.physics.add
      .sprite(410, 10, "panel")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(25, 15, true);
  }

  createColliders() {
    this.physics.add.overlap(
      this.player,
      this.panel,
      this.onPanelCollision,
      null,
      this
    );
  }

  onPanelCollision() {
    const text1 = this.add
      .text(
        400,
        300,
        "Are you really sure you want to go? Better know the code.",
        {
          fixedWidth: 700,
          fixedHeight: 50,
          backgroundColor: "black",
          align: "center",
          wordWrap: { width: 300, useAdvancedWrap: true },
        }
      )
      .setOrigin(0.5, 0.5);

    const text2 = this.add
      .text(400, 370, "", {
        fixedWidth: 300,
        fixedHeight: 40,
        backgroundColor: "black",
        align: "center",
        wordWrap: { width: 300, useAdvancedWrap: true },
      })
      .setOrigin(0.5, 0.5);

    text2.setInteractive().on("pointerdown", () => {
      this.rexUI.edit(text2);
    });

    const enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    enter.on("down", () => {
      this.combination = parseInt(text2._text);
      text1.destroy();
      if (this.combination === 428395) {
        const width = this.sys.canvas.width;
        const height = this.sys.canvas.height;
        this.player.disableBody();
        //CURRENTLY SENDS A MESSAGE, NEEDS TO GO TO VICTORY SCENE
        this.add
          .text(
            width * 0.5,
            height * 0.5,
            "Holy crap, the door actually opened. You did it! Get the *#!% outta here!",
            {
              fontSize: 30,
              backgroundColor: "#4c517d",
              wordWrap: { width: 300, useAdvancedWrap: true },
              strokeThickness: 1,
              stroke: "#fdcd83",
              align: "center",
              fixedWidth: width,
              fixedHeight: height,
            }
          )
          .setOrigin(0.5, 0.5);
      }
      if (this.combination !== 428395 && !isNaN(this.combination)) {
        const wrongCodeMessage = "Whoops. That ain't it!";
        this.player.disableBody();
        createMessage(this, wrongCodeMessage);
        nextSceneFunc(this, "MainScene");
        //THIS CURRENT SET UP ALLOWS FOR UNLIMITED TRIES. WHILE THIS IS AN OPTION, WE SHOULD TRY TO FIGURE OUT HOW TO LIMIT.
      }
      text2.destroy();
    });
  }

  update() {
    this.player.update();
  }
}

export default Exit;
