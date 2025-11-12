# Update Workspace Dependency

A command-line utility to update a specified dependency or devDependency across all workspaces in an npm monorepo.

## Prerequisites

This script requires Node.js and npm to be installed

## Usage

To update a dependency or devDependency across all workspaces, run the following command:

```bash
npx update-workspace-dependency [<package-name@new-version> ...]
```

e.g.

```bash
npx update-workspace-dependency react react-dom
```

Replace package-name@new-version with the name of the dependency and the desired version separated by the @ character.

The script will update the specified dependency in each workspace, regardless of whether it is a dependency or a devDependency. If the dependency is not present in a workspace, it will not be added.

## How It Works

The script reads the workspaces glob patterns from the root package.json file and iterates through each workspace.

For each workspace, it checks if the specified dependency is listed as a dependency or devDependency. If it is, the script updates the version of the dependency in the package.json file and installs the updated dependency.

## Note

This script updates the dependency versions in the package.json files and installs the updated dependencies in the workspaces, but it does not automatically commit or push the changes to your version control system. After the update, you should verify that the changes work as expected, and then commit and push the changes to your repository.
