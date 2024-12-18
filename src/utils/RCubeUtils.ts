export function appliedMoves(cubeInfo: number[][][], moves: string) {
  let i = 0;
  let res = deepCopy(cubeInfo);
  while (i < moves.length) {
    applyMove(res, moves.substring(i, i + 3));
    i += 3;
  }
  return res;
}

export function getViewRotation(rotation: string, shape: number) {
  let moves = "";
  for (let i = 0; i < shape; i++) {
    moves += rotation[0] + i + rotation[1];
  }
  return moves;
}

const deepCopy = (arr: any[]): any[] => {
  return arr.map((item) => (Array.isArray(item) ? deepCopy(item) : item));
};

function applyMove(cubeInfo: number[][][], moves: string) {
  let axis = moves.charAt(0);
  let layer = +moves.charAt(1);
  let angle = +moves.charAt(2);
  let shape = cubeInfo[0].length;
  rotateFace(cubeInfo, axis, layer, angle, shape);
  rotateSide(cubeInfo, axis, layer, angle, shape);
}

function rotateFace(
  cubeInfo: number[][][],
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

    cubeInfo[faceIndex] = rotatedFace(
      cubeInfo[faceIndex],
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
  cubeInfo: number[][][],
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
  ringShift(cubeInfo, ringPos, angle * shape);
}

function ringShift(
  cubeInfo: number[][][],
  ringPos: [number, number, number][],
  distance: number
) {
  let temp = ringPos.map(([faceIndex, y, x]) => {
    return cubeInfo[faceIndex][y][x];
  });
  let ringLength = temp.length;
  for (let i = 0; i < ringLength; i++) {
    let [faceIndex, y, x] = ringPos[(i + distance) % ringLength];
    cubeInfo[faceIndex][y][x] = temp[i];
  }
}

export function reversedMoves(moves: string) {
  let rMoves = "";
  let prevReversed = "";
  for (let i = moves.length - 3; i >= 0; i -= 3) {
    let curMove = moves.substring(i, i + 3);
    if (curMove == prevReversed) {
      prevReversed = "";
    } else {
      rMoves += prevReversed;
      prevReversed = reversedMove(curMove);
    }
  }
  return rMoves + prevReversed;
}

export function reversedMove(move: string) {
  return move.length == 0 ? "" : move.substring(0, 2) + (4 - +move[2]);
}
