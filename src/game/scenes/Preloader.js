import Phaser from "phaser";
import monsterA from "@/game/assets/characters/Monster-A/Monster-A-down.png";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  init() {
    //called everytime the scene restarts
    this.readyCount = 0;
  }
  preload() {
    //create progress bar
    let progressBar = this.add.graphics();
    //create progress box
    let progressBox = this.add.graphics();
    //fill the progress box
    progressBox.fillStyle(0x282d36);
    progressBox.fillRect(240, 270, 320, 50);

    //set the cameras width and height
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    //display loading text
    let loadingText = this.make.text({
      //set loading text in the middle of the screen
      x: width / 2,
      y: height / 2 - 50,
      text: "A Crime is Occurring ...",
      style: {
        //look for font to change
        font: "30px Inconsolata",
        color: "#ffffff",
      },
    });

    //set loading text origin to middle of the screen
    loadingText.setOrigin(0.5, 0.5);

    //display percent number within box
    let percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: "0%",
      style: {
        font: "25px Inconsolata",
        color: "#ffffff",
      },
    });

    percentText.setOrigin(0.5, 0.5);

    //update the progress bar as it loads
    this.load.on("progress", (value) => {
      percentText.setText(parseInt(value) * 100 + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    //remove the loading screen once we have reached 100%
    this.load.on(
      "complete",
      function() {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        this.readyScene();
      }.bind(this)
    );

    this.timedEvent = this.time.delayedCall(3000, this.readyScene, [], this);

    ///load any assests needed for game
    //needs image to load to show percentage bar
    this.load.image("monsterA", monsterA);
  } //end of preload

  readyScene() {
    this.readyCount++;
    //once readyCount is equal to 2, we know it is safe to start title scene
    if (this.readyCount === 2) {
      // have it lead to title sceene
        this.scene.start('MainScene')
    }
  }
}
