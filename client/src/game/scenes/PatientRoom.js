import Phaser, { Scene } from "phaser";
import Player from "@/game/Player";
import {
  resizeMapLayer,
  resizeCollider,
  createMessage,
  nextSceneFunc,
} from "@/game/HelperFunctions";

import collider from "@/game/assets/collider.png";

import RoomTimer from "@/game/scenes/RoomTimer";

class PatientRoom extends Scene {
  constructor() {
    super({key: "PatientRoom"});
  }
}

export default PatientRoom
