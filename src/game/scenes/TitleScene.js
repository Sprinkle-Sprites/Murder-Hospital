import Phaser from "phaser";
import config from "../game";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    this.load.image(100, 100, "hospital");
    this.createPlayButton();
  }

  createPlayButton() {
    // CREATE PLAY SPRITE AND SET INTERACTION
    this.playButton = this.add.sprite(500, 300, "blueButton1").setInteractive();

    this.gameText = this.add.text(0, 0, "Enter", {
      fontSize: "32px",
      fill: "#fff",
      color: "#fffff",
    });

    //center text inside of button
    this.centerButtonText(this.gameText, this.playButton);

    this.playButton.on(
      "pointerdown",
      function(pointer) {
        this.scene.start("MainScene");
        this.scene.start("ClueBank");
        this.scene.start("MainTimerScene");
      }.bind(this)
    );
  }

  centerButtonText(gameText, playButton) {
    Phaser.Display.Align.In.Center(gameText, playButton);
  }
}
