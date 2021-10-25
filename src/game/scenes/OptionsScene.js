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
        fontSize: "50px",
      })
      .setOrigin(0.5, 0.5)
      .setColor("red")
      .setShadow(5, 5, "black", 5, false, true);
  }

  createAudio() {
    this.audioButton = this.add
      .image(this.width * 0.39, this.height * 0.2, "blackCheckmark")
      .setInteractive();
    this.audioText = this.add.text(
      this.width * 0.41,
      this.height * 0.2,
      "Music Enabled",
      { fontSize: 24 }
    );

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
      console.log("this", this);
    } else {
      this.audioButton.setTexture("blackCheckmark");
    }
  }
}
