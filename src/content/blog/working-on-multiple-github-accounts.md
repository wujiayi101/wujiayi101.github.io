---
title: "Working On Multiple GitHub Accounts"
description: ""
pubDate: "Nov 03, 2023"
tags: ["git", "tips", "productivity"]

---

# Overview
Many of us have multiple GitHub accounts, such as a work account and a personal account. Sometimes, we need to work on these accounts on the same machine. In this blog post, we will introduce a setup that enables the machine to automatically load the right git configuration and SSH key when switching between projects from different GitHub accounts.

# Create Separate Directories for Different GitHub Accounts

Create separate directories for each GitHub account. For example:

- `~/github/work`: for your work GitHub account projects
- `~/github/personal`: for your personal GitHub account projects

# Generate key pair for each GitHub account

For each GitHub account, [generate](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key) an SSH key pair and add the public key to the respective GitHub account using the [GitHub Docs guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).


# Configure `.gitconfig`

If it doesn't exist already, create `.gitconfig` file in your `$HOME` folder and add the following content to it. The configuration file is self-explanatory and instructs Git to read a child config file based on the current working directory. You git also include shared configuration in this file.


```
[url "git@github.com:"]
    insteadOf = https://github.com/
[includeIf "gitdir:~/github/work/"]
    path = ~/.gitconfig-work
[includeIf "gitdir:~/github/personal/"]
    path = ~/.gitconfig-personal
```
_`~/.gitconfig`_


Next, create the child config files. Typically, you will have different user names, email addresses, and SSH keys for each GitHub account. These details can be specified in the respective child configs.

```
[user]
	name = chris-work
	email = work@gmail.com
[commit]
	gpgSign = true
[core]
    sshCommand = "ssh -i ~/.ssh/work_key"
```
_`~/.gitconfig-work`_


```
[user]
	name = chris-personal
	email = personal@gmail.com
[commit]
	gpgSign = false
[core]
    sshCommand = "ssh -i ~/.ssh/personal_key"
```
_`~/.gitconfig-personal`_


# Verify the Setup

Let's verify the setup:

1. Go to `~/github/work/`
1. Run `mkdir new-work-repo; cd new-work-repo; git init`
1. Run `git config -l`, and the output should display the work-related configuration.

Repeat the same steps for the personal account folder, and verify `git config -l` returns personal-related configuration

# Summary

With this setup, Git will automatically load the appropriate configuration and SSH key based on the current working directory, making it easier to work with multiple GitHub accounts on the same machine.

Feel free to adapt this setup to your specific needs and enjoy working seamlessly with your multiple GitHub accounts!