import React, { useState } from "react";
import "./RCube.css";
//import { Canvas, useFrame } from "@react-three/fiber";
//import { CameraControls } from "@react-three/drei";

const colors = ["white", "red", "green", "yellow", "orange", "blue"];

const RCube: React.FC<{ dimension?: number }> = ({ dimension = 3 }) => {
  const [rCube, _] = useState<number[][][]>(
    Array(6)
      .fill(null)
      .map((_, index) =>
        Array(dimension)
          .fill(null)
          .map(() => Array(dimension).fill(index))
      )
  );

  const rCubeFace = (faceIndex: number) => {
    const gridStyle = {
      display: "grid",
      gridTemplateColumns: `repeat(${dimension}, 25px)`,
      gridTemplateRows: `repeat(${dimension}, 25px)`,
      gap: "2px",
    };

    return (
      <div className="face-container">
        <div className="face" style={gridStyle}>
          {rCube[faceIndex].flat().map((colorIndex, index) => (
            <div
              key={index}
              className="sticker"
              style={{ backgroundColor: colors[colorIndex] }}
            ></div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="cube-grid">
      <div className="face-container"></div>
      {rCubeFace(2)}
      <div className="face-container"></div>
      <div className="face-container"></div>
      {rCubeFace(4)}
      {rCubeFace(0)}
      {rCubeFace(1)}
      {rCubeFace(3)}
      <div className="face-container"></div>
      {rCubeFace(5)}
      <div className="face-container"></div>
      <div className="face-container"></div>
    </div>
  );
};

export default RCube;
