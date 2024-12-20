export type RCubeInfo = number[][][];

export function initRCubeInfo(shape: number): RCubeInfo {
  return Array(6)
    .fill(null)
    .map((_, index) =>
      Array(shape)
        .fill(null)
        .map(() => Array(shape).fill(index))
    );
}

export function rCubeInfo2String(rCubeInfo: RCubeInfo): string {
  return rCubeInfo.flat(Infinity).join("");
}

export function appliedMoves(rCubeInfo: RCubeInfo, moves: string[]) {
  let res = deepCopy(rCubeInfo);
  let shape = rCubeInfo[0].length;
  for (const curMove of moves) {
    if (curMove[0] == "r") {
      for (let i = 0; i < shape; i++) {
        applyMove(res, curMove[1] + i + curMove[2], shape);
      }
    } else {
      applyMove(res, curMove, shape);
    }
  }
  return res;
}

export function orbitFree(rCubeInfo: RCubeInfo) {
  return appliedMoves(rCubeInfo, orbitFreeMoves(rCubeInfo));
}

const deepCopy = (arr: any[]): any[] => {
  return arr.map((item) => (Array.isArray(item) ? deepCopy(item) : item));
};

export function orbitFreeMoves(rCubeInfo: RCubeInfo): string[] {
  const shape = rCubeInfo[0].length;
  let res: string[] = [];
  if (shape % 2 == 0) {
    return res;
  }
  const idPos = (shape / 2) >> 0;
  let tPos = 0;
  let fPos = 0;
  for (let i = 0; i < 6; i++) {
    const colId = rCubeInfo[i][idPos][idPos];
    if (colId == 0) {
      tPos = i;
    } else if (colId == 1) {
      fPos = i;
    }
  }
  if (fPos >= 1 && fPos <= 4) {
    if (fPos != 1) {
      res.push("rx" + (fPos - 1));
    }
    if (tPos >= 1 && tPos <= 4) {
      res.push("rz" + ((fPos - tPos + 4) % 4));
    } else if (tPos == 5) {
      res.push("rz2");
    }
  } else if (fPos == 0) {
    if (tPos != 3) {
      res.push("rx" + ((tPos + 1) % 4));
    }
    res.push("ry3");
  } else if (fPos == 5) {
    if (tPos != 1) {
      res.push("rx" + (tPos - 1));
    }
    res.push("ry1");
  }

  return res;
}

function applyMove(rCubeInfo: RCubeInfo, moves: string, shape: number) {
  const axis = moves.charAt(0);
  const layer = +moves.charAt(1);
  const angle = +moves.charAt(2);
  rotateFace(rCubeInfo, axis, layer, angle, shape);
  rotateSide(rCubeInfo, axis, layer, angle, shape);
}

function rotateFace(
  rCubeInfo: RCubeInfo,
  axis: string,
  layer: number,
  angle: number,
  shape: number
) {
  let faceRotationAngle = 0;
  if (layer == 0) {
    faceRotationAngle = 4 - angle;
  } else if (layer == shape - 1) {
    faceRotationAngle = angle;
  }
  if (faceRotationAngle != 0) {
    let faceIndex = -1;
    switch (axis) {
      case "x":
        faceIndex = layer == 0 ? 5 : 0;
        break;
      case "y":
        faceIndex = layer == 0 ? 4 : 2;
        break;
      case "z":
        faceIndex = layer == 0 ? 1 : 3;
        faceRotationAngle = 4 - faceRotationAngle;
        break;
      default:
    }

    rCubeInfo[faceIndex] = rotatedFace(
      rCubeInfo[faceIndex],
      faceRotationAngle,
      shape
    );
  }
}

function rotatedFace(face: number[][], rotationAngle: number, shape: number) {
  return face.map((row, y) =>
    row.map((_, x) => {
      let pos = [x, y, shape - x - 1, shape - y - 1];
      return face[pos[(4 - rotationAngle + 1) % 4]][pos[4 - rotationAngle]];
    })
  );
}

function rotateSide(
  rCubeInfo: RCubeInfo,
  axis: string,
  layer: number,
  angle: number,
  shape: number
) {
  let ringPos: [number, number, number][] = Array(4 * shape).fill(null);
  switch (axis) {
    case "x":
      ringPos = ringPos.map((_, index) => [
        4 - ((index / shape) >> 0),
        layer,
        shape - 1 - (index % shape),
      ]);
      break;
    case "y":
      ringPos = ringPos.map((_, index) => {
        let cur = (index / shape) >> 0;
        let faceIndex = [5, 1, 0, 3][cur];
        let y = cur == 3 ? shape - 1 - (index % shape) : index % shape;
        let x = cur == 3 ? shape - 1 - layer : layer;
        return [faceIndex, y, x];
      });
      break;
    case "z":
      ringPos = ringPos.map((_, index) => {
        let cur = (index / shape) >> 0;
        let faceIndex = [0, 2, 5, 4][cur];
        let curIndex = index % shape;
        let pos = [curIndex, layer, shape - 1 - curIndex, shape - 1 - layer];
        return [faceIndex, pos[(cur + 1) % 4], pos[cur % 4]];
      });
      break;
    default:
      break;
  }
  ringShift(rCubeInfo, ringPos, angle * shape);
}

function ringShift(
  rCubeInfo: RCubeInfo,
  ringPos: [number, number, number][],
  distance: number
) {
  let temp = ringPos.map(([faceIndex, y, x]) => {
    return rCubeInfo[faceIndex][y][x];
  });
  let ringLength = temp.length;
  for (let i = 0; i < ringLength; i++) {
    let [faceIndex, y, x] = ringPos[(i + distance) % ringLength];
    rCubeInfo[faceIndex][y][x] = temp[i];
  }
}
