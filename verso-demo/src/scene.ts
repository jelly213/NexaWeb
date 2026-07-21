/**
 * The VERSO tower — a fully procedural, multi-part Three.js scene.
 * Every floor is its own group so the scroll timeline can assemble the
 * building, lift floors apart for the unit reveal, and light windows at dusk.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/** Structural slice of a gsap timeline — keeps three/gsap typing decoupled. */
export interface Tl {
  to(target: object, vars: Record<string, unknown>, position?: number | string): Tl;
}

// ---------- palette ----------
const DAY_SKY = new THREE.Color('#c9d4e0');
const DUSK_SKY = new THREE.Color('#0d1017');
const DAY_GROUND_FOG = new THREE.Color('#b9c3cf');
const DUSK_GROUND_FOG = new THREE.Color('#0b0e14');
const CONCRETE = '#ddd6c9';
const LIMESTONE = '#cfc6b4';
const BRONZE = '#8a6a3f';
const GLASS_TINT = '#33404d';
const WINDOW_WARM = '#ffb35c';
const CITY_BLOCK = '#20222a';

// ---------- tower dimensions ----------
const FLOORS = 10;          // residential floors above the podium
const FLOOR_H = 1;
const W = 8;
const D = 6;
const PODIUM_H = 1.6;
const UNIT_FLOOR = 5;       // the floor that opens during act 3 (0-based)

// seeded RNG so the context city is identical on every load
function lcg(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff);
}

export interface VersoScene {
  /** Wire every scroll-driven animation onto the master timeline. */
  addTimeline(tl: Tl): void;
  resize(): void;
  dispose(): void;
}

