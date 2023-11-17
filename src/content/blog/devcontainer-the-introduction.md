---
title: "Dev Containers - The Introduction"
description: ""
pubDate: "Nov 09 2023"
tags: ["devcontainers", "vscode", "productivity"]
---

# Works on my machine 🤷

I worked on a project on and off for a few years. One day, a new colleague joined the project and tried to set it up on his machine. The project is pretty complex to set up, requiring the installation of various software. The Readme seemed to be detailed and up-to-date, but it turned out it wasn't. The colleague spent over a day fixing some weird errors that I couldn't reproduce on my machine. I did the setup a few years back when I onboarded to the project, and it worked, so I never changed the settings again.

I wish there was a tool that could create the same development setup in just one click for everyone.

# What is devcontainer?

The [Visual Studio Code Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension allows you to use a Docker container as a full-featured development environment. This helps ensure a consistent environment across developer machines and makes it easy for new team members and contributors to get up and running.

# Wait, do I have to use VS Code? 🤔

Yes, I know what you're thinking. [VS Code is the best IDE](https://containers.dev/supporting#editors) in terms of supporting devcontainers nicely. Trust me, once you appreciate the benefits of devcontainers, switching to VS Code will be a no-brainer.

# System requirements 📦

* Install [Docker](https://www.docker.com/get-started).
* [Install VS Code](https://code.visualstudio.com/) and the "Dev Containers" extension.
* [Install the VS Code `code` command](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line).


## Demo

I created a [GoLang project](https://github.com/wujiayi101/devcontainer_demo_golang) to demonstrate the use of devcontainers.

- *Option 1*: Click the "Dev Containers Open" Badge

    -  This is a truly one-click spin up! This automatically clones the project to a devcontainer volume and launches it in VSCode

- *Option 2*: Open the project in VS Code and open it in devcontainer

    - Manually clone the project to your machine and run `code /path/to/project` to open the project in VS Code. VS Code detects the configurations in `.devcontainer` and prompts you to open the project in the devcontainer:

    ![localImage](https://code.visualstudio.com/assets/docs/devcontainers/create-dev-container/dev-container-reopen-prompt.png)

It can be a bit slow to start the container for the first time, but the subsequent start up should be much faster because of caching. Once the devcontainer has started, it already includes all the software (e.g., Python, Go, pre-commit, etc.) and VS Code extensions for you. To try it out, launch the terminal in VS Code and try a few exercises:

* Run `pre-commit run -a` to run pre-commit hooks on all files.
* Run `make test` to run Go unit tests.
* Run `docker-compose up --build` to run Docker in the devcontainer.
* Add a whitespace to the end of a line in a file, and notice that the space will be automatically removed when you save the file. This is done by the `shardulm94.trailing-spaces` extension.
* Add a typo or misspelled word to the file, and notice that it will show a warning message for the unknown word. This is triggered by the `streetsidesoftware.code-spell-checker` extension.

This is great! With the devcontainer configuration, everyone working on the project will have the exact same setup. No more _it works on my machine_ dramas. 
