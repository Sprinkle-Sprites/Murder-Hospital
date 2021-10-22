import Phaser, { Scene } from "phaser";
import config from "../game";

export default class Story extends Scene {
  constructor() {
    super("Story");
  }

  create() {
    this.createBackground();
    this.createStory();
    this.createBeginButton();
  }

  createBackground() {
    this.add.image(200, 200, "hospital2").setScale(0.9);
  }

  createStory() {
    this.add.text(300, 10, "Hello...", {
      fontFamily: "GypsyCurse",
      fontSize: 125,
      color: "red",
      stroke: "black",
    });
  }

  createBeginButton() {
    this.beginButton = this.add.sprite(500, 310, "blueButton").setInteractive();

    this.gameText = this.add.text(0, 0, "Enter", {
      fontSize: "32px",
      fill: "#fff",
      color: "#fffff",
    });

    //center text inside of button
    this.centerButtonText(this.gameText, this.playButton);

    this.playButton.on(
      "pointerdown",
      function() {
        this.scene.start("MainScene");
        this.scene.start("ClueBank");
        this.scene.start("MainTimerScene");
      }.bind(this)
    );

    this.input.on("pointerout", function(event, gameObjects) {
      gameObjects[0].setTexture("blueButton");
    });
  }

  centerButtonText(gameText, playButton) {
    Phaser.Display.Align.In.Center(gameText, playButton);
  }
}
