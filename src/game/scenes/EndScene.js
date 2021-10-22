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
    this.captureMessage();
    this.input.on("pointerdown", () => this.scene.start("TitleScene"));
  }

  captureMessage() {
    let captureMessage =
      "Time is up. I guess you're staying with me....forever. I think you'll like it here.";
    createMessage(this, captureMessage);
  }
}

export default EndScene;
