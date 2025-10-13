/* eslint-disable */
// @ts-nocheck

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  useGLTF,
  ContactShadows,
} from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

//
// 🔹 Scene Debugger (for calibrating hotspot positions)
//
function SceneDebugger({ targetRef }) {
  const { scene, camera, gl } = useThree();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    const grid = new THREE.GridHelper(10, 10);
    const axes = new THREE.AxesHelper(2);
    scene.add(grid);
    scene.add(axes);

    const handleClick = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      if (!targetRef.current) return;
      const intersects = raycaster.intersectObject(targetRef.current, true);
      if (intersects.length > 0) {
        const worldPoint = intersects[0].point.clone();
        const localPoint = targetRef.current.worldToLocal(worldPoint);
        console.log("🔥 Local hotspot:", [
          +localPoint.x.toFixed(2),
          +localPoint.y.toFixed(2),
          +localPoint.z.toFixed(2),
        ]);
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => {
      gl.domElement.removeEventListener("click", handleClick);
      scene.remove(grid);
      scene.remove(axes);
    };
  }, [camera, gl, targetRef]);

  return null;
}

//
// 🔹 Gentle showroom oscillation
//
function AutoOscillateGroup({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!);
  const t0 = useRef(performance.now());

  useFrame(() => {
    const t = (performance.now() - t0.current) / 1000;
    const yaw = Math.sin(t * 0.4) * (Math.PI / 18); // ±10°
    if (group.current) group.current.rotation.y = yaw;
  });

  return <group ref={group}>{children}</group>;
}

//
// 🔹 Load and position model
//
function BikeModel({ modelUrl, scale, cameraOffsetY }) {
  const { scene } = useGLTF(modelUrl);
  const { camera, controls } = useThree();

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Center model
    scene.position.x += -center.x;
    scene.position.y += -center.y;
    scene.position.z += -center.z;

    // Adjust camera framing
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.6;
    camera.position.set(0, size.y * (cameraOffsetY || 0.2), cameraZ);
    camera.lookAt(0, 0, 0);

    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, [scene, camera, controls, cameraOffsetY]);

  return <primitive object={scene} scale={scale || 1.3} />;
}

//
// 🔹 Hotspot Marker with Tooltip
//

