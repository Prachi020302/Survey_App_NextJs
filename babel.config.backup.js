module.exports = {
  presets: ["next/babel"],
  env: {
    test: {
      plugins: ["istanbul"], // adds coverage instrumentation
    },
  },
};
