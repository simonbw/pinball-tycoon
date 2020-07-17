import { Mesh, Object3D, Scene } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import bumperModel from "../../../resources/models/bumperModel.glb";

const loader = new GLTFLoader();

type ModelName = string;

export const MODELS = new Map<ModelName, Mesh>();

async function loadModel(
  url: string,
  anistropy: number = 4
): Promise<Object3D> {
  const gltf: GLTF = await new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(gltf),
      (progressEvent) => console.log(progressEvent),
      (error) => reject(error)
    );
  });

  // Don't ask me why
  const obj3d = gltf.scene.children[0];
  if (!(obj3d instanceof Mesh)) {
    throw new Error("model ain't no mesh");
  }
  MODELS.set(url, obj3d);
  if (obj3d.material.map) {
    obj3d.material.map.anistropy = anistropy;
  }
  if (obj3d.material.emissiveMap) {
    obj3d.material.emissiveMap.anistropy = anistropy;
  }
  console.log(obj3d.material);
  return obj3d;
}

export async function loadModels() {
  console.log("loading models");
  await Promise.all([loadModel(bumperModel)]);
}
