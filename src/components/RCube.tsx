import React, { useRef, useState } from "react";
import "../scss/RCube.css";
import RCubeDisplay from "./RCubeDisplay";
import { Canvas } from "@react-three/fiber";
import {
  appliedMoves,
  getViewRotation,
  reversedMove,
  reversedMoves,
} from "../utils/RCubeUtils";
import BtnDropdown from "./BtnDropdown";
import Collapse from "./Collapse";

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
      onClick={() => {
        updateHist(move);
        setRCubeInfo(appliedMoves(rCubeInfo, move));
      }}
    >
      {`${text} (${move})`}
    </button>
  );

  const handleShapeChange = (newShape: number) => {
    clearHist();
    setShape(newShape);
    setRCubeInfo(initRCubeInfo(newShape));
  };

  const setShape = (newShape: number) => {
    shape.current = newShape;
  };

  const clearHist = () => {
    hist.current = "";
  };

  const updateHist = (move: string) => {
    hist.current += move;
  };

  const peekHist = () => {
    let hl = hist.current.length;
    return hl == 0 ? "" : hist.current.substring(hl - 3, hl);
  };

  const popHist = () => {
    let histTop = peekHist();
    if (histTop.length > 0) {
      hist.current = hist.current.substring(0, hist.current.length - 3);
    }
    return histTop;
  };

  let shape = useRef(3);
  let hist = useRef("");
  const [rCubeInfo, setRCubeInfo] = useState<number[][][]>(
    initRCubeInfo(shape.current)
  );
  const [is3d, setIs3d] = useState<boolean>(false);

  return (
    <>
      <div className="displayer">
        <Canvas className="rubik-canvas">
          <RCubeDisplay
            rCubeInfo={rCubeInfo}
            is3d={is3d}
            shape={shape.current}
          />
        </Canvas>
      </div>

      <div className="user-control">
        <div className=" user-menu container text-center">
          <div className="row justify-content-start">
            <BtnDropdown
              text={`Current View: ${is3d ? "3d" : "2d"}`}
              dropdown={[
                ["2d", () => setIs3d(false)],
                ["3d", () => setIs3d(true)],
              ]}
              btnGroupClassName="col-4"
              btnClassName="btn btn-primary"
              id="viewDropdown"
            />
            <BtnDropdown
              text={`Current Cube Shape: ${shape.current}x${shape.current}`}
              dropdown={[
                ["2x2", () => handleShapeChange(2)],
                ["3x3", () => handleShapeChange(3)],
              ]}
              btnGroupClassName="col-5"
              btnClassName="btn btn-danger"
              id="shapeDropdown"
            />
            <button
              type="button"
              className="btn btn-success col"
              onClick={() => {
                const prevMove = popHist();
                setRCubeInfo(appliedMoves(rCubeInfo, reversedMove(prevMove)));
              }}
              disabled={peekHist().length == 0}
            >
              {`Undo ${peekHist()}`}
            </button>
          </div>
          <Collapse
            textMain="Solution:"
            textContent={reversedMoves(hist.current)}
            btnClassName="btn-info"
            collapseClassName=""
            id="solution"
          />
        </div>

        <div className="user-moves container text-center mt-3">
          <div className="row align-items-center mx-2">
            <ControlButton text="L'" move={"y01"} />
            <ControlButton text="U " move={`x${shape.current - 1}1`} />
            <ControlButton text="U'" move={`x${shape.current - 1}3`} />
            <ControlButton text="R" move={`y${shape.current - 1}1`} />
          </div>
          <div className="row align-items-center mx-2">
            <ControlButton text="B " move={`z${shape.current - 1}3`} />
            <ControlButton text="F'" move={"z03"} />
            <ControlButton text="F " move={"z01"} />
            <ControlButton text="B'" move={`z${shape.current - 1}1`} />
          </div>
          <div className="row align-items-center mx-2">
            <ControlButton text="L " move={"y03"} />
            <ControlButton text="D'" move={"x01"} />
            <ControlButton text="D " move={"x03"} />
            <ControlButton text="R'" move={`y${shape.current - 1}3`} />
          </div>
          <div className="row align-items-center mx-2">
            <ControlButton
              text="X "
              move={getViewRotation("x1", shape.current)}
            />
            <ControlButton
              text="Y "
              move={getViewRotation("y1", shape.current)}
            />
            <ControlButton
              text="X'"
              move={getViewRotation("x3", shape.current)}
            />
          </div>
          <div className="row align-items-center mx-2">
            <ControlButton
              text="Z'"
              move={getViewRotation("z3", shape.current)}
            />
            <ControlButton
              text="Y'"
              move={getViewRotation("y3", shape.current)}
            />
            <ControlButton
              text="Z "
              move={getViewRotation("z1", shape.current)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RCube;
