import Phaser, { Scene } from "phaser";

export default class TitleScene extends Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    this.createBackground();
    this.createPlayButton();
    this.createOptionsButton();
    this.createCreditsButton();
    this.createTurnOffPreviousScenes();
  }

  createTurnOffPreviousScenes() {
    this.scene.stop("MainScene");
  }
  createBackground() {
    this.add.image(200, 200, "hospital").setScale(0.9);
    this.add
      .text(280, 50, "Murder Hospital", {
        fontFamily: "GypsyCurse",
        fontSize: 125,
        color: "red",
      })
      .setOrigin(0, 0)
      .setShadow(5, 5, "black", 5, false, true);
  }

  createPlayButton() {
    // CREATE PLAY SPRITE AND SET INTERACTION
    this.playButton = this.add.sprite(500, 310, "blueButton").setInteractive();

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

  createOptionsButton() {
    this.optionsButton = this.add
      .sprite(500, 360, "blueButton2")
      .setInteractive();

    this.optionsText = this.add.text(0, 0, "Options", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.centerButtonText(this.optionsText, this.optionsButton);

    this.optionsButton.on(
      "pointerdown",
      function() {
        this.scene.start("OptionsScene");
      }.bind(this)
    );
    this.input.on("pointerover", function(event, gameObjects) {
      gameObjects[0].setTexture("blueButton2");
    });
  }

  createCreditsButton() {
    this.creditsButton = this.add
      .sprite(500, 410, "blueButton2")
      .setInteractive();

    this.creditsText = this.add.text(0, 0, "Credits", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.centerButtonText(this.creditsText, this.creditsButton);

    this.creditsButton.on(
      "pointerdown",
      function() {
        this.scene.start("CreditsScene");
      }.bind(this)
    );
    this.input.on("pointerover", function(event, gameObjects) {
      gameObjects[0].setTexture("blueButton2");
    });
  }

  centerButtonText(gameText, playButton) {
    Phaser.Display.Align.In.Center(gameText, playButton);
  }
}
