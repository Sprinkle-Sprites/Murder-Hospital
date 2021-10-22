import Phaser from "phaser";
import { createMessage, nextSceneFunc } from "@/game/HelperFunctions";

class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: "EndScene" });
  }

  create() {
    this.captureMessage();
    this.scene.setVisible(false, "MainScene");
    this.scene.setVisible(false, "ClueBank");
    this.input.on("pointerdown", () => this.scene.start("TitleScene"));
  }

  captureMessage() {
    let captureMessage =
      "Time is up. I guess you're staying with me....forever. I think you'll like it here.";
    createMessage(this, captureMessage);
  }
}

export default EndScene;
