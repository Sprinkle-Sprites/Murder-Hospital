import Phaser, { Scene } from "phaser";

export default class OptionsScene extends Scene {
  constructor() {
    super("OptionsScene");
  }

  create() {
    this.createBackground();
    this.createScale();
    this.createTitleText();
    this.createMusic();
    this.createSounds();
    this.createReturnButton();
    console.log("sounds", this.sound);
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

  createMusic() {
    this.musicButton = this.add
      .image(this.width * 0.35, this.height * 0.27, "blackCheckmark")
      .setInteractive();
    this.musicText = this.add.text(
      this.width * 0.37,
      this.height * 0.25,
      "Music Enabled",
      {
        fontSize: "32px",
      }
    );
    this.musicOn = true;

    this.musicButton.on(
      "pointerdown",
      function() {
        this.musicOn = !this.musicOn;
        this.updateAudio();
      }.bind(this)
    );
  }

  createSounds() {
    this.soundButton = this.add
      .image(this.width * 0.35, this.height * 0.37, "blackCheckmark")
      .setInteractive();
    this.soundText = this.add.text(
      this.width * 0.37,
      this.height * 0.35,
      "Sound Enabled",
      {
        fontSize: "32px",
      }
    );
    this.soundOn = true;

    this.soundButton.on(
      "pointerdown",
      function() {
        this.soundOn = !this.soundOn;
        this.updateAudio();
      }.bind(this)
    );
  }

  createReturnButton() {
    this.returnButton = this.add
      .sprite(this.width * 0.48, this.height * 0.8, "blueButton2")
      .setInteractive();

    this.returnText = this.add.text(0, 0, "Menu", {
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

  updateAudio() {
    if (this.musicOn === false) {
      this.musicButton.setTexture("greyButton");
      this.sound.stopByKey("bgMusic");
    } else {
      this.musicButton.setTexture("blackCheckmark");
      this.sound.play("bgMusic");
    }

    if (this.soundOn === false) {
      this.soundButton.setTexture("greyButton");
      this.sound.removeAll();
      if (this.musicOn === true) {
        this.sound.play("bgMusic");
      }
    } else {
      this.soundButton.setTexture("blackCheckmark");
      //this.sound.resumeAll()
    }
  }
}
