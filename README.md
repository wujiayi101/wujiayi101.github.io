# wujiayi101.github.io

## Developer in Devcontainer

[`Devcontainer`](https://code.visualstudio.com/docs/devcontainers/containers) spins up a development environment in a container so you don't have to install the dependencies on your host machine:

1. Ensure Docker is installed and running
2. Install [vscode](https://code.visualstudio.com/) and `Dev Containers` extension
3. Open this project in vscode
4. Launch `Command Palette` from the UI or run `⌘ + Shift + P` if you are on Mac
5. Select either `Reopen in Container` or `Rebuild Container` to start the Devcontainer
6. Once Devcontainer starts up, open vscode terminal, and use the commands in the following section to develop and debug.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

