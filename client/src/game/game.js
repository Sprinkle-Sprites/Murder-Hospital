import Phaser from "phaser";
import MainScene from "@/game/scenes/MainScene";
import Preloader from "@/game/scenes/Preloader";
import Radiology from "@/game/scenes/Radiology";
<<<<<<< HEAD
import MainTimerScene from "@/game/scenes/MainTimerScene";
=======
>>>>>>> 26e717fc3a5ad0ef02b9ab82fd57d3437a231842

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
<<<<<<< HEAD
    scene: [Preloader, Radiology, MainScene, MainTimerScene],
=======
    scene: [Preloader, MainScene, Radiology],
>>>>>>> 26e717fc3a5ad0ef02b9ab82fd57d3437a231842
  });
}

export default launch;
export { launch };
