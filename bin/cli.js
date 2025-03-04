#!/usr/bin/env node

const { execSync } = require("child_process");

const runCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit", shell: true });
    return true;
  } catch (e) {
    console.error(`❌ Failed to execute: ${command}`, e.message);
    return false;
  }
};

const repoName = process.argv[2] || "m4-app";
const gitCheckoutCommand = `git clone --depth 1 https://github.com/itsmanojthapa/m4 ${repoName}`;
const installDepsCommand =
  process.platform === "win32"
    ? `cd ${repoName} & yarn`
    : `cd ${repoName} && yarn`;

// Clone repo
console.log(`🚀 Cloning repository into ${repoName}...`);
if (!runCommand(gitCheckoutCommand)) process.exit(-1);

// Install dependencies
console.log(`📦 Installing dependencies for ${repoName}...`);
if (!runCommand(installDepsCommand)) process.exit(-1);

// Setup environment file (only if .env.example exists)
const copyEnvCommand = `cd ${repoName} && [ -f .env.example ] && cp .env.example .env || echo "⚠️  .env.example not found, skipping..."`;
runCommand(copyEnvCommand);

console.log(`🎉 Your Next.js app is ready! Run:`);
console.log(`\n  cd ${repoName}`);
console.log(`
☑ create app
☑ yarn install
☐ Set up .env file first 🙏
☐ yarn gen - Generate Prisma client
☐ yarn migrate - Run Prisma migrations
☐ yarn dev - Start the development server
`);
