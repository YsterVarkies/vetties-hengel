/*
 * VETTIES HENGEL HOEKIE: 3D SCENES
 * Uses Three.js (loaded from the jsDelivr CDN) to draw:
 *   - the hero: the bass leaping over moving water, with its reflection, ripples and bubbles
 *   - a small 3D model for each "What's on the shelves" item
 *   - the bobber floating on the water above the Visit section
 * All of it is decoration. If the browser can't show 3D, or the CDN can't be
 * reached, the flat drawings from script.js and style.css stay as they are.
 */
(() => {
  'use strict';

  // Switch a part off by changing true to false.
  const SETTINGS = {
    hero: true,     // the 3D bass and water at the top of the page
    shelf: true,    // the 3D models on the "What's on the shelves" items
    bobber: true    // the 3D bobber above the Visit section
  };

  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';
  const STILL = window.matchMedia('(prefers-reduced-motion: reduce)').matches;  // draw one still frame, no movement
  const FINE_POINTER = window.matchMedia('(pointer: fine)').matches;
  const GREEN = 0x4cd80a;
  const RED = 0xe0533d;
  const PAGE_BLACK = 0x0d0d0d;

  if (!SETTINGS.hero && !SETTINGS.shelf && !SETTINGS.bobber) return;

  import(THREE_URL)
    .then((THREE) => {
      const loop = createLoop();
      if (SETTINGS.shelf || SETTINGS.bobber) {
        try { startViews(THREE, loop); } catch (err) { console.warn('3D shelf models are off:', err); }
      }
      if (SETTINGS.hero) {
        startHero(THREE, loop).catch((err) => console.warn('3D hero is off, keeping the flat one:', err));
      }
    })
    .catch((err) => console.warn('Three.js could not be loaded, keeping the flat page:', err));

  /* ---------------------------------------------------------
     One animation loop for every 3D part. It only runs while a
     part is on screen, and draws a single still frame for
     visitors who have asked for reduced motion.
     --------------------------------------------------------- */
  function createLoop() {
    const parts = [];
    let frameId = 0;
    let last = 0;
    let time = STILL ? 2.4 : 0;

    function frame(now) {
      frameId = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      if (!STILL) time += dt;

      let running = false;
      parts.forEach((part) => {
        if (part.broken || !part.active()) return;
        running = true;
        try { part.frame(time, dt); } catch (err) { part.broken = true; console.warn(err); }
      });

      if (running && !STILL) frameId = requestAnimationFrame(frame);
      else last = 0;
    }

    return {
      get time() { return time; },
      add(part) { parts.push(part); this.wake(); },
      wake() { if (!frameId) frameId = requestAnimationFrame(frame); }
    };
  }

  /* =========================================================
     HERO: the bass leaping over the water
     ========================================================= */
  const FISH_H = 2.2;      // the bass's height in scene units
  const FISH_Y = 1.3;      // how high it hangs above the water
  const PITCH = 0.14;      // how far the camera looks down at the water (radians)
  const FOV = 35;
  const MAX_RIPPLES = 12;
  const LEAP_TIME = 1.05;  // seconds for a leap when the fish is clicked
  const INTRO_TIME = 1.7;  // seconds for the jump out of the water when the page opens

  async function startHero(THREE, loop) {
    const hero = document.querySelector('.hero');
    const anchor = document.getElementById('fish-wrap');   // the flat fish; the 3D one takes its place
    const flatFish = document.getElementById('fish');
    const copy = document.querySelector('.hero-copy');
    if (!hero || !anchor || !flatFish) return;

    // Reading the picture's pixels only works from a web server, not from a file
    // opened straight off the disk. If it fails, the flat hero stays.
    const img = await loadImage(flatFish.src);
    const picture = solidPicture(img, Math.round(img.naturalWidth * 0.012));
    const GW = 150;
    const GH = Math.round(GW * picture.height / picture.width);
    const alpha = readAlpha(picture, GW, GH);
    const FISH_W = FISH_H * picture.width / picture.height;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, FINE_POINTER ? 2 : 1.5));
    renderer.toneMapping = THREE.NeutralToneMapping;
    const canvas = renderer.domElement;
    canvas.className = 'hero-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    const scene = new THREE.Scene();
    scene.environment = makeEnvironment(THREE, renderer);
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 400);
    const target = new THREE.Vector3(0, FISH_Y, 0);

    // Lights (layer 1 is the reflection pass, so they light that too)
    const lights = [
      new THREE.HemisphereLight(0xd8f0cc, 0x0b1408, 0.9),
      new THREE.DirectionalLight(0xffffff, 2.3),
      new THREE.DirectionalLight(0x9cff6a, 4.5)
    ];
    lights[1].position.set(2.5, 3.5, 4);
    lights[2].position.set(-2.5, 1.8, -3.5);
    lights.forEach((light) => { light.layers.enable(1); scene.add(light); });

    /* ---- The bass: the logo picture, puffed out into a rounded 3D shape ---- */
    const texture = new THREE.CanvasTexture(picture);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;

    const flex = { uTime: { value: 0 }, uFlex: { value: 0.55 } };
    const fishMaterial = new THREE.MeshPhysicalMaterial({
      map: texture, alphaTest: 0.5, alphaToCoverage: true,
      roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.2, envMapIntensity: 0.8
    });
    fishMaterial.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, flex);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;\nuniform float uFlex;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          // A swimming wave runs along the body, from the head (top left of the picture) to the tail
          float along = clamp(distance(uv, vec2(0.08, 0.9)), 0.0, 1.0);
          float swim = uTime * 3.4 - along * 4.5;
          transformed.z += sin(swim) * uFlex * along * along * 0.3;
          transformed.x += cos(swim) * uFlex * along * along * 0.05;`);
    };
    const fishGeometry = inflatedGeometry(THREE, alpha, GW, GH, FISH_W, FISH_H, 0.24);
    const fish = new THREE.Mesh(fishGeometry, fishMaterial);
    scene.add(fish);

    // Its reflection: the same fish flipped under the water and drawn into a separate
    // picture, which the water samples with a wobble from the waves.
    const mirror = new THREE.Group();
    mirror.scale.y = -1;
    const fishMirror = new THREE.Mesh(fishGeometry, fishMaterial);
    fishMirror.layers.set(1);
    mirror.add(fishMirror);
    scene.add(mirror);
    const reflection = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
    const keepBelowWater = [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)];

    /* ---- Water and sky ---- */
    const shared = {
      uTime: { value: 0 },
      uLightDir: { value: new THREE.Vector3(0.02, 0.34, -1).normalize() },   // behind the fish; it glints on the water below it
      uScrim: { value: new THREE.Vector4() },
      uScrimSoft: { value: 100 },
      uGlowTight: { value: 1 }
    };
    const ripples = Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, -99, 0));
    let rippleIndex = 0;

    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400).rotateX(-Math.PI / 2),
      new THREE.ShaderMaterial({
        defines: { MAX_RIPPLES },
        uniforms: {
          ...shared,
          uRipples: { value: ripples },
          uReflection: { value: reflection.texture },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uFogDensity: { value: 0.045 }
        },
        vertexShader: WORLD_VERT,
        fragmentShader: SCRIM_GLSL + SKY_GLSL + WATER_FRAG,
        toneMapped: false
      })
    );
    scene.add(water);

    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(150, 32, 16),
      new THREE.ShaderMaterial({
        uniforms: { ...shared },
        vertexShader: WORLD_VERT,
        fragmentShader: SCRIM_GLSL + SKY_GLSL + SKY_FRAG,
        side: THREE.BackSide, depthWrite: false, toneMapped: false
      })
    );
    sky.renderOrder = -1;
    scene.add(sky);

    /* ---- Bubbles drifting up from the water ---- */
    const pointScale = { value: 1 };   // pixels per unit at a distance of 1
    const sizeScale = { value: 1 };
    const bubbleCount = FINE_POINTER ? 50 : 24;
    const bubbleGeometry = new THREE.BufferGeometry();
    const bubblePos = new Float32Array(bubbleCount * 3);
    const bubbleSeed = new Float32Array(bubbleCount);
    const bubbleSize = new Float32Array(bubbleCount);
    for (let i = 0; i < bubbleCount; i++) {
      bubblePos.set([Math.random() - 0.5, Math.random(), Math.random() - 0.5], i * 3);
      bubbleSeed[i] = Math.random();
      bubbleSize[i] = 0.05 + Math.random() * 0.1;
    }
    bubbleGeometry.setAttribute('position', new THREE.BufferAttribute(bubblePos, 3));
    bubbleGeometry.setAttribute('aSeed', new THREE.BufferAttribute(bubbleSeed, 1));
    bubbleGeometry.setAttribute('aSize', new THREE.BufferAttribute(bubbleSize, 1));
    const bubbles = new THREE.Points(bubbleGeometry, new THREE.ShaderMaterial({
      uniforms: { ...shared, uScale: pointScale, uSizeScale: sizeScale, uColor: { value: new THREE.Color(GREEN) } },
      vertexShader: BUBBLE_VERT,
      fragmentShader: SCRIM_GLSL + BUBBLE_FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false
    }));
    bubbles.frustumCulled = false;   // they move in the shader
    scene.add(bubbles);

    /* ---- Splash droplets ---- */
    const SPLASH = 240;
    const dropPos = new Float32Array(SPLASH * 3);
    const dropVel = new Float32Array(SPLASH * 3);
    const dropLife = new Float32Array(SPLASH);
    let nextDrop = 0;
    let splashTime = 0;
    const splashGeometry = new THREE.BufferGeometry();
    splashGeometry.setAttribute('position', new THREE.BufferAttribute(dropPos, 3).setUsage(THREE.DynamicDrawUsage));
    splashGeometry.setAttribute('aLife', new THREE.BufferAttribute(dropLife, 1).setUsage(THREE.DynamicDrawUsage));
    const drops = new THREE.Points(splashGeometry, new THREE.ShaderMaterial({
      uniforms: { uScale: pointScale, uSizeScale: sizeScale },
      vertexShader: SPLASH_VERT,
      fragmentShader: SPLASH_FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false
    }));
    drops.frustumCulled = false;
    scene.add(drops);

    function addRipple(x, z, strength, age = 0) {
      ripples[rippleIndex].set(x, z, loop.time - age, strength);
      rippleIndex = (rippleIndex + 1) % MAX_RIPPLES;
    }

    function splash(x, z, power) {
      addRipple(x, z, power);
      const count = Math.round(28 * power);
      for (let n = 0; n < count; n++) {
        const i = nextDrop;
        nextDrop = (nextDrop + 1) % SPLASH;
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.25;
        const out = (0.35 + Math.random() * 0.9) * power;
        dropPos.set([x + Math.cos(a) * r, 0.02, z + Math.sin(a) * r], i * 3);
        dropVel.set([Math.cos(a) * out, (1.6 + Math.random() * 2.4) * Math.sqrt(power), Math.sin(a) * out], i * 3);
        dropLife[i] = 0.7 + Math.random() * 0.6;
      }
      splashTime = 1.4;
    }

    function updateDrops(dt) {
      if (splashTime <= 0) return;
      splashTime -= dt;
      for (let i = 0; i < SPLASH; i++) {
        if (dropLife[i] <= 0) continue;
        dropLife[i] -= dt;
        dropVel[i * 3 + 1] -= 7 * dt;
        dropPos[i * 3] += dropVel[i * 3] * dt;
        dropPos[i * 3 + 1] += dropVel[i * 3 + 1] * dt;
        dropPos[i * 3 + 2] += dropVel[i * 3 + 2] * dt;
        if (dropPos[i * 3 + 1] < 0) dropLife[i] = 0;
      }
      splashGeometry.attributes.position.needsUpdate = true;
      splashGeometry.attributes.aLife.needsUpdate = true;
    }

    // The lowest point of the tail, in the fish's own space (where the rings start)
    const tailLocal = new THREE.Vector3(FISH_W * 0.1, -FISH_H * 0.46, 0);
    const tail = new THREE.Vector3();
    function tailOnWater() {
      fish.updateMatrixWorld();
      return fish.localToWorld(tail.copy(tailLocal));
    }

    /* ---- Fitting the scene to the page layout ---- */
    const shift = new THREE.Vector2();
    const buffer = new THREE.Vector2();
    let distance = 7;

    function layout() {
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.getDrawingBufferSize(buffer);
      reflection.setSize(Math.ceil(buffer.x / 2), Math.ceil(buffer.y / 2));
      water.material.uniforms.uResolution.value.copy(buffer);
      camera.aspect = w / h;

      // Put the 3D fish where the flat one sits in the layout, at the same size
      // (lifted a little where its column has room, to show more water below it)
      const box = hero.getBoundingClientRect();
      const spot = anchor.getBoundingClientRect();
      const room = spot.top - anchor.parentElement.getBoundingClientRect().top;
      const lift = Math.max(0, Math.min(room, h * 0.08));
      shift.set(
        ((spot.left + spot.width / 2 - box.left) / w) * 2 - 1,
        1 - ((spot.top + spot.height / 2 - lift - box.top) / h) * 2
      );
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      distance = FISH_H * h / (2 * tanHalf * Math.max(spot.height, 120));

      // Bubbles fill the visible area around the fish
      const halfH = tanHalf * distance;
      const halfW = halfH * camera.aspect;
      bubbles.position.set(-shift.x * halfW, 0, -distance * 0.2);
      bubbles.scale.set(halfW * 2.4, halfH * 2.6 + FISH_Y, distance * 1.1);
      sizeScale.value = distance / 7 * Math.min(1, camera.aspect * 1.4);   // smaller bubbles on narrow screens
      pointScale.value = buffer.y / (2 * tanHalf);
      shared.uGlowTight.value = Math.pow(distance / 7, 2);
      water.material.uniforms.uFogDensity.value = 0.32 / distance;

      // Keep the water calm behind the heading and buttons so they stay easy to read
      if (copy) {
        const c = copy.getBoundingClientRect();
        const ratio = buffer.x / w;
        shared.uScrim.value.set(
          (c.left - box.left) * ratio, (box.bottom - c.bottom) * ratio,
          (c.right - box.left) * ratio, (box.bottom - c.top) * ratio
        );
        shared.uScrimSoft.value = 140 * ratio;
      }
      loop.wake();
    }

    function placeCamera(yaw, pitch) {
      camera.position.set(
        target.x + Math.sin(yaw) * Math.cos(pitch) * distance,
        target.y + Math.sin(pitch) * distance,
        target.z + Math.cos(yaw) * Math.cos(pitch) * distance
      );
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      // Shift the lens (not the camera) so the fish lands on its spot in the layout
      camera.projectionMatrix.elements[8] = -shift.x;
      camera.projectionMatrix.elements[9] = -shift.y;
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
      camera.updateMatrixWorld();
    }

    /* ---- Pointer: the fish turns toward it, leaps when clicked; the water ripples ---- */
    const state = { aimX: 0, aimY: 0, ax: 0, ay: 0, leapAt: -99, leapKind: '', splashed: false, nextRing: 0 };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const waterPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const fishPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const localRay = new THREE.Ray();
    const inverse = new THREE.Matrix4();
    const hit = new THREE.Vector3();

    function aimRay(event) {
      const box = canvas.getBoundingClientRect();
      pointer.set(((event.clientX - box.left) / box.width) * 2 - 1, 1 - ((event.clientY - box.top) / box.height) * 2);
      raycaster.setFromCamera(pointer, camera);
    }

    // Is the ray over the painted part of the fish? (Checks the picture, not the mesh.)
    function overFish() {
      fish.updateMatrixWorld();
      localRay.copy(raycaster.ray).applyMatrix4(inverse.copy(fish.matrixWorld).invert());
      if (!localRay.intersectPlane(fishPlane, hit)) return false;
      const gx = Math.floor((hit.x / FISH_W + 0.5) * GW);
      const gy = Math.floor((0.5 - hit.y / FISH_H) * GH);
      for (let y = gy - 3; y <= gy + 3; y++) {
        for (let x = gx - 3; x <= gx + 3; x++) {
          if (x >= 0 && y >= 0 && x < GW && y < GH && alpha[y * GW + x] > 0.5) return true;
        }
      }
      return false;
    }

    function leap(kind) {
      const now = loop.time;
      if (kind === 'leap' && now - state.leapAt < LEAP_TIME * 0.85) return;
      state.leapAt = now;
      state.leapKind = kind;
      state.splashed = false;
      if (kind === 'leap') { const p = tailOnWater(); splash(p.x, p.z, 1); }
    }

    const isControl = (el) => el.closest('a, button, input, textarea, select');

    if (!STILL) {
      if (FINE_POINTER) {
        hero.addEventListener('pointermove', (event) => {
          const box = hero.getBoundingClientRect();
          state.aimX = ((event.clientX - box.left) / box.width) * 2 - 1;
          state.aimY = ((event.clientY - box.top) / box.height) * 2 - 1;
          aimRay(event);
          hero.style.cursor = !isControl(event.target) && overFish() ? 'pointer' : '';
        });
        hero.addEventListener('pointerleave', () => { state.aimX = 0; state.aimY = 0; hero.style.cursor = ''; });
      }
      hero.addEventListener('click', (event) => {
        if (isControl(event.target)) return;
        aimRay(event);
        if (overFish()) leap('leap');
        else if (raycaster.ray.intersectPlane(waterPlane, hit)) splash(hit.x, hit.z, 0.5);
      });
    }

    /* ---- Each frame ---- */
    let ready = false;
    function frame(t, dt) {
      const k = 1 - Math.exp(-dt * 3);
      state.ax += (state.aimX - state.ax) * k;
      state.ay += (state.aimY - state.ay) * k;
      const scrolled = STILL ? 0 : Math.min(Math.max(window.scrollY / Math.max(hero.offsetHeight, 1), 0), 1);

      let y = FISH_Y + Math.sin(t * 1.15) * 0.07 + scrolled * 0.45;
      const rx = -state.ay * 0.12;
      let ry = state.ax * 0.5 + Math.sin(t * 0.37) * 0.2;
      let rz = Math.sin(t * 1.15 + 0.6) * 0.03;
      let flexTarget = 0.55;
      let airborne = false;

      const p = (t - state.leapAt) / (state.leapKind === 'intro' ? INTRO_TIME : LEAP_TIME);
      if (p >= 0 && p < 1) {
        airborne = true;
        flexTarget = 1.3;
        if (state.leapKind === 'intro') {
          const rise = easeOutBack(p);
          y -= 2.7 * (1 - rise);
          rz += (1 - rise) * 0.5;
          if (!state.splashed && y > -FISH_H * 0.45) { state.splashed = true; splash(0, 0, 1.5); }
        } else {
          const arc = Math.sin(Math.PI * p);
          y += arc * 0.95;
          rz -= arc * 0.3;
          ry += Math.sin(Math.PI * 2 * p) * 0.45;
          if (!state.splashed && p > 0.8) { state.splashed = true; const at = tailOnWater(); splash(at.x, at.z, 1.3); }
        }
      }

      fish.position.set(0, y, 0);
      fish.rotation.set(rx, ry, rz);
      fishMirror.position.copy(fish.position);
      fishMirror.rotation.copy(fish.rotation);
      flex.uTime.value = t;
      flex.uFlex.value += (flexTarget - flex.uFlex.value) * k;

      // Rings spread from under the tail while the fish hangs above the water
      if (!airborne && !STILL && t > state.nextRing) {
        const at = tailOnWater();
        addRipple(at.x, at.z, 0.45);
        state.nextRing = t + 1.4;
      }

      placeCamera(state.ax * 0.06, PITCH + state.ay * 0.02 + scrolled * 0.1);
      sky.position.copy(camera.position);
      shared.uTime.value = t;
      updateDrops(dt);

      // Pass 1: the reflection. Pass 2: everything else.
      renderer.setRenderTarget(reflection);
      renderer.setClearColor(0x000000, 0);
      renderer.clippingPlanes = keepBelowWater;
      camera.layers.set(1);
      renderer.render(scene, camera);
      camera.layers.set(0);
      renderer.clippingPlanes = [];
      renderer.setRenderTarget(null);
      renderer.setClearColor(PAGE_BLACK, 1);
      renderer.render(scene, camera);

      if (!ready) { ready = true; canvas.classList.add('is-ready'); }
    }

    /* ---- Start ---- */
    hero.prepend(canvas);
    document.documentElement.classList.add('hero-3d');   // script.js and style.css stop moving the flat fish
    layout();
    new ResizeObserver(layout).observe(hero);
    window.addEventListener('resize', layout);
    if (document.fonts) document.fonts.ready.then(layout);

    if (STILL) {
      // A couple of rings already spreading, so the still picture has some life
      const at = tailOnWater();
      addRipple(at.x, at.z, 0.45, 0.9);
      addRipple(at.x, at.z, 0.45, 2.3);
    } else {
      leap('intro');
    }

    let visible = false;
    new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      loop.wake();
    }).observe(hero);
    loop.add({ active: () => visible, frame });
  }

  // Builds a puffed-out mesh from a picture's outline: thin parts (fins) stay
  // flat and the body gets rounded, like an inflated sticker. Front and back.
  function inflatedGeometry(THREE, alpha, gw, gh, width, height, depth) {
    const N = gw * gh;

    // Distance from each painted pixel to the outline
    const dist = chamfer(alpha.map((a) => (a > 0.5 ? 1 : 0)), gw, gh, true);

    // Turn distance into thickness, then smooth it
    const reach = gw * 0.13;
    let thick = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const t = Math.min(dist[i] / reach, 1);
      thick[i] = t * (2 - t);
    }
    for (let pass = 0; pass < 2; pass++) {
      const out = new Float32Array(N);
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          if (!dist[y * gw + x]) continue;
          let sum = 0;
          let n = 0;
          for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
              const xx = x + i;
              const yy = y + j;
              if (xx >= 0 && yy >= 0 && xx < gw && yy < gh) { sum += thick[yy * gw + xx]; n++; }
            }
          }
          out[y * gw + x] = sum / n;
        }
      }
      thick = out;
    }

    // One vertex per pixel near the painted area
    const index = new Int32Array(N).fill(-1);
    const front = [];
    const uvs = [];
    let count = 0;
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        let near = false;
        for (let j = -1; j <= 1 && !near; j++) {
          for (let i = -1; i <= 1; i++) {
            const xx = x + i;
            const yy = y + j;
            if (xx >= 0 && yy >= 0 && xx < gw && yy < gh && alpha[yy * gw + xx] > 0.02) { near = true; break; }
          }
        }
        if (!near) continue;
        const u = (x + 0.5) / gw;
        const v = 1 - (y + 0.5) / gh;
        index[y * gw + x] = count++;
        front.push((u - 0.5) * width, (v - 0.5) * height, thick[y * gw + x] * depth);
        uvs.push(u, v);
      }
    }

    const positions = new Float32Array(count * 6);
    const uv = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      positions.set([front[i * 3], front[i * 3 + 1], front[i * 3 + 2]], i * 3);
      positions.set([front[i * 3], front[i * 3 + 1], -front[i * 3 + 2]], (count + i) * 3);
      uv.set([uvs[i * 2], uvs[i * 2 + 1]], i * 2);
      uv.set([uvs[i * 2], uvs[i * 2 + 1]], (count + i) * 2);
    }

    const faces = [];
    for (let y = 0; y < gh - 1; y++) {
      for (let x = 0; x < gw - 1; x++) {
        const a = index[y * gw + x];
        const b = index[y * gw + x + 1];
        const c = index[(y + 1) * gw + x];
        const d = index[(y + 1) * gw + x + 1];
        if (a < 0 || b < 0 || c < 0 || d < 0) continue;
        faces.push(a, c, b, b, c, d);                                            // front
        faces.push(a + count, b + count, c + count, b + count, d + count, c + count); // back
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geometry.setIndex(faces);
    geometry.computeVertexNormals();
    return geometry;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not load ' + src));
      img.src = src;
    });
  }

  // Transparency of each pixel, at a small size. Throws if the browser won't let us read it.
  function readAlpha(img, w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    const alpha = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) alpha[i] = data[i * 4 + 3] / 255;
    return alpha;
  }

  // The fins in the picture are spines with see-through gaps between them. In 3D
  // those gaps show as holes, and the side fin (painted over the body) makes the
  // body dip in. This copy closes gaps up to "gap" pixels wide, fills any holes
  // inside the outline, and colours the new pixels from their neighbours.
  // Throws if the browser won't let us read the picture (file:// pages).
  function solidPicture(img, gap) {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const N = w * h;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const image = ctx.getImageData(0, 0, w, h);
    const px = image.data;

    // Close the gaps: grow the painted area by "gap", then shrink it back
    const clear = new Uint8Array(N);
    for (let i = 0; i < N; i++) clear[i] = px[i * 4 + 3] < 128 ? 1 : 0;
    const toPaint = chamfer(clear, w, h, false);
    const grown = new Uint8Array(N);
    for (let i = 0; i < N; i++) grown[i] = toPaint[i] <= gap ? 1 : 0;
    const toEdge = chamfer(grown, w, h, true);
    const solid = new Uint8Array(N);
    for (let i = 0; i < N; i++) solid[i] = toEdge[i] > gap || !clear[i] ? 1 : 0;

    // Anything clear that can't be reached from the picture's border is a hole
    const outside = new Uint8Array(N);
    const stack = [];
    for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
    while (stack.length) {
      const i = stack.pop();
      if (outside[i] || solid[i]) continue;
      outside[i] = 1;
      const x = i % w;
      if (x > 0) stack.push(i - 1);
      if (x < w - 1) stack.push(i + 1);
      if (i >= w) stack.push(i - w);
      if (i < N - w) stack.push(i + w);
    }

    // Colour for the new pixels: a blur of the colours around them, a little lighter
    const channels = [0, 1, 2, 3].map(() => new Float32Array(N));
    for (let i = 0; i < N; i++) {
      const a = px[i * 4 + 3] / 255;
      channels[3][i] = a;
      for (let k = 0; k < 3; k++) channels[k][i] = px[i * 4 + k] * a;
    }
    const soft = channels.map((ch) => blurChannel(blurChannel(ch, w, h, 4), w, h, 4));
    const membrane = [150, 190, 90];
    for (let i = 0; i < N; i++) {
      const a = px[i * 4 + 3] / 255;
      if (outside[i] || a >= 1) continue;
      const weight = Math.max(soft[3][i], 0.001);
      for (let k = 0; k < 3; k++) {
        const fill = (soft[k][i] / weight) * 0.75 + membrane[k] * 0.25;
        px[i * 4 + k] = px[i * 4 + k] * a + fill * (1 - a);
      }
      px[i * 4 + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    return c;
  }

  // Distance from each "inside" pixel to the nearest outside one (0 for outside
  // pixels). edgeIsOutside: whether the area beyond the picture counts as outside.
  function chamfer(inside, w, h, edgeIsOutside) {
    const SQ2 = Math.SQRT2;
    const d = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) d[i] = inside[i] ? 1e9 : 0;
    const edge = edgeIsOutside ? 0 : 1e9;
    const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? edge : d[y * w + x]);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (d[i]) d[i] = Math.min(d[i], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + SQ2, at(x + 1, y - 1) + SQ2);
      }
    }
    for (let y = h - 1; y >= 0; y--) {
      for (let x = w - 1; x >= 0; x--) {
        const i = y * w + x;
        if (d[i]) d[i] = Math.min(d[i], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + SQ2, at(x - 1, y + 1) + SQ2);
      }
    }
    return d;
  }

  // Box blur of one channel, across then down
  function blurChannel(ch, w, h, r) {
    const across = new Float32Array(w * h);
    const out = new Float32Array(w * h);
    const size = 2 * r + 1;
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let sum = 0;
      for (let x = -r; x <= r; x++) sum += ch[row + Math.min(Math.max(x, 0), w - 1)];
      for (let x = 0; x < w; x++) {
        across[row + x] = sum / size;
        sum += ch[row + Math.min(x + r + 1, w - 1)] - ch[row + Math.max(x - r, 0)];
      }
    }
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let y = -r; y <= r; y++) sum += across[Math.min(Math.max(y, 0), h - 1) * w + x];
      for (let y = 0; y < h; y++) {
        out[y * w + x] = sum / size;
        sum += across[Math.min(y + r + 1, h - 1) * w + x] - across[Math.max(y - r, 0) * w + x];
      }
    }
    return out;
  }

  function easeOutBack(p) {
    const c1 = 1.6;
    return 1 + (c1 + 1) * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
  }

  /* ---- Shaders for the hero ---- */
  const WORLD_VERT = /* glsl */ `
    varying vec3 vWorld;
    void main() {
      vec4 world = modelMatrix * vec4(position, 1.0);
      vWorld = world.xyz;
      gl_Position = projectionMatrix * viewMatrix * world;
    }`;

  // 1 away from the hero text, fading towards 0 behind it
  const SCRIM_GLSL = /* glsl */ `
    uniform vec4 uScrim;
    uniform float uScrimSoft;
    float scrimMask() {
      vec2 centre = (uScrim.xy + uScrim.zw) * 0.5;
      vec2 halfSize = (uScrim.zw - uScrim.xy) * 0.5;
      vec2 q = abs(gl_FragCoord.xy - centre) - halfSize;
      float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
      return smoothstep(-uScrimSoft * 0.3, uScrimSoft, d);
    }
    vec3 calmBehindText(vec3 col) {
      return mix(vec3(0.004), col, mix(0.3, 1.0, scrimMask()));
    }`;

  // Near-black like the page, a faint green haze along the horizon, a glow behind the fish
  const SKY_GLSL = /* glsl */ `
    uniform vec3 uLightDir;
    uniform float uGlowTight;   // larger when the fish is drawn smaller, so the glow stays fish-sized
    vec3 skyColor(vec3 dir) {
      vec3 col = vec3(0.004);
      col += vec3(0.004, 0.012, 0.002) * exp(-abs(dir.y) * 10.0);
      float g = max(dot(dir, uLightDir), 0.0);
      col += vec3(0.012, 0.025, 0.006) * pow(g, 40.0 * uGlowTight) + vec3(0.005, 0.012, 0.002) * pow(g, 12.0 * uGlowTight);
      return col;
    }`;

  const SKY_FRAG = /* glsl */ `
    varying vec3 vWorld;
    void main() {
      gl_FragColor = vec4(calmBehindText(skyColor(normalize(vWorld - cameraPosition))), 1.0);
      #include <colorspace_fragment>
    }`;

  const WATER_FRAG = /* glsl */ `
    uniform float uTime;
    uniform vec4 uRipples[MAX_RIPPLES];   // x, z, start time, strength
    uniform sampler2D uReflection;
    uniform vec2 uResolution;
    uniform float uFogDensity;
    varying vec3 vWorld;

    // One travelling wave: height in x, slope in y and z
    vec3 wave(vec2 p, vec2 dir, float freq, float amp, float speed) {
      float phase = dot(p, dir) * freq + uTime * speed;
      return vec3(sin(phase) * amp, dir * (cos(phase) * amp * freq));
    }

    void main() {
      vec2 p = vWorld.xz;
      vec3 h = wave(p, vec2(0.96, 0.28), 1.3, 0.022, 1.1)
             + wave(p, vec2(-0.51, 0.86), 2.1, 0.012, 1.5)
             + wave(p, vec2(0.2, -0.98), 3.7, 0.007, 2.2)
             + wave(p, vec2(-0.93, -0.37), 6.3, 0.0035, 3.0);

      float glow = 0.0;
      for (int i = 0; i < MAX_RIPPLES; i++) {
        vec4 r = uRipples[i];
        float age = uTime - r.z;
        if (r.w <= 0.0 || age < 0.0 || age > 5.0) continue;
        vec2 d = p - r.xy;
        float dist = length(d) + 0.0001;
        float x = dist - age * 0.85;
        float env = r.w * exp(-age * 0.9) / (1.0 + dist * 1.2);
        float g = exp(-x * x * 16.0);
        float c = cos(x * 14.0);
        float s = sin(x * 14.0);
        h.x += env * g * c * 0.05;
        h.yz += (d / dist) * env * 0.05 * g * (-14.0 * s - 32.0 * x * c);
        glow += env * g * max(c, 0.0);
      }

      vec3 n = normalize(vec3(-h.y, 1.0, -h.z));
      vec3 toEye = cameraPosition - vWorld;
      float eyeDist = length(toEye);
      vec3 V = toEye / eyeDist;
      float fres = 0.06 + 0.94 * pow(1.0 - max(dot(n, V), 0.0), 4.0);
      vec3 R = reflect(-V, n);

      vec4 refl = texture2D(uReflection, gl_FragCoord.xy / uResolution + n.xz * 0.05);
      vec3 col = mix(vec3(0.002, 0.005, 0.003), skyColor(R), clamp(fres * 1.6, 0.0, 1.0));
      col = mix(col, refl.rgb * (0.3 + fres), refl.a);

      float sun = max(dot(R, uLightDir), 0.0);
      col += vec3(0.75, 1.0, 0.7) * (pow(sun, 350.0) * 2.5 + pow(sun, 120.0) * 0.12 + pow(sun, 50.0) * 0.012);
      col += vec3(0.12, 0.55, 0.01) * glow * 0.3;

      float fog = 1.0 - exp(-pow(eyeDist * uFogDensity, 2.0));
      col = mix(col, skyColor(-V), fog);
      gl_FragColor = vec4(calmBehindText(col), 1.0);
      #include <colorspace_fragment>
    }`;

  const BUBBLE_VERT = /* glsl */ `
    uniform float uTime;
    uniform float uScale;
    uniform float uSizeScale;
    attribute float aSeed;
    attribute float aSize;
    varying float vAlpha;
    void main() {
      vec3 p = position;
      p.y = fract(position.y + uTime * (0.035 + fract(aSeed * 7.31) * 0.05));
      p.x += sin(uTime * 0.6 + aSeed * 6.2832) * 0.012;
      p.z += cos(uTime * 0.45 + aSeed * 4.0) * 0.01;
      vAlpha = smoothstep(0.0, 0.08, p.y) * (1.0 - smoothstep(0.55, 1.0, p.y));
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = aSize * uSizeScale * uScale / -mv.z;
    }`;

  const BUBBLE_FRAG = /* glsl */ `
    uniform vec3 uColor;
    varying float vAlpha;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float r = length(c);
      if (r > 0.5) discard;
      float rim = smoothstep(0.5, 0.4, r) * smoothstep(0.22, 0.42, r);
      float shine = smoothstep(0.13, 0.0, length(c - vec2(-0.14, -0.14)));
      float a = (rim * 0.55 + shine * 0.7 + 0.04) * vAlpha * mix(0.2, 1.0, scrimMask());
      gl_FragColor = vec4(mix(uColor, vec3(1.0), shine) * a, 1.0);
      #include <colorspace_fragment>
    }`;

  const SPLASH_VERT = /* glsl */ `
    uniform float uScale;
    uniform float uSizeScale;
    attribute float aLife;
    varying float vLife;
    void main() {
      vLife = aLife;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = aLife > 0.0 ? (0.03 + aLife * 0.05) * uSizeScale * uScale / -mv.z : 0.0;
    }`;

  const SPLASH_FRAG = /* glsl */ `
    varying float vLife;
    void main() {
      float r = length(gl_PointCoord - 0.5);
      if (r > 0.5 || vLife <= 0.0) discard;
      float a = smoothstep(0.5, 0.1, r) * clamp(vLife * 1.5, 0.0, 1.0);
      gl_FragColor = vec4(vec3(0.75, 1.0, 0.65) * a, 1.0);
      #include <colorspace_fragment>
    }`;

  /* =========================================================
     SHELF MODELS AND THE BOBBER
     One hidden 3D renderer draws every small model in turn and
     copies each picture into a canvas inside the page, so they
     scroll with the page like any other image.
     ========================================================= */
  function startViews(THREE, loop) {
    const shelfIcons = SETTINGS.shelf
      ? [...document.querySelectorAll('.stock-list .ico')].filter((el) => MODELS[el.dataset.icon])
      : [];
    const shore = SETTINGS.bobber ? document.querySelector('#visit .shore') : null;
    if (!shelfIcons.length && !shore) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.setClearColor(0x000000, 0);
    const env = makeEnvironment(THREE, renderer);
    const mats = makeMaterials(THREE);
    renderer.setScissorTest(true);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const views = new Map();   // canvas -> view
    let bufW = 0;
    let bufH = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const view = views.get(entry.target);
        view.visible = entry.isIntersecting;
        // Play the model's action once as it scrolls into view (phones have no hover)
        if (!view.seen && entry.intersectionRatio >= 0.6) {
          view.seen = true;
          view.playFrom = loop.time + view.opts.delay;
          view.playTo = view.playFrom + 1.6;
        }
      });
      loop.wake();
    }, { threshold: [0, 0.6] });

    function addView(container, name, opts) {
      const canvas = document.createElement('canvas');
      canvas.className = 'view3d ' + (opts.className || '');
      canvas.setAttribute('aria-hidden', 'true');
      container.append(canvas);

      const scene = new THREE.Scene();
      scene.environment = env;
      studioLights(THREE, scene);
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(0, opts.cameraY, opts.distance);
      camera.lookAt(0, 0, 0);
      const presenter = new THREE.Group();
      scene.add(presenter);
      const model = MODELS[name](THREE, mats);
      presenter.add(model.root);

      const view = {
        canvas, ctx: canvas.getContext('2d'), scene, camera, presenter, model, opts,
        visible: false, seen: false, ready: false, hovered: false,
        playFrom: -1, playTo: -1, e: 0, aimX: 0, aimY: 0, ax: 0, ay: 0
      };
      views.set(canvas, view);
      observer.observe(canvas);
      return view;
    }

    function play(view, seconds) {
      view.playFrom = loop.time;
      view.playTo = loop.time + seconds;
      loop.wake();
    }

    shelfIcons.forEach((ico, i) => {
      const view = addView(ico, ico.dataset.icon, { distance: 5.2, cameraY: 0.35, sway: 0.35, seed: i * 1.7, delay: (i % 3) * 0.15 });
      ico.classList.add('has-3d');
      const item = ico.closest('li') || ico;
      item.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') view.hovered = true; loop.wake(); });
      item.addEventListener('pointerleave', () => { view.hovered = false; view.aimX = 0; view.aimY = 0; });
      item.addEventListener('pointermove', (event) => {
        const box = item.getBoundingClientRect();
        view.aimX = ((event.clientX - box.left) / box.width) * 2 - 1;
        view.aimY = ((event.clientY - box.top) / box.height) * 2 - 1;
      });
      item.addEventListener('pointerdown', (event) => { if (event.pointerType !== 'mouse') play(view, 1.8); });
    });

    if (shore) {
      const view = addView(shore, 'bobber', { distance: 9.3, cameraY: 1.1, sway: 0, seed: 0, delay: 0, className: 'bobber3d' });
      shore.classList.add('has-3d');
      let lastBite = -1;
      const bite = () => {
        if (STILL || loop.time - lastBite < 0.5) return;
        lastBite = loop.time;
        view.model.bite();
        loop.wake();
      };
      view.canvas.addEventListener('pointerenter', bite);
      view.canvas.addEventListener('pointerdown', bite);
    }

    function frame(t, dt) {
      views.forEach((v) => {
        if (!v.visible) return;
        const w = Math.round(v.canvas.clientWidth * ratio);
        const h = Math.round(v.canvas.clientHeight * ratio);
        if (!w || !h) return;
        if (v.canvas.width !== w || v.canvas.height !== h) { v.canvas.width = w; v.canvas.height = h; }
        if (w > bufW || h > bufH) {
          bufW = Math.max(bufW, w);
          bufH = Math.max(bufH, h);
          renderer.setSize(bufW, bufH, false);
        }
        if (v.camera.aspect !== w / h) { v.camera.aspect = w / h; v.camera.updateProjectionMatrix(); }

        // "e" is how lively the model is: 0 resting, 1 hovered or playing
        const lively = !STILL && (v.hovered || (t >= v.playFrom && t < v.playTo));
        v.e += ((lively ? 1 : 0) - v.e) * (1 - Math.exp(-dt * 5));
        const k = 1 - Math.exp(-dt * 4);
        v.ax += (v.aimX - v.ax) * k;
        v.ay += (v.aimY - v.ay) * k;

        const sway = v.opts.sway;
        v.presenter.rotation.y = Math.sin(t * 0.5 + v.opts.seed) * sway + v.ax * 0.55;
        v.presenter.rotation.x = v.ay * 0.3;
        v.presenter.position.y = sway ? Math.sin(t * 1.2 + v.opts.seed) * 0.05 : 0;
        v.model.update(t, dt, v);

        renderer.setViewport(0, 0, w, h);
        renderer.setScissor(0, 0, w, h);
        renderer.render(v.scene, v.camera);
        v.ctx.clearRect(0, 0, w, h);
        v.ctx.drawImage(renderer.domElement, 0, bufH - h, w, h, 0, 0, w, h);
        if (!v.ready) { v.ready = true; v.canvas.classList.add('is-ready'); }
      });
    }

    loop.add({ active: () => [...views.values()].some((v) => v.visible), frame });
  }

  function studioLights(THREE, scene) {
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(2.5, 3.5, 4);
    const rim = new THREE.DirectionalLight(GREEN, 3.5);
    rim.position.set(-3.5, 1.5, -3);
    scene.add(key, rim, new THREE.HemisphereLight(0xffffff, 0x1a2a14, 0.7));
  }

  // A tiny made-up room for shiny things to reflect: soft white lights and a green one.
  function makeEnvironment(THREE, renderer) {
    const room = new THREE.Scene();
    room.add(new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: 0x1a1d1a, side: THREE.BackSide })));
    const panel = (color, strength, w, h, x, y, z) => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength), side: THREE.DoubleSide })
      );
      mesh.position.set(x, y, z);
      mesh.lookAt(0, 0, 0);
      room.add(mesh);
    };
    panel(0xffffff, 6, 4, 2, 0, 4.9, 1);
    panel(0xffffff, 3, 2, 3, 4.9, 1, 1);
    panel(GREEN, 4, 3, 2, -4.9, 0.5, -2);
    panel(0xffffff, 1.5, 6, 1, 0, -1, 4.9);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const texture = pmrem.fromScene(room, 0.04).texture;
    pmrem.dispose();
    return texture;
  }

  function makeMaterials(THREE) {
    const shiny = (color, extra) => new THREE.MeshPhysicalMaterial(Object.assign({
      color, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12
    }, extra));
    return {
      steel: new THREE.MeshStandardMaterial({ color: 0xe4e8ea, metalness: 1, roughness: 0.18 }),
      gunmetal: new THREE.MeshStandardMaterial({ color: 0x4a504c, metalness: 0.9, roughness: 0.32 }),
      black: shiny(0x161816, { roughness: 0.4, clearcoat: 0.6 }),
      green: shiny(GREEN),
      deepGreen: shiny(0x2f8a07),
      red: shiny(RED),
      white: shiny(0xf2f2ef, { roughness: 0.4, clearcoat: 0.5 }),
      yellow: shiny(0xf3e04a),
      blank: shiny(0x1a1c1a, { metalness: 0.4, roughness: 0.25 }),
      cork: new THREE.MeshStandardMaterial({ color: 0xb4865a, roughness: 0.9 }),
      inside: new THREE.MeshStandardMaterial({ color: 0x0c0d0c, roughness: 0.9 }),
      clear: new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transparent: true, opacity: 0.35, roughness: 0.05,
        clearcoat: 1, depthWrite: false, side: THREE.DoubleSide
      }),
      line: new THREE.LineBasicMaterial({ color: 0xf2f2ef, transparent: true, opacity: 0.6 })
    };
  }

  function roundedRect(THREE, w, h, r) {
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  function roundedBox(THREE, w, h, d, r) {
    const bevel = Math.min(r * 0.5, w / 4, h / 4, d / 4);
    const iw = w - bevel * 2;
    const ih = h - bevel * 2;
    const ir = Math.max(Math.min(r - bevel, iw / 2, ih / 2) - 0.0001, 0.0001);
    return new THREE.ExtrudeGeometry(roundedRect(THREE, iw, ih, ir), {
      depth: d - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel,
      bevelSegments: 3, curveSegments: 5
    }).center();
  }

  function lineThrough(THREE, material, count) {
    const points = Array.from({ length: count }, () => new THREE.Vector3());
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
  }

  /* ---------------------------------------------------------
     The models. Each item in CONFIG.stock (script.js) picks one
     with its "icon" name. update() runs every frame; v.e goes
     from 0 (resting) to 1 (hovered, or playing as it scrolls in).
     --------------------------------------------------------- */
  const MODELS = {
    // A crankbait: wobbles side to side, faster when hovered
    lure(THREE, m) {
      const root = new THREE.Group();
      const body = new THREE.Group();
      root.add(body);
      root.rotation.set(0, -0.55, 0.12);

      const profile = [];
      for (let i = 0; i <= 32; i++) {
        const u = i / 32;
        const r = 0.46 * Math.pow(u, 0.6) * Math.pow(1 - u, 0.35) / 0.535;
        profile.push(new THREE.Vector2(Math.max(r, 0.001), u * 2 - 1));
      }
      const shape = new THREE.LatheGeometry(profile, 48);
      shape.rotateZ(-Math.PI / 2);   // nose points along +x
      shape.scale(1, 1, 0.72);

      // Paint it like the bass: pale belly, green sides, dark bars across the back
      const belly = new THREE.Color(0xf4f1c4);
      const side = new THREE.Color(GREEN);
      const back = new THREE.Color(0x1f5c05);
      const c = new THREE.Color();
      const pos = shape.attributes.position;
      const colors = [];
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        c.copy(belly).lerp(side, THREE.MathUtils.smoothstep(y, -0.22, 0.12));
        c.lerp(back, THREE.MathUtils.smoothstep(y, 0.18, 0.42));
        c.lerp(back, Math.max(0, Math.sin(x * 11)) * THREE.MathUtils.smoothstep(y, 0, 0.3) * 0.55);
        colors.push(c.r, c.g, c.b);
      }
      shape.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      body.add(new THREE.Mesh(shape, new THREE.MeshPhysicalMaterial({
        vertexColors: true, roughness: 0.28, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08
      })));

      const eye = new THREE.SphereGeometry(0.085, 16, 12);
      const pupil = new THREE.SphereGeometry(0.05, 12, 10);
      [-1, 1].forEach((s) => {
        const e = new THREE.Mesh(eye, m.yellow);
        e.position.set(0.6, 0.1, s * 0.255);
        const p = new THREE.Mesh(pupil, m.black);
        p.position.set(0.615, 0.105, s * 0.3);
        body.add(e, p);
      });

      // The clear diving lip under the nose
      const lipShape = new THREE.Shape();
      lipShape.moveTo(0, -0.17);
      lipShape.lineTo(0.32, -0.15);
      lipShape.quadraticCurveTo(0.5, 0, 0.32, 0.15);
      lipShape.lineTo(0, 0.17);
      lipShape.lineTo(0, -0.17);
      const lip = new THREE.Mesh(new THREE.ExtrudeGeometry(lipShape, { depth: 0.025, bevelEnabled: false }).rotateX(Math.PI / 2), m.clear);
      lip.position.set(0.86, -0.1, 0);
      lip.rotation.z = -0.65;
      body.add(lip);

      const hooks = [treble(THREE, m), treble(THREE, m)];
      hooks[0].position.set(0.05, -0.44, 0);
      hooks[1].position.set(-0.98, -0.02, 0);
      body.add(...hooks);

      let phase = 0;
      return {
        root,
        update(t, dt, v) {
          phase += dt * (1.6 + v.e * 9);
          const amp = 0.18 + v.e * 0.2;
          body.rotation.x = Math.sin(phase) * amp;
          body.rotation.y = Math.sin(phase + 0.6) * amp * 0.35;
          hooks.forEach((hook, i) => {
            hook.rotation.x = -body.rotation.x * 0.8;
            hook.rotation.z = Math.sin(phase * 0.8 + i) * (0.05 + v.e * 0.15);
          });
        }
      };
    },

    // A spinning reel: the handle cranks and the rotor spins with it
    reel(THREE, m) {
      const root = new THREE.Group();
      root.rotation.set(0.15, -0.75, 0);
      root.position.y = -0.3;

      const foot = new THREE.Mesh(roundedBox(THREE, 1.0, 0.07, 0.24, 0.04), m.gunmetal);
      foot.position.set(0, 1.04, 0.05);
      const stem = new THREE.Mesh(roundedBox(THREE, 0.12, 0.62, 0.16, 0.05), m.gunmetal);
      stem.position.set(0, 0.72, -0.02);
      stem.rotation.x = 0.12;
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 20), m.black);
      body.scale.set(0.78, 1, 1.05);
      body.position.set(0, 0.12, -0.18);
      root.add(foot, stem, body);

      // Rotor and bail: spin around the spool's axis (z)
      const rotor = new THREE.Group();
      rotor.position.set(0, 0.12, 0.2);
      const cupMaterial = m.gunmetal.clone();
      cupMaterial.side = THREE.DoubleSide;   // it's open at the front, so both sides show
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.28, 0.3, 40, 1, true), cupMaterial);
      cup.rotation.x = Math.PI / 2;
      const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.022, 8, 48), m.green);
      stripe.position.z = 0.15;
      const bail = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.018, 8, 32, Math.PI), m.steel);
      bail.position.z = 0.24;
      rotor.add(cup, stripe, bail);
      root.add(rotor);

      // Spool with green line on it: slides in and out as you crank
      const spool = new THREE.Group();
      spool.position.set(0, 0.12, 0.5);
      const line = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.26, 40), new THREE.MeshStandardMaterial({ color: GREEN, roughness: 0.55 }));
      line.rotation.x = Math.PI / 2;
      const lipFront = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.035, 40), m.steel);
      lipFront.rotation.x = Math.PI / 2;
      lipFront.position.z = 0.145;
      const lipBack = lipFront.clone();
      lipBack.position.z = -0.145;
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), m.black);
      knob.rotation.x = Math.PI / 2;
      knob.position.z = 0.16;
      spool.add(line, lipFront, lipBack, knob);
      root.add(spool);

      // Handle on the side
      const handle = new THREE.Group();
      handle.position.set(0.3, 0.12, -0.18);
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.24, 10), m.gunmetal);
      shaft.rotation.z = Math.PI / 2;
      shaft.position.x = 0.12;
      const arm = new THREE.Mesh(roundedBox(THREE, 0.05, 0.5, 0.06, 0.03), m.gunmetal);
      arm.position.set(0.24, -0.22, 0);
      const grip = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.12, 6, 12), m.green);
      grip.rotation.z = Math.PI / 2;
      grip.position.set(0.34, -0.45, 0);
      handle.add(shaft, arm, grip);
      root.add(handle);

      let crank = 0;
      return {
        root,
        update(t, dt, v) {
          crank += dt * (0.8 + v.e * 9);
          handle.rotation.x = crank;
          rotor.rotation.z = -crank * 5.2;   // the rotor turns about five times per crank
          spool.position.z = 0.5 + Math.sin(crank) * 0.035;
        }
      };
    },

    // A rod: bends under a fish on hover, with the line pulled tight
    rod(THREE, m) {
      const root = new THREE.Group();
      const rod = new THREE.Group();
      rod.rotation.z = -0.8;
      rod.position.set(-1.05, -0.95, 0);
      root.add(rod);

      const L = 2.7;
      const SEG = 48;
      const blankGeometry = new THREE.CylinderGeometry(0.012, 0.042, L, 10, SEG).translate(0, L / 2, 0);
      const base = blankGeometry.attributes.position.array.slice();
      rod.add(new THREE.Mesh(blankGeometry, m.blank));

      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.07, 0.5, 20), m.cork);
      grip.position.y = 0.27;
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.18, 20), m.gunmetal);
      seat.position.y = 0.61;
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.05, 20), m.black);
      cap.position.y = 0.0;
      rod.add(grip, seat, cap);

      // Guides with green thread wraps, placed along the blank
      const guides = [0.42, 0.56, 0.68, 0.78, 0.87, 0.94, 1].map((s, i) => {
        const g = new THREE.Group();
        const size = 0.06 - i * 0.005;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(size, 0.008, 6, 18), m.steel);
        ring.rotation.x = -Math.PI / 2;
        ring.position.x = 0.03 + size;
        const wrap = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.05, 10), m.green);
        g.add(ring, wrap);
        g.userData.at = Math.round(s * SEG);
        rod.add(g);
        return g;
      });

      const cx = new Float32Array(SEG + 1);
      const cy = new Float32Array(SEG + 1);
      const ang = new Float32Array(SEG + 1);
      function bend(amount) {
        let x = 0;
        let y = 0;
        for (let i = 0; i <= SEG; i++) {
          const s = i / SEG;
          ang[i] = amount * s * s;   // the tip bends more than the butt
          cx[i] = x;
          cy[i] = y;
          x += Math.sin(ang[i]) * L / SEG;
          y += Math.cos(ang[i]) * L / SEG;
        }
        const p = blankGeometry.attributes.position;
        for (let v = 0; v < p.count; v++) {
          const ox = base[v * 3];
          const i = Math.round(base[v * 3 + 1] / L * SEG);
          p.setXYZ(v, cx[i] + ox * Math.cos(ang[i]), cy[i] - ox * Math.sin(ang[i]), base[v * 3 + 2]);
        }
        p.needsUpdate = true;
        blankGeometry.computeVertexNormals();
        guides.forEach((g) => {
          const i = g.userData.at;
          g.position.set(cx[i], cy[i], 0);
          g.rotation.z = -ang[i];
        });
      }

      // The line from the tip, with a little lure on the end
      const line = lineThrough(THREE, m.line, 16);
      const bait = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.1, 4, 10), m.red);
      root.add(line, bait);
      const tip = new THREE.Vector3();
      const end = new THREE.Vector3();
      const mid = new THREE.Vector3();
      const pt = new THREE.Vector3();

      return {
        root,
        update(t, dt, v) {
          const fight = v.e * (0.8 + Math.sin(t * 13) * 0.05 + Math.sin(t * 5.3) * 0.04);
          bend(0.12 + Math.sin(t * 1.2) * 0.03 + fight);

          rod.updateMatrix();
          tip.set(cx[SEG], cy[SEG], 0).applyMatrix4(rod.matrix);
          end.set(tip.x + Math.sin(t * 1.3) * 0.08, tip.y - 1.05, 0).lerp(pt.set(1.7, -1.7, 0), v.e);
          const sag = 0.25 * (1 - v.e);
          mid.copy(tip).add(end).multiplyScalar(0.5);
          mid.y -= sag;
          const attr = line.geometry.attributes.position;
          for (let i = 0; i < attr.count; i++) {
            const s = i / (attr.count - 1);
            const a = (1 - s) * (1 - s);
            const b = 2 * (1 - s) * s;
            const c = s * s;
            attr.setXYZ(i, a * tip.x + b * mid.x + c * end.x, a * tip.y + b * mid.y + c * end.y, 0);
          }
          attr.needsUpdate = true;
          bait.position.copy(end);
          bait.rotation.z = Math.sin(t * 2) * 0.3;
        }
      };
    },

    // A bottle of dip: turns to show the label, pours when hovered
    dip(THREE, m) {
      const root = new THREE.Group();
      root.position.y = -0.1;
      const tilt = new THREE.Group();
      root.add(tilt);
      const spin = new THREE.Group();
      tilt.add(spin);

      const v2 = (r, y) => new THREE.Vector2(r, y);
      const bottle = new THREE.Mesh(
        new THREE.LatheGeometry([v2(0.001, -0.78), v2(0.3, -0.78), v2(0.37, -0.76), v2(0.4, -0.7), v2(0.4, 0.2), v2(0.37, 0.32), v2(0.26, 0.44), v2(0.17, 0.5), v2(0.15, 0.56), v2(0.15, 0.62)], 48),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0.08, clearcoat: 1, depthWrite: false })
      );
      bottle.renderOrder = 2;
      const liquid = new THREE.Mesh(
        new THREE.LatheGeometry([v2(0.001, -0.74), v2(0.34, -0.74), v2(0.37, -0.68), v2(0.37, 0.12), v2(0.001, 0.12)], 48),
        new THREE.MeshStandardMaterial({ color: GREEN, emissive: 0x1a5a00, emissiveIntensity: 0.6, roughness: 0.2 })
      );
      const around = Math.PI * 2 * 0.78;
      const label = new THREE.Mesh(
        new THREE.CylinderGeometry(0.405, 0.405, 0.48, 48, 1, true, -around / 2, around),
        new THREE.MeshStandardMaterial({ map: labelTexture(THREE), roughness: 0.5 })
      );
      label.position.y = -0.22;
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.18, 0.2, 32), m.red);
      cap.position.y = 0.71;
      const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.2, 20), m.red);
      nozzle.position.y = 0.91;
      spin.add(liquid, label, bottle, cap, nozzle);

      // Drops that fall from the nozzle while it pours
      const drops = Array.from({ length: 5 }, () => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), liquid.material);
        mesh.visible = false;
        root.add(mesh);
        return { mesh, life: 0, vel: new THREE.Vector3() };
      });
      const spout = new THREE.Vector3();

      let pour = 0;
      return {
        root,
        update(t, dt, v) {
          spin.rotation.y = t * 0.7;
          pour += (v.e - pour) * (1 - Math.exp(-dt * 4));
          tilt.rotation.z = pour * 1.15 + Math.sin(t * 9) * 0.04 * v.e;
          tilt.updateMatrix();
          spout.set(0, 1.02, 0).applyMatrix4(tilt.matrix);
          drops.forEach((d) => {
            if (d.life <= 0) {
              d.mesh.visible = false;
              if (pour > 0.7 && Math.random() < dt * 5) {
                d.life = 0.9;
                d.mesh.position.copy(spout);
                d.vel.set(-0.5 - Math.random() * 0.3, 0.1, 0);
              }
              return;
            }
            d.life -= dt;
            d.vel.y -= 5 * dt;
            d.mesh.position.addScaledVector(d.vel, dt);
            d.mesh.scale.setScalar(Math.min(1, d.life * 2));
            d.mesh.visible = true;
          });
        }
      };
    },

    // A hook on the line: turns slowly, swings when hovered
    hook(THREE, m) {
      const root = new THREE.Group();
      root.position.y = -0.2;
      const swing = new THREE.Group();
      swing.position.y = 1.55;
      root.add(swing);
      const hook = new THREE.Group();
      hook.position.y = -1.55;
      swing.add(hook);

      const pts = [];
      for (let i = 0; i <= 8; i++) pts.push(new THREE.Vector3(0, 0.82 - i * (1.07 / 8), 0));   // shank
      for (let i = 1; i <= 16; i++) {                                                         // bend
        const a = -Math.PI * i / 16;
        pts.push(new THREE.Vector3(-0.32 + 0.32 * Math.cos(a), -0.25 + 0.32 * Math.sin(a), 0));
      }
      for (let i = 1; i <= 4; i++) pts.push(new THREE.Vector3(-0.64, -0.25 + i * 0.07, 0));      // up to the point
      const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, 0.035, 10), m.steel);
      const point = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.16, 10), m.steel);
      point.position.set(-0.64, 0.11, 0);
      const barb = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.11, 8), m.steel);
      barb.position.set(-0.6, 0.0, 0);
      barb.rotation.z = -2.5;
      const eye = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.03, 10, 24), m.steel);
      eye.position.y = 0.9;
      const shot = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), m.gunmetal);
      shot.position.y = 1.3;
      const line = lineThrough(THREE, m.line, 2);
      line.geometry.attributes.position.setXYZ(0, 0, 0.98, 0);
      line.geometry.attributes.position.setXYZ(1, 0, 3.5, 0);
      hook.add(wire, point, barb, eye, shot, line);
      hook.scale.setScalar(1.1);

      let phase = 0;
      return {
        root,
        update(t, dt, v) {
          phase += dt * (1 + v.e * 3.5);
          swing.rotation.z = Math.sin(phase * 1.8) * (0.05 + v.e * 0.28);
          hook.rotation.y = t * 0.6 + v.e * Math.sin(phase) * 0.8;
        }
      };
    },

    // A tackle box: the lid springs open on hover and the tray lifts out
    box(THREE, m) {
      const root = new THREE.Group();
      root.rotation.set(0.42, -0.5, 0);
      root.position.y = -0.15;
      const W = 1.7;
      const H = 0.62;
      const D = 0.95;
      const top = -0.2 + H / 2;

      const base = new THREE.Mesh(roundedBox(THREE, W, H, D, 0.1), m.green);
      base.position.y = -0.2;
      const inside = new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(THREE, W - 0.12, D - 0.12, 0.05)), m.inside);
      inside.rotation.x = -Math.PI / 2;
      inside.position.y = top + 0.003;
      root.add(base, inside);

      const latchGeometry = roundedBox(THREE, 0.16, 0.18, 0.05, 0.02);
      [-0.45, 0.45].forEach((x) => {
        const latch = new THREE.Mesh(latchGeometry, m.steel);
        latch.position.set(x, top - 0.06, D / 2 + 0.01);
        root.add(latch);
      });

      // The tray of little lures inside
      const tray = new THREE.Group();
      const trayY = top - 0.02;
      tray.position.y = trayY;
      tray.add(new THREE.Mesh(roundedBox(THREE, W - 0.22, 0.05, D - 0.24, 0.03), m.black));
      const colours = [RED, 0xf3e04a, GREEN, 0xff8a2a, 0x3fa9f5, 0xf2f2ef];
      const lureGeometry = new THREE.CapsuleGeometry(0.05, 0.16, 4, 10);
      const lures = colours.map((colour, i) => {
        const lure = new THREE.Mesh(lureGeometry, new THREE.MeshPhysicalMaterial({ color: colour, roughness: 0.3, clearcoat: 1 }));
        lure.rotation.z = Math.PI / 2;
        lure.position.set(-0.5 + (i % 3) * 0.5, 0.07, i < 3 ? -0.17 : 0.17);
        tray.add(lure);
        return lure;
      });
      root.add(tray);

      // The lid swings up from a hinge along the back
      const hinge = new THREE.Group();
      hinge.position.set(0, top, -D / 2);
      const lid = new THREE.Mesh(roundedBox(THREE, W, 0.2, D, 0.1), m.deepGreen);
      lid.position.set(0, 0.1, D / 2);
      const handlePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.32, 0, 0), new THREE.Vector3(-0.28, 0.14, 0), new THREE.Vector3(0, 0.19, 0),
        new THREE.Vector3(0.28, 0.14, 0), new THREE.Vector3(0.32, 0, 0)
      ]);
      const handle = new THREE.Mesh(new THREE.TubeGeometry(handlePath, 30, 0.035, 8), m.black);
      handle.position.set(0, 0.2, D / 2);
      hinge.add(lid, handle);
      root.add(hinge);

      let open = 0;
      let speed = 0;
      return {
        root,
        update(t, dt, v) {
          // A spring, so the lid bounces a little when it opens
          speed += ((0.04 + v.e * 0.96) - open) * 120 * dt - speed * 11 * dt;
          open += speed * dt;
          hinge.rotation.x = -open * 1.75;
          tray.position.y = trayY + Math.max(open, 0) * 0.16;
          lures.forEach((lure, i) => { lure.position.y = 0.07 + Math.sin(t * 3 + i) * 0.012 * v.e; });
        }
      };
    },

    // The bobber above the Visit section: floats on the waves, dips under for a bite
    bobber(THREE, m) {
      const root = new THREE.Group();
      const float = new THREE.Group();
      root.add(float);
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m.red);
      const bottom = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), m.white);
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.505, 0.505, 0.05, 32), m.black);
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 10), m.white);
      stick.position.y = 0.72;
      const stickTip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), m.red);
      stickTip.position.y = 0.97;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.4, 8), m.white);
      stem.position.y = -0.68;
      const line = lineThrough(THREE, m.line, 2);
      line.geometry.attributes.position.setXYZ(0, 0, 1.0, 0);
      line.geometry.attributes.position.setXYZ(1, 0, 6, 0);
      float.add(top, bottom, band, stick, stickTip, stem, line);

      // A ring that spreads on the water after a bite
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.55, 0.62, 48),
        new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -0.1;
      root.add(ring);

      let dip = 0;
      let dipSpeed = 0;
      let ringAge = 9;
      return {
        root,
        bite() { dipSpeed = -6; ringAge = 0; },
        update(t, dt) {
          dipSpeed += (-dip * 90 - dipSpeed * 7) * dt;
          dip += dipSpeed * dt;
          float.position.y = Math.sin(t * 1.75) * 0.06 + dip;
          float.rotation.z = Math.sin(t * 1.75 + 0.8) * 0.09 + dipSpeed * 0.02;
          ringAge += dt;
          ring.scale.setScalar(1 + ringAge * 2.2);
          ring.material.opacity = Math.max(0, 0.6 * (1 - ringAge / 1.2));
        }
      };
    }
  };

  // A treble hook: split ring, shank and three bends
  function treble(THREE, m) {
    const g = new THREE.Group();
    const R = 0.075;
    const L = 0.26;
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.011, 6, 16), m.steel));
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, L, 6), m.steel);
    shank.position.y = -0.04 - L / 2;
    g.add(shank);
    const bendGeometry = new THREE.TorusGeometry(R, 0.012, 6, 14, Math.PI);
    const pointGeometry = new THREE.ConeGeometry(0.018, 0.07, 6);
    for (let k = 0; k < 3; k++) {
      const arm = new THREE.Group();
      arm.rotation.y = k * Math.PI * 2 / 3;
      const bendMesh = new THREE.Mesh(bendGeometry, m.steel);
      bendMesh.rotation.z = Math.PI;
      bendMesh.position.set(R, -0.04 - L, 0);
      const point = new THREE.Mesh(pointGeometry, m.steel);
      point.position.set(2 * R, -0.04 - L + 0.035, 0);
      arm.add(bendMesh, point);
      g.add(arm);
    }
    return g;
  }

  // The label on the dip bottle, with the shop's name
  function labelTexture(THREE) {
    const c = document.createElement('canvas');
    c.width = 768;
    c.height = 192;
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    const draw = () => {
      const g = c.getContext('2d');
      g.fillStyle = '#111';
      g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = '#4cd80a';
      g.fillRect(0, 0, c.width, 12);
      g.fillRect(0, c.height - 12, c.width, 12);
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.font = 'italic 800 84px "Barlow Condensed", "Arial Narrow", sans-serif';
      g.fillText('VETTIES', c.width / 2, 80);
      g.fillStyle = '#f2f2ef';
      g.font = '700 34px Barlow, sans-serif';
      g.fillText('B A I T   D I P', c.width / 2, 142);
      texture.needsUpdate = true;
    };
    draw();
    if (document.fonts) document.fonts.ready.then(draw);
    return texture;
  }
})();
