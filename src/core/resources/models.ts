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
      undefined,
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
  return obj3d;
}

export async function loadModels(
  onProgress?: (loaded: number, total: number) => void
) {
  let loaded = 0;
  const promises = [loadModel(bumperModel)];
  onProgress?.(0, promises.length);
  await Promise.all(
    promises.map(async (p) => {
      await p;
      loaded += 1;
      onProgress?.(loaded, promises.length);
    })
  );
}
