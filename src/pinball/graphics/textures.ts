import { TextureLoader, RepeatWrapping, MirroredRepeatWrapping } from "three";
import woodSrc from "../../../resources/images/wood.png";
import metalgrid4Basecolor from "../../../resources/images/metalgrid4_basecolor.png";
import metalgrid4Ao from "../../../resources/images/metalgrid4_AO.png";
import metalgrid4NormalOgl from "../../../resources/images/metalgrid4_normal-ogl.png";
import metalgrid4Roughness from "../../../resources/images/metalgrid4_roughness.png";
import ironScuffedRoughness from "../../../resources/images/Iron-Scuffed_roughness.png";
import haytexture from "../../../resources/images/haytexture.jpg";

const loader = new TextureLoader();

const Wood = loader.load(woodSrc);
Wood.wrapS = RepeatWrapping;
Wood.wrapT = MirroredRepeatWrapping;
Wood.repeat.set(2.5, 1.5);
Wood.center.set(0.5, 0.5);
Wood.rotation = Math.PI / 2.0;
Wood.anisotropy = 4;

const MetalGrid = loader.load(metalgrid4Basecolor);
const MetalGridAO = loader.load(metalgrid4Ao);
const MetalGridNormal = loader.load(metalgrid4NormalOgl);
const MetalGridRoughness = loader.load(metalgrid4Roughness);

const IronScuffedRoughness = loader.load(ironScuffedRoughness);
IronScuffedRoughness.wrapS = RepeatWrapping;
IronScuffedRoughness.wrapT = RepeatWrapping;

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
  Hay,
};
