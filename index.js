#!/usr/bin/env node

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import prompts from "prompts";
import { spawn } from "child_process";
import { description, version } from "./package.json";

// Simple CLI argument parsing
const args = process.argv.slice(2);
const options = {
  prod: args.includes("--prod"),
  dev: args.includes("--dev"),
  optional: args.includes("--optional"),
  peer: args.includes("--peer"),
  interactive: args.includes("-i") || args.includes("--interactive"),
  help: args.includes("-h") || args.includes("--help"),
  version: args.includes("-V") || args.includes("--version"),
};

if (options.help) {
  console.log(`${description}

Usage: install-latest [options]

Options:
  -V, --version     output the version number
  --prod            update only production dependencies
  --dev             update only development dependencies
  --optional        update only optional dependencies
  --peer            update only peer dependencies
  -i, --interactive interactively select the dependency types you want to update
  -h, --help        display help for command`);
  process.exit(0);
}

if (options.version) {
  console.log(version);
  process.exit(0);
}

(async () => {
  packageFile = JSON.parse(
    readFileSync(`${process.cwd()}/package.json`).toString(),
  );

  const getDependencies = (type) =>
    packageFile[type]
      ? Object.entries(packageFile[type])
          .filter(([, value]) => isNaN(value[0]))
          .map(([key]) => key)
      : [];

  let dependencies = [];

  if (
    [options.prod, options.dev, options.optional, options.peer].some(Boolean)
  ) {
    if (options.prod) dependencies.push(...getDependencies("dependencies"));
    if (options.dev) dependencies.push(...getDependencies("devDependencies"));
    if (options.optional)
      dependencies.push(...getDependencies("optionalDependencies"));
    if (options.peer) dependencies.push(...getDependencies("peerDependencies"));
  } else {
    dependencies.push(
      ...getDependencies("dependencies"),
      ...getDependencies("devDependencies"),
      ...getDependencies("optionalDependencies"),
      ...getDependencies("peerDependencies"),
    );
  }

  if (options.interactive) {
    const response = await prompts({
      type: "multiselect",
      name: "selectedPackages",
      message: "Select the packages to be updated:",
      choices: dependencies.map(dep => ({ title: dep, value: dep })),
    });
    dependencies = response.selectedPackages || [];
  }

  const packageManager = existsSync(resolve(process.cwd(), "yarn.lock"))
    ? "yarn"
    : "npm";

  const executableName = /^win/.test(process.platform)
    ? packageManager + ".cmd"
    : packageManager;

  const installCommand = { npm: "install", yarn: "add" };

  spawn(
    executableName,
    [
      installCommand[packageManager],
      ...dependencies.map((dependency) => `${dependency}@latest`),
    ],
    {
      cwd: process.cwd(),
      stdio: "inherit",
    },
  );
})();
