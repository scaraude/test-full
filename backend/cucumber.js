export default {
  import: ["backend/features/**/*.ts"],
};

export const sqlite = {
  import: ["backend/features/**/*.ts"],
  tags: "@critical",
  worldParameters: {},
};
