import React, { useRef, useState } from "react";
import "../scss/RCube.css";
import RCubeDisplay from "./RCubeDisplay";
import { Canvas } from "@react-three/fiber";
import { RCubeInfo, appliedMoves, initRCubeInfo } from "../utils/rCubeInfo";
import { getShuffle, reversedMove } from "../utils/rCubeMove";
import BtnDropdown from "./BtnDropdown";
import Collapse from "./Collapse";
import { RCubeCombinations } from "../utils/RCubeCombinations";

const combinationsSearchDepth = 3;

const RCube: React.FC = () => {
  const ControlButton: React.FC<{ text: string; move: string }> = ({
    text,
    move,
  }) => {
    let btnType = "btn-outline-primary";
    const nextStep = frontQuickSolution();
    if (
      showHint &&
      (nextStep == move ||
        (nextStep.substring(0, 2) == move.substring(0, 2) &&
          move[2] == "1" &&
          nextStep[2] == "2"))
    ) {
      btnType = "btn-info";
    }
    return (
      <button
        type="button"
        className={`btn ${btnType} col m-1`}
        onClick={() => {
          updateHist(move);
          const newRCubeInfo = appliedMoves(rCubeInfo, [move]);
          setRCubeInfo(newRCubeInfo);
          updateQuickSolution(newRCubeInfo);
        }}
      >
        {`${text}| ${move}`}
      </button>
    );
  };

  const handleShapeChange = (newShape: number) => {
    clearHist();
    setShape(newShape);
    setRCubeInfo(initRCubeInfo(newShape));
  };

  const setShape = (newShape: number) => {
    shape.current = newShape;
  };

  const clearHist = () => {
    hist.current = [];
  };

  const updateHist = (move: string) => {
    hist.current.push(move);
  };

  const peekHist = () => {
    let hl = hist.current.length;
    return hl == 0 ? "" : hist.current[hl - 1];
  };

  const popHist = () => {
    let back = hist.current.pop();
    return back ? back : "";
  };

  const updateQuickSolution = (
    rCubeInfo: RCubeInfo,
    showing: boolean = showHint
  ) => {
    if (!showing) {
      return;
    }
    quickSolution.current = combinations.current.updateFindPath(
      initRCubeInfo(shape.current),
      rCubeInfo,
      hist.current
    );
  };

  const frontQuickSolution = () => {
    return quickSolution.current.length > 0 ? quickSolution.current[0] : "none";
  };

  const shape = useRef(3);

  const [rCubeInfo, setRCubeInfo] = useState<RCubeInfo>(
    initRCubeInfo(shape.current)
  );

  const [is3d, setIs3d] = useState<boolean>(false);

  const hist: React.MutableRefObject<string[]> = useRef([]);

  const combinations: React.MutableRefObject<RCubeCombinations> = useRef(
    new RCubeCombinations(rCubeInfo, combinationsSearchDepth)
  );

  const quickSolution: React.MutableRefObject<string[]> = useRef([]);

  const [showHint, setShowHint] = useState(false);

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
              text={is3d ? "3D" : "2D"}
              dropdown={[
                ["2d", () => setIs3d(false)],
                ["3d", () => setIs3d(true)],
              ]}
              btnGroupClassName="col"
              btnClassName="btn btn-primary"
              id="viewDropdown"
            />
            <BtnDropdown
              text={`${shape.current}x${shape.current}`}
              dropdown={[
                ["2x2", () => handleShapeChange(2)],
                ["3x3", () => handleShapeChange(3)],
              ]}
              btnGroupClassName="col"
              btnClassName="btn btn-danger"
              id="shapeDropdown"
            />
          </div>
          <div className="row text-center mt-2 ">
            <button
              type="button"
              className="btn btn-success col-3 mx-3"
              onClick={() => {
                const prevMove = popHist();
                const nextRCI = appliedMoves(rCubeInfo, [
                  reversedMove(prevMove),
                ]);
                setRCubeInfo(nextRCI);
                updateQuickSolution(nextRCI);
              }}
              disabled={peekHist().length == 0}
            >
              {`Undo ${peekHist()}`}
            </button>
            <button
              type="button"
              className="btn btn-warning col-2 me-5"
              onClick={() => {
                const moves = getShuffle(shape.current, 20);
                hist.current = hist.current.concat(moves);
                const nextRCI = appliedMoves(rCubeInfo, moves);
                setRCubeInfo(nextRCI);
                updateQuickSolution(nextRCI);
              }}
            >
              {"Shuffle"}
            </button>
          </div>
          <div className="align-items-center mt-2" style={{ display: "flex" }}>
            <Collapse
              textMain="Solution:"
              textContent={quickSolution.current.join(" ")}
              btnClassName="btn-info"
              collapseClassName=""
              id="solution"
              onClick={() => {
                setShowHint(!showHint);
                updateQuickSolution(rCubeInfo, !showHint);
              }}
            />
          </div>
        </div>

        <div className="user-moves container text-center mt-2">
          <div className="row align-items-center">
            <ControlButton text="L'" move={"y01"} />
            <ControlButton text="U " move={`x${shape.current - 1}1`} />
            <ControlButton text="U'" move={`x${shape.current - 1}3`} />
            <ControlButton text="R " move={`y${shape.current - 1}1`} />
          </div>
          <div className="row align-items-center">
            <ControlButton text="B " move={`z${shape.current - 1}3`} />
            <ControlButton text="F'" move={"z03"} />
            <ControlButton text="F " move={"z01"} />
            <ControlButton text="B'" move={`z${shape.current - 1}1`} />
          </div>
          <div className="row align-items-center">
            <ControlButton text="L " move={"y03"} />
            <ControlButton text="D'" move={"x01"} />
            <ControlButton text="D " move={"x03"} />
            <ControlButton text="R'" move={`y${shape.current - 1}3`} />
          </div>
          <div className="row align-items-center">
            <ControlButton text="X " move="rx1" />
            <ControlButton text="Y " move="ry1" />
            <ControlButton text="X'" move="rx3" />
          </div>
          <div className="row align-items-center">
            <ControlButton text="Z'" move="rz3" />
            <ControlButton text="Y'" move="ry3" />
            <ControlButton text="Z " move="rz1" />
          </div>
        </div>
      </div>
    </>
  );
};

export default RCube;
