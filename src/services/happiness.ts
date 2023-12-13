import { BLOCK } from "../constants/block";
import { getDistance } from "../utils/distance";

export const getHappinessIndexOfHospitals = (grid: number[][]): number => {
  const hospital_distances = getDistance(grid, BLOCK.HOSPITAL);

  let rowNum = grid.length;
  let colNum = grid[0].length;

  let hospitalSum = 0;
  let houses = 0;

  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < colNum; j++) {
      if (grid[i][j] == 1) {
        houses += 1;
        hospitalSum += hospital_distances[i][j];
      }
    }
  }

  return (houses * 100) / hospitalSum;
};

export const getHappinessIndexOfSchools = (grid: number[][]): number => {
  const school_distances = getDistance(grid, BLOCK.SCHOOL);

  let rowNum = grid.length;
  let colNum = grid[0].length;

  let schoolSum = 0;
  let houses = 0;

  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < colNum; j++) {
      if (grid[i][j] == 1) {
        houses += 1;
        schoolSum += school_distances[i][j];
      }
    }
  }

  return (houses * 100) / schoolSum;
};
