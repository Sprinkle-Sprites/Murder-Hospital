import Phaser from "phaser";

//TILES
import InteriorA from "@/game/assets/tiles/Interior-Hospital-A.png";
import InteriorB from "@/game/assets/tiles/Interior-Hospital-B.png";
import InteriorC from "@/game/assets/tiles/Interior-Hospital-C.png";
import InteriorAlt from "@/game/assets/tiles/Interior-Hospital-Alt.png";
import Lab2 from "@/game/assets/tiles/Laboratory-2.png";
import Lab3 from "@/game/assets/tiles/Laboratory-3.png";
import bathroom from "@/game/assets/tiles/bathroom.png";
import creepyDoll from "@/game/assets/tiles/creepy_toys.png";
import Elevator from "@/game/assets/tiles/Elevator-Doors-Alt.png";

//SCENES
import board from "@/game/assets/tiles/board.json";
import radiology from "@/game/assets/tiles/radiology.json";
import surgery from "@/game/assets/tiles/surgery.json";
import morgue from "@/game/assets/tiles/morgue.json";
import laboratory from "@/game/assets/tiles/Laboratory.json";
import patients_room from "@/game/assets/tiles/patients_room.json";
import pharmacy from "@/game/assets/tiles/Pharmacy.json";
import ICU from "@/game/assets/tiles/ICU.json";
import exit_room from "@/game/assets/tiles/exit_room.json";
import locker_room from "@/game/assets/tiles/LockerRoom.json";

//GAME ASSETS
import combination_code from "@/game/assets/popups/locker_combo.png";
import lockerRoom from "@/game/assets/tiles/LockerRoom.png";
import blueButton from "@/game/assets/buttons/blue_button01.png";
import blueButton2 from "@/game/assets/buttons/blue_button02.png";
import githubLogo from "@/game/assets/buttons/github.png";
import linkedinLogo from "@/game/assets/buttons/linkedin.png";
import greyButton from "@/game/assets/buttons/grey_box.png";
import blackCheckmark from "@/game/assets/buttons/black-checkmark.png";

// BACKGROUND IMAGES
import hospital from "@/game/assets/background/abandoned_Hospital.jpg";
import creditBackground from "@/game/assets/background/burgandy-background.jpg";
import victory from "@/game/assets/background/parking-lot-victory.jpg";

