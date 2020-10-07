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
  .option('-D, --dev', 'update only devDependencies')
  .option('-N, --non-dev', 'update only non devDependencies')

program.parse(process.argv)


if (program.dev) package.dependencies = null
if (program.nonDev) package.devDependencies = null


const packageManager = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'))
  ? 'yarn'
  : 'npm'

const installCommand = { npm: 'install', yarn: 'add' }

const dependencies = [
  ...Object.keys(package.dependencies || {}),
  ...Object.keys(package.devDependencies || {}),
].map(dependency => `${dependency}@latest`)

spawn(
  packageManager,
  [installCommand[packageManager], ...dependencies],
  {
    cwd: process.cwd(),
    stdio: 'inherit',
  },
)
