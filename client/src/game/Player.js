import Phaser from "phaser";

import playerDown from "@/game/assets/characters/Dr-Frankenstien-A/Dr-Frankenstien-A-down.png";
import playerUp from "@/game/assets/characters/Dr-Frankenstien-A/Dr-Frankenstien-A-up.png";
import playerRight from "@/game/assets/characters/Dr-Frankenstien-A/Dr-Frankenstien-A-right.png";
import playerLeft from "@/game/assets/characters/Dr-Frankenstien-A/Dr-Frankenstien-A-left.png";
import playerIdle from "@/game/assets/characters/Dr-Frankenstien-A/Dr-Frankenstien-A-idle.png";

import playerDown2 from "@/game/assets/characters/Dr-Frankenstien-B/Dr-Frankenstien-B-down.png";
import playerUp2 from "@/game/assets/characters/Dr-Frankenstien-B/Dr-Frankenstien-B-up.png";
import playerRight2 from "@/game/assets/characters/Dr-Frankenstien-B/Dr-Frankenstien-B-right.png";
import playerLeft2 from "@/game/assets/characters/Dr-Frankenstien-B/Dr-Frankenstien-B-left.png";
import playerIdle2 from "@/game/assets/characters/Dr-Frankenstien-B/Dr-Frankenstien-B-down.png";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.texture = texture;

    this.scene.add.existing(this);
    //PLAYER KEY INPUTS
    const { LEFT, RIGHT, UP, DOWN } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
    });
  }
  static preload(scene) {
    scene.load.spritesheet("player-down", playerDown, {
      frameWidth: 72,
      frameHeight: 96,
    });

    scene.load.spritesheet("player-up", playerUp, {
      frameWidth: 72,
      frameHeight: 96,
    });

    scene.load.spritesheet("player-right", playerRight, {
      frameWidth: 72,
      frameHeight: 96,
    });

    scene.load.spritesheet("player-left", playerLeft, {
      frameWidth: 72,
      frameHeight: 96,
    });

    scene.load.spritesheet("player-idle", playerIdle, {
      frameWidth: 72,
      frameHeight: 96,
    });
    scene.load.spritesheet("player-down2", playerDown2, {
      frameWidth: 72,
      frameHeight: 96,
    });

    scene.load.spritesheet("player-up2", playerUp2, {
      frameWidth: 72,
      frameHeight: 96,
    });

    scene.load.spritesheet("player-right2", playerRight2, {
      frameWidth: 72,
      frameHeight: 96,
    });

    scene.load.spritesheet("player-left2", playerLeft2, {
      frameWidth: 72,
      frameHeight: 96,
    });

    scene.load.spritesheet("player-idle2", playerIdle2, {
      frameWidth: 72,
      frameHeight: 96,
    });
  }

  update() {
    this.handleInputs();
  }

  handleInputs() {
    let speed = 100;
    let playerVelocity = new Phaser.Math.Vector2();
    const { keys } = this;

    this.createAnims();

    //IF ANY ARROW KEY IS PRESSED...
    if (
      keys.right.isDown ||
      keys.left.isDown ||
      keys.up.isDown ||
      keys.down.isDown
    ) {
      //ADJUST ANIMATIONS AND VELOCITY ACCORDING TO KEY PRESS
      if (keys.right.isDown) {
        this.play("player_right_anim", true);
        playerVelocity.x = 1;
      } else if (keys.left.isDown) {
        this.play("player_left_anim", true);
        playerVelocity.x = -1;
      } else if (keys.up.isDown) {
        this.play("player_up_anim", true);
        playerVelocity.y = -1;
      } else if (keys.down.isDown) {
        this.play("player_down_anim", true);
        playerVelocity.y = 1;
      }
    } else {
      //IF NO KEY IS PRESSED, PLAY IDLE SPRITE AND RESET VELOCITY
      this.play("player_idle_anim", true);
      this.setVelocity(0, 0);
    }

    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y);
  }

  createAnims() {
    if (this.texture === 1) {
      this.anims.create({
        key: "player_down_anim",
        frames: this.anims.generateFrameNumbers("player-down"),
        frameRate: 7,
        repeat: -1,
      });

      this.anims.create({
        key: "player_up_anim",
        frames: this.anims.generateFrameNumbers("player-up"),
        frameRate: 7,
        repeat: -1,
      });

      this.anims.create({
        key: "player_right_anim",
        frames: this.anims.generateFrameNumbers("player-right"),
        frameRate: 7,
        repeat: -1,
      });

      this.anims.create({
        key: "player_left_anim",
        frames: this.anims.generateFrameNumbers("player-left"),
        frameRate: 7,
        repeat: -1,
      });

      this.anims.create({
        key: "player_idle_anim",
        frames: this.anims.generateFrameNumbers("player-idle"),
        frameRate: 5,
        repeat: -1,
      });
    } else if (this.texture === 2) {
      this.anims.create({
        key: "player_down_anim",
        frames: this.anims.generateFrameNumbers("player-down2"),
        frameRate: 7,
        repeat: -1,
      });

      this.anims.create({
        key: "player_up_anim",
        frames: this.anims.generateFrameNumbers("player-up2"),
        frameRate: 7,
        repeat: -1,
      });

      this.anims.create({
        key: "player_right_anim",
        frames: this.anims.generateFrameNumbers("player-right2"),
        frameRate: 7,
        repeat: -1,
      });

      this.anims.create({
        key: "player_left_anim",
        frames: this.anims.generateFrameNumbers("player-left2"),
        frameRate: 7,
        repeat: -1,
      });

      this.anims.create({
        key: "player_idle_anim",
        frames: this.anims.generateFrameNumbers("player-idle2"),
        frameRate: 5,
        repeat: -1,
      });
    }
  }
}

export default Player;
