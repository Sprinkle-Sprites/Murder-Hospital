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
    this.createFeatureLogos();
    this.createSpecialThanks();
    this.createReturnButton();
  }

  createBackground() {
    this.add.image(200, 200, "credits-Background");
  }
  createScale() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;

    console.log("width", this.width);
    console.log("height", this.height);
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
    // GABBY
    this.add
      .text(this.width * 0.18, this.height * 0.35, "Gabriella (Gabby) Apeadu", {
        fontFamily: "Oswald",
        fontSize: "25px",
        stroke: "#D9B48FFF",
      })
      .setOrigin(0, 0.5)
      .setShadow(5, 5, "black", 5, false, true);

    // HELENA
    this.add
      .text(this.width * 0.62, this.height * 0.35, "Helena Bliss", {
        fontFamily: "Oswald",
        fontSize: "25px",
        stroke: "#D9B48FFF",
      })
      .setOrigin(0, 0.5)
      .setShadow(5, 5, "black", 5, false, true);

    // NICOLE
    this.add
      .text(this.width * 0.18, this.height * 0.52, "Nicole Buendia", {
        fontFamily: "Oswald",
        fontSize: "25px",
        stroke: "#D9B48FFF",
      })
      .setOrigin(0, 0.5)
      .setShadow(5, 5, "black", 5, false, true);

    // SARAH
    this.add
      .text(this.width * 0.62, this.height * 0.52, "Sarah Sheppard", {
        fontFamily: "Oswald",
        fontSize: "25px",
        stroke: "#D9B48FFF",
      })
      .setOrigin(0, 0.5)
      .setShadow(5, 5, "black", 5, false, true);
  }

  createFeatureLogos() {
    this.logos = [];

    // GABBY'S LOGOS
    this.logos.push(
      this.add
        .image(this.width * 0.25, this.height * 0.42, "githubLogo")
        .setInteractive()
        .setScale(0.08)
        .setOrigin(0, 0.5)
    );
    this.logos.push(
      this.add
        .image(this.width * 0.3, this.height * 0.42, "linkedinLogo")
        .setInteractive()
        .setScale(0.08)
        .setOrigin(0, 0.5)
    );

    // HELENA'S LOGOS
    this.logos.push(
      this.add
        .image(this.width * 0.65, this.height * 0.42, "githubLogo")
        .setInteractive()
        .setScale(0.08)
        .setOrigin(0, 0.5)
    );
    this.logos.push(
      this.add
        .image(this.width * 0.7, this.height * 0.42, "linkedinLogo")
        .setInteractive()
        .setScale(0.08)
        .setOrigin(0, 0.5)
    );

    // NICOLE'S LOGOS
    this.logos.push(
      this.add
        .image(this.width * 0.25, this.height * 0.59, "githubLogo")
        .setInteractive()
        .setScale(0.08)
        .setOrigin(0, 0.5)
    );
    this.logos.push(
      this.add
        .image(this.width * 0.3, this.height * 0.59, "linkedinLogo")
        .setInteractive()
        .setScale(0.08)
        .setOrigin(0, 0.5)
    );

    // SARAH

    this.logos.push(
      this.add
        .image(this.width * 0.65, this.height * 0.59, "githubLogo")
        .setInteractive()
        .setScale(0.08)
        .setOrigin(0, 0.5)
    );
    this.logos.push(
      this.add
        .image(this.width * 0.7, this.height * 0.59, "linkedinLogo")
        .setInteractive()
        .setScale(0.08)
        .setOrigin(0, 0.5)
    );

    this.addLinks();
  }

  goToLink(url) {
    const tab = window.open(url, "_blank");
    if (tab && tab.focus) {
      tab.focus();
    } else if (!tab) {
      window.location.href = url;
    }
  }

  addLinks() {
    const urls = [
      "https://github.com/gapeadu",
      "https://www.linkedin.com/in/gabriellaap/",
      "https://github.com/hbliss2",
      "https://www.linkedin.com/in/helena-bliss/",
      "https://github.com/nbuendia",
      "https://www.linkedin.com/in/nicole-buendia/",
      "https://github.com/sheppas",
      "https://www.linkedin.com/in/sheppas/",
    ];

    for (let i = 0; i < this.logos.length; i++) {
      this.logos[i].on("pointerup", () => this.goToLink(urls[i]), this);
    }
  }

  createSpecialThanks() {
    this.add
      .text(this.width * 0.18, this.height * 0.85, "Special Thanks : ", {
        fontFamily: "GypsyCurse",
        fontSize: "40px",
      })
      .setOrigin(0.5, 0.5)
      .setColor("red")
      .setShadow(5, 5, "black", 5, false, true);

    this.add
      .text(
        this.width * 0.25,
        this.height * 0.85,
        " Mac Mcinerney (instructor), Joe Alves (instructor), and McKenna Warren (PM)",
        {
          fontFamily: "Oswald",
          fontSize: "25px",
          stroke: "#D9B48FFF",
        }
      )
      .setOrigin(0, 0.5)
      .setShadow(5, 5, "black", 5, false, true);
  }

  createReturnButton() {
    this.returnButton = this.add
      .sprite(this.width * 0.9, this.height * 0.95, "blueButton2")
      .setScale(0.5)
      .setInteractive();

    this.returnText = this.add.text(0, 0, "Return", {
      fontSize: "16px",
      fill: "#fff",
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
