#!/usr/bin/env node
/* eslint-disable import/no-dynamic-require */
const path = require('path')
const { execSync } = require('child_process')
const glob = require('glob')

const cwd = process.cwd()
const packageJson = require(`${cwd}/package.json`)

if (!packageJson) {
  console.error('No package.json found')
  process.exit(1)
}

if (process.argv.length !== 3) {
  console.error('Usage: npx update-workspace-dependency <dependency@new-version>')
  process.exit(1)
}

const [dependency, newVersion] = process.argv[2].split('@')

if (!dependency || !newVersion) {
  console.error('Invalid argument format. Use <dependency@new-version>')
  process.exit(1)
}

const workspacesGlob = packageJson.workspaces

if (!workspacesGlob) {
  console.error('No workspaces found in package.json')
  process.exit(1)
}

workspacesGlob.forEach(pattern => {
  glob.sync(pattern).forEach(workspacePath => {
    const packageJsonPath = path.join(workspacePath, 'package.json')
    const packageJsonContent = require(`${cwd}/${packageJsonPath}`)

    if (
      (packageJsonContent.dependencies && packageJsonContent.dependencies[dependency]) ||
      (packageJsonContent.devDependencies && packageJsonContent.devDependencies[dependency])
    ) {
      const saveOption =
        packageJsonContent.dependencies && packageJsonContent.dependencies[dependency]
          ? '--save'
          : '--save-dev'
      execSync(`npm install "${dependency}@${newVersion}" ${saveOption}`, {
        cwd: workspacePath,
        stdio: 'inherit',
      })
    }
  })
})
