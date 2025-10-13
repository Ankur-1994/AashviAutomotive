/* Explicitly register R3F JSX types so <mesh> etc. compile */

import * as THREE from "three";
import { ReactThreeFiber } from "@react-three/fiber";

declare global {
  namespace JSX {
    // Add all of R3F's intrinsic elements (mesh, group, lights, geometry …)
    interface IntrinsicElements extends ReactThreeFiber.IntrinsicElements {}
  }
}

export {};
