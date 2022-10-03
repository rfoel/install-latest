#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const { spawn } = require('child_process')
const { program } = require('commander')
const { description, version } = require('./package.json')

const package = require(`${process.cwd()}/package.json`)

const getDependencies = type =>
  package[type]
    ? Object.entries(package[type])
        .filter(([value]) => !isNaN(value[0]))
        .map(([key]) => key)
    : []

program
  .version(version)
  .description(description)
  .option('--prod', 'update only production dependencies')
  .option('--dev', 'update only development dependencies')
  .option('--optional', 'update only optional dependencies')
  .option('--peer', 'update only peer dependencies')
  .option(
    '-i, --interactive',
    'interactively select the dependency types you want to update',
  )

program.parse(process.argv)
const options = program.opts()

const dependencies = []

if ([options.prod, options.dev, options.optional, options.peer].some(Boolean)) {
  if (options.prod) dependencies.push(...getDependencies('dependencies'))
  if (options.dev) dependencies.push(...getDependencies('devDependencies'))
  if (options.optional)
    dependencies.push(...getDependencies('optionalDependencies'))
  if (options.peer) dependencies.push(...getDependencies('peerDependencies'))
} else {
  dependencies.push(
    ...getDependencies('dependencies'),
    ...getDependencies('devDependencies'),
    ...getDependencies('optionalDependencies'),
    ...getDependencies('peerDependencies'),
  )
}

;(async () => {
  if (options.interactive) {
    await inquirer
      .prompt({
        type: 'checkbox',
        name: 'userPackages',
        message: 'Select the packages to be updated:',
        choices: [...dependencies],
      })
      .then(answers => {
        dependencies.length = 0
        dependencies.push(...answers.userPackages)
      })
  }

  const packageManager = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'))
    ? 'yarn'
    : 'npm'

  const executableName = /^win/.test(process.platform)
    ? packageManager + '.cmd'
    : packageManager

  const installCommand = { npm: 'install', yarn: 'add' }

  spawn(
    executableName,
    [
      installCommand[packageManager],
      ...dependencies.map(dependency => `${dependency}@latest`),
    ],
    {
      cwd: process.cwd(),
      stdio: 'inherit',
    },
  )
})()
