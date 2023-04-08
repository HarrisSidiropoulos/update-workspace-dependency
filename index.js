#!/usr/bin/env node
/* eslint-disable import/no-dynamic-require */
const path = require('path')
const { execSync } = require('child_process')
const glob = require('glob')
const { parse } = require('parse-package-name')

const cwd = process.cwd()
const packageJson = require(`${cwd}/package.json`)

if (!packageJson) {
  console.error('No package.json found')
  process.exit(1)
}

if (process.argv.length < 3) {
  console.error('Usage: npx update-workspace-dependency <dependency@new-version>')
  process.exit(1)
}

const [, , ...packagesWithVersion] = process.argv

const workspacesGlob = packageJson.workspaces

if (!workspacesGlob) {
  console.error('No workspaces found in package.json')
  process.exit(1)
}

workspacesGlob.forEach(pattern => {
  glob.sync(pattern).forEach(workspacePath => {
    const packageJsonPath = path.join(workspacePath, 'package.json')
    const packageJsonContent = require(`${cwd}/${packageJsonPath}`)

    const dependencies = packagesWithVersion.filter(packageWithVersion => {
      const { name } = parse(packageWithVersion)
      return packageJsonContent.dependencies && packageJsonContent.dependencies[name]
    })

    const devDependencies = packagesWithVersion.filter(packageWithVersion => {
      const { name } = parse(packageWithVersion)
      return packageJsonContent.devDependencies && packageJsonContent.devDependencies[name]
    })

    if (dependencies.length > 0) {
      execSync(`npm i -S ${dependencies.join(' ')}`, {
        cwd: workspacePath,
        stdio: 'inherit',
      })
    }
    if (devDependencies.length > 0) {
      execSync(`npm i -D ${devDependencies.join(' ')}`, {
        cwd: workspacePath,
        stdio: 'inherit',
      })
    }
  })
})
