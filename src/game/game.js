import Phaser from "phaser";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

import MainScene from "@/game/scenes/MainScene";
import TitleScene from "@/game/scenes/TitleScene";
import Story from "@/game/scenes/Story";
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
import ICU from "@/game/scenes/ICU";
import EndScene from "./scenes/EndScene";
import VictoryScene from "@/game/scenes/Victory";

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    mode: Phaser.Scale.FIT,
    width: 1100,
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
        debug: false,
      },
    },

    scene: [
      Preloader,
      TitleScene,
      Story,
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
      ICU,
      EndScene,
      VictoryScene,
    ],
  });
}

export default launch;
export { launch };
