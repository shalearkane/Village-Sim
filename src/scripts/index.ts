import {
  getHappinessIndexOfHospitals,
  getHappinessIndexOfSchools,
} from "../services/happiness";

const grid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 3, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 3, 3, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const getHappinessIndex = () => {
  return getHappinessIndexOfHospitals(grid) + getHappinessIndexOfSchools(grid);
};
