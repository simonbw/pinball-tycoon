import {
  DefaultLoadingManager,
  LinearFilter,
  LinearMipMapLinearFilter,
  MirroredRepeatWrapping,
  RepeatWrapping,
  TextureLoader,
} from "three";
import haytexture from "../../../resources/images/haytexture.jpg";
import ironScuffedRoughness from "../../../resources/images/Iron-Scuffed_roughness.png";
import metalgrid4Ao from "../../../resources/images/metalgrid4_AO.png";
import metalgrid4Basecolor from "../../../resources/images/metalgrid4_basecolor.png";
import metalgrid4NormalOgl from "../../../resources/images/metalgrid4_normal-ogl.png";
import metalgrid4Roughness from "../../../resources/images/metalgrid4_roughness.png";
import woodSrc from "../../../resources/images/wood.png";
import scuffedPlasticRough from "../../../resources/images/scuffed-plastic-rough.png";
import scuffedPlasticNormal from "../../../resources/images/scuffed-plastic-normal.png";
import scuffedPlastic5Alb from "../../../resources/images/scuffed-plastic5-alb.png";

const loader = new TextureLoader();
loader.manager.onStart = (url) => console.log(`loading ${url}`);

const Wood = loader.load(woodSrc);
Wood.wrapS = RepeatWrapping;
Wood.wrapT = MirroredRepeatWrapping;
Wood.repeat.set(2.5, 1.5);
Wood.center.set(0.5, 0.5);
Wood.rotation = Math.PI / 2.0;
Wood.anisotropy = 4;
Wood.minFilter = LinearMipMapLinearFilter;
Wood.magFilter = LinearFilter;

const MetalGrid = loader.load(metalgrid4Basecolor);
const MetalGridAO = loader.load(metalgrid4Ao);
const MetalGridNormal = loader.load(metalgrid4NormalOgl);
const MetalGridRoughness = loader.load(metalgrid4Roughness);

const IronScuffedRoughness = loader.load(ironScuffedRoughness);
IronScuffedRoughness.wrapS = RepeatWrapping;
IronScuffedRoughness.wrapT = RepeatWrapping;

const PlasticScuffed = loader.load(scuffedPlastic5Alb);
const PlasticScuffedRoughness = loader.load(scuffedPlasticRough);
const PlasticScuffedNormal = loader.load(scuffedPlasticNormal);

for (const t of [
  PlasticScuffed,
  PlasticScuffedNormal,
  PlasticScuffedRoughness,
]) {
  t.wrapS = MirroredRepeatWrapping;
  t.wrapT = MirroredRepeatWrapping;
  t.repeat.set(3, 3);

  t.anisotropy = 4;
}

const Hay = loader.load(haytexture);

for (const t of [MetalGrid, MetalGridAO, MetalGridNormal, MetalGridRoughness]) {
  t.wrapS = RepeatWrapping;
  t.wrapT = RepeatWrapping;
  t.center.set(0.5, 0.5);
  t.repeat.set(1, 2);
}

export const TEXTURES = {
  Wood,
  MetalGrid,
  MetalGridAO,
  MetalGridNormal,
  MetalGridRoughness,
  IronScuffedRoughness,
  PlasticScuffed,
  PlasticScuffedRoughness,
  PlasticScuffedNormal,
  Hay,
};

export function waitForTexturesLoaded(
  onProgress?: (completed: number, total: number) => void
) {
  if (Object.values(TEXTURES).every((texture) => Boolean(texture.image))) {
    console.log("all textures already loaded");
    const total = Object.values(TEXTURES).length;
    onProgress?.(total, total);
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    console.log("loading textures...");
    const manager = loader.manager;
    manager.onLoad = () => resolve();
    manager.onError = () => reject();

    manager.onStart = (url) => console.log(`loading ${url}`);
    manager.onProgress = (url, n, t) => onProgress?.(n, t);
  });
}
