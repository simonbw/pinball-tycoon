import {
  LinearFilter,
  LinearMipmapLinearFilter,
  NearestFilter,
  RepeatWrapping,
  TextureLoader,
} from "three";
import bumperEmissive from "../../../resources/images/bumper-emissive.png";
import bumper from "../../../resources/images/bumper.png";
import hockeyPlayfield from "../../../resources/images/hockey_playfield.png";
import ironScuffedRoughness from "../../../resources/images/Iron-Scuffed_roughness.png";
import plasticpattern1Normal2Ogl from "../../../resources/images/plasticpattern1-normal2-ogl.png";
import plasticpattern1Roughness2 from "../../../resources/images/plasticpattern1-roughness2.png";
import scuffedPlasticNormal from "../../../resources/images/scuffed-plastic-normal.png";
import scuffedPlasticRough from "../../../resources/images/scuffed-plastic-rough.png";
import scuffedPlastic5Alb from "../../../resources/images/scuffed-plastic5-alb.png";
import woodSrc from "../../../resources/images/wood.png";

const loader = new TextureLoader();

export const TEXTURES = {
  HockeyPlayfield: loader.load(hockeyPlayfield),
  IronScuffedRoughness: loader.load(ironScuffedRoughness),
  PlasticScuffed: loader.load(scuffedPlastic5Alb),
  PlasticScuffedNormal: loader.load(scuffedPlasticNormal),
  PlasticScuffedRoughness: loader.load(scuffedPlasticRough),
  Wood: loader.load(woodSrc),
  BumpyPlasticNormal: loader.load(plasticpattern1Normal2Ogl),
  BumpyPlasticRoughness: loader.load(plasticpattern1Roughness2),
  Bumper: loader.load(bumper),
  BumperEmissive: loader.load(bumperEmissive),
};

for (const texture of Object.values(TEXTURES)) {
  texture.anisotropy = 4;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
}

// TEXTURES.Bumper.flipY = false;
TEXTURES.Bumper.repeat.set(0.5, 0.5);

// Customize textures
TEXTURES.HockeyPlayfield.anisotropy = 16;
TEXTURES.HockeyPlayfield.generateMipmaps = true;
TEXTURES.HockeyPlayfield.magFilter = LinearFilter;
TEXTURES.HockeyPlayfield.minFilter = LinearMipmapLinearFilter;

TEXTURES.BumpyPlasticNormal.repeat.set(0.1, 0.1);
TEXTURES.BumpyPlasticRoughness.repeat.set(0.1, 0.1);
TEXTURES.BumpyPlasticNormal.minFilter = NearestFilter;
TEXTURES.BumpyPlasticRoughness.minFilter = NearestFilter;

export function waitForTexturesLoaded(
  onProgress?: (completed: number, total: number) => void
) {
  if (Object.values(TEXTURES).every((texture) => Boolean(texture.image))) {
    const total = Object.values(TEXTURES).length;
    onProgress?.(total, total);
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const manager = loader.manager;
    manager.onLoad = () => resolve();
    manager.onError = () => reject();

    manager.onProgress = (url, n, t) => onProgress?.(n, t);
  });
}
