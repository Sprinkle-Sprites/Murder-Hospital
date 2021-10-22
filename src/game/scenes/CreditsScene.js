import Phaser, { Scene } from "phaser";

export default class CreditsScene extends Scene {
  constructor() {
    super({ key: "CreditsScene" });
  }

  create() {
    this.createBackground();
    this.createTitleText();
  }

  createBackground() {
    this.add.image(200, 200, "credits-Background");
  }

  createTitleText() {
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    this.add
      .text(width * 0.5, height * 0.1, "Murder Hospital", {
        fontFamily: "GypsyCurse",
        fontSize: "50px",
      })
      .setOrigin(0.5, 0.5)
      .setColor("#DD9200");
  }

  createTeam() {}
}
