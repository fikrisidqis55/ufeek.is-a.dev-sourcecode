<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

  let container: HTMLDivElement;
  let hovered = false;

  onMount(() => {
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(4, 6, 2);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enableDamping = true;

    let model: THREE.Group | null = null;
    const loader = new GLTFLoader();

    loader.load(
      "/models/myBear.glb",
      (gltf) => {
        model = gltf.scene;
        model.scale.set(1, 1, 1);
        scene.add(model);
      },
      undefined,
      (error) => {
        console.warn("Could not load /models/myBear.glb:", error);
      }
    );

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (model) {
        if (!hovered) {
          model.rotation.y += 0.01;
          model.position.y = 0;
        } else {
          model.position.y = Math.sin(Date.now() * 0.002) * 0.2;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  });
</script>

<div
  bind:this={container}
  class="w-full h-full min-h-[300px] cursor-grab active:cursor-grabbing relative"
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  role="region"
  aria-label="3D Model Viewer"
></div>
