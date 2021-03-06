import Phaser, { Scene } from "phaser";
// import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import eventsCenter from "@/game/eventsCenter";
import eventEmitter from "../eventEmitter";

import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  nextSceneFunc,
  createMessage,
  handleRoomCountdownFinished,
  changeDieFunc,
  onZoneCollision,
} from "@/game/HelperFunctions";

import deoderant from "@/game/assets/popups/deoderant.png";
import groceryList from "@/game/assets/popups/grocery-list.png";
import mirror from "@/game/assets/popups/mirror.png";
import toothbrush from "@/game/assets/popups/toothbrush.png";
import collider from "@/game/assets/collider.png";
import RoomTimer from "@/game/scenes/RoomTimer";
import directions from "@/game/assets/popups/directionsFinal.png";

class LockerRoom extends Scene {
  constructor() {
    super({ key: "LockerRoom" });
    this.combination = 0;
    this.collectedClues = [];
  }

  preload() {
    Player.preload(this);
    this.load.image("directionsPopUp", directions);
    //lockers (deoderant) (mirror, doorclue)
    this.load.image("locker1", collider);
    this.load.image("locker2", collider);

    //sink (toothbrush)
    this.load.image("sink", collider);

    //shower (labcoat with note in pocket)
    this.load.image("shower", collider);

    //POPUPS
    this.load.image("mirror", mirror);
    this.load.image("deoderant", deoderant);
    this.load.image("toothbrush", toothbrush);
    this.load.image("note", groceryList);

    //REMOVES CONTAINER CLASS TO HIDE DIE/BUTTONS AND ADDS HIDE CLASS
    changeDieFunc(this.scene);
  }

  create() {
    this.createTitle();
    this.createPlayer();
    this.createMap();
    this.createColliders();
    this.createLocker1();
    this.createLocker2();
    this.createSink();
    this.createShower();
    this.createColliders();
    this.createTimer();
    this.createSounds();
  }

  createTitle() {
    this.add.text(345, 605, "LOCKER ROOM", {
      fontFamily: "GypsyCurse",
      fontSize: 30,
      color: "red",
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

  createMap() {
    const map = this.make.tilemap({ key: "LockerRoom" });
    //for border and walls and stalls
    const InteriorA = map.addTilesetImage(
      "Interior-Hospital-A",
      "Interior-A",
      16,
      16,
      0,
      0
    );
    //for floors
    const InteriorB = map.addTilesetImage(
      "Interior-Hospital-B",
      "Interior-B",
      16,
      16,
      0,
      0
    );
    //for bathroom
    const bathroom = map.addTilesetImage("Bathroom", "Bathroom", 16, 16, 0, 0);
    //for lockers
    const lockerRoom = map.addTilesetImage(
      "Locker Room",
      "lockerRoom",
      16,
      16,
      0,
      0
    );
    //for extras2
    const InteriorC = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );
    //for extras
    const InteriorAlt = map.addTilesetImage(
      "Interior-Hospital-Alt",
      "Interior-Alt",
      16,
      16,
      0,
      0
    );

    //LAYERS
    this.floorLayer = map.createLayer("Floor", InteriorB);
    this.borderLayer = map.createLayer("Border", InteriorA);
    this.wallLayer = map.createLayer("Walls", InteriorA);
    this.stallsLayer = map.createLayer("Stalls", InteriorA);
    this.bathroomLayer = map.createLayer("Bathroom", bathroom);
    this.lockersLayer = map.createLayer("Lockers", lockerRoom);
    this.extraLayer = map.createLayer("Extras", InteriorAlt);
    this.extra2Layer = map.createLayer("Extras 2", InteriorC);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [
      this.floorLayer,
      this.wallLayer,
      this.borderLayer,
      this.stallsLayer,
      this.bathroomLayer,
      this.lockersLayer,
      this.extraLayer,
      this.extra2Layer,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
      layers[i].setDepth(-1);
    }
  }

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 350, 520, "player1")
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

    //RADIUS
    this.zone = this.add.zone(this.x, this.y, 125, 125);
    this.physics.world.enable(this.zone);
  }

  createLocker1() {
    this.locker1 = this.physics.add
      .sprite(503, 80, "locker1")
      // .setDepth(-2)
      .setSize(20, 22)
      .setScale(0.6, 1.5)
      .setVisible(false);
  }

  createLocker2() {
    this.locker2 = this.physics.add
      .sprite(712, 80, "locker2")
      // .setDepth(-2)
      .setSize(20, 22)
      .setScale(0.6, 1.5)
      .setVisible(false);
  }

  createSink() {
    this.sink = this.physics.add
      .sprite(752, 527, "sink")
      // .setDepth(-2)
      .setSize(19, 20)
      .setScale(0.8, 0.7)
      .setVisible(false);
  }

  createShower() {
    this.shower = this.physics.add
      .sprite(245, 82, "shower")
      // .setDepth(-2)
      .setSize(18, 23)
      .setScale(1.6, 2.5)
      .setVisible(false);
  }

  createSounds() {
    this.lockerSound = this.sound.add("locker");
    this.lockerSound2 = this.sound.add("locker 2");
    this.toothbrushSound = this.sound.add("toothbrush");
    this.showerSound = this.sound.add("shower");
  }

