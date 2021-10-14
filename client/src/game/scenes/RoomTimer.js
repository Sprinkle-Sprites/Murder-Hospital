import Phaser from "phaser";

export default class RoomTimer {
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

  constructor(scene, label) {
    this.scene = scene;
    this.label = label;
  }
  /**
   *
   * @param {() => void} callback
   * @param {number} duration
   */

  start(callback, duration = 30000) {
    this.stop();

    this.finishedCallback = callback;
    this.duration = duration;

    //calls function after set amount of time passes
    this.timerEvent = this.scene.time.addEvent({
      delay: duration,
      callback: () => {
        //text to display when timer ends
        this.label.text = "Your Time: \n 00:00";
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

  update() {
    if (!this.timerEvent || this.duration <= 0) {
      // return undefined
      return;
    }
    const elapsed = this.timerEvent.getElapsed();
    const remaining = this.duration - elapsed;
    const seconds = this.zeroPad((remaining / 1000).toFixed(0), 2);
    this.label.text = `Your Time: \n 00:${seconds}`
  }
}
