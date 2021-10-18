import Phaser, { Scene } from "phaser";
import MainTimer from "@/game/scenes/MainTimer";

//NOTE: MainTimer functionality has not been removed from homepage, and is commented out in Radiology

class MainSceneTimer extends Phaser.Scene {
  constructor() {
    super({ key: "MainTimerScene" });
  }

  create() {
    const timerLabel = this.add.text(620, 35, "", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 10,
    });
    this.mainTimer = new MainTimer(this, timerLabel);
    this.mainTimer.start(this.handleCountdownFinished.bind(this));
  }

  handleCountdownFinished() {
    const { width, height } = this.scale;
    this.add
      .text(width * 0.5, height * 0.5, "You've been captured", {
        fontSize: 30,
      })
      .setOrigin(0.5);
  }

  update() {
    this.mainTimer.update();
  }
}

export default MainSceneTimer;
