import Phaser from "phaser";

export function resizeCollider(obj, width, height) {
  obj.body.setSize(obj.width - width, obj.height - height, true);
}

export function resizeMapLayer(scene, layer) {
  layer.displayWidth = scene.sys.canvas.width - 200;
  layer.displayHeight = scene.sys.canvas.height - 50;
}

export function createMessage(scene, message) {
  const width = scene.sys.canvas.width;
  const height = scene.sys.canvas.height;

  scene.add
    .text(width * 0.5, height * 0.5, message, {
      fontSize: 30,
      backgroundColor: "black",
      wordWrap: { width: 300, useAdvancedWrap: true },
      strokeThickness: 5,
      stroke: "#69070c",
      padding: {
        top: 200,
      },
      align: "center",
      fixedWidth: width,
      fixedHeight: height,
    })
    .setOrigin(0.5, 0.5);
}

export function nextSceneFunc(scene, nextScene) {
  setTimeout(() => {
    scene.cameras.main.fadeOut(250, 0, 0, 0);
    scene.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        scene.scene.start(nextScene);
      }
    );
  }, 2000);
}
