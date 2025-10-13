/* src/react-three-fiber-jsx.d.ts */

import * as THREE from "three";
import { ReactThreeFiber } from "@react-three/fiber";

/**
 * Explicitly merge R3F JSX elements into global JSX namespace.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactThreeFiber.IntrinsicElements {}
  }
}

export {};
