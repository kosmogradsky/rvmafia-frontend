module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testPathIgnorePatterns: ["lib/", "node_modules/"],
  testEnvironment: "node",
  rootDir: "src",
};
