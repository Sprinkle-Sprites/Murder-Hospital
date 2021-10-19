import Phaser, { Scene } from "phaser";
// import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import eventsCenter from "@/game/eventsCenter";

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
import twoDollarBill from "@/game/assets/popups/two-dollar-bill.png";

import RoomTimer from "@/game/scenes/RoomTimer";

class Pharmacy extends Scene {
  constructor() {
    super({ key: "Pharmacy" });
    this.combination = 0;
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
    this.load.image("pills", pillsPop);
    this.load.image("key", keyPop);
    this.load.image("bandages", bandagesPop);
    this.load.image("twoDollar", twoDollarBill);
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createPills();
    this.createCabinet();
    this.createLockBox();
    this.createCabinet2();
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
    const pillsPopUp = this.add.image(400, 300, "pills");
    pillsPopUp.setScale(0.75, 0.75);
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => pillsPopUp.destroy(),
      loop: false,
    });
    eventsCenter.emit("update-bank", "pills");
    nextSceneFunc(this, "MainScene");
  }

  onCabinetCollision() {
    const keyPopUp = this.add.image(400, 300, "key");
    keyPopUp.setScale(0.25, 0.25);
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => keyPop.destroy(),
      loop: false,
    });
    eventsCenter.emit("update-bank", "key");
    nextSceneFunc(this, "MainScene");
  }

  onLockBoxCollision() {
    const text1 = this.add
      .text(
        400,
        300,
        "This box requires a four digit combination. Enter below...",
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
      text2.destroy();
      if (this.combination === 1022) {
        const popup = this.add.image(400, 300, "twoDollar");
        popup.setScale(0.25, 0.25);
        this.player.disableBody();
        this.time.addEvent({
          delay: 4000,
          callback: () => popup.destroy(),
          loop: false,
        });
        eventsCenter.emit("update-bank", "twoDollar");
        nextSceneFunc(this, "MainScene");
      }
      if (!this.combination === 1022) {
        const wrongCodeMessage =
          "You try to open the lock box, but it won't budge. Better keep looking for that code";
        this.player.disableBody();
        createMessage(this, wrongCodeMessage);
        nextSceneFunc(this, "MainScene");
      }
    });
  }

  onCabinet2Collision() {
    const bandagesPopUp = this.add.image(400, 300, "bandages");
    bandagesPopUp.setScale(0.5, 0.5);
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => bandagesPopUp.destroy(),
      loop: false,
    });
    eventsCenter.emit("update-bank", "bandages");
    nextSceneFunc(this, "MainScene");
  }

  update() {
    this.player.update();
    this.roomTimer.update();
  }
}

export default Pharmacy;
