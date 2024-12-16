import React, { useState } from "react";
import "./RCube.css";
import RCubeDisplay from "./RCubeDisplay";
import { Canvas } from "@react-three/fiber";
import { appliedMoves } from "../utils/RCubeUtils";

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

  const ButtonMove: React.FC<{ text: string; move: string }> = ({
    text,
    move,
  }) => (
    <button onClick={() => setRCubeInfo(appliedMoves(rCubeInfo, move))}>
      {text}
    </button>
  );

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
      <div className="displayer">
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
            {/*<option value={4}>4</option>*/}
          </select>
        </div>
        <div>
          <ButtonMove text="L'" move={"y01"} />
          <ButtonMove text="U " move={`x${shape - 1}1`} />
          <ButtonMove text="2U" move={`x${shape - 1}2`} />
          <ButtonMove text="U'" move={`x${shape - 1}3`} />
          <ButtonMove text="R" move={`y${shape - 1}1`} />
          <br />
          <ButtonMove text="2L" move={"y02"} />
          <ButtonMove text="F'" move={"z03"} />
          <ButtonMove text="2F" move={"z02"} />
          <ButtonMove text="F " move={"z01"} />
          <ButtonMove text="2R" move={`y${shape - 1}2`} />
          <br />
          <ButtonMove text="L " move={"y03"} />
          <ButtonMove text="B " move={`z${shape - 1}3`} />
          <ButtonMove text="2B" move={`z${shape - 1}2`} />
          <ButtonMove text="B'" move={`z${shape - 1}1`} />
          <ButtonMove text="R'" move={`y${shape - 1}3`} />
          <br />
          <ButtonMove text="D'" move={"x01"} />
          <ButtonMove text="2D" move={"x02"} />
          <ButtonMove text="D " move={"x03"} />
          <br />
        </div>
      </div>
    </>
  );
};

export default RCube;
