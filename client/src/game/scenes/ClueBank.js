import Phaser, { Scene } from "phaser";
import eventsCenter from "@/game/eventsCenter";
//surgery assets
import bar_of_soap from "@/game/assets/popups/bar_of_soap.png";
import rubber_glove from "@/game/assets/popups/rubber_glove.png";
import scapel from "@/game/assets/popups/scapel.png";
//patient's assets
import flowers from "@/game/assets/popups/flowers.png";
import blanket from "@/game/assets/popups/blanket.png";

class ClueBank extends Scene {
  constructor() {
    super({key: "ClueBank"})
  }

  preload() {
    //surgery
    this.load.image("glove", rubber_glove);
    this.load.image("soap", bar_of_soap);
    this.load.image("scapel", scapel)
    //patient's room
    this.load.image("flowers", flowers);
    this.load.image("blanket", blanket);

  }

  create(){
    const BankLabel = this.add.text(850, 10, "Clue Bank", { fontSize: 20, backgroundColor:"black", padding: 5});
    eventsCenter.on('update-bank', this.addImage, this)
  }

  addImage(key){
    this.add.image(850, 35, key).setScale(.1,.1);
  }
}

export default ClueBank