  createColliders() {
    //LAYER COLLIDERS
    this.borderLayer.setCollisionByProperty({ collides: true });
    this.stallsLayer.setCollisionByProperty({ collides: true });
    this.bathroomLayer.setCollisionByProperty({ collides: true });
    this.extra2Layer.setCollisionByProperty({ collides: true });
    this.lockersLayer.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, this.borderLayer);
    this.physics.add.collider(this.player, this.stallsLayer);
    this.physics.add.collider(this.player, this.bathroomLayer);
    this.physics.add.collider(this.player, this.extra2Layer);
    this.physics.add.collider(this.player, this.lockersLayer);

    this.physics.add.overlap(
      this.player,
      this.locker1,
      this.onLocker1Collision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.locker2,
      this.onLocker2Collision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.sink,
      this.onSinkCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.shower,
      this.onShowerCollision,
      null,
      this
    );

    //ZONES
    this.physics.add.overlap(
      this.zone,
      this.locker1,
      onZoneCollision,
      null,
      this
    );

    this.physics.add.overlap(
      this.zone,
      this.locker2,
      onZoneCollision,
      null,
      this
    );

    this.physics.add.overlap(this.zone, this.sink, onZoneCollision, null, this);

    this.physics.add.overlap(
      this.zone,
      this.shower,
      onZoneCollision,
      null,
      this
    );
  }

  onLocker1Collision() {
    this.roomTimer.stop();
    this.player.disableBody();
    this.lockerSound.play();

    //WRAPED ALL ACTIONS TO RUN AFTER SOUND FINSIHES PLAYING
    this.time.addEvent({
      delay: 1500,
      callback: () => {
        const popUp = this.add
          .image(400, 300, "deoderant")
          .setScale(0.75, 0.75);

        this.time.addEvent({
          delay: 4750,
          callback: () => popUp.destroy(),
          loop: false,
        });
        eventsCenter.emit("update-bank", "deoderant");

        if (!this.collectedClues.includes("deoderant")) {
          this.collectedClues.push("deoderant");
          this.completed();
        }

        nextSceneFunc(this, "MainScene");
      },
      loop: false,
    });
  }

  onLocker2Collision() {
    this.roomTimer.stop();
    this.player.disableBody();
    this.lockerSound2.play();

    const enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    const text1 = this.add
      .text(400, 300, "This locker is locked. Enter the combination below...", {
        fixedWidth: 700,
        fixedHeight: 50,
        backgroundColor: "black",
        align: "center",
        wordWrap: { width: 300, useAdvancedWrap: true },
      })
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

      if (this.combination === 15931) {
        const popUp = this.add.image(400, 300, "mirror").setScale(0.25, 0.25);

        this.time.addEvent({
          delay: 4750,
          callback: () => popUp.destroy(),
          loop: false,
        });
        eventsCenter.emit("update-bank", "mirror");

        if (!this.collectedClues.includes("mirror")) {
          this.collectedClues.push("mirror");
          this.completed();
        }

        nextSceneFunc(this, "MainScene");
      } else {
        const wrongCodeMessage =
          "You try to open the locker, but it won't budge. Better keep looking for the combo";

        createMessage(
          this,
          wrongCodeMessage,
          "center",
          50,
          this.sys.canvas.height / 2
        );
        nextSceneFunc(this, "MainScene");
      }

      text2.destroy();
    });
  }

  onSinkCollision() {
    this.roomTimer.stop();
    this.player.disableBody();
    this.toothbrushSound.play();

    const popUp = this.add.image(400, 300, "toothbrush").setScale(0.25, 0.25);

    this.time.addEvent({
      delay: 4750,
      callback: () => popUp.destroy(),
      loop: false,
    });
    eventsCenter.emit("update-bank", "toothbrush");

    if (!this.collectedClues.includes("toothbrush")) {
      this.collectedClues.push("toothbrush");
      this.completed();
    }

    nextSceneFunc(this, "MainScene");
  }

  onShowerCollision() {
    this.roomTimer.stop();
    this.player.disableBody();
    this.showerSound.play();

    const openMessage =
      "You find a grocery list stuck to the wall of the shower. Strange contents...";
    createMessage(this, openMessage, "top", 50, this.sys.canvas.height / 2);

    setTimeout(() => {
      const popUp = this.add.image(400, 300, "note").setScale(0.5, 0.5);
      this.time.addEvent({
        delay: 4750,
        callback: () => popUp.destroy(),
        loop: false,
      });
      eventsCenter.emit("update-bank", "note");

      if (!this.collectedClues.includes("note")) {
        this.collectedClues.push("note");
        this.completed();
      }

      nextSceneFunc(this, "MainScene");
    }, 3000);
  }

  getDirections() {
    let value = document.getElementById("directions").getAttribute("value");

    if (value === "readMe") {
      const popUp1 = this.add
        .image(400, 320, "directionsPopUp")
        .setScale(0.95, 0.9);
      this.input.on("pointerdown", () => {
        popUp1.destroy();
      });

      document.querySelector("#directions").setAttribute("value", "wait");
    } else {
      return;
    }
  }

  update() {
    this.player.update();
    this.roomTimer.update();
    this.getDirections();

    //MOVES PLAYER ZONE WITH PLAYER
    this.zone.x = this.player.x;
    this.zone.y = this.player.y;
  }

  completed() {
    if (this.collectedClues.length === 4)
      //send a message to dice to lower prob of the locker room (dice # 6) being rolled
      eventEmitter.emit("completed", 6);
  }
}

export default LockerRoom;
