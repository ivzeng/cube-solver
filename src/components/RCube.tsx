import React, { useState } from "react";
import "../scss/RCube.css";
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

  const ControlButton: React.FC<{ text: string; move: string }> = ({
    text,
    move,
  }) => (
    <button
      type="button"
      className="btn btn-outline-primary col m-1"
      onClick={() => setRCubeInfo(appliedMoves(rCubeInfo, move))}
    >
      {text}
    </button>
  );

  const getViewRotation = (rotation: string, shape: number) => {
    let moves = "";
    for (let i = 0; i < shape; i++) {
      moves += rotation[0] + i + rotation[1];
    }
    return moves;
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
      <div className="user-control">
        <div className=" menu container text-center">
          <div className="row align-items-center">
            <button
              className="btn btn-primary col"
              onClick={() => setIs3d(!is3d)}
            >
              {is3d ? "Switch to 2D" : "Switch to 3D"}
            </button>
            <span className="col">
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
            </span>
          </div>
        </div>
        <div className="user-move container text-center ">
          <div className="row align-items-center">
            <ControlButton text="L'" move={"y01"} />
            <ControlButton text="U " move={`x${shape - 1}1`} />
            <ControlButton text="U'" move={`x${shape - 1}3`} />
            <ControlButton text="R" move={`y${shape - 1}1`} />
          </div>
          <div className="row align-items-center">
            <ControlButton text="B " move={`z${shape - 1}3`} />
            <ControlButton text="F " move={"z01"} />
            <ControlButton text="F'" move={"z03"} />
            <ControlButton text="B'" move={`z${shape - 1}1`} />
          </div>
          <div className="row align-items-center">
            <ControlButton text="L " move={"y03"} />
            <ControlButton text="D'" move={"x01"} />
            <ControlButton text="D " move={"x03"} />
            <ControlButton text="R'" move={`y${shape - 1}3`} />
          </div>
          <div className="row align-items-center">
            <ControlButton text="X " move={getViewRotation("x1", shape)} />
            <ControlButton text="Y " move={getViewRotation("y1", shape)} />
            <ControlButton text="X'" move={getViewRotation("x3", shape)} />
          </div>
          <div className="row align-items-center">
            <ControlButton text="Z'" move={getViewRotation("z3", shape)} />
            <ControlButton text="Y'" move={getViewRotation("y3", shape)} />
            <ControlButton text="Z " move={getViewRotation("z1", shape)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RCube;
