import Phaser from "phaser";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

import MainScene from "@/game/scenes/MainScene";
import Preloader from "@/game/scenes/Preloader";
import Radiology from "@/game/scenes/Radiology";
import MainTimerScene from "@/game/scenes/MainTimerScene";
import Surgery from "@/game/scenes/Surgery";
import Morgue from "@/game/scenes/Morgue";
import Laboratory from "@/game/scenes/Laboratory";
import PatientRoom from "@/game/scenes/PatientRoom";
import ClueBank from "@/game/scenes/ClueBank";
import Pharmacy from "@/game/scenes/Pharmacy";
import Exit from "@/game/scenes/Exit";
import LockerRoom from "@/game/scenes/LockerRoom";

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    mode: Phaser.Scale.FIT,
    width: 1000,
    height: 650,
    parent: containerId,
    dom: {
      createContainer: true,
    },
    plugins: {
      scene: [
        {
          key: "rexUI",
          plugin: RexUIPlugin,
          mapping: "rexUI",
        },
      ],
    },
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
      ClueBank,
      Morgue,
      Exit,
      LockerRoom,
    ],
  });
}

export default launch;
export { launch };
