import Phaser from "phaser";
import { changeDieFunc } from "@/game/HelperFunctions";

class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: "EndScene" });
  }

  preload() {
    //HAVE TO HARD CODE DIE CLASS TO MAKE SURE IT HIDES
    changeDieFunc(this.scene);

    this.scene.setVisible(false, "MainScene");
    this.scene.setVisible(false, "ClueBank");
  }

  create() {
    this.createBackground();
    this.captureMessage();
    this.input.on("pointerdown", () => this.scene.start("TitleScene"));
  }

  createBackground() {
    this.add.image(200, 200, "hospital2").setScale(0.9);
  }

  captureMessage() {
    this.add
      .text(200, 10, "The timer ends...", {
        fontFamily: "GypsyCurse",
        fontSize: 125,
        color: "red",
      })
      .setShadow(5, 5, "black", 5, false, true);

    this.add
      .text(
        100,
        200,
        "...and the door swings open. An imposing figure in dirty dress shoes and a blood-spattered lab coat enters the hallway.",
        {
          fontSize: 20,
          wordWrap: { width: 900, useAdvancedWrap: true },
        }
      )
      .setShadow(3, 3, "black", 7, false, true);

    this.add
      .text(
        100,
        310,
        "I am so sorry for my tardiness! I try never to make guests wait. But the Doctor's in now, and we can begin.",
        {
          fontSize: 20,
          fontStyle: "italic",
          wordWrap: { width: 900, useAdvancedWrap: true },
          color: "red",
        }
      )
      .setShadow(3, 3, "black", 7, false, true);

    this.add
      .text(
        100,
        410,
        "The Doctor nears you, pulling an implement out of his pocket.",
        {
          fontSize: 20,
          wordWrap: { width: 900, useAdvancedWrap: true },
        }
      )
      .setShadow(3, 3, "black", 7, false, true);

    this.add
      .text(100, 490, "Now tell me, does this hurt...", {
        fontSize: 20,
        fontStyle: "italic",
        wordWrap: { width: 900, useAdvancedWrap: true },
        color: "red",
      })
      .setShadow(3, 3, "black", 7, false, true);
  }
}

export default EndScene;
