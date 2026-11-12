import type { ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';

import { PartId } from './milestones';
import { Anchor, BabyModel, buildBaby } from './model';

export type Projected = { part: PartId; x: number; y: number; facing: number };

const IDLE_MS = 3000;
const AUTO_SPIN = 0.18;
const DRAG = 0.0075;

const WOMB_VERTEX = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 1.0, 1.0); }`;

const WOMB_FRAGMENT = `
precision mediump float;
varying vec2 vUv;
uniform float uPulse;
uniform float uAspect;
void main() {
  vec2 p = (vUv - vec2(0.5, 0.56)) * vec2(uAspect, 1.0) * 2.0;
  float d = length(p);
  vec3 inner = vec3(0.97, 0.77, 0.62);
  vec3 mid = vec3(0.76, 0.40, 0.30);
  vec3 outer = vec3(0.20, 0.07, 0.07);
  vec3 c = mix(inner, mid, smoothstep(0.05, 0.75 + uPulse * 0.03, d));
  c = mix(c, outer, smoothstep(0.7, 1.45, d));
  gl_FragColor = vec4(c, 1.0);
}`;

const MOTE_VERTEX = `
attribute float aSize;
uniform float uTime;
varying float vFade;
void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.25 + position.x * 5.0) * 0.08;
  p.x += cos(uTime * 0.2 + position.y * 4.0) * 0.06;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vFade = 0.35 + 0.35 * sin(uTime * 0.5 + position.z * 6.0);
  gl_PointSize = aSize * (9.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const MOTE_FRAGMENT = `
precision mediump float;
varying float vFade;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  gl_FragColor = vec4(1.0, 0.9, 0.8, (1.0 - smoothstep(0.1, 1.0, d)) * vFade * 0.55);
}`;

export function createEngine(gl: ExpoWebGLRenderingContext) {
  const width = gl.drawingBufferWidth;
  const height = gl.drawingBufferHeight;
  const aspect = width / height;
  const canvas = { width, height, style: {}, clientWidth: width, clientHeight: height, addEventListener() {}, removeEventListener() {}, getContext: () => gl };

  // O contexto do expo-gl é WebGL2, mas herda da classe WebGL1 que o three recusa ao criar o renderer.
  const globals = globalThis as { WebGLRenderingContext?: unknown };
  const webgl1 = globals.WebGLRenderingContext;
  globals.WebGLRenderingContext = undefined;
  const renderer = new THREE.WebGLRenderer({ canvas: canvas as unknown as HTMLCanvasElement, context: gl as unknown as WebGL2RenderingContext, antialias: false });
  globals.WebGLRenderingContext = webgl1;
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.autoClear = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, aspect, 0.1, 50);
  const halfTan = Math.tan(THREE.MathUtils.degToRad(16));
  const homeDistance = 1.08 / (halfTan * Math.min(1, aspect));
  const homeOffset = new THREE.Vector3(0, 0.12, 0);

  const wombUniforms = { uPulse: { value: 0 }, uAspect: { value: aspect } };
  const womb = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: WOMB_VERTEX, fragmentShader: WOMB_FRAGMENT, uniforms: wombUniforms, depthWrite: false, depthTest: false }));
  womb.frustumCulled = false;
  womb.renderOrder = -10;
  scene.add(womb);

  const moteCount = 70;
  const motePos = new Float32Array(moteCount * 3);
  const moteSize = new Float32Array(moteCount);
  for (let i = 0; i < moteCount; i++) {
    motePos[i * 3] = (Math.random() - 0.5) * 3.4;
    motePos[i * 3 + 1] = (Math.random() - 0.5) * 5;
    motePos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    moteSize[i] = (2 + Math.random() * 6) * (height / 900);
  }
  const moteGeometry = new THREE.BufferGeometry();
  moteGeometry.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  moteGeometry.setAttribute('aSize', new THREE.BufferAttribute(moteSize, 1));
  const moteUniforms = { uTime: { value: 0 } };
  const motes = new THREE.Points(moteGeometry, new THREE.ShaderMaterial({ vertexShader: MOTE_VERTEX, fragmentShader: MOTE_FRAGMENT, uniforms: moteUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  motes.frustumCulled = false;
  scene.add(motes);

  scene.add(new THREE.HemisphereLight('#FFE3D1', '#8A3F2E', 1.7));
  const key = new THREE.DirectionalLight('#FFF0E2', 1.9);
  key.position.set(1.5, 2.5, 4);
  scene.add(key);
  const back = new THREE.DirectionalLight('#FF9A6B', 1.5);
  back.position.set(-2.5, 0.5, -3);
  scene.add(back);

  const pivot = new THREE.Group();
  pivot.quaternion.setFromEuler(new THREE.Euler(0.08, -0.32, 0));
  const sway = new THREE.Group();
  pivot.add(sway);
  scene.add(pivot);

  const homeQ = pivot.quaternion.clone();
  const targetOffset = homeOffset.clone();
  let distance = homeDistance;
  let targetDistance = homeDistance;
  let focusQ: THREE.Quaternion | null = null;
  let lastTouch = Date.now();
  let spinPaused = false;
  let velX = 0;
  let velY = 0;
  let baby: BabyModel | null = null;
  let inside = false;
  let raf = 0;
  let disposed = false;
  let onFrame: ((list: Projected[]) => void) | null = null;
  let parts: PartId[] = [];
  let onDrawn: (() => void) | null = null;
  const cache = new Map<number, BabyModel>();

  pivot.position.copy(homeOffset);
  camera.position.set(0, 0, distance);

  const yAxis = new THREE.Vector3(0, 1, 0);
  const xAxis = new THREE.Vector3(1, 0, 0);
  const qTmp = new THREE.Quaternion();
  const vTmp = new THREE.Vector3();
  const nTmp = new THREE.Vector3();
  const qWorld = new THREE.Quaternion();
  let lastFrame = Date.now();
  let elapsed = 0;

  const applyInside = () => {
    if (!baby) return;
    baby.organs.visible = inside;
    for (const m of baby.skinMaterials) {
      m.transparent = inside;
      m.opacity = inside ? 0.26 : 1;
      m.depthWrite = !inside;
      m.needsUpdate = true;
    }
  };

  const getModel = (week: number) => {
    let model = cache.get(week);
    if (!model) {
      model = buildBaby(week);
      cache.set(week, model);
    }
    for (const [w, m] of cache) {
      if (cache.size > 3 && w !== week && m !== baby) {
        m.dispose();
        cache.delete(w);
      }
    }
    return model;
  };

  const frame = () => {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    const now = Date.now();
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    elapsed += dt;

    if (focusQ) {
      pivot.quaternion.slerp(focusQ, 1 - Math.exp(-dt * 4.5));
    } else {
      if (Math.abs(velX) + Math.abs(velY) > 1e-4) {
        qTmp.setFromAxisAngle(yAxis, velX);
        pivot.quaternion.premultiply(qTmp);
        qTmp.setFromAxisAngle(xAxis, velY);
        pivot.quaternion.premultiply(qTmp);
        const damp = Math.exp(-dt * 5);
        velX *= damp;
        velY *= damp;
      }
      if (!spinPaused && Date.now() - lastTouch > IDLE_MS) {
        qTmp.setFromAxisAngle(yAxis, AUTO_SPIN * dt);
        pivot.quaternion.premultiply(qTmp);
      }
    }
    pivot.position.lerp(targetOffset, 1 - Math.exp(-dt * 4.5));
    distance += (targetDistance - distance) * (1 - Math.exp(-dt * 6));
    camera.position.z = distance;

    sway.rotation.z = Math.sin(elapsed * 0.7) * 0.012;
    sway.position.y = Math.sin(elapsed * 0.55) * 0.012;

    const beat = Math.pow(Math.max(0, Math.sin(elapsed * 8.5)), 6);
    wombUniforms.uPulse.value = beat;
    moteUniforms.uTime.value = elapsed;
    if (baby) baby.heart.scale.setScalar(1 + beat * 0.12);

    renderer.render(scene, camera);
    gl.endFrameEXP();
    if (onDrawn) {
      const done = onDrawn;
      onDrawn = null;
      done();
    }

    if (onFrame && baby) {
      sway.updateWorldMatrix(true, false);
      sway.getWorldQuaternion(qWorld);
      const list: Projected[] = [];
      for (const part of parts) {
        const a = baby.anchors[part];
        if (!a) continue;
        vTmp.copy(a.pos).applyMatrix4(sway.matrixWorld).project(camera);
        nTmp.copy(a.normal).applyQuaternion(qWorld);
        list.push({ part, x: (vTmp.x + 1) / 2, y: (1 - vTmp.y) / 2, facing: nTmp.z });
      }
      onFrame(list);
    }
  };
  frame();

  return {
    // `done` só roda depois do primeiro quadro com o bebê, quando os shaders já compilaram.
    setWeek(week: number, done: () => void) {
      const next = getModel(week);
      if (baby !== next) {
        if (baby) sway.remove(baby.root);
        baby = next;
        sway.add(baby.root);
        applyInside();
      }
      onDrawn = done;
    },
    preload(week: number) {
      if (!cache.has(week)) cache.set(week, buildBaby(week));
    },
    setInside(value: boolean) {
      inside = value;
      applyInside();
    },
    setParts(list: PartId[]) {
      parts = list;
    },
    setOnFrame(cb: (list: Projected[]) => void) {
      onFrame = cb;
    },
    drag(dx: number, dy: number) {
      lastTouch = Date.now();
      velX = dx * DRAG;
      velY = dy * DRAG;
      qTmp.setFromAxisAngle(yAxis, velX);
      pivot.quaternion.premultiply(qTmp);
      qTmp.setFromAxisAngle(xAxis, velY);
      pivot.quaternion.premultiply(qTmp);
    },
    touch() {
      lastTouch = Date.now();
      velX = 0;
      velY = 0;
    },
    zoom(factor: number) {
      lastTouch = Date.now();
      targetDistance = THREE.MathUtils.clamp(targetDistance / factor, homeDistance * 0.3, homeDistance * 1.25);
    },
    focus(part: PartId) {
      const a: Anchor | undefined = baby?.anchors[part];
      if (!a) return;
      spinPaused = true;
      velX = 0;
      velY = 0;
      // Gira até a parte encarar a câmera e a desloca para a metade de cima, acima do card.
      const n = a.normal.clone().applyQuaternion(pivot.quaternion);
      focusQ = new THREE.Quaternion().setFromUnitVectors(n, new THREE.Vector3(0.05, 0.05, 1).normalize()).multiply(pivot.quaternion);
      targetDistance = homeDistance * 0.46;
      targetOffset.copy(a.pos).applyQuaternion(focusQ).negate();
      targetOffset.y += 0.12;
    },
    clearFocus() {
      focusQ = null;
      spinPaused = false;
      lastTouch = Date.now();
      targetDistance = homeDistance;
      targetOffset.copy(homeOffset);
    },
    reset() {
      pivot.quaternion.copy(homeQ);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      for (const m of cache.values()) m.dispose();
      cache.clear();
      moteGeometry.dispose();
      renderer.dispose();
    },
  };
}

export type Engine = ReturnType<typeof createEngine>;
