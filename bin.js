#!/usr/bin/env node

const { execSync } = require("node:child_process");
const { cp, rm, rename, readdir, mv } = require("node:fs/promises");
const { resolve } = require("node:path");

const run = (command, options) =>
  execSync(command, { stdio: "inherit", ...options });

const main = async () => {
  const sourcePath = __dirname;
  const targetPath = resolve(".");

  await cp(sourcePath, targetPath, {
    recursive: true,
  });

  await mv("./gitignore", ".gitignore");

  run("git init");

  run(`npm install`);
  run(`npm install`, {
    cwd: `./src/lib/graphExercise/ui`,
  });

  await Promise.all(
    ["graph", "concrete", "foundation"].map(replaceWithTemplates)
  );
};

const replaceWithTemplates = async (category) => {
  const exercises = await readdir(`./src/exercises/${category}`);

  await Promise.all(
    exercises.map(async (exercise) => {
      const exercisePath = `./src/exercises/${category}/${exercise}/exercise.ts`;
      const exerciseTemplatePath = `./src/exercises/${category}/${exercise}/template.ts`;
      await rm(exercisePath);
      await rename(exerciseTemplatePath, exercisePath);
    })
  );
};

main();
