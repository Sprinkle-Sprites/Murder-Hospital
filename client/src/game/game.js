import Phaser from "phaser";
import MainScene from "@/game/scenes/MainScene";
import Preloader from "@/game/scenes/Preloader";
import Radiology from "@/game/scenes/Radiology";
import MainTimerScene from "@/game/scenes/MainTimerScene";
import Surgery from "@/game/scenes/Surgery";
import Laboratory from "@/game/scenes/Laboratory";
import PatientRoom from "@/game/scenes/PatientRoom";
import ClueBank from "@/game/scenes/ClueBank";
import Pharmacy from "@/game/scenes/Pharmacy";

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    mode: Phaser.Scale.FIT,
    width: 1000,
    height: 650,
    parent: containerId,
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 0,
        },
        debug: true,
      },
    },
    scene: [
      Preloader,
      Radiology,
      Surgery,
      MainScene,
      MainTimerScene,
      Laboratory,
      PatientRoom,
      Pharmacy,
      ClueBank
    ],
  });
}

export default launch;
export { launch };
