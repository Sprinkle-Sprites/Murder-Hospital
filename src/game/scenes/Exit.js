import Phaser, { Scene } from "phaser";
import eventsCenter from "@/game/eventsCenter";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
  changeDieFunc,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";
import openDoor from "@/game/assets/audio/object-doorcreak03.wav";

class Exit extends Scene {
  constructor() {
    super({ key: "Exit" });
    this.combination = 0;
  }

  preload() {
    Player.preload(this);

    //exit panel
    this.load.image("panel", collider);

    this.load.audio("open door", openDoor);

    //REMOVES CONTAINER CLASS TO HIDE DIE/BUTTONS AND ADDS HIDE CLASS
    changeDieFunc(this.scene);
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createPanel();
    this.createColliders();
    this.createSounds();
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
    this.floorLayer = map.createLayer("exitFloors", InteriorB).setDepth(-1);
    this.wallLayer = map.createLayer("exitWalls", InteriorA).setDepth(-1);
    this.backgroundLayer = map
      .createLayer("exitBackground", InteriorAlt)
      .setDepth(-1);
    this.detailsCLayer = map
      .createLayer("exitDetailsC", InteriorC)
      .setDepth(-1);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [
      this.floorLayer,
      this.wallLayer,
      this.backgroundLayer,
      this.detailsCLayer,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
    }
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
      // .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(25, 25)
      .setScale(1, 1);
  }

  createSounds() {
    this.openDoorSound = this.sound.add("open door");
  }

  createColliders() {
    //LAYER COLLIDERS
    this.wallLayer.setCollisionByProperty({ collides: true });
    this.detailsCLayer.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.collider(this.player, this.detailsCLayer);

    this.physics.add.overlap(
      this.player,
      this.panel,
      this.onPanelCollision,
      null,
      this
    );
  }

  onPanelCollision() {
    this.player.disableBody();

    const enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

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
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.rexUI.edit(text2);
      });

    enter.on("down", () => {
      this.combination = parseInt(text2._text);
      text1.destroy();

      if (this.combination === 428395) {
        this.openDoorSound.play();
        nextSceneFunc(this, "Victory");
      }

      if (this.combination !== 428395 && !isNaN(this.combination)) {
        const wrongCodeMessage = "Whoops. That ain't it!";
        createMessage(
          this,
          wrongCodeMessage,
          "center",
          135,
          this.sys.canvas.height / 2
        );

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
