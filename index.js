#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import inquirer from 'inquirer'
import { spawn } from 'child_process'
import { program } from 'commander'
import { description, version } from './package.json'

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

;(async () => {
  packageFile = JSON.parse(
    readFileSync(`${process.cwd()}/package.json`).toString(),
  )

  const getDependencies = type =>
    packageFile[type]
      ? Object.entries(packageFile[type])
          .filter(([, value]) => isNaN(value[0]))
          .map(([key]) => key)
      : []

  let dependencies = []

  if (
    [options.prod, options.dev, options.optional, options.peer].some(Boolean)
  ) {
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

  if (options.interactive) {
    await inquirer
      .prompt({
        type: 'checkbox',
        name: 'selectedPackages',
        message: 'Select the packages to be updated:',
        choices: [...dependencies],
      })
      .then(answers => {
        dependencies = answers.selectedPackages
      })
  }

  const packageManager = existsSync(resolve(process.cwd(), 'yarn.lock'))
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
