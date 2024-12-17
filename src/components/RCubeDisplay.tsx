import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import {
  Cylinder,
  PerspectiveCamera,
  OrthographicCamera,
  OrbitControls,
} from "@react-three/drei";

const colors = [
  "white", // top
  "red", // front
  "blue", // right
  "orange", // back
  "green", //left
  "yellow", // down
];
const blockSize = 10;
const cBlockSize = 8;
const blockheight = 1;

interface RCubeBlockProps {
  colorIndex: number;
  position: [number, number, number];
}

const RCubeBlock: React.FC<RCubeBlockProps> = ({ colorIndex, position }) => {
  return (
    <mesh position={position} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
      <Cylinder args={[cBlockSize, blockSize, blockheight, 4]}>
        <meshStandardMaterial attach="material-0" color={"black"} />
        <meshStandardMaterial attach="material-2" color={"black"} />
        <meshStandardMaterial attach="material-1" color={colors[colorIndex]} />
      </Cylinder>
    </mesh>
  );
};

interface RCubeDisplayProps {
  rCubeInfo: number[][][];
  is3d: boolean;
  shape: number;
}

const RCubeDisplay: React.FC<RCubeDisplayProps> = ({
  rCubeInfo,
  is3d,
  shape,
}) => {
  const { camera } = useThree();

  const initCamera = () => {
    if (camera) {
      camera.lookAt(0, 0, 0); // Ensure camera is looking at the center
    }
  };

  useEffect(initCamera, [camera]);

  const placeFace = (faceIndex: number, faceInfo: number[][]) => {
    const faceOffset = ((blockSize * Math.SQRT2) / 2) * shape; // Spacing to center the cube faces
    const facePositions: [number, number, number][] = is3d
      ? [
          [0, faceOffset, 0], // Top
          [0, 0, faceOffset], // Front
          [faceOffset, 0, 0], // Right
          [0, 0, -faceOffset], // Back
          [-faceOffset, 0, 0], // Left
          [0, -faceOffset, 0], // Bottom
        ]
      : [
          [0, faceOffset * 2 + 2, 0], // Top
          [0, 0, 0], // Front
          [faceOffset * 2 + 2, 0, 0], // Right
          [faceOffset * 4 + 4, 0, 0], // Back
          [-faceOffset * 2 - 2, 0, 0], // Left
          [0, -faceOffset * 2 - 2, 0], // Bottom
        ];

    const rotationAxes: [number, number, number][] = is3d
      ? [
          [-Math.PI / 2, 0, 0], // Top
          [0, 0, 0], // Front
          [0, Math.PI / 2, 0], // Right
          [0, Math.PI, 0], // Back
          [0, -Math.PI / 2, 0], // Left
          [Math.PI / 2, 0, 0], // Bottom
        ]
      : Array(6)
          .fill(null)
          .map(() => [0, 0, 0]);

    const blocks = [];
    const blockOffset = (shape - 1) / 2;
    for (let row = 0; row < shape; row++) {
      const y = (row - blockOffset) * blockSize * Math.SQRT2;
      const z = 0;
      for (let col = 0; col < shape; col++) {
        const x = (col - blockOffset) * blockSize * Math.SQRT2;
        blocks.push(
          <RCubeBlock
            key={`${shape}-${faceIndex}-${row}-${col}`}
            colorIndex={faceInfo[row][col]}
            position={[x, y, z]}
          />
        );
      }
    }

    return (
      <group
        key={`face${faceIndex}`}
        position={facePositions[faceIndex]}
        rotation={rotationAxes[faceIndex]}
      >
        {blocks}
      </group>
    );
  };

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {is3d ? (
        <>
          <PerspectiveCamera
            makeDefault
            position={[
              blockSize * shape * 1.5,
              blockSize * shape * 1.5,
              blockSize * shape * 3,
            ]}
          />
          <OrbitControls />
        </>
      ) : (
        <OrthographicCamera makeDefault position={[0, 0, 5]} />
      )}
      <group>
        {rCubeInfo.map((faceInfo, faceIndex) => placeFace(faceIndex, faceInfo))}
      </group>
    </>
  );
};

export default RCubeDisplay;
