export function reverseSolve(hist: string[]) {
  let rMoveStack: string[] = [];
  for (let move of hist) {
    let rl = rMoveStack.length;
    if (rl > 0 && rMoveStack[rl - 1] == move) {
      rMoveStack.pop();
    } else {
      rMoveStack.push(reversedMove(move));
    }
  }
  return rMoveStack.reverse();
}

export function reversedMove(move: string) {
  return move.length == 0 ? "" : move.substring(0, 2) + (4 - +move[2]);
}

export function allRCubeMoves(shape: number) {
  const axis = ["x", "y", "z"];
  const layer = Array.from({ length: shape - (shape % 2) }, (_, index) =>
    index <= shape / 2 - 1 ? index : index + (shape % 2)
  );
  const angle = Array.from({ length: 3 }, (_, index) => index + 1);
  const basic: string[] = Array.from(
    { length: layer.length * 9 },
    (_, index) =>
      axis[(index / (layer.length * 3)) >> 0] +
      layer[((index % (layer.length * 3)) / 3) >> 0] +
      angle[index % 3]
  );
  const orbit =
    shape % 2 == 0
      ? Array.from(
          { length: 9 },
          (_, index) => "r" + axis[(index / 3) >> 0] + angle[index % 3]
        )
      : [];
  return basic.concat(orbit);
}

export function getShuffle(shape: number, len: number = 20) {
  const allRCMoves = allRCubeMoves(shape);
  return Array.from(
    { length: len },
    () => allRCMoves[Math.floor(Math.random() * allRCMoves.length)]
  );
}
