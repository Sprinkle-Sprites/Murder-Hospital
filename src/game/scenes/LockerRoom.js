import Phaser, { Scene } from "phaser";
// import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import eventsCenter from "@/game/eventsCenter";

import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessageForImage,
  createMessage,
  nextSceneFunc,
} from "@/game/HelperFunctions";

import deoderant from "@/game/assets/popups/deoderant.png";
import groceryList from "@/game/assets/popups/grocery-list.png";
import mirror from "@/game/assets/popups/mirror.png";
import toothbrush from "@/game/assets/popups/toothbrush.png";

import collider from "@/game/assets/collider.png";

import RoomTimer from "@/game/scenes/RoomTimer";

class Pharmacy extends Scene {
  constructor() {
    super({ key: "LockerRoom" });
    this
  }

  preload() {
    Player.preload(this);

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
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createColliders();
    this.createLocker1();
    this.createLocker2();
    this.createSink();
    this.createShower();
    this.createColliders();
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
    const floorLayer = map.createLayer("Floor", InteriorB).setDepth(-1);
    const borderLayer = map.createLayer("Border", InteriorA).setDepth(-1);
    const wallLayer = map.createLayer("Walls", InteriorA).setDepth(-1);
    const stallsLayer = map.createLayer("Stalls", InteriorA).setDepth(-1);
    const bathroomLayer = map.createLayer("Bathroom", bathroom).setDepth(-1);
    const lockersLayer = map.createLayer("Lockers", lockerRoom).setDepth(-1);
    const extraLayer = map.createLayer("Extras", InteriorAlt).setDepth(-1);
    const extra2Layer = map.createLayer("Extras 2", InteriorC).setDepth(-1);

    //SCALES TILED MAP TO FIT WORLD SIZE
    const layers = [
      floorLayer,
      wallLayer,
      borderLayer,
      stallsLayer,
      bathroomLayer,
      lockersLayer,
      extraLayer,
      extra2Layer,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
    }

    //LAYER COLLIDERS
    borderLayer.setCollisionByProperty({ collides: true });
    stallsLayer.setCollisionByProperty({ collides: true });
    bathroomLayer.setCollisionByProperty({ collides: true });
    extra2Layer.setCollisionByProperty({ collides: true });
    lockersLayer.setCollisionByProperty({ collides: true });

    //CREATES INTERACTION BETWEEN PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, borderLayer);
    this.physics.add.collider(this.player, stallsLayer);
    this.physics.add.collider(this.player, bathroomLayer);
    this.physics.add.collider(this.player, extra2Layer);
    this.physics.add.collider(this.player, lockersLayer);

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
  }

  createLocker1() {
    this.locker1 = this.physics.add
      .sprite(500, 60, "locker1")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(20, 50, true);
  }

  createLocker2() {
    this.locker2 = this.physics.add
      .sprite(690, 60, "locker2")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(20, 50, true);
  }

  createSink() {
    this.sink = this.physics.add
      .sprite(734, 511, "sink")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(19, 20, true);
  }

  createShower() {
    this.shower = this.physics.add
      .sprite(229, 50, "shower")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setSize(35, 20, true);
  }

  createColliders() {
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
  }

  onLocker1Collision() {
    const popUp = this.add.image(400, 300, "deoderant");
    popUp.setScale(0.75, 0.75);
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => popUp.destroy(),
      loop: false,
    });
    eventsCenter.emit("update-bank", "deoderant");
    nextSceneFunc(this, "MainScene");
  }

  onLocker2Collision() {

    const text1 = this.add
    .text(
      400,
      300,
      "This locker is locked. Enter the combination below...",
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
    if (this.combination === 15931) {
      const popUp = this.add.image(400, 300, "mirror");
    popUp.setScale(0.25, 0.25);
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => popUp.destroy(),
      loop: false,
    });
    eventsCenter.emit("update-bank", "mirror");
    nextSceneFunc(this, "MainScene");
    } else if (this.combination !== 15931 && !isNaN(this.combination)) {
      const wrongCodeMessage =
        "You try to open the locker, but it won't budge. Better keep looking for the combo";
      this.player.disableBody();
      createMessage(this, wrongCodeMessage);
      nextSceneFunc(this, "MainScene");
    }
    text2.destroy();
  });

  }

  onSinkCollision() {
    const popUp = this.add.image(400, 300, "toothbrush");
    popUp.setScale(0.25, 0.25);
    this.player.disableBody();
    this.time.addEvent({
      delay: 4750,
      callback: () => popUp.destroy(),
      loop: false,
    });
    eventsCenter.emit("update-bank", "toothbrush");
    nextSceneFunc(this, "MainScene");
  }

  onShowerCollision() {
    this.player.disableBody();
    const openMessage =
      "You find a grocery list stuck to the wall of the shower. Strange contents...";
    createMessageForImage(this, openMessage);
    setTimeout(() => {
      const popUp = this.add.image(400, 300, "note").setScale(0.5, 0.5);
      this.time.addEvent({
        delay: 4750,
        callback: () => popUp.destroy(),
        loop: false,
      });
      eventsCenter.emit("update-bank", "note");
      nextSceneFunc(this, "MainScene");
    }, 3000);
  }

  update() {
    this.player.update();
    this.roomTimer.update();
  }
}

export default Pharmacy;
