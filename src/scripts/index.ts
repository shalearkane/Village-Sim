class QueueNode {
  constructor(public i: number, public j: number, public distance: number) {}
}

function calculateDistances(grid: number[][], target: number): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const distances: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(Infinity)
  );

  const queue: QueueNode[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === target) {
        queue.push(new QueueNode(i, j, 0));
        distances[i][j] = 0;
      }
    }
  }

  while (queue.length > 0) {
    const {
      i: currentI,
      j: currentJ,
      distance: currentDistance,
    } = queue.shift()!;

    for (const [di, dj] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const ni = currentI + di;
      const nj = currentJ + dj;

      if (
        0 <= ni &&
        ni < rows &&
        0 <= nj &&
        nj < cols &&
        distances[ni][nj] === Infinity
      ) {
        distances[ni][nj] = currentDistance + 1;
        queue.push(new QueueNode(ni, nj, currentDistance + 1));
      }
    }
  }

  return distances;
}

const grid: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 3, 0, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const hospitalDistances = calculateDistances(grid, 2);
const schoolDistances = calculateDistances(grid, 3);

for (const row of hospitalDistances) {
  console.log(row);
}

let hospitalSum = 0,
  schoolSum = 0,
  houses = 0;
const rows = grid.length;
const cols = grid[0].length;
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    if (grid[i][j] === 1) {
      houses += 1;
      hospitalSum += hospitalDistances[i][j];
      schoolSum += schoolDistances[i][j];
    }
  }
}

console.log((houses * 100) / hospitalSum + (houses * 100) / schoolSum);
