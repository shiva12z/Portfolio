import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
  loader.setDRACOLoader(dracoLoader);

  const onModelLoaded = async (gltf: GLTF) => {
    const character = gltf.scene;
    await renderer.compileAsync(character, camera, scene);
    character.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.frustumCulled = true;
        if (mesh.material && !Array.isArray(mesh.material)) {
          (mesh.material as THREE.ShaderMaterial).precision = "mediump";
        }
      }
    });

    setCharTimeline(character, camera);
    setAllTimeline();

    const footR = character.getObjectByName("footR");
    const footL = character.getObjectByName("footL");
    if (footR) footR.position.y = 3.36;
    if (footL) footL.position.y = 3.36;

    dracoLoader.dispose();
    return gltf;
  };

  const loadFromUrl = (url: string) =>
    new Promise<GLTF>((resolve, reject) => {
      loader.load(
        url,
        async (gltf) => {
          try {
            resolve(await onModelLoaded(gltf));
          } catch (error) {
            reject(error);
          }
        },
        undefined,
        (error) => {
          console.error("Error loading GLTF model:", error);
          reject(error);
        }
      );
    });

  const loadCharacter = async (): Promise<GLTF | null> => {
    try {
      const encryptedBlob = await decryptFile(
        `${import.meta.env.BASE_URL}models/character.enc`,
        "Character3D#@"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
      try {
        return await loadFromUrl(blobUrl);
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    } catch (encryptedError) {
      console.warn("Encrypted model failed, trying plain GLB:", encryptedError);
      try {
        return await loadFromUrl(`${import.meta.env.BASE_URL}models/character.glb`);
      } catch (glbError) {
        console.error("Failed to load character model:", glbError);
        return null;
      }
    }
  };

  return { loadCharacter };
};

export default setCharacter;