//AUDIO
import bgMusic from "@/game/assets/audio/Paranormal Phenomena 1.wav";
import laughter from "@/game/assets/audio/human-giggle05.wav";
//ICU
import bloodSlip from "@/game/assets/audio/action-squelch03.wav";
import IVBloodBag from "@/game/assets/audio/object-plasticbag02.wav";
import monitorSound from "@/game/assets/audio/action-lighton01.wav";
import posterCrumble from "@/game/assets/audio/object-paperbagcrunch04.wav";
//LAB
import calendarCrumble from "@/game/assets/audio/object-paper05.wav";
import skeletonMovement from "@/game/assets/audio/action-openbook02.wav";
import testTubeGrab from "@/game/assets/audio/action-lightclick01.wav";
import beakerGrab from "@/game/assets/audio/action-unlock04.wav";
import candyTray from "@/game/assets/audio/action-objectmove.wav";
import deskDrawer from "@/game/assets/audio/action-doorshut01.wav";
//LOCKER ROOM
import lockerDoor from "@/game/assets/audio/object-gateswing04.wav";
import lockerDoor2 from "@/game/assets/audio/action-doorhandle01.wav";
import toothbrushSink from "@/game/assets/audio/object-gateclang01.wav";
import showerNote from "@/game/assets/audio/water-drop04.wav";
//MORGUE
import bodyLocker from "@/game/assets/audio/action-doorhandle01.wav";
import bodyLocker2 from "@/game/assets/audio/object-gateswing01.wav";
import chainsawLoveNote from "@/game/assets/audio/zipper_1.wav";
import notebook from "@/game/assets/audio/action-objectmove.wav";
import photo from "@/game/assets/audio/object-paperbagcrunch04.wav";
//PATIENT ROOM
import flowerWater from "@/game/assets/audio/water-drop03.wav";
import bedSheets from "@/game/assets/audio/action-objectmove.wav";
import doll from "@/game/assets/audio/action-objectmove.wav";
import lockedDrawer from "@/game/assets/audio/action-doorhandle01.wav";
import openedDrawer from "@/game/assets/audio/object-doorcreak10.wav";
//PHARMACY
import pills from "@/game/assets/audio/pill-shake.wav";
import keys from "@/game/assets/audio/key-jingle.wav";
import boxUnlock from "@/game/assets/audio/action-unlock02.wav";
import bandaid from "@/game/assets/audio/object-paper02.wav";
//RADIOLOGY
import lightClick from "@/game/assets/audio/action-lightclick01.wav";
import xrayOn from "@/game/assets/audio/action-lighton01.wav";
import xrayMachine from "@/game/assets/audio/typing.wav";
//SURGERY
import glove from "@/game/assets/audio/rubber-glove.wav";
import fireExtinguisher from "@/game/assets/audio/object-rockdrag02.wav";
import soap from "@/game/assets/audio/object-gateclang01.wav";
import scalpelAudio from "@/game/assets/audio/gasp1.wav";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }
  init() {
    //called everytime the scene restarts
    this.readyCount = 0;
  }
  preload() {
    this.preloadAudio();

    //create progress bar
    let progressBar = this.add.graphics().setPosition(140, 90);
    // //create & fill progress box
    let progressBox = this.add
      .graphics()
      .setPosition(140, 90)
      .fillStyle(0x282d36, 0.5)
      .fillRect(240, 270, 320, 50);

    //set the cameras width and height
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;

    //display loading text
    let loadingText = this.make.text({
      //set loading text in the middle of the screen
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading Blood...there's a lot of it...",
      style: {
        //look for font to change
        font: "30px",
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
      progressBar.fillStyle(0xffffff, 1).fillRect(250, 280, 300 * value, 30);
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

    this.timedEvent = this.time.delayedCall(1000, this.readyScene, [], this);
    // load assets for non-gameplay scenes
    this.load.image("blueButton", blueButton);
    this.load.image("blueButton2", blueButton2);
    this.load.image("hospital", hospital);
    this.load.image("credits-Background", creditBackground);
    this.load.image("githubLogo", githubLogo);
    this.load.image("linkedinLogo", linkedinLogo);
    this.load.image("greyButton", greyButton);
    this.load.image("blackCheckmark", blackCheckmark);
    this.load.image("victory", victory);

    // load any assets needed for game
    this.load.image("Interior-A", InteriorA);
    this.load.image("Interior-B", InteriorB);
    this.load.image("Interior-C", InteriorC);
    this.load.image("Interior-Alt", InteriorAlt);
    this.load.image("Elevator", Elevator);
    this.load.image("floor", Lab2);
    this.load.image("lockerRoom", lockerRoom);
    this.load.image("Lab-3", Lab3);
    this.load.image("Creepy-Doll", creepyDoll);
    this.load.image("pop-up-image", combination_code);
    this.load.image("Bathroom", bathroom);

    this.load.tilemapTiledJSON("board", board);
    this.load.tilemapTiledJSON("radiology", radiology);
    this.load.tilemapTiledJSON("surgery", surgery);
    this.load.tilemapTiledJSON("morgue", morgue);
    this.load.tilemapTiledJSON("Laboratory", laboratory);
    this.load.tilemapTiledJSON("patient", patients_room);
    this.load.tilemapTiledJSON("pharmacy", pharmacy);
    this.load.tilemapTiledJSON("ICU", ICU);
    this.load.tilemapTiledJSON("exit", exit_room);
    this.load.tilemapTiledJSON("LockerRoom", locker_room);
  } //end of preload

  preloadAudio() {
    //BACKGROUND
    this.load.audio("bgMusic", bgMusic);
    this.load.audio("laughter", laughter);

    //ICU
    this.load.audio("blood", bloodSlip);
    this.load.audio("IVBag", IVBloodBag);
    this.load.audio("monitor", monitorSound);
    this.load.audio("poster", posterCrumble);

    //LAB
    this.load.audio("calendar", calendarCrumble);
    this.load.audio("skeleton", skeletonMovement);
    this.load.audio("test tube", testTubeGrab);
    this.load.audio("beaker", beakerGrab);
    this.load.audio("candy", candyTray);
    this.load.audio("desk", deskDrawer);

    //LOCKER ROOM
    this.load.audio("locker", lockerDoor);
    this.load.audio("locker 2", lockerDoor2);
    this.load.audio("toothbrush", toothbrushSink);
    this.load.audio("shower", showerNote);

    //MORGUE
    this.load.audio("body locker", bodyLocker);
    this.load.audio("body locker 2", bodyLocker2);
    this.load.audio("love note", chainsawLoveNote);
    this.load.audio("notebook", notebook);
    this.load.audio("photo", photo);

    //PATIENT ROOM
    this.load.audio("flower", flowerWater);
    this.load.audio("sheets", bedSheets);
    this.load.audio("doll", doll);
    this.load.audio("locked drawer", lockedDrawer);
    this.load.audio("opened drawer", openedDrawer);

    //PHARMACY
    this.load.audio("pills", pills);
    this.load.audio("keys", keys);
    this.load.audio("box", boxUnlock);
    this.load.audio("bandaid", bandaid);

    //RADIOLOGY
    this.load.audio("light", lightClick);
    this.load.audio("xray on", xrayOn);
    this.load.audio("xray machine", xrayMachine);

    //SURGERY
    this.load.audio("glove", glove);
    this.load.audio("fire extinguisher", fireExtinguisher);
    this.load.audio("soap", soap);
    this.load.audio("scalpel", scalpelAudio);
  }
  create() {
    this.bgAudio();
  }

  bgAudio() {
    const bgMusic = this.sound.add("bgMusic", {
      loop: true,
    });

    if (!this.sound.locked) {
      bgMusic.play();
    } else {
      this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
        bgMusic.play();
      });
    }
  }

  readyScene() {
    this.readyCount++;
    //once readyCount is equal to 2, we know it is safe to start title scene
    if (this.readyCount === 2) {
      // have it lead to title scene
      this.scene.start("TitleScene");
    }
  }
}
