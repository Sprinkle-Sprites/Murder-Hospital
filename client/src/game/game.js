import Phaser from "phaser";
import MainScene from "@/game/scenes/MainScene";
import Preloader from "@/game/scenes/Preloader";
import Radiology from "@/game/scenes/Radiology";
import MainTimerScene from "@/game/scenes/MainTimerScene";
import Surgery from "@/game/scenes/Surgery"

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
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
    scene: [Preloader, Radiology, Surgery, MainScene, MainTimerScene],
  });
}

export default launch;
export { launch };
