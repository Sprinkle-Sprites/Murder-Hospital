import { Scene } from "phaser";
import Player from "@/game/Player";
import RoomTimer from "@/game/scenes/RoomTimer";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
  handleRoomCountdownFinished,
} from "@/game/HelperFunctions";
import collider from "@/game/assets/collider.png";

class ICU extends Scene {
  constructor() {
    super({ key: "ICU" });
  }

  preload() {
    Player.preload(this);
  }

  create() {
    this.createPlayer();
    this.createMap();
    this.createColliders();
    this.createTimer();
  }

  update() {
    this.player.update();
    this.roomTimer.update();
  }

  createPlayer() {
    this.player = this.physics.add.existing(
      new Player(this, 400, 300, "player1")
    );

    //ADJUSTS PLAYER SPRITE SIZE
    this.player.displayHeight = 18;
    this.player.displayWidth = 18;

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

  createMap() {
    const map = this.make.tilemap({ key: "ICU" });
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

    const Lab3 = map.addTilesetImage("Laboratory-3", "Lab-3", 16, 16, 0, 0);

    //MAP LAYERS
    this.floorLayer = map.createLayer("floor IHB", InteriorB);
    this.floorLayer2 = map.createLayer("floor 2 IHB", InteriorB);
    this.wallLayer = map.createLayer("wall IHA", InteriorA);
    this.wallLayer2 = map.createLayer("wall 2 IHC", InteriorC);
    this.borderLayer = map.createLayer("border IHA", InteriorA);
    this.detailsLayer = map.createLayer("details IHALT", InteriorAlt);
    this.bedsLayer = map.createLayer("beds IHC", InteriorC);
    this.bedsLayer2 = map.createLayer("beds 2 IHALT", InteriorAlt);
    this.furnitureLayer = map.createLayer("furniture IHC", InteriorC);
    this.furnitureLayer2 = map.createLayer("furniture IHALT", InteriorAlt);
    this.furnitureLayer3 = map.createLayer("furniture LAB3", Lab3);
    this.nurseStationLayer = map.createLayer("nurse station 3 LAB3", Lab3);
    this.nurseStationLayer2 = map.createLayer("nurse station LAB3", Lab3);
    this.nurseStationLayer3 = map.createLayer("nurse station 2 LAB3", Lab3);
    this.nurseStationLayer4 = map.createLayer("nurse station 4 IHC", InteriorC);

    //SCALE LAYERS TO SCENE SIZE AND SETS DEPTH SO PLAYER RENDERS ABOVE LAYERS
    const layers = [
      this.floorLayer,
      this.floorLayer2,
      this.wallLayer,
      this.wallLayer2,
      this.borderLayer,
      this.detailsLayer,
      this.bedsLayer,
      this.bedsLayer2,
      this.furnitureLayer,
      this.furnitureLayer2,
      this.furnitureLayer3,
      this.nurseStationLayer,
      this.nurseStationLayer2,
      this.nurseStationLayer3,
      this.nurseStationLayer4,
    ];

    for (let i = 0; i < layers.length; i++) {
      resizeMapLayer(this, layers[i]);
      layers[i].setDepth(-1);
    }
  }

  createColliders() {
    //LAYER COLLIDERS
    this.borderLayer.setCollisionByProperty({ collides: true });
    this.wallLayer.setCollisionByProperty({ collides: true });
    this.nurseStationLayer2.setCollisionByProperty({ collides: true });

    //PLAYER AND LAYER COLLIDERS
    this.physics.add.collider(this.player, this.borderLayer);
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.collider(this.player, this.nurseStationLayer2);

    //PLAYER AND LAYER COLLIDERS WITH CALLBACK
    //

    // COLLIDER DEBUG COLOR
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    this.nurseStationLayer3.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });
  }
}

export default ICU;
