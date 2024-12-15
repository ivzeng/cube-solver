import React, { useState } from "react";
import "./RCube.css";
import RCubeDisplay from "./RCubeDisplay";
import { Canvas } from "@react-three/fiber";

const RCube: React.FC = () => {
  const initRCubeInfo = (shape: number): number[][][] => {
    return Array(6)
      .fill(null)
      .map((_, index) =>
        Array(shape)
          .fill(null)
          .map(() => Array(shape).fill(index))
      );
  };
  const [shape, setShape] = useState<number>(3);
  const [rCubeInfo, setRCubeInfo] = useState<number[][][]>(
    initRCubeInfo(shape)
  );
  const [is3d, setIs3d] = useState<boolean>(false);
  return (
    <>
      <div className="displayer">
        <Canvas className="rubik-canvas">
          <RCubeDisplay rCubeInfo={rCubeInfo} is3d={is3d} shape={shape} />
        </Canvas>
      </div>

      <button onClick={() => setIs3d(!is3d)}>
        {is3d ? "Switch to 2D" : "Switch to 3D"}
      </button>
      <div>
        <label htmlFor="shape-select">Select Shape: </label>
        <select
          id="shape-select"
          value={shape}
          onChange={(e) => {
            const newShape = Number(e.target.value);
            setShape(newShape);
            setRCubeInfo(initRCubeInfo(newShape));
          }}
        >
          <option value={2}>2</option> <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>
    </>
  );
};

export default RCube;
