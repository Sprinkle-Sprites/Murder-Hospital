import Phaser, { Scene } from "phaser";

export default class CreditsScene extends Scene {
  constructor() {
    super({ key: "CreditsScene" });
  }

  create() {
    this.createBackground();
    this.createScale();
    this.createTitleText();
    this.createTeam();
    this.createFeatureLinks();
  }

  createBackground() {
    this.add.image(200, 200, "credits-Background");
  }
  createScale() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
  }

  createTitleText() {
    this.add
      .text(this.width * 0.5, this.height * 0.1, "Murder Hospital", {
        fontFamily: "GypsyCurse",
        fontSize: "50px",
      })
      .setOrigin(0.5, 0.5)
      .setColor("red")
      .setShadow(5, 5, "black", 5, false, true);
  }

  createTeam() {
    this.add
      .text(this.width * 0.18, this.height * 0.35, "Gabriella (Gabby) Apeadu", {
        fontFamily: "Oswald",
        fontSize: "25px",
        stroke: "#D9B48FFF",
      })
      .setOrigin(0, 0.5)
      .setShadow(5, 5, "black", 5, false, true);

    this.add
      .text(this.width * 0.6, this.height * 0.35, "Helena Bliss", {
        fontFamily: "Oswald",
        fontSize: "25px",
        stroke: "#D9B48FFF",
      })
      .setOrigin(0, 0.5)
      .setShadow(5, 5, "black", 5, false, true);

    this.add
      .text(this.width * 0.18, this.height * 0.52, "Nicole Buendia", {
        fontFamily: "Oswald",
        fontSize: "25px",
        stroke: "#D9B48FFF",
      })
      .setOrigin(0, 0.5)
      .setShadow(5, 5, "black", 5, false, true);

    this.add
      .text(this.width * 0.6, this.height * 0.52, "Sarah Sheppard", {
        fontFamily: "Oswald",
        fontSize: "25px",
        stroke: "#D9B48FFF",
      })
      .setOrigin(0, 0.5)
      .setShadow(5, 5, "black", 5, false, true);
  }

  createFeatureLinks() {
    this.teamButtons = [];
    // GABBY
    this.teamButtons.push(
      this.add
        .image(this.width * 0.25, this.height * 0.42, "githubLogo")
        .setInteractive()
        .setScale(0.1)
        .setOrigin(0, 0.5)
    );
    this.teamButtons.push(
      this.add
        .image(this.width * 0.3, this.height * 0.42, "linkedinLogo")
        .setInteractive()
        .setScale(0.1)
        .setOrigin(0, 0.5)
    );

    // HELENA

    // NICOLE

    // SARAH
  }
}
