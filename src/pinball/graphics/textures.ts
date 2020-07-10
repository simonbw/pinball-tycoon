import { TextureLoader, RepeatWrapping, MirroredRepeatWrapping } from "three";
import woodSrc from "../../../resources/images/wood.png";

const loader = new TextureLoader();

const Wood = loader.load(woodSrc);
Wood.wrapS = RepeatWrapping;
Wood.wrapT = MirroredRepeatWrapping;
Wood.repeat.set(1.2, 1.2);
Wood.center.set(0.5, 0.5);
Wood.rotation = Math.PI / 2.0;

export const TEXTURES = {
  Wood,
};
