import Phaser from "phaser";
import player from "@/game/assets/characters/Dr-Frankenstien-A/Dr-Frankenstien-A-down.png";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.texture = texture;

    this.scene.add.existing(this);

    //player move inputs
  }

  static preload(scene) {
    scene.load.spritesheet("player1", player, {
      frameWidth: 72,
      frameHeight: 96,
    });
  }

  update() {
    this.createAnims();
  }

  createAnims() {
    this.anims.create({
      key: "player_anim",
      frames: this.anims.generateFrameNumbers("player1"),
      frameRate: 7,
      repeat: -1,
    });

    this.play("player_anim", true);
  }
}

export default Player;
