import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface STLViewerProps {
  url: string;
  color: string;
  rotationSpeed: number;
  screenshotRef: React.MutableRefObject<(() => void) | null>;
}

const STLViewer: React.FC<STLViewerProps> = ({ url, color, rotationSpeed, screenshotRef }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const newScene = new THREE.Scene();
    const newCamera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const newRenderer = new THREE.WebGLRenderer();

    newRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(newRenderer.domElement);

    const controls = new OrbitControls(newCamera, newRenderer.domElement);

    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);

    let mesh: THREE.Mesh;
    let rotationGroup: THREE.Group;

    const loader = new STLLoader();
    loader.load(url, (geometry: THREE.BufferGeometry) => {
      const material = new THREE.MeshPhongMaterial({
        color: color,
        specular: 0x111111,
        shininess: 200,
      });
      mesh = new THREE.Mesh(geometry, material);

      rotationGroup = new THREE.Group();
      rotationGroup.add(mesh);
      newScene.add(rotationGroup);

      geometry.computeBoundingBox();
      const center = geometry.boundingBox!.getCenter(new THREE.Vector3());
      mesh.position.sub(center);

      const boundingBox = new THREE.Box3().setFromObject(mesh);
      const size = boundingBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      newCamera.position.set(maxDim * 2, maxDim * 2, maxDim * 2);
      newCamera.lookAt(0, 0, 0);

      const ambientLight = new THREE.AmbientLight(0x404040);
      newScene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1, 1, 1);
      newScene.add(directionalLight);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      if (rotationGroup) {
        rotationGroup.rotation.y += rotationSpeed * 0.01;
      }
      controls.update();
      newRenderer.render(newScene, newCamera);
    };

    animate();

    const handleResize = () => {
      if (mountRef.current) {
        newCamera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        newCamera.updateProjectionMatrix();
        newRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    const mountElement = mountRef.current;

    return () => {
      window.removeEventListener('resize', handleResize);
      mountElement?.removeChild(newRenderer.domElement);
    };
  }, [url, color, rotationSpeed]);

  useEffect(() => {
    if (scene && camera && renderer) {
      screenshotRef.current = () => {
        renderer.render(scene, camera);
        const screenshot = renderer.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = screenshot;
        link.download = 'stl_screenshot.png';
        link.click();
      };
    }
  }, [scene, camera, renderer, screenshotRef]);

  return (
    <div
      ref={mountRef}
      className="w-full h-[calc(100vh-12rem)] rounded-lg overflow-hidden"
    />
  );
};

export default STLViewer;