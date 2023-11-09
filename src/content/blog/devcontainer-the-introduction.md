---
title: "Spinning Up Any Developement Setup With One Click"
description: ""
pubDate: "Nov 06 2023"
tags: ["devcontainers", "vscode", "productivity"]
---

# "Works on my machine" 🤷

I worked on a project on and off for a few years, one day a new colleague joined the project and tried to set up the project on his machine. The project is pretty complex to set up, it requires the installation of various softwares. The Readme seemed to be pretty detail and up-to-date, but turns out it wasn't, the colleague spent more than 1 day fixing some weird errors that I couldn't reproduce on my machine. I did the set up a few years back when I onboard to the project, it worked and so never changed the setting again. 

I wish there is a tool that everyone could could create the same development set up in one click. 

# What is devcontainer?

The [Visual Studio Code Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension lets you use a Docker container as a full-featured development environment, which helps ensure a consistent environment across developer machines and makes it easy for new team members and contributors to get up and running

# "Wait, do I have to use vscode?" 🤔

Yes, I know what you are thinking. [vscode is the best IDE](https://containers.dev/supporting#editors) in terms of supportting devcontainer nicely. T   rust me, once you appreciate the benefits of devcontainers, switching to vscode will be a non-brainer. 

# System requirements 📦

* Install [Docker](https://www.docker.com/get-started).
* [Install vscode](https://code.visualstudio.com/) and `Dev Containers`` extension
* [Install vscode `code` command](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line)


## Test drive with a demo

I created a [golang project](https://github.com/wujiayi101/devcontainer_demo_golang) to demomenstrate the use of devcontaners

### First, imagine what you need to set up without devcontainer

For the life before devcontainer, you need to at least install go, python, and pre-commit and a bunch of IDE extensions to make yourself ready for the development. With the devcontainer, everything is installed in a container and isolated from your host machine

### Option 1: Click `Dev Containers Open` Badge

You could click the `Dev Containers Open` label on the readme to launch the project to a remote container directly.  


### Option 2: Open the project in vscode, and open the project in a container


Clone the project to your machine, and run `code /path/to/project` to launch the project in vscode. vscode automatically detects the devcontainer config file, and will prompt you option to open this project in the devcontainer:

![localImage](https://code.visualstudio.com/assets/docs/devcontainers/create-dev-container/dev-container-reopen-prompt.png)

It could be a bit slow to start the container for the first time, once it is started you are 100% ready to write and debug the code: 

To try it out, simply launch the terminal in vscode, type in `make ci` to run the tests. 

Notice the devcontainer have already installed all the sofwares (e.g, python, go, pre-commit, etc) and vscode extensions for you, all you have done is start the project in the devcontainer!







