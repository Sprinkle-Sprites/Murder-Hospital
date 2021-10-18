import Phaser from "phaser";

export default class MainTimer {
  /** @type {Phaser.Scene} */
  scene;
  /** @type {Phaser.GameObjects.Text} */
  label;
  /** @type {Phaser.Time.TimerEvent} */
  timerEvent;

  duration = 0;

  /**
   *
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.Text} label
   */

  constructor(scene, label, timerEvent) {
    this.scene = scene;
    this.label = label;
  }

  /**
   *
   * @param {() => void} callback
   * @param {number} duration
   */

  start(callback, duration = 3600000) {
    this.stop();

    this.finishedCallback = callback;
    this.duration = duration;

    //calls function after set amount of time passes
    this.timerEvent = this.scene.time.addEvent({
      delay: duration,
      callback: () => {
        //text to display when timer ends
        this.label.text = "Game Time: 00:00";
        this.stop();

        if (callback) {
          callback();
        }
      },
    });
  }

  stop() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = undefined;
    }
  }
  zeroPad(number, size) {
    let stringNumber = String(number);
    while (stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  minusFive() {
    this.minutes -= "5";
    return this.minutes;
  }

  update() {
    if (!this.timerEvent || this.duration <= 0) {
      // return undefined
      return;
    }

    this.elapsed = this.timerEvent.getElapsed();
    this.remaining = this.duration - this.elapsed;
    this.seconds = this.remaining / 1000;
    this.minutes = this.zeroPad(Math.floor(this.seconds / 60), 2);
    this.partInSeconds = this.zeroPad((this.seconds % 60).toFixed(0), 2);
    this.label.text = `Game Time:\n ${this.minutes}:${this.partInSeconds}`;

    this.minusFive();
  }
}
