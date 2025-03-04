#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const runCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
    return true;
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
};

const repoName = process.argv[2] || "m4-app";
const gitCheckoutCommand = `git clone --depth 1 https://github.com/itsmanojthapa/m4 ${repoName}`;
const installDepsCommand = `cd ${repoName} && yarn`;

// Clone repo
console.log(`Cloning the repository with name ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

// Install dependencies
console.log(`Installing dependencies for ${repoName}`);
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) process.exit(-1);

// Setup environment file
const copyEnv = runCommand(`cd ${repoName} && cp .env.example .env`);
if (!copyEnv) process.exit(-1);

console.log(
  "🚀 Your Next.js app is ready! Use the following commands to start:",
);
console.log(`cd ${repoName}`);
console.log(`
☑ create app
☑ yarn install
☐ Set up .env file first 🙏
☐ yarn gen - Generate Prisma client
☐ yarn migrate - Run Prisma migrations
☐ yarn dev - Start the development server
`);
