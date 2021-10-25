import Phaser, { Scene } from "phaser";

export default class Story extends Scene {
  constructor() {
    super("Story");
  }

  create() {
    this.createBackground();
    this.createStory();
    this.createPlayButton();
    this.createReturnButton();
  }

  createBackground() {
    this.add.image(200, 200, "hospital").setScale(0.9);
  }

  createStory() {
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
        "...down a dark country road. It is storming. Your car breaks down. \n \n You remember passing what looked like a hospital a few miles back. You walk to the hospital to get help. When you go inside, you're locked in and a timer appears on the wall. \n \n A disembodied voice comes through the hospital speakers:",
        {
          fontSize: 20,
          wordWrap: { width: 900, useAdvancedWrap: true },
        }
      )
      .setShadow(3, 3, "black", 7, false, true);

    this.add
      .text(
        100,
        320,
        "Hello, strangers. Welcome to my humble abode. You've caught me at a bad time, and I had to run out for a few essentials...you're locked in until I return in an hour. Make yourself at home...if you can.",
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
        420,
        "The transmission ends. You see there is a key pad by the door. Can you figure out the code and get out of the hospital before the Doctor returns?",
        {
          fontSize: 20,
          wordWrap: { width: 900, useAdvancedWrap: true },
        }
      )
      .setShadow(3, 3, "black", 7, false, true);
  }

  createPlayButton() {
    this.playButton = this.add.sprite(390, 550, "blueButton").setInteractive();

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

  createReturnButton() {
    this.returnButton = this.add
      .sprite(690, 550, "blueButton2")
      .setInteractive();

    this.returnText = this.add.text(0, 0, "Return", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.centerButtonText(this.returnText, this.returnButton);

    this.returnButton.on(
      "pointerdown",
      function() {
        this.scene.start("TitleScene");
      }.bind(this)
    );

    this.input.on("pointerover", function(event, gameObjects) {
      gameObjects[0].setTexture("blueButton2");
    });
  }
}
