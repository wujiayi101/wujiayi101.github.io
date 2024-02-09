---
title: "Choosing Git Branching Strategies"
description: ""
pubDate: "Feb 12, 2024"
tags: ["git", "devops"]
---

A git branching strategy defines how a team uses git to collaborate on the same codebase and how to release the code to the users. Personally I think [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) should be the go-to option for everyone in 2024, but for the sake of completeness, I will also talk about Gitflow.

# Gitflow

![gitflow](/git-model@2x.png)

Introduced in 2010 (5 years after git was invented), Gitflow gained huge popularity in the industry. At its esssese, there are two main branches and a number of supporting branches involved in the process:

- Master branch (i.e, `master`)
    - Known as the _main_ branch of the repository. 
    - The `HEAD` of `master` is considered production ready and can be shipped to the customers 
- Develop branch (i.e,`develop`)
    - Known knowned as the _integration branch_
    - The `HEAD` of `develop` represents the latest development effort and can potentially be shipped as the next release
    - Developer needs to regularly pull latest changes from `develop` to make sure it stay in sycn with the latest changes
    - The changes in `develop` will eventually be merged back to `master`
- Feature branch (i.e, `feature/*` or `feature-*`)
    - feature branches are used to develop new features for future releases
    - feature branches branch off `develop`, and will be merge back to `develop`
- Release branch (i.e, `release/*` or `release-*`)
    - When the `HEAD` of `develop` is consider stable for a release, a release branch is created from `develop`, and this will become thre release candidate
    - bug fix can be directly applied to the release branch instead of the develop branch
    - once the release branch is become the real release, merge the changes back to `master`, and create a semantic tag for the release. 
    - Finally the changes on the release branch need to be merged back to `develop`
- Hot fixes (i.e, `hotfix/*` or `hotfix-*`)
    - In case a hot fix is needed for production issue, branch off `master` branch, merge the changes back to `master` and merge the changes back to `develop`

(Read [this](https://nvie.com/posts/a-successful-git-branching-model/) for details if you need a more in-depth explaination of Gitflow)


# GitHub flow

Gith

The essense of Github flow is that 