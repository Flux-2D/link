import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

const container = document.querySelector("#game-canvas-container");
const loadingMessage = document.querySelector("#loading-message");
const errorMessage = document.querySelector("#error-message");
const positionReadout = document.querySelector("#position-readout");

try {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9cc7d8);
  scene.fog = new THREE.Fog(0x9cc7d8, 45, 150);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 250);
  camera.position.set(0, 6.5, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xcceaff, 0x514633, 2.3));
  const sun = new THREE.DirectionalLight(0xffe7bd, 3.2);
  sun.position.set(-25, 35, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  scene.add(sun);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(180, 180),
    new THREE.MeshStandardMaterial({ color: 0x6f9561, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 180),
    new THREE.MeshStandardMaterial({ color: 0xb99c70, roughness: 1 })
  );
  path.rotation.x = -Math.PI / 2;
  path.position.y = 0.012;
  scene.add(path);

  const player = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.55, 1.1, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xd76f48, roughness: 0.8 })
  );
  body.position.y = 1.1;
  body.castShadow = true;
  player.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.46, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xf0bd91, roughness: 0.9 })
  );
  head.position.y = 2.25;
  head.castShadow = true;
  player.add(head);
  player.position.set(0, 0, 8);
  scene.add(player);

  // Simple landmarks make movement and scale visible in the prototype.
  const landmarkMaterial = new THREE.MeshStandardMaterial({ color: 0x607b8b, roughness: 0.95 });
  for (let z = -60; z <= 60; z += 12) {
    for (const x of [-7, 7]) {
      const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 2.6, 8), landmarkMaterial);
      stone.position.set(x, 1.3, z);
      stone.rotation.z = (x + z) * 0.01;
      stone.castShadow = true;
      scene.add(stone);
    }
  }

  const keys = new Set();
  const movementKeys = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"]);
  window.addEventListener("keydown", (event) => {
    if (movementKeys.has(event.code)) { event.preventDefault(); keys.add(event.code); }
  });
  window.addEventListener("keyup", (event) => keys.delete(event.code));

  const clock = new THREE.Clock();
  const cameraTarget = new THREE.Vector3();
  const desiredCameraPosition = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const maxWorldDistance = 75;

  function update(delta) {
    direction.set(0, 0, 0);
    if (keys.has("KeyW") || keys.has("ArrowUp")) direction.z -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) direction.z += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) direction.x -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) direction.x += 1;
    if (direction.lengthSq() > 0) {
      direction.normalize();
      player.position.addScaledVector(direction, delta * 8);
      player.rotation.y = Math.atan2(direction.x, direction.z);
    }
    player.position.x = THREE.MathUtils.clamp(player.position.x, -maxWorldDistance, maxWorldDistance);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -maxWorldDistance, maxWorldDistance);

    cameraTarget.set(player.position.x, 1.3, player.position.z);
    desiredCameraPosition.set(player.position.x, player.position.y + 6.5, player.position.z + 10);
    camera.position.lerp(desiredCameraPosition, 1 - Math.pow(0.001, delta));
    camera.lookAt(cameraTarget);
    positionReadout.textContent = `X ${player.position.x.toFixed(1)}   Z ${player.position.z.toFixed(1)}`;
  }

  function animate() {
    requestAnimationFrame(animate);
    update(Math.min(clock.getDelta(), 0.05));
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  loadingMessage.hidden = true;
  animate();
} catch (error) {
  console.error(error);
  loadingMessage.hidden = true;
  errorMessage.hidden = false;
}
