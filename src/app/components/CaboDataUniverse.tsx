import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type NodePoint = {
  position: THREE.Vector3;
  phase: number;
};

function fibonacciSphere(count: number, radius: number): NodePoint[] {
  const points: NodePoint[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;

    points.push({
      position: new THREE.Vector3(
        Math.cos(theta) * ringRadius * radius,
        y * radius,
        Math.sin(theta) * ringRadius * radius,
      ),
      phase: (i * 0.37) % (Math.PI * 2),
    });
  }

  return points;
}

function buildConnections(points: NodePoint[], maxDistance: number) {
  const positions: number[] = [];

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      if (points[i].position.distanceTo(points[j].position) < maxDistance) {
        positions.push(
          points[i].position.x,
          points[i].position.y,
          points[i].position.z,
          points[j].position.x,
          points[j].position.y,
          points[j].position.z,
        );
      }
    }
  }

  return new Float32Array(positions);
}

export function CaboDataUniverse() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const nodeCount = mobile ? 72 : 150;
    const radius = mobile ? 2.7 : 3.35;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, mobile ? 9.5 : 8.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: true,
      powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const universe = new THREE.Group();
    scene.add(universe);

    const points = fibonacciSphere(nodeCount, radius);

    const pointPositions = new Float32Array(points.length * 3);
    const pointSizes = new Float32Array(points.length);

    points.forEach((point, index) => {
      pointPositions[index * 3] = point.position.x;
      pointPositions[index * 3 + 1] = point.position.y;
      pointPositions[index * 3 + 2] = point.position.z;
      pointSizes[index] = index % 13 === 0 ? 0.095 : 0.045;
    });

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    pointsGeometry.setAttribute('size', new THREE.BufferAttribute(pointSizes, 1));

    const pointsMaterial = new THREE.PointsMaterial({
      color: '#F5EDE0',
      size: mobile ? 0.055 : 0.065,
      transparent: true,
      opacity: 0.82,
      sizeAttenuation: true,
    });

    const nodeCloud = new THREE.Points(pointsGeometry, pointsMaterial);
    universe.add(nodeCloud);

    const connectionsGeometry = new THREE.BufferGeometry();
    connectionsGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(buildConnections(points, mobile ? 0.82 : 0.76), 3),
    );

    const connectionsMaterial = new THREE.LineBasicMaterial({
      color: '#C4673A',
      transparent: true,
      opacity: mobile ? 0.16 : 0.24,
      depthWrite: false,
    });

    const connections = new THREE.LineSegments(connectionsGeometry, connectionsMaterial);
    universe.add(connections);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(mobile ? 1.02 : 1.2, 2),
      new THREE.MeshBasicMaterial({
        color: '#C4673A',
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      }),
    );
    universe.add(core);

    const innerCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(mobile ? 0.72 : 0.84, 1),
      new THREE.MeshBasicMaterial({
        color: '#C9A84C',
        wireframe: true,
        transparent: true,
        opacity: 0.34,
      }),
    );
    universe.add(innerCore);

    const ringMaterials = [
      new THREE.MeshBasicMaterial({
        color: '#C4673A',
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      }),
      new THREE.MeshBasicMaterial({
        color: '#C9A84C',
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      }),
      new THREE.MeshBasicMaterial({
        color: '#1D6B6B',
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      }),
    ];

    const rings = [2.05, 2.45, 2.9].map((ringRadius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(ringRadius, 0.008, 6, 96),
        ringMaterials[index],
      );
      ring.rotation.x = index === 0 ? Math.PI / 2.6 : index === 1 ? Math.PI / 3.1 : Math.PI / 1.9;
      ring.rotation.y = index * 0.7;
      universe.add(ring);
      return ring;
    });

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(mobile ? 0.92 : 1.08, 32, 32),
      new THREE.MeshBasicMaterial({
        color: '#C4673A',
        transparent: true,
        opacity: 0.045,
      }),
    );
    universe.add(glow);

    const ambientParticles = new THREE.Points(
      new THREE.BufferGeometry(),
      new THREE.PointsMaterial({
        color: '#C9A84C',
        size: mobile ? 0.035 : 0.045,
        transparent: true,
        opacity: 0.38,
      }),
    );

    const ambientPositions = new Float32Array((mobile ? 90 : 180) * 3);
    for (let i = 0; i < ambientPositions.length; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 4.2 + Math.random() * 2.8;
      ambientPositions[i] = Math.cos(angle) * distance;
      ambientPositions[i + 1] = (Math.random() - 0.5) * 6;
      ambientPositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    ambientParticles.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(ambientPositions, 3),
    );
    universe.add(ambientParticles);

    const pointer = { x: 0, y: 0 };
    const targetPointer = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      targetPointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetPointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    mount.addEventListener('pointermove', onPointerMove, { passive: true });

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    resize();
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      pointer.x += (targetPointer.x - pointer.x) * 0.035;
      pointer.y += (targetPointer.y - pointer.y) * 0.035;

      universe.rotation.y += reducedMotion ? 0 : 0.0018;
      universe.rotation.x = pointer.y * 0.08;
      universe.rotation.z = pointer.x * 0.035;

      nodeCloud.rotation.y = Math.sin(elapsed * 0.18) * 0.08;
      connections.rotation.y = nodeCloud.rotation.y;

      core.rotation.x += reducedMotion ? 0 : 0.002;
      core.rotation.y += reducedMotion ? 0 : 0.003;
      innerCore.rotation.x -= reducedMotion ? 0 : 0.003;
      innerCore.rotation.z += reducedMotion ? 0 : 0.002;

      rings[0].rotation.z += reducedMotion ? 0 : 0.0025;
      rings[1].rotation.x += reducedMotion ? 0 : 0.0015;
      rings[2].rotation.y -= reducedMotion ? 0 : 0.0018;

      const pulse = 1 + Math.sin(elapsed * 1.15) * 0.035;
      glow.scale.setScalar(pulse);
      glow.material.opacity = 0.035 + (Math.sin(elapsed * 1.15) + 1) * 0.008;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      mount.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();

      pointsGeometry.dispose();
      pointsMaterial.dispose();
      connectionsGeometry.dispose();
      connectionsMaterial.dispose();
      core.geometry.dispose();
      core.material.dispose();
      innerCore.geometry.dispose();
      innerCore.material.dispose();
      glow.geometry.dispose();
      glow.material.dispose();
      ambientParticles.geometry.dispose();
      ambientParticles.material.dispose();

      rings.forEach((ring) => {
        ring.geometry.dispose();
      });
      ringMaterials.forEach((material) => material.dispose());

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="cabo-data-universe"
      aria-hidden="true"
    >
      <div className="cabo-universe-label">
        <span>LIVE INTELLIGENCE SYSTEM</span>
        <span>DATA → STORY → POWER</span>
      </div>
    </div>
  );
}
