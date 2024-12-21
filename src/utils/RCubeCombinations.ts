import {
  appliedMoves,
  orbitFree,
  orbitFreeMoves,
  RCubeInfo,
  rCubeInfo2String,
} from "./rCubeInfo";
import { allRCubeMoves, reversedMove } from "./rCubeMove";

interface RCC {
  info: RCubeInfo;
  updated: number;
  adjacency: Map<string, string>;
}

export class RCubeCombinations {
  private nodeInfo: Map<string, RCC>;
  private steps: number;

  constructor(rCubeInfo: RCubeInfo, steps: number, moves: string[] = []) {
    this.nodeInfo = new Map();
    this.steps = steps;
    this.updateMoves(rCubeInfo, moves);
  }

  public updateFindPath(
    initRCubeInfo: RCubeInfo,
    resultRCubeInfo: RCubeInfo,
    moveHistory: string[]
  ) {
    const endKey = rCubeInfo2String(initRCubeInfo);
    const orbitMoves = orbitFreeMoves(resultRCubeInfo);
    const startKey = rCubeInfo2String(orbitFree(resultRCubeInfo));
    this.updateMoves(initRCubeInfo, moveHistory);
    const faceMoves = this.findPath(startKey, endKey)
      .split(" ")
      .filter((move) => move.length > 0);
    this.updateMoves(resultRCubeInfo, faceMoves);
    return orbitMoves.concat(faceMoves);
  }

  private update(rCubeInfo: RCubeInfo, steps = this.steps) {
    const curNodeKey = rCubeInfo2String(rCubeInfo);
    const shape = rCubeInfo[0].length;
    if (!this.nodeInfo.has(curNodeKey)) {
      this.touchNode(curNodeKey, rCubeInfo);
    }

    const curNode = this.nodeInfo.get(curNodeKey)!;

    if (curNode.updated < steps) {
      curNode.updated = steps;
      const moves = allRCubeMoves(shape);
      for (const move of moves) {
        this.addConnection(curNodeKey, move);
        const nextNode = this.nodeInfo.get(curNode.adjacency.get(move)!)!;
        this.update(nextNode.info, steps - 1);
      }
    }
  }

  private updateMoves(rCubeInfo: RCubeInfo, moves: string[]) {
    let cur = rCubeInfo;
    this.update(orbitFree(cur));

    for (const move of moves) {
      cur = appliedMoves(cur, [move]);
      this.update(orbitFree(cur));
    }
  }

  private touchNode(nodeKey: string, nodeInfo: RCubeInfo) {
    if (!this.nodeInfo.has(nodeKey)) {
      this.nodeInfo.set(nodeKey, {
        info: nodeInfo,
        updated: 0,
        adjacency: new Map(),
      });
    }
  }

  private addConnection(curNodeKey: string, move: string) {
    const curNode = this.nodeInfo.get(curNodeKey)!;
    const curAdjacency = curNode.adjacency;

    let nextNodeKey = curAdjacency.get(move);

    if (nextNodeKey == undefined) {
      const nextNodeInfo = appliedMoves(curNode.info, [move]);
      nextNodeKey = rCubeInfo2String(nextNodeInfo);
      this.touchNode(nextNodeKey, nextNodeInfo);
      const nextAdjacency = this.nodeInfo.get(nextNodeKey)!.adjacency;
      curAdjacency.set(move, nextNodeKey);
      nextAdjacency.set(reversedMove(move), curNodeKey);
    }
  }

  private findPath(startKey: string, endKey: string): string {
    let level: [string, string][] = [[startKey, ""]];
    const visited: Set<string> = new Set();
    visited.add(startKey);

    let levelSize: number[] = [];
    while (level.length > 0) {
      levelSize.push(level.length);
      let nextLevel: [string, string][] = [];
      for (const [curKey, curPath] of level) {
        if (curKey == endKey) {
          console.log(levelSize);
          return curPath;
        }
        const curAdjacency = this.nodeInfo.get(curKey)!.adjacency;
        for (const move of curAdjacency.keys()) {
          const nextNodeKey = curAdjacency.get(move)!;

          if (!visited.has(nextNodeKey)) {
            visited.add(nextNodeKey);
            const nextPath = curPath + " " + move;
            nextLevel.push([nextNodeKey, nextPath]);
          }
        }
      }
      level = nextLevel;
    }

    return "None";
  }
}