function Hotspot({ data, language }) {
  const [show, setShow] = useState(false);
  const [placement, setPlacement] = useState("top");
  const hotspotRef = useRef();
  const { camera, size } = useThree();

  const isEn = language === "en";
  const info = data[language] || data.en;
  const imageUrl = data.image;

  // ✅ Compute placement accurately based on camera and world orientation
  useEffect(() => {
    const updatePlacement = () => {
      if (!hotspotRef.current) return;

      const pos = new THREE.Vector3(...data.position);
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);

      const worldUp = new THREE.Vector3(0, 1, 0);
      const facing = camDir.dot(worldUp); // determines orientation vs camera

      // Project hotspot to screen
      const projected = pos.clone().project(camera);
      const screenX = (projected.x * 0.5 + 0.5) * size.width;
      const screenY = (-projected.y * 0.5 + 0.5) * size.height;

      // Edge margin thresholds
      const marginY = 180;
      const marginX = 200;

      let newPlacement = "top";

      // ✅ 1. Check if it's visually upside down
      if (facing > 0.4) newPlacement = "bottom";
      if (facing < -0.4) newPlacement = "top";

      // ✅ 2. Adjust if near edges
      if (screenY < marginY) newPlacement = "bottom";
      else if (screenY > size.height - marginY) newPlacement = "top";

      // ✅ 3. Prevent clipping on left/right sides
      if (screenX < marginX) newPlacement = "right";
      else if (screenX > size.width - marginX) newPlacement = "left";

      setPlacement(newPlacement);
    };

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    return () => window.removeEventListener("resize", updatePlacement);
  }, [camera, size, data.position]);

  return (
    <Html
      position={data.position}
      center
      ref={hotspotRef}
      zIndexRange={[1, 9999]}
      style={{ transform: "translate(-50%, -50%)", cursor: "pointer" }}
    >
      <div
        className="relative"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((p) => !p)}
      >
        {/* 🔸 Dot */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-4 h-4 rounded-full bg-orange-500 shadow-md shadow-orange-400/60 relative z-[5]"
        />

        {/* 🔸 Connector line */}
        {show && (
          <div
            className={`absolute ${
              placement === "top"
                ? "bottom-[22px]"
                : placement === "bottom"
                ? "top-[22px]"
                : placement === "left"
                ? "right-[22px]"
                : "left-[22px]"
            } ${
              placement === "left" || placement === "right"
                ? "h-[1px] w-5"
                : "w-[1px] h-5"
            } bg-orange-400/70 z-[4]`}
          ></div>
        )}

        {/* 🧩 Tooltip */}
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className={`absolute bg-white/95 backdrop-blur-md rounded-2xl border border-orange-100
                        shadow-[0_8px_24px_rgba(0,0,0,0.15)] p-3 sm:p-4 w-[260px] max-w-[90vw]
                        z-[10] overflow-hidden
                        ${
                          placement === "top"
                            ? "bottom-[38px] left-1/2 -translate-x-1/2"
                            : placement === "bottom"
                            ? "top-[38px] left-1/2 -translate-x-1/2"
                            : placement === "left"
                            ? "right-[38px] top-1/2 -translate-y-1/2"
                            : "left-[38px] top-1/2 -translate-y-1/2"
                        }`}
          >
            {/* {imageUrl && (
              <div
                className="relative w-full rounded-xl overflow-hidden mb-3
                           bg-gradient-to-b from-[#F8FAFC] to-[#E8EDF4]
                           flex items-center justify-center"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={imageUrl}
                  alt={info?.title || "Bike part"}
                  className="object-contain w-[85%] h-[85%] rounded-lg"
                  loading="lazy"
                />
              </div>
            )} */}

            <h3 className="font-semibold text-orange-600 text-sm mb-1">
              {info?.title}
            </h3>
            {info?.shortDesc && (
              <p className="text-gray-700 text-xs leading-snug mb-2">
                {info.shortDesc}
              </p>
            )}
            <div className="text-[11px] text-gray-600 space-y-0.5">
              {info?.maintenance?.interval && (
                <div>
                  <strong className="font-semibold text-gray-800">
                    {isEn ? "Maintenance:" : "मेंटेनेंस:"}
                  </strong>{" "}
                  {info.maintenance.interval}
                </div>
              )}
              {info?.lifespan && (
                <div>
                  <strong className="font-semibold text-gray-800">
                    {isEn ? "Lifespan:" : "आयु:"}
                  </strong>{" "}
                  {info.lifespan}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </Html>
  );
}

//
// 🔹 Main Stage
//
export default function BikeStage({ language, model, hotspots }) {
  const {
    modelUrl,
    scale,
    lighting,
    environment,
    backgroundColor,
    cameraOffsetY,
  } = model;

  // ✅ Define bikeGroup ref (shared for debug + model)
  const bikeGroup = useRef<THREE.Group>(null!);

  return (
    <div
      className="
        w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh]
        rounded-2xl overflow-hidden
        bg-gradient-to-b from-[#E8EFF8] via-[#D8E3F4] to-[#C7D6EE]
      "
    >
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 4.5], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={[backgroundColor || "#f4f6fa"]} />

        {/* Lights from Firestore config */}
        <ambientLight intensity={lighting?.ambientIntensity || 0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={lighting?.directionalIntensity || 1.2}
          castShadow
        />
        <hemisphereLight
          intensity={lighting?.hemisphereIntensity || 0.6}
          groundColor={"#555"}
        />

        {/* ✅ Debug (only in dev) */}
        {import.meta.env.DEV && <SceneDebugger targetRef={bikeGroup} />}

        <Suspense fallback={<Html center>Loading bike...</Html>}>
          <AutoOscillateGroup>
            {/* ✅ Group for both model & hotspots */}
            <group ref={bikeGroup}>
              <BikeModel
                modelUrl={modelUrl}
                scale={scale}
                cameraOffsetY={cameraOffsetY}
              />
              {hotspots.map((spot) => (
                <Hotspot key={spot.id} data={spot} language={language} />
              ))}
            </group>
          </AutoOscillateGroup>

          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.4}
            scale={12}
            blur={3}
            far={5}
          />
          <Environment preset={environment || "warehouse"} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom
          enableRotate
          enableDamping
          dampingFactor={0.05}
          zoomSpeed={0.6}
          rotateSpeed={0.9}
          minDistance={3}
          maxDistance={6}
        />
      </Canvas>
    </div>
  );
}
