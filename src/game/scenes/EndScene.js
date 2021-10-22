import Phaser from "phaser";
import { createMessage, changeDieClass } from "@/game/HelperFunctions";

class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: "EndScene" });
  }

  preload() {
    changeDieClass();
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
      .text(200, 10, "You are driving alone...", {
        fontFamily: "GypsyCurse",
        fontSize: 125,
        color: "red",
      })
      .setShadow(5, 5, "black", 5, false, true);

      this.add
      .text(
        100,
        170,
        "Time is up. I guess you're staying with me....forever. I think you'll like it here.",
        {
          fontSize: 20,
          wordWrap: { width: 900, useAdvancedWrap: true },
        }
      )
      .setShadow(3, 3, "black", 7, false, true);
  }
}

export default EndScene;
