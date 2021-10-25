import Phaser, { Scene } from "phaser";

export default class OptionsScene extends Scene {
  constructor() {
    super("OptionsScene");
  }

  create() {
    this.createBackground();
    this.createScale();
    this.createTitleText();
    this.createAudio();
    this.createReturnButton();
    console.log("this", this);
  }

  createBackground() {
    this.add.image(200, 200, "hospital").setScale(0.9);
  }
  createScale() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
  }

  createTitleText() {
    this.add
      .text(this.width * 0.48, this.height * 0.1, "Options", {
        fontFamily: "GypsyCurse",
        fontSize: "60px",
      })
      .setOrigin(0.5, 0.5)
      .setColor("red")
      .setShadow(5, 5, "black", 5, false, true);
  }

  createAudio() {
    this.audioButton = this.add
      .image(this.width * 0.35, this.height * 0.27, "blackCheckmark")
      .setInteractive();
    this.audioText = this.add.text(
      this.width * 0.37,
      this.height * 0.25,
      "Music Enabled",
      {
        fontSize: "32px",
      }
    );
    this.soundOn = true;

    this.audioButton.on(
      "pointerdown",
      function() {
        this.soundOn = !this.soundOn;
        this.updateAudio();
      }.bind(this)
    );
  }

  updateAudio() {
    if (this.soundOn === false) {
      this.audioButton.setTexture("greyButton");
      this.sound.removeAll();
    } else {
      this.audioButton.setTexture("blackCheckmark");
      this.sound.play("bgMusic");
    }
  }

  createReturnButton() {
    this.returnButton = this.add
      .sprite(this.width * 0.48, this.height * 0.8, "blueButton2")
      .setInteractive();

    this.returnText = this.add.text(0, 0, "Return", {
      fontSize: "32px",
      fill: "#fff",
      color: "#ffffff",
    });

    this.centerButtonText(this.returnText, this.returnButton);

    this.returnButton.on(
      "pointerdown",
      function() {
        this.scene.start("TitleScene");
      }.bind(this)
    );
  }

  centerButtonText(returnText, returnButton) {
    Phaser.Display.Align.In.Center(returnText, returnButton);
  }
}
