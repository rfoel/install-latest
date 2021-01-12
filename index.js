#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const { program } = require('commander')
const { description, version } = require('./package.json')

const package = require(`${process.cwd()}/package.json`)

program
  .version(version)
  .description(description)
  .option('-P, --prod', 'update only production dependencies')
  .option('-D, --dev', 'update only development dependencies')

program.parse(process.argv)

if (program.prod) package.devDependencies = null
if (program.dev) package.dependencies = null

const packageManager = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'))
  ? 'yarn'
  : 'npm'

const executableName = /^win/.test(process.platform)
  ? packageManager + '.cmd'
  : packageManager;

const installCommand = { npm: 'install', yarn: 'add' }

const dependencies = [
  ...Object.keys(package.dependencies || {}),
  ...Object.keys(package.devDependencies || {}),
].map(dependency => `${dependency}@latest`)

spawn(executableName, [installCommand[packageManager], ...dependencies], {
  cwd: process.cwd(),
  stdio: 'inherit',
})
