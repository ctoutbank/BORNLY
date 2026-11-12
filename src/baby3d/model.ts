import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';

import { PartId } from './milestones';

// Modelo ilustrativo gerado por código: proporções aproximadas, não é anatomia exata.

type Keyframes = [number, number][];

const FRAMES = {
  head: [[4, 0.3], [8, 0.38], [12, 0.36], [20, 0.33], [28, 0.31], [40, 0.3]] as Keyframes,
  torso: [[4, 0.15], [8, 0.17], [12, 0.2], [20, 0.225], [28, 0.26], [40, 0.31]] as Keyframes,
  arc: [[4, 0.36], [8, 0.42], [12, 0.48], [20, 0.52], [28, 0.54], [40, 0.54]] as Keyframes,
  span: [[4, 165], [8, 135], [12, 118], [40, 112]] as Keyframes,
  tail: [[4, 1], [7, 0.8], [9, 0], [40, 0]] as Keyframes,
  limb: [[4, 0], [5, 0.08], [7, 0.32], [9, 0.62], [12, 0.92], [20, 1.12], [40, 1.2]] as Keyframes,
  limbR: [[5, 0.04], [9, 0.055], [12, 0.066], [20, 0.076], [28, 0.092], [40, 0.115]] as Keyframes,
  headLift: [[4, 0.14], [8, 0.2], [12, 0.28], [20, 0.34], [40, 0.34]] as Keyframes,
};

function at(frames: Keyframes, week: number) {
  if (week <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    if (week <= frames[i][0]) {
      const [a, va] = frames[i - 1];
      const [b, vb] = frames[i];
      return va + ((vb - va) * (week - a)) / (b - a);
    }
  }
  return frames[frames.length - 1][1];
}

const V = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
const dir = (deg: number) => V(Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180));

export type Anchor = { pos: THREE.Vector3; normal: THREE.Vector3 };
export type BabyModel = {
  root: THREE.Group;
  organs: THREE.Group;
  heart: THREE.Object3D;
  skinMaterials: THREE.MeshStandardMaterial[];
  anchors: Partial<Record<PartId, Anchor>>;
  dispose: () => void;
};

function makeSkin(color: THREE.Color, rim: THREE.Color) {
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.58, metalness: 0 });
  // Brilho de borda que imita a luz atravessando a pele.
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uRim = { value: rim };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uRim;')
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\nfloat rimAmount = pow(1.0 - saturate(dot(normalize(vViewPosition), normal)), 2.2);\ntotalEmissiveRadiance += uRim * rimAmount * 0.55;',
      );
  };
  return m;
}

