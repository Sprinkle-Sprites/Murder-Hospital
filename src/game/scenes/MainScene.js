import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import MainTimerScene from "@/game/scenes/MainTimerScene";
import rollDie from "../Dice";
import { io } from "socket.io-client";
import { socket } from "../../components/Chat.vue";

import { resizeCollider, resizeMapLayer } from "@/game/HelperFunctions";
import { diceNextSceneFunc, createMessage } from "../HelperFunctions";

// const exitButton = document.getElementById("try-to-leave")
// exitButton.addEventListener("click", MainScene.goToEnd, true)

class MainScene extends Scene {
  constructor() {
    super({ key: "MainScene" });

    this.users = [];
    this.players = 0;
  }

  preload() {
    Player.preload(this);
  }

  create() {
    this.cameras.main.fadeIn(250, 0, 0, 0);

    this.createPlayer();

    this.createMap();
  }

  createMap() {
    const map = this.make.tilemap({ key: "board" });
    const tileset = map.addTilesetImage(
      "Interior-Hospital-A",
      "Interior-A",
      16,
      16,
      0,
      0
    );

    const floorTileset = map.addTilesetImage(
      "Laboratory-2",
      "floor",
      16,
      16,
      0,
      0
    );

    const waiting_Room = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );
    const icu = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );

    const patient_Room = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );

    const surgery = map.addTilesetImage(
      "Interior-Hospital-Alt",
      "Interior-Alt",
      16,
      16,
      0,
      0
    );

    const morgue = map.addTilesetImage(
      "Interior-Hospital-Alt",
      "Interior-Alt",
      16,
      16,
      0,
      0
    );

    const xRay = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );

    const lab = map.addTilesetImage("Laboratory-3", "Lab-3", 16, 16, 0, 0);

    const lockers = map.addTilesetImage(
      "Locker Room",
      "lockerRoom",
      16,
      16,
      0,
      0
    );

    const blood = map.addTilesetImage(
      "Interior-Hospital-Alt",
      "Interior-Alt",
      16,
      16,
      0,
      0
    );

    const pharmacy = map.addTilesetImage(
      "Interior-Hospital-C",
      "Interior-C",
      16,
      16,
      0,
      0
    );

    //create layers
    const floorLayer = map.createLayer("Ground", floorTileset).setDepth(-1);
    const wallsLayer = map.createLayer("WallsLayer", tileset).setDepth(-1);
    const waitingRoom = map
      .createLayer("Waiting Room", waiting_Room)
      .setDepth(-1);
    const icuRoom = map.createLayer("ICU", icu).setDepth(-1);
    const patientRoom = map
      .createLayer("Patient's Room", patient_Room)
      .setDepth(-1);
    const surgeryRoom = map.createLayer("Surgery", surgery).setDepth(-1);
    const labRoom = map.createLayer("Laboratory", lab).setDepth(-1);
    const morgueRoom = map.createLayer("Morgue", morgue).setDepth(-1);
    const xRayRoom = map.createLayer("X-ray", xRay).setDepth(-1);
    const lockerRoom = map.createLayer("Locker Room", lockers).setDepth(-1);
    const bloodSplatter = map.createLayer("Blood", blood).setDepth(-1);
    const pharmacyRoom = map.createLayer("Pharmacy", pharmacy).setDepth(-1);

    this.add
      .text(70, 120, "ICU", { fontFamily: "Helvetica", color: "black" })
      .setDepth(-1);
    this.add
      .text(240, 120, "Locker Room", {
        fontFamily: "Helvetica",
        color: "black",
      })
      .setDepth(-1);
    this.add
      .text(450, 120, "Patients Room", {
        fontFamily: "Helvetica",
        color: "black",
      })
      .setDepth(-1);
    this.add
      .text(685, 220, "Surgery", {
        fontFamily: "Helvetica",
        color: "black",
      })
      .setDepth(-1);
    this.add
      .text(675, 400, "Laboratory", {
        fontFamily: "Helvetica",
        color: "black",
      })
      .setDepth(-1);
    this.add
      .text(475, 530, "Pharmacy", {
        fontFamily: "Helvetica",
        color: "black",
      })
      .setDepth(-1);
    this.add
      .text(200, 530, "Morgue", {
        fontFamily: "Helvetica",
        color: "black",
      })
      .setDepth(-1);
    this.add
      .text(70, 275, "X-Ray", {
        fontFamily: "Helvetica",
        color: "black",
      })
      .setDepth(-1);
    this.add
      .text(360, 325, "Waiting Room", {
        fontFamily: "Helvetica",
        color: "black",
      })
      .setDepth(-1);

    //resize
    const layers = [
      floorLayer,
      wallsLayer,
      waitingRoom,
      icuRoom,
      patientRoom,
      surgeryRoom,
      labRoom,
      morgueRoom,
      xRayRoom,
      lockerRoom,
      bloodSplatter,
      pharmacyRoom,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
    }

    //LAYER COLLIDERS
    wallsLayer.setCollisionByProperty({ collides: true });

    //set colliders
    this.physics.add.collider(this.player, wallsLayer);
  } //end of createMap

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 350, 250, "player1")
    );

    //scalling player's height and width
    this.player.displayHeight = 15;
    this.player.displayWidth = 15;

    this.time.addEvent({
      delay: 100,
      callback: () => resizeCollider(this.player, 20, 20),
      callbackScope: this,
      loop: false,
    });
  }

  rollRoom() {
    let value = document.getElementById("diceValue").getAttribute("value");

    // code to check if dice works
    if (parseInt(value) === 1) {
      const patRoomMes = "To The Patient's Room";
      createMessage(this, patRoomMes);
      diceNextSceneFunc(this, "PatientRoom");
      document.querySelector("#diceValue").setAttribute("value", "0");
    } else if (parseInt(value) === 2) {
      const surgRoomMes = "To Surgery";
      createMessage(this, surgRoomMes);
      diceNextSceneFunc(this, "Surgery");
      document.querySelector("#diceValue").setAttribute("value", "0");
    } else if (parseInt(value) === 3) {
      const radRoomMes = "To The X-ray Room";
      createMessage(this, radRoomMes);
      diceNextSceneFunc(this, "Radiology");
      document.querySelector("#diceValue").setAttribute("value", "0");
    } else if (parseInt(value) === 4) {
      const labRoomMes = "To The Laboratory";
      createMessage(this, labRoomMes);
      diceNextSceneFunc(this, "Laboratory");
      document.querySelector("#diceValue").setAttribute("value", "0");
    } else if (parseInt(value) === 5) {
      const pharmRoomMes = "To The Pharmacy";
      createMessage(this, pharmRoomMes);
      diceNextSceneFunc(this, "Pharmacy");
      document.querySelector("#diceValue").setAttribute("value", "0");
    } else if (parseInt(value) === 6) {
      const lockerRoomMes = "To The Locker Room";
      createMessage(this, lockerRoomMes);
      diceNextSceneFunc(this, "LockerRoom");
      document.querySelector("#diceValue").setAttribute("value", "0");
    } else if (parseInt(value) === 7) {
      const morgueRoomMes = "To The Morgue";
      createMessage(this, morgueRoomMes);
      diceNextSceneFunc(this, "Morgue");
      document.querySelector("#diceValue").setAttribute("value", "0");
    } else {
      return "You need to investigate a room";
    }
  }

  // goToEnd() {
  //   diceNextSceneFunc(this, "Exit");
  // }

  update() {
    this.player.update();
    this.rollRoom();
    // this.goToEnd();
  }
}

export default MainScene;
