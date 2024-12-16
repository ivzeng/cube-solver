export function appliedMoves(cubeInfo: number[][][], moves: string) {
  let i = 0;
  let res = deepCopy(cubeInfo);
  while (i < moves.length) {
    applyMove(res, moves.substring(i, i + 3));
    i += 3;
  }
  return res;
}

export function applyMove(cubeInfo: number[][][], moves: string) {
  let axis = moves.charAt(0);
  let layer = +moves.charAt(1);
  let angle = +moves.charAt(2);
  let shape = cubeInfo[0].length;
  rotateFace(cubeInfo, axis, layer, angle, shape);
  rotateSide(cubeInfo, axis, layer, angle, shape);
}

const deepCopy = (arr: any[]): any[] => {
  return arr.map((item) => (Array.isArray(item) ? deepCopy(item) : item));
};

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

    console.log(layer);
    console.log(faceRotationAngle);

    cubeInfo[faceIndex] = rotatedFace(
      cubeInfo[faceIndex],
      faceRotationAngle,
      shape
    );
  }
}

function rotatedFace(face: number[][], rotationAngle: number, shape: number) {
  console.log(rotationAngle);
  return face.map((row, y) =>
    row.map((_, x) => {
      // 1: x y = 3 0  1 0 => 3-1-0 1
      // 2: x y = 2 3  1 0 => 3-1-1 3-1-0
      // 3: x y = 1 2  1 0 => 3-1-0 1

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
        shape - ((index / shape) >> 0) + 1,
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
