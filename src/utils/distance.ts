import { Vector3 } from "three";

export function getDistance(
  grid: Array<Array<number>>,
  target: number
): Array<Array<number>> {
  const rowNum = grid.length;
  const colNum = grid[0].length;
  const queue: number[][] = [];

  // Preparing the distance matrix
  const distances: Array<Array<number>> = [];
  for (let i = 0; i < rowNum; i++) {
    distances.push([]);
    for (let j = 0; j < colNum; j++) {
      if (grid[i][j] == target) {
        distances[i].push(0);
        queue.push([i, j, 0]);
      } else {
        distances[i].push(Infinity);
      }
    }
  }

  // BFS
  let itr = 0;
  while (itr < queue.length) {
    const [current_i, current_j, current_distance] = queue[itr];

    for (let [di, dj] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      let ni: number = current_i + di;
      let nj: number = current_j + dj;

      if (
        0 <= ni &&
        ni < rowNum &&
        0 <= nj &&
        nj < colNum &&
        distances[ni][nj] === Infinity
      ) {
        distances[ni][nj] = current_distance + 1;
        queue.push([ni, nj, current_distance + 1]);
      }
    }

    itr++;
  }

  return distances;
}

export const getAbsoluteDistance = (a: Vector3, b: Vector3): number => {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
  );
};
