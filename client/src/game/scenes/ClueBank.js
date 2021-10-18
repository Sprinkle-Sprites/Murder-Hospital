import Phaser, { Scene } from "phaser";
import eventsCenter from "@/game/eventsCenter";
//surgery assets
import bar_of_soap from "@/game/assets/popups/bar_of_soap.png";
import rubber_glove from "@/game/assets/popups/rubber_glove.png";
import scapel from "@/game/assets/popups/scapel.png";
//patient's assets
import flowers from "@/game/assets/popups/flowers.png";
import blanket from "@/game/assets/popups/blanket.png";
import paperScrap from "@/game/assets/popups/paperScrap.png";

class ClueBank extends Scene {
  constructor() {
    super({ key: "ClueBank" });
    this.bank = {};
    this.count = 0;
    this.x = 850;
    this.y = 70;
  }

  preload() {
    //surgery
    this.load.image("glove", rubber_glove);
    this.load.image("soap", bar_of_soap);
    this.load.image("scapel", scapel);
    //patient's room
    this.load.image("flowers", flowers);
    this.load.image("blanket", blanket);
    this.load.image("paperScrap", paperScrap);
  }

  create() {
    const BankLabel = this.add.text(850, 10, "Clue Bank", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 5,
    });
    eventsCenter.on("update-bank", this.addImage, this);
    eventsCenter.on("check-scapel", this.checker, this);
  }

  addImage(key) {
    let keyArr = Object.keys(this.bank);
    if (!keyArr.includes(key)) {
      this.determineCoordinates(key);
      this.add
        .image(this.bank[key].x, this.bank[key].y, key)
        .setScale(0.1, 0.1);
    }
  }

  determineCoordinates(key) {
    this.count++;

    if (this.count === 1) {
      this.bank[key] = {
        x: this.x,
        y: this.y,
      };
    } else if (this.count % 2 === 0) {
      this.x = 950;
    } else {
      this.y = this.y + 60;
      this.x = 850;
    }

    this.bank[key] = {
      x: this.x,
      y: this.y,
    };
  }

  checker(key) {
    let keyArr = Object.keys(this.bank);
    if (keyArr.includes(key)) {
      eventsCenter.emit("confirmation-check", true);
    } else {
      eventsCenter.emit("confirmation-check", false);
    }
  }
}

export default ClueBank;
