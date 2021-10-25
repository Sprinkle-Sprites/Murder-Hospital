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
    this.images = {};
    this.count = 0;
    this.x = 850;
    this.y = 70;
  }

  preload() {
    //this preloader is not needed at the moment but keeping for the time, just in case
  }

  create() {
    const BankLabel = this.add.text(900, 10, "Clue Bank", {
      fontSize: 20,
      backgroundColor: "black",
      padding: 5,
    });
    eventsCenter.on("update-bank", this.addImage, this);
    eventsCenter.on("check-scapel", this.checker, this);
    eventsCenter.on("check-key", this.checker, this);
    this.input.on("pointerdown", this.embiggen, this);
  }

  addImage(key) {
    let keyArr = Object.keys(this.bank);
    if (!keyArr.includes(key)) {
      this.determineCoordinates(key);
      this.images[key] = this.add
        .image(this.bank[key].x, this.bank[key].y, key)
        .setScale(0.1, 0.1)
        .setInteractive();
    }
  }

  determineCoordinates(key) {
    this.count++;
    if (this.count === 1) {
      this.bank[key] = {
        x: this.x,
        y: this.y,
      };
    } else if (this.count % 3 === 0) {
      this.x = 1050;
    } else if (this.count % 3 === 2) {
      this.x = 950;
    } else if (this.count % 3 === 1) {
      this.y = this.y + 65;
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

  embiggen() {
    const xAxis = this.input.mousePointer.x;
    console.log("this is the xAxis", xAxis);
    const yAxis = this.input.mousePointer.y;
    console.log("this is the yAxis", yAxis);
    let a = Object.values(this.bank).find((item) => {
      let closestXs = this.closestX(xAxis);
      console.log("this is the array of Xs", closestXs);
      let closest = this.closestY(closestXs, yAxis);
      console.log("this is the closest Y", closest);
      console.log("this is the boolean", item === closest);
      return item === closest;
    });
    let key = this.isValueInArary(a);
    console.log("this is the key", key);
    const popUp = this.add.image(400, 300, key).setScale(0.5, 0.5);
    this.time.addEvent({
      delay: 4750,
      callback: () => popUp.destroy(),
      loop: false,
    });
  }

  closestX(xAxis) {
    let arrOfValues = Object.values(this.bank);
    let columnADiff = Math.abs(850 - xAxis);
    let columnBDiff = Math.abs(950 - xAxis);
    let columnCDiff = Math.abs(1050 - xAxis);
    if (columnADiff < columnBDiff && columnADiff < columnCDiff) {
      let aCol = arrOfValues.filter((val) => {
        return val.x === 850;
      });
      return aCol;
    } else if (columnBDiff < columnADiff && columnBDiff < columnCDiff) {
      let bCol = arrOfValues.filter((val) => {
        return val.x === 950;
      });
      return bCol;
    } else {
      let cCol = arrOfValues.filter((val) => {
        return val.x === 1050;
      });
      return cCol;
    }
  }

  closestY(arr, yAxis) {
    let difference = 100;
    let closest;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (Math.abs(item.y - yAxis) < difference) {
        difference = Math.abs(item.y - yAxis);
        closest = item;
      }
    }
    return closest;
  }

  isValueInArary(a) {
    let arrayOfKeys = Object.keys(this.bank);
    for (let i = 0; i < arrayOfKeys.length; i++) {
      let value = arrayOfKeys[i];
      if (this.bank[value] === a) {
        return value;
      }
    }
  }
}

export default ClueBank;
