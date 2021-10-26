import Phaser, { Scene } from "phaser";
import MainTimer from "@/game/scenes/MainTimer";
import { diceNextSceneFunc } from "@/game/HelperFunctions";
import laughter from "@/game/assets/audio/human-giggle05.wav";
//NOTE: MainTimer functionality has not been removed from homepage, and is commented out in Radiology

class MainSceneTimer extends Phaser.Scene {
  constructor() {
    super({ key: "MainTimerScene" });
  }

  preload() {
    this.load.audio("laughter", laughter);
  }

  create() {
    const timerLabel = this.add.text(620, 610, "", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 10,
    });

    this.mainTimer = new MainTimer(this, timerLabel);
    this.mainTimer.start(this.handleCountdownFinished.bind(this));

    //AUDIO
    this.laughterSound = this.sound.add("laughter");
  }

  handleCountdownFinished() {
    // const { width, height } = this.scale;
    // this.add
    //   .text(width * 0.5, height * 0.5, "You've been captured", {
    //     fontSize: 30,
    //   })
    //   .setOrigin(0.5);
    diceNextSceneFunc(this, "EndScene");
  }

  update() {
    this.mainTimer.update();

    const minutes = Number(this.mainTimer.minutes);
    const seconds = Number(this.mainTimer.partInSeconds);

    //AUDIO
    if (minutes % 5 === 0) {
      if (seconds === 59) {
        this.laughterSound.play();
      }
    }
  }
}

export default MainSceneTimer;