export function buildBaby(week: number): BabyModel {
  const headR = at(FRAMES.head, week);
  const torsoR = at(FRAMES.torso, week);
  const arcR = at(FRAMES.arc, week);
  const span = at(FRAMES.span, week);
  const tail = at(FRAMES.tail, week);
  const limb = at(FRAMES.limb, week);
  const limbR = at(FRAMES.limbR, week);
  const headLift = at(FRAMES.headLift, week);

  const balls: { c: THREE.Vector3; r: number }[] = [];
  const ball = (c: THREE.Vector3, r: number) => balls.push({ c: c.clone(), r });
  const chain = (a: THREE.Vector3, b: THREE.Vector3, ra: number, rb: number) => {
    const steps = Math.max(2, Math.ceil(a.distanceTo(b) / (Math.min(ra, rb) * 0.9)));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      ball(a.clone().lerp(b, t), (ra + (rb - ra) * t) * 0.92);
    }
  };

  // Curva da coluna em "C", com as costas para -x e o rosto para +x.
  const start = 180 - span / 2;
  const P = (s: number) => dir(start + span * s).multiplyScalar(arcR);
  const inward = (s: number) => P(s).normalize().negate();

  const torsoProfile = (s: number) => torsoR * (0.72 + 0.34 * Math.sin(Math.PI * Math.min(1, s + 0.12)));
  for (let i = 0; i <= 12; i++) {
    const s = i / 12;
    ball(P(s).add(inward(s).multiplyScalar(torsoR * 0.18)), torsoProfile(s));
  }
  if (tail > 0) {
    for (let i = 1; i <= 7; i++) {
      const s = 1 + i * 0.05;
      ball(P(s), torsoR * 0.72 * (1 - i / 8) * tail + 0.012);
    }
  }

  const headDir = dir(start - 8);
  const head = P(0).add(headDir.clone().multiplyScalar(headR * 0.55)).add(V(headLift, headLift * 0.55));
  const face = dir(-28 + Math.min(18, (week - 8) * 0.8));
  const faceSide = V(0, 0, 1);
  ball(head, headR);
  ball(head.clone().add(face.clone().multiplyScalar(-headR * 0.15)).add(V(0, headR * 0.18)), headR * 0.92);
  chain(P(0), head.clone().add(V(0, -headR * 0.4)), torsoR * 0.72, headR * 0.55);

  const facePoint = (right: number, up: number, out: number) => {
    const upV = face.clone().applyAxisAngle(V(0, 0, 1), Math.PI / 2);
    return head.clone().add(face.clone().multiplyScalar(headR * out)).add(upV.multiplyScalar(headR * up)).add(faceSide.clone().multiplyScalar(headR * right));
  };
  if (week >= 9) {
    ball(facePoint(0, -0.12, 1.02), headR * 0.17);
    ball(facePoint(0, -0.42, 0.9), headR * 0.16);
    ball(facePoint(0, -0.68, 0.74), headR * 0.25);
    ball(facePoint(0.4, -0.3, 0.72), headR * 0.28);
    ball(facePoint(-0.4, -0.3, 0.72), headR * 0.28);
    ball(facePoint(0, 0.3, 0.88), headR * 0.26);
  }

  type Capsule = { a: THREE.Vector3; b: THREE.Vector3; r: number };
  const capsules: Capsule[] = [];
  const handCenters: THREE.Vector3[] = [];
  const footCenters: THREE.Vector3[] = [];

  for (const side of [1, -1]) {
    const spread = side === 1 ? 0 : 10;
    const shoulder = P(0.16).add(inward(0.16).multiplyScalar(torsoR * 0.4)).add(V(0, 0, side * torsoR * 0.95));
    const hip = P(0.9).add(inward(0.9).multiplyScalar(torsoR * 0.25)).add(V(0, 0, side * torsoR * 0.8));

    if (limb < 0.2) {
      ball(shoulder.clone().add(V(0.03, 0, side * 0.02)), limbR * 1.4);
      handCenters.push(shoulder.clone().add(V(0.05, 0, side * 0.04)));
      if (week >= 6) ball(hip.clone().add(V(0.03, 0, side * 0.02)), limbR * 1.3);
      footCenters.push(hip.clone().add(V(0.05, 0, side * 0.04)));
      continue;
    }

    const elbow = shoulder.clone().add(dir(-42 - spread).multiplyScalar(limb * 0.3)).add(V(0, 0, side * 0.08));
    const wrist = elbow.clone().add(dir(72 + spread * 2).multiplyScalar(limb * 0.27)).add(V(0, 0, -side * 0.03));
    const hand = wrist.clone().add(dir(64 + spread * 2).multiplyScalar(limb * 0.06));
    chain(shoulder, elbow, limbR * 1.25, limbR);
    chain(elbow, wrist, limbR, limbR * 0.78);
    ball(hand, limbR * (limb > 0.5 ? 1.05 : 1.25));
    handCenters.push(hand);

    const knee = hip.clone().add(dir(30 + spread).multiplyScalar(limb * 0.46)).add(V(0, 0, side * 0.1));
    const ankle = knee.clone().add(dir(-112 - spread).multiplyScalar(limb * 0.42)).add(V(0, 0, -side * 0.03));
    const foot = ankle.clone().add(dir(-8).multiplyScalar(limb * 0.14));
    chain(hip, knee, limbR * 1.7, limbR * 1.15);
    chain(knee, ankle, limbR * 1.15, limbR * 0.82);
    chain(ankle, foot, limbR * 0.85, limbR * 0.95);
    footCenters.push(foot);

    if (week >= 9) {
      const fingerLen = limb * 0.075;
      for (let f = 0; f < 5; f++) {
        const angle = 25 + spread * 2 + f * 20;
        const from = hand.clone().add(dir(angle).multiplyScalar(limbR * 0.7)).add(V(0, 0, (f - 2) * limbR * 0.34));
        capsules.push({ a: from, b: from.clone().add(dir(angle + 12).multiplyScalar(f === 0 ? fingerLen * 0.7 : fingerLen)), r: limbR * 0.17 });
      }
    }
    if (week >= 11) {
      const toeLen = limb * 0.035;
      for (let f = 0; f < 5; f++) {
        const from = foot.clone().add(V(limbR * 0.75, -limbR * 0.15 + f * limbR * 0.02, (f - 2) * limbR * 0.3));
        capsules.push({ a: from, b: from.clone().add(V(toeLen, 0, 0)), r: limbR * (f === 2 ? 0.2 : 0.16) });
      }
    }
  }

  // Encaixa tudo na caixa do gerador de superfície.
  const box = new THREE.Box3();
  for (const b of balls) {
    box.expandByPoint(b.c.clone().addScalar(b.r));
    box.expandByPoint(b.c.clone().subScalar(b.r));
  }
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const k = 1.7 / Math.max(size.x, size.y, size.z);
  const fit = (v: THREE.Vector3) => v.clone().sub(center).multiplyScalar(k);

  const g = Math.min(1, Math.max(0, (week - 4) / 26));
  const skinColor = new THREE.Color('#C9654A').lerp(new THREE.Color('#E9A98C'), g);
  const rimColor = new THREE.Color('#FF8A5C').lerp(new THREE.Color('#FFC4A3'), g);
  const skin = makeSkin(skinColor, rimColor);

  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [skin];

  const SUBTRACT = 130;
  const ISOLATION = 80;
  const surface = new MarchingCubes(68, skin, false, false, 150000);
  surface.isolation = ISOLATION;
  surface.frustumCulled = false;
  surface.reset();
  for (const b of balls) {
    const c = fit(b.c);
    const r = (b.r * k) / 2;
    surface.addBall(c.x / 2 + 0.5, c.y / 2 + 0.5, c.z / 2 + 0.5, r * r * (ISOLATION + SUBTRACT), SUBTRACT);
  }
  surface.update();
  root.add(surface);
  disposables.push(surface.geometry);

  const addSphere = (parent: THREE.Object3D, c: THREE.Vector3, r: number, material: THREE.Material, scale?: THREE.Vector3) => {
    const geometry = new THREE.SphereGeometry(1, 24, 18);
    disposables.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(c);
    mesh.scale.setScalar(r);
    if (scale) mesh.scale.multiply(scale);
    parent.add(mesh);
    return mesh;
  };

  for (const cap of capsules) {
    const a = fit(cap.a);
    const b = fit(cap.b);
    const geometry = new THREE.CapsuleGeometry(cap.r * k, a.distanceTo(b), 4, 8);
    disposables.push(geometry);
    const mesh = new THREE.Mesh(geometry, skin);
    mesh.position.copy(a.clone().lerp(b, 0.5));
    mesh.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize());
    root.add(mesh);
  }

  const eyeMaterial = new THREE.MeshStandardMaterial({ color: '#1E1412', roughness: 0.25 });
  disposables.push(eyeMaterial);
  const eyeOpen = week >= 27;
  const eyePoints = [1, -1].map((side) => facePoint(side * 0.42, 0.06, week < 9 ? 0.72 : 0.8));
  if (week >= 6) {
    for (const p of eyePoints) {
      addSphere(root, fit(p), headR * k * (week < 10 ? 0.08 : 0.115), eyeMaterial);
      if (week >= 10 && !eyeOpen) addSphere(root, fit(p).add(fit(face).sub(fit(V(0, 0))).multiplyScalar(headR * 0.02)), headR * k * 0.15, skin);
    }
  }

  const earPoints = [1, -1].map((side) => head.clone().add(face.clone().multiplyScalar(-headR * 0.18)).add(V(0, -headR * 0.05, side * headR * 0.98)));
  if (week >= 8) {
    for (const [i, p] of earPoints.entries()) {
      const geometry = new THREE.TorusGeometry(headR * k * 0.15, headR * k * 0.055, 8, 16, Math.PI * 1.45);
      disposables.push(geometry);
      const ear = new THREE.Mesh(geometry, skin);
      ear.position.copy(fit(p));
      ear.rotation.set(0, i === 0 ? 0 : Math.PI, 1.2);
      root.add(ear);
    }
  }

  // Cordão umbilical: sai da barriga e some na direção da placenta.
  const belly = P(0.62).add(inward(0.62).multiplyScalar(torsoR * 1.02));
  const bellyOut = fit(belly);
  if (week >= 7) {
    const cordPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      cordPts.push(
        bellyOut.clone()
          .add(V(t * 0.7 + 0.1 * Math.sin(t * 9), -t * t * 1.3 + 0.05 * Math.sin(t * 13), -t * 0.9 + 0.08 * Math.cos(t * 11))),
      );
    }
    const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cordPts), 90, 0.022 + 0.018 * g, 8);
    const material = makeSkin(new THREE.Color('#D98E86'), new THREE.Color('#FFD2C7'));
    disposables.push(geometry, material);
    root.add(new THREE.Mesh(geometry, material));
  }

  // Órgãos: só aparecem em "Ver por dentro".
  const organs = new THREE.Group();
  organs.visible = false;
  root.add(organs);
  const organMaterial = (color: string, emissive: string) => {
    const m = new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: 0.35, roughness: 0.5 });
    disposables.push(m);
    return m;
  };

  const brain = fit(head.clone().add(V(0, headR * 0.1)));
  const brainMesh = addSphere(organs, brain, headR * k * 0.74, organMaterial('#F2B8B0', '#B85E58'), V(1.08, 0.92, 0.94));
  if (week >= 18) {
    // Sulcos sugeridos por deslocamento dos vértices.
    const geometry = new THREE.SphereGeometry(1, 64, 48);
    const pos = geometry.attributes.position;
    const depth = 0.012 + 0.03 * Math.min(1, (week - 18) / 14);
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = Math.sin(v.x * 17 + 2 * Math.sin(v.y * 9)) * Math.sin(v.y * 15 + 2 * Math.sin(v.z * 11)) * Math.sin(v.z * 13 + v.x * 5);
      v.multiplyScalar(1 + n * depth);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geometry.computeVertexNormals();
    disposables.push(geometry);
    brainMesh.geometry = geometry;
  }

  const heartPos = P(0.32).add(inward(0.32).multiplyScalar(torsoR * 0.55));
  const heart = new THREE.Group();
  heart.position.copy(fit(heartPos));
  const heartMat = organMaterial('#D2352F', '#8E1410');
  const hr = torsoR * k * (week < 10 ? 0.42 : 0.34);
  addSphere(heart, V(hr * 0.28, hr * 0.22), hr * 0.62, heartMat);
  addSphere(heart, V(-hr * 0.28, hr * 0.22), hr * 0.62, heartMat);
  addSphere(heart, V(0, -hr * 0.2), hr * 0.72, heartMat, V(0.9, 1.15, 0.9));
  organs.add(heart);

  const lungMat = organMaterial('#E88CA0', '#A84459');
  const lungScale = Math.min(1, Math.max(0.3, (week - 6) / 16));
  const lungCenter = P(0.34).add(inward(0.34).multiplyScalar(torsoR * 0.15));
  if (week >= 8) {
    for (const side of [1, -1]) {
      addSphere(organs, fit(lungCenter.clone().add(V(0, 0, side * torsoR * 0.48))), torsoR * k * 0.42 * lungScale, lungMat, V(0.8, 1.35, 0.72));
    }
  }

  const liverPos = P(0.56).add(inward(0.56).multiplyScalar(torsoR * 0.42));
  if (week >= 8) addSphere(organs, fit(liverPos), torsoR * k * 0.42, organMaterial('#9C4A3B', '#4D1E14'), V(1.1, 0.72, 1.25));

  const boneMat = organMaterial('#F7EFE2', '#A69A82');
  if (week >= 6) {
    const count = 24;
    for (let i = 0; i <= count; i++) {
      const s = i / count;
      addSphere(organs, fit(P(s).add(inward(s).multiplyScalar(-torsoR * 0.42))), torsoR * k * 0.1 * (1 - s * 0.45), boneMat, V(1, 0.75, 1));
    }
  }
  const spineMid = P(0.5).add(inward(0.5).multiplyScalar(-torsoR * 0.42));

  const anchor = (p: THREE.Vector3, n: THREE.Vector3): Anchor => ({ pos: fit(p), normal: n.clone().normalize() });
  const anchors: BabyModel['anchors'] = {
    eyes: anchor(eyePoints[0], V(face.x, face.y, 0.6)),
    ears: anchor(earPoints[0], V(0, 0, 1)),
    hands: anchor(handCenters[0], V(0.35, 0.1, 1)),
    feet: anchor(footCenters[0], V(0.4, -0.2, 1)),
    cord: { pos: bellyOut, normal: V(0.9, -0.2, 0.3).normalize() },
    brain: anchor(head.clone().add(V(0, headR * 0.45)), V(0, 0.4, 1)),
    heart: anchor(heartPos, V(0.3, 0, 1)),
    lungs: anchor(lungCenter.clone().add(V(0, 0, torsoR * 0.48)), V(0, 0, 1)),
    liver: anchor(liverPos, V(0.3, 0, 1)),
    spine: anchor(spineMid, V(-0.4, 0, 1)),
  };

  return {
    root,
    organs,
    heart,
    skinMaterials: [skin],
    anchors,
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}
