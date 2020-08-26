#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const package = require(`${process.cwd()}/package.json`)

const packageManager = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'))
  ? 'yarn'
  : 'npm'

const installCommand = { npm: 'install', yarn: 'add' }

const dependencies = [
  ...Object.keys(package.dependencies),
  ...Object.keys(package.devDependencies),
].map(dependency => `${dependency}@latest`)

spawn(packageManager, [installCommand[packageManager], ...dependencies], {
  cwd: process.cwd(),
  stdio: 'inherit',
})
