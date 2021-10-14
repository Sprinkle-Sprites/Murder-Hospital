import Phaser from "phaser";
import MainScene from "@/game/scenes/MainScene";
import Preloader from "@/game/scenes/Preloader";
import Radiology from "@/game/scenes/Radiology";
import MainTimerScene from "@/game/scenes/MainTimerScene";

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    scene: [Preloader, Radiology, MainScene, MainTimerScene],
  });
}

export default launch;
export { launch };
