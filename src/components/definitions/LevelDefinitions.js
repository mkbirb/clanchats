// The EXP that needs to be reached for the user to level
export const levelDefinition = {
  0: 0,
  1: 10,
  2: 20,
  3: 25,
};

export const maxLevel = Math.max(...Object.keys(levelDefinition).map(Number));