export function createScene(container: HTMLElement): VersoScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 1.75));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = !coarse;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = DAY_SKY.clone();
  scene.fog = new THREE.Fog(DAY_GROUND_FOG.clone(), 55, 130);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  // swap in a real sky for lighting/reflections once it loads (CC0, Poly Haven)
  new RGBELoader().load('/env/sky_1k.hdr', (tex) => {
    scene.environment = pmrem.fromEquirectangular(tex).texture;
    tex.dispose();
  });

  const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 300);
  camera.position.set(14, 4.5, 19);
  const camTarget = new THREE.Vector3(0, 3.5, 0);

  // ---------- lights ----------
  const hemi = new THREE.HemisphereLight('#e8eef6', '#4a4238', 0.85);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff2df', 2.2);
  sun.position.set(18, 26, 14);
  sun.castShadow = renderer.shadowMap.enabled;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -22;
  sun.shadow.camera.right = 22;
  sun.shadow.camera.top = 26;
  sun.shadow.camera.bottom = -6;
  sun.shadow.camera.far = 80;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  // ---------- materials ----------
  const matConcrete = new THREE.MeshStandardMaterial({ color: '#cfc9bd', roughness: 0.9, metalness: 0 });
  const matLimestone = new THREE.MeshStandardMaterial({ color: LIMESTONE, roughness: 0.85, metalness: 0 });
  // Griffintown DNA: red-brick warehouse podium under the glass tower
  const brickTex = new THREE.TextureLoader().load('/textures/brick.webp');
  brickTex.colorSpace = THREE.SRGBColorSpace;
  brickTex.wrapS = brickTex.wrapT = THREE.RepeatWrapping;
  brickTex.repeat.set(3.2, 0.9);
  const matBrick = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.95, metalness: 0 });
  // "bronze" in daylight must read as dark anodized metal, not brown wood
  const matBronze = new THREE.MeshStandardMaterial({ color: '#3f3a34', roughness: 0.45, metalness: 0.85, envMapIntensity: 1.0 });
  const matGround = new THREE.MeshStandardMaterial({ color: '#3c3f46', roughness: 1 });
  const matWater = new THREE.MeshStandardMaterial({ color: '#2c3e4d', roughness: 0.15, metalness: 0.6, envMapIntensity: 0.9 });
  const matCity = new THREE.MeshStandardMaterial({ color: '#333845', roughness: 0.95 });
  const matGreen = new THREE.MeshStandardMaterial({ color: '#46543f', roughness: 1 });
  // depthWrite:false on every transparent material — glass must never occlude the
  // glowing cores behind it in the depth buffer (they'd vanish at night otherwise)
  const makeGlass = () =>
    new THREE.MeshPhysicalMaterial({
      color: GLASS_TINT,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.55,
      envMapIntensity: 1.4,
      depthWrite: false,
    });
  const makeCore = () =>
    new THREE.MeshBasicMaterial({ color: WINDOW_WARM, transparent: true, opacity: 0, depthWrite: false });

  // ---------- ground, canal, context city ----------
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), matGround);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const canal = new THREE.Mesh(new THREE.PlaneGeometry(300, 14), matWater);
  canal.rotation.x = -Math.PI / 2;
  canal.position.set(0, 0.02, 26);
  scene.add(canal);

  const cityLightMats: THREE.MeshBasicMaterial[] = [];
  const rng = lcg(20260720);
  const city = new THREE.Group();
  for (let i = 0; i < 34; i++) {
    const bw = 4 + rng() * 6;
    const bd = 4 + rng() * 6;
    const bh = 2 + rng() * 9;
    const block = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), matCity);
    // ring the tower, keep the lot and the canal-facing view clear
    const angle = rng() * Math.PI * 2;
    const radius = 30 + rng() * 44;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 0.85;
    // the camera lives south of the tower (positive z): keep that whole sector clear,
    // except a distant skyline across the canal
    if (z > 2 && z < 42 && Math.abs(x) < 36) continue;
    block.position.set(x, bh / 2, z);
    block.castShadow = false;
    block.receiveShadow = false;
    city.add(block);
    // sparse windows that light at dusk
    if (rng() > 0.35) {
      const lm = new THREE.MeshBasicMaterial({ color: '#ffc37a', transparent: true, opacity: 0 });
      cityLightMats.push(lm);
      const lights = new THREE.Mesh(new THREE.PlaneGeometry(bw * 0.72, bh * 0.6), lm);
      lights.position.set(x, bh * 0.55, z + bd / 2 + 0.02);
      city.add(lights);
    }
  }
  scene.add(city);

  // ---------- the tower ----------
  const tower = new THREE.Group();
  scene.add(tower);

  // podium
  const podium = new THREE.Group();
  // recessed brick core so the lobby's glass band reads from the street
  const podiumBody = new THREE.Mesh(new THREE.BoxGeometry(W + 2.2, PODIUM_H, D + 1.6), matBrick);
  podiumBody.position.y = PODIUM_H / 2;
  podiumBody.castShadow = podiumBody.receiveShadow = true;
  podium.add(podiumBody);
  // thin bronze band at the parapet, with a muted roof deck so the top face doesn't read bronze
  const podiumFascia = new THREE.Mesh(new THREE.BoxGeometry(W + 3.1, 0.1, D + 2.5), matBronze);
  podiumFascia.position.y = PODIUM_H + 0.05;
  podium.add(podiumFascia);
  const podiumDeck = new THREE.Mesh(
    new THREE.BoxGeometry(W + 2.5, 0.05, D + 1.9),
    new THREE.MeshStandardMaterial({ color: '#78736a', roughness: 1 })
  );
  podiumDeck.position.y = PODIUM_H + 0.125;
  podiumDeck.receiveShadow = true;
  podium.add(podiumDeck);
  // lobby glass band
  const lobbyGlass = new THREE.Mesh(new THREE.BoxGeometry(W + 3.0, PODIUM_H * 0.62, D + 2.4), makeGlass());
  lobbyGlass.position.y = PODIUM_H * 0.38;
  podium.add(lobbyGlass);
  tower.add(podium);

  interface Floor {
    group: THREE.Group;
    glass: THREE.MeshPhysicalMaterial;
    core: THREE.MeshBasicMaterial;
    finalY: number;
  }
  const floors: Floor[] = [];

  for (let i = 0; i < FLOORS; i++) {
    const g = new THREE.Group();
    const finalY = PODIUM_H + i * FLOOR_H;

    const slab = new THREE.Mesh(new THREE.BoxGeometry(W + 0.24, 0.12, D + 0.24), matConcrete);
    slab.position.y = 0.06;
    slab.castShadow = slab.receiveShadow = true;
    g.add(slab);

    const glassMat = makeGlass();
    const glass = new THREE.Mesh(new THREE.BoxGeometry(W, FLOOR_H - 0.14, D), glassMat);
    glass.position.y = 0.14 + (FLOOR_H - 0.14) / 2;
    glass.castShadow = false;
    g.add(glass);

    const coreMat = makeCore();
    const core = new THREE.Mesh(new THREE.BoxGeometry(W * 0.94, FLOOR_H - 0.3, D * 0.94), coreMat);
    core.position.y = 0.14 + (FLOOR_H - 0.14) / 2;
    g.add(core);

    // bronze corner columns
    const colGeo = new THREE.BoxGeometry(0.11, FLOOR_H - 0.14, 0.11);
    for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as const) {
      const col = new THREE.Mesh(colGeo, matBronze);
      col.position.set((sx * W) / 2, 0.14 + (FLOOR_H - 0.14) / 2, (sz * D) / 2);
      g.add(col);
    }

    // curtain-wall mullions — the fine vertical rhythm that makes glass read as real facade
    const mullGeo = new THREE.BoxGeometry(0.045, FLOOR_H - 0.14, 0.045);
    const mullions = new THREE.InstancedMesh(mullGeo, matBronze, 24);
    const m4 = new THREE.Matrix4();
    let mi = 0;
    const my = 0.14 + (FLOOR_H - 0.14) / 2;
    for (let x = -3; x <= 3; x++) {
      m4.setPosition(x, my, D / 2);
      mullions.setMatrixAt(mi++, m4);
      m4.setPosition(x, my, -D / 2);
      mullions.setMatrixAt(mi++, m4);
    }
    for (let z = -2; z <= 2; z++) {
      m4.setPosition(W / 2, my, z);
      mullions.setMatrixAt(mi++, m4);
      m4.setPosition(-W / 2, my, z);
      mullions.setMatrixAt(mi++, m4);
    }
    g.add(mullions);

    // balconies on the canal side, alternating halves
    if (i >= 1 && i < FLOORS - 1) {
      const balc = new THREE.Group();
      const bSlab = new THREE.Mesh(new THREE.BoxGeometry(W * 0.42, 0.1, 1.1), matConcrete);
      bSlab.castShadow = true;
      balc.add(bSlab);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(W * 0.42, 0.42, 0.04), makeGlass());
      rail.position.set(0, 0.26, 0.53);
      balc.add(rail);
      balc.position.set((i % 2 === 0 ? -1 : 1) * W * 0.22, 0.12, D / 2 + 0.55);
      g.add(balc);
    }

    g.position.y = finalY;
    tower.add(g);
    floors.push({ group: g, glass: glassMat, core: coreMat, finalY });
  }

  // roof: bronze crown + pergola + planters + string lights
  const roof = new THREE.Group();
  const roofY = PODIUM_H + FLOORS * FLOOR_H;
  const crown = new THREE.Mesh(new THREE.BoxGeometry(W + 0.7, 0.18, D + 0.7), matBronze);
  crown.position.y = 0.09;
  crown.castShadow = true;
  roof.add(crown);
  const pergola = new THREE.Group();
  const postGeo = new THREE.BoxGeometry(0.1, 0.9, 0.1);
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as const) {
    const post = new THREE.Mesh(postGeo, matBronze);
    post.position.set(sx * 1.6, 0.63, sz * 1.1);
    pergola.add(post);
  }
  const pergolaTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 2.6), matBronze);
  pergolaTop.position.y = 1.1;
  pergola.add(pergolaTop);
  pergola.position.set(-W * 0.18, 0.18, 0.4);
  roof.add(pergola);
  const stringLightMats: THREE.MeshBasicMaterial[] = [];
  for (let i = 0; i < 7; i++) {
    const lm = new THREE.MeshBasicMaterial({ color: '#ffd9a0', transparent: true, opacity: 0 });
    stringLightMats.push(lm);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), lm);
    bulb.position.set(-W * 0.18 - 1.5 + i * 0.5, 0.18 + 1.02 - Math.sin((i / 6) * Math.PI) * 0.12, 0.4 + 1.2);
    roof.add(bulb);
  }
  for (let i = 0; i < 4; i++) {
    const planter = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), matGreen);
    planter.scale.set(1, 0.75, 1);
    planter.position.set(W * 0.32, 0.42, -D * 0.32 + i * (D * 0.21));
    roof.add(planter);
  }
  roof.position.y = roofY;
  tower.add(roof);

  // unit-reveal dressing: furniture blocks on the unit floor, hidden until act 3
  const unit = floors[UNIT_FLOOR];
  const furniture = new THREE.Group();
  const matWalnut = new THREE.MeshStandardMaterial({ color: '#5b4632', roughness: 0.7 });
  const matCream = new THREE.MeshStandardMaterial({ color: '#d8d2c4', roughness: 0.9 });
  const pieces: Array<[THREE.MeshStandardMaterial, number, number, number, number, number]> = [
    [matCream, 1.8, 0.28, 0.8, -2.0, 1.2],   // sofa
    [matWalnut, 2.2, 0.32, 0.9, 1.6, -1.2],  // bed
    [matWalnut, 1.6, 0.36, 0.7, -1.4, -1.6], // kitchen island
    [matCream, 0.8, 0.22, 0.8, 2.2, 1.6],    // chairs
  ];
  for (const [m, px, py, pz, x, z] of pieces) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(px, py, pz), m);
    p.position.set(x, 0.14 + py / 2, z);
    p.scale.setScalar(0.001);
    furniture.add(p);
  }
  unit.group.add(furniture);
  // bronze outline that highlights the open floor
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(W + 0.55, FLOOR_H, D + 0.55)),
    new THREE.LineBasicMaterial({ color: '#e8b573', transparent: true, opacity: 0 })
  );
  edges.position.y = FLOOR_H / 2;
  unit.group.add(edges);

  // ---------- initial (pre-assembly) state ----------
  // The podium starts built (the opening frame shows real architecture);
  // the floors and roof rise out of it on scroll.
  const SINK = 14; // parts start sunk this far below their final position
  for (const f of floors) f.group.position.y = f.finalY - SINK;
  roof.position.y = roofY - SINK - 4;

  // ---------- dusk driver ----------
  const dusk = { t: 0 };
  const dayHemi = 0.85;
  const daySun = 2.2;
  const sunDay = new THREE.Color('#fff2df');
  const sunDusk = new THREE.Color('#ff8e4d');
  const slabDay = new THREE.Color('#cfc9bd');
  const slabDusk = new THREE.Color('#6e6a62'); // slabs dim at night so bloom stays on the windows
  const cityThresholds = cityLightMats.map(() => 0.25 + rng() * 0.5);
  const floorThresholds = floors.map(() => 0.15 + rng() * 0.55);

  function applyDusk() {
    const t = dusk.t;
    (scene.background as THREE.Color).copy(DAY_SKY).lerp(DUSK_SKY, t);
    scene.fog!.color.copy(DAY_GROUND_FOG).lerp(DUSK_GROUND_FOG, t);
    hemi.intensity = dayHemi * (1 - t * 0.78);
    sun.intensity = daySun * (1 - t * 0.82);
    sun.color.copy(sunDay).lerp(sunDusk, Math.min(1, t * 1.6));
    sun.position.set(18 - t * 10, 26 - t * 20, 14 + t * 6);
    floors.forEach((f, i) => {
      const on = THREE.MathUtils.smoothstep(t, floorThresholds[i], floorThresholds[i] + 0.18);
      // the unit floor keeps its own timeline-driven glow during act 3
      if (i !== UNIT_FLOOR) f.core.opacity = on * 0.82;
      f.glass.opacity = 0.55 - t * 0.18; // glass reads darker/clearer at night
    });
    cityLightMats.forEach((m, i) => {
      m.opacity = THREE.MathUtils.smoothstep(t, cityThresholds[i], cityThresholds[i] + 0.2) * 0.65;
    });
    stringLightMats.forEach((m) => (m.opacity = THREE.MathUtils.smoothstep(t, 0.3, 0.55)));
    matConcrete.color.copy(slabDay).lerp(slabDusk, t);
    if (bloom) bloom.strength = 0.1 + t * 0.32; // windows halo as night falls
  }

  // ---------- post-processing (desktop only; mobile keeps the lean direct path) ----------
  let composer: EffectComposer | null = null;
  let bloom: UnrealBloomPass | null = null;
  if (!coarse) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.12, // strength ramps up with dusk
      0.55,
      0.62
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }

  // ---------- render loop (only renders; all motion is timeline-driven) ----------
  let disposed = false;
  renderer.setAnimationLoop(() => {
    if (disposed) return;
    camera.lookAt(camTarget);
    if (composer) composer.render();
    else renderer.render(scene, camera);
  });

  // ---------- timeline ----------
  function addTimeline(tl: Tl): void {
    // Act 1 — assembly (0 → 2.2)
    floors.forEach((f, i) => {
      tl.to(f.group.position, { y: f.finalY, duration: 0.55 }, 0.35 + i * 0.13);
    });
    tl.to(roof.position, { y: roofY, duration: 0.5 }, 1.75);
    // camera drifts up as the tower rises
    tl.to(camera.position, { x: 15, y: 6.5, z: 19, duration: 2.2 }, 0);
    tl.to(camTarget, { y: 6, duration: 2.2 }, 0);

    // Act 2 — orbit to the architecture view (2.2 → 4.2)
    tl.to(camera.position, { x: -17, y: 9.5, z: 19, duration: 2.0 }, 2.2);
    tl.to(camTarget, { x: 1.5, y: 5.5, z: 0, duration: 2.0 }, 2.2);

    // Act 3 — the unit reveal (4.2 → 6.6): floors above lift, furniture pops, floor glows
    floors.forEach((f, i) => {
      if (i > UNIT_FLOOR) {
        tl.to(f.group.position, { y: f.finalY + 1.5 + (i - UNIT_FLOOR) * 0.22, duration: 0.7 }, 4.3 + (i - UNIT_FLOOR) * 0.05);
      }
    });
    tl.to(roof.position, { y: roofY + 1.5 + (FLOORS - UNIT_FLOOR) * 0.22, duration: 0.7 }, 4.3 + (FLOORS - UNIT_FLOOR) * 0.05);
    tl.to(camera.position, { x: -12.5, y: PODIUM_H + UNIT_FLOOR + 4.5, z: 13.5, duration: 1.4 }, 4.3);
    tl.to(camTarget, { x: 1.2, y: PODIUM_H + UNIT_FLOOR + 0.6, duration: 1.4 }, 4.3);
    tl.to(unit.glass, { opacity: 0.12, duration: 0.5 }, 4.7);
    tl.to(unit.core, { opacity: 0.35, duration: 0.5 }, 4.7);
    tl.to(edges.material, { opacity: 0.9, duration: 0.5 }, 4.7);
    furniture.children.forEach((p, i) => {
      tl.to(p.scale, { x: 1, y: 1, z: 1, duration: 0.4 }, 4.9 + i * 0.08);
    });
    // close the floor back up (5.9 → 6.6)
    furniture.children.forEach((p) => {
      tl.to(p.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.25 }, 5.9);
    });
    tl.to(unit.glass, { opacity: 0.55, duration: 0.4 }, 6.0);
    tl.to(unit.core, { opacity: 0, duration: 0.3 }, 5.95);
    tl.to(edges.material, { opacity: 0, duration: 0.4 }, 6.0);
    floors.forEach((f, i) => {
      if (i > UNIT_FLOOR) tl.to(f.group.position, { y: f.finalY, duration: 0.6 }, 6.05);
    });
    tl.to(roof.position, { y: roofY, duration: 0.6 }, 6.05);

    // Act 4 — dusk (6.6 → 8.6)
    tl.to(camera.position, { x: 12.5, y: 8, z: 16, duration: 2.0 }, 6.6);
    tl.to(camTarget, { x: 0, y: 6.2, z: 0, duration: 2.0 }, 6.6);
    tl.to(dusk, { t: 1, duration: 1.8, onUpdate: applyDusk }, 6.7);
    // the unit floor joins the lit facade at dusk
    tl.to(unit.core, { opacity: 0.82, duration: 0.6 }, 7.3);

    // Act 5 — pull back to the night skyline (8.6 → 10)
    tl.to(camera.position, { x: 19, y: 11, z: 24, duration: 1.4 }, 8.6);
    tl.to(camTarget, { y: 6.5, duration: 1.4 }, 8.6);
  }

  function resize(): void {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer?.setSize(w, h);
  }

  function dispose(): void {
    disposed = true;
    renderer.setAnimationLoop(null);
    renderer.dispose();
    pmrem.dispose();
  }

  return { addTimeline, resize, dispose };
}
