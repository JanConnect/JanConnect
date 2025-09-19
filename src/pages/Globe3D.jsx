import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";

function latLonToVec3(latDeg, lonDeg, r) {
  const lat = THREE.MathUtils.degToRad(latDeg);
  const lon = THREE.MathUtils.degToRad(lonDeg);
  const x = r * Math.cos(lat) * Math.cos(lon);
  const y = r * Math.sin(lat);
  const z = r * Math.cos(lat) * Math.sin(lon);
  return new THREE.Vector3(x, y, z);
}

function LatLonGrid({ radius = 1, step = 15 }) {
  const lines = useMemo(() => {
    const group = new THREE.Group();
    for (let lat = -75; lat <= 75; lat += step) {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 3) {
        points.push(latLonToVec3(lat, lon, radius));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(geom, mat);
      group.add(line);
    }
    for (let lon = -180; lon < 180; lon += step) {
      const points = [];
      for (let lat = 0; lat <= 90; lat += 3) {
        points.push(latLonToVec3(lat, lon, radius));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(geom, mat);
      group.add(line);
    }
    return group;
  }, [radius, step]);

  return <primitive object={lines} />;
}

const RedPin = ({ position, label, sublabel }) => {
  const group = useRef();
  const headRadius = 0.03;
  const tailHeight = 0.08;
  const [visible, setVisible] = useState(false);

  useFrame(({ camera }) => {
    if (!group.current) return;

    const pinWorldPos = new THREE.Vector3();
    group.current.getWorldPosition(pinWorldPos);

    const camToPin = new THREE.Vector3()
      .subVectors(pinWorldPos, camera.position)
      .normalize();

    const globeToPin = pinWorldPos.clone().normalize();

    setVisible(camToPin.dot(globeToPin) < 0.1);

    group.current.lookAt(camera.position);
  });

  return (
    <group ref={group} position={position} visible={visible}>
      <group position={[0, 0.02, 0]}>
        <mesh>
          <sphereGeometry args={[headRadius, 32, 32]} />
          <meshStandardMaterial
            color="#EA4335"
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[headRadius * 0.4, headRadius * 0.4, headRadius * 0.6]}>
          <sphereGeometry args={[headRadius * 0.25, 16, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh
          rotation={[Math.PI, 0, 0]}
          position={[0, -headRadius - tailHeight / 2, 0]}
        >
          <coneGeometry args={[headRadius * 0.45, tailHeight, 16]} />
          <meshStandardMaterial
            color="#C5271A"
            metalness={0.1}
            roughness={0.35}
          />
        </mesh>
      </group>

      {visible && (
        <Html
          position={[0, 0.11, 0]}
          center
          style={{
            padding: "6px 8px",
            background: "rgba(255,255,255,0.92)",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            whiteSpace: "nowrap",
            fontSize: 12,
            color: "#111827",
            transition: "opacity 0.3s ease",
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>{label}</div>
            {sublabel && <div style={{ opacity: 0.7 }}>{sublabel}</div>}
          </div>
        </Html>
      )}
    </group>
  );
};

const generateRandomPins = (count, radius = 1.02) => {
  const pins = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    pins.push([x, y, z]);
  }
  return pins;
};

const SmallPin = ({ position }) => {
  const group = useRef();
  const headRadius = 0.02;
  const tailHeight = 0.05;
  const [visible, setVisible] = useState(false);

  useFrame(({ camera }) => {
    if (!group.current) return;
    const pinWorldPos = new THREE.Vector3();
    group.current.getWorldPosition(pinWorldPos);

    const camToPin = new THREE.Vector3()
      .subVectors(pinWorldPos, camera.position)
      .normalize();

    const globeToPin = pinWorldPos.clone().normalize();

    setVisible(camToPin.dot(globeToPin) < 0.1);

    group.current.lookAt(camera.position);
  });

  return (
    <group ref={group} position={position} visible={visible}>
      <group position={[0, 0.01, 0]}>
        <mesh>
          <sphereGeometry args={[headRadius, 16, 16]} />
          <meshStandardMaterial
            color="#EA4335"
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[headRadius * 0.4, headRadius * 0.4, headRadius * 0.6]}>
          <sphereGeometry args={[headRadius * 0.25, 8, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh
          rotation={[Math.PI, 0, 0]}
          position={[0, -headRadius - tailHeight / 2, 0]}
        >
          <coneGeometry args={[headRadius * 0.45, tailHeight, 8]} />
          <meshStandardMaterial
            color="#C5271A"
            metalness={0.1}
            roughness={0.35}
          />
        </mesh>
      </group>
    </group>
  );
};

function AutoRotate({ speed = 0.15 }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });
  return (
    <group ref={ref}>
      <group />
    </group>
  );
}

function TransparentGlobe({ radius = 1 }) {
  return (
    <>
      <mesh>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      <lineSegments>
        <wireframeGeometry
          attach="geometry"
          args={[new THREE.SphereGeometry(radius, 32, 32)]}
        />
        <lineBasicMaterial
          attach="material"
          color="#00ffff"
          opacity={0.75}
          transparent
        />
      </lineSegments>
    </>
  );
}

export function Globe3D({ complaints }) {
  const R = 1;
  const SOUTH_LIMIT = -0.6 * R; // adjust: no pins below this Y

  const pins = useMemo(() => {
    return complaints
      .map((c) => {
        const pos = latLonToVec3(c.lat, c.lon, R);
        return { ...c, pos };
      })
      .filter((p) => p.pos.y > SOUTH_LIMIT);
  }, [complaints]);

  const randomPins = useMemo(() => {
    return generateRandomPins(200, 1.02).filter((pos) => pos[1] > SOUTH_LIMIT);
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.5], fov: 45 }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 3]} intensity={1.1} />
      <directionalLight position={[-3, -2, -3]} intensity={0.5} />

      <group>
        <TransparentGlobe radius={R} />

        {pins.map((p) => (
          <group key={p.id} position={p.pos.clone().multiplyScalar(1.02)}>
            <RedPin position={[0, 0, 0]} label={p.area} sublabel={p.title} />
          </group>
        ))}

        {randomPins.map((pos, i) => (
          <SmallPin key={i} position={pos} />
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
}
