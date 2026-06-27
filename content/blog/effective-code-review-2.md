---
title: "Effective code review (part 2): giving feedback"
description: ""
pubDate: "March 10, 2024"
tags: ["code-review", "github"]
---

In the [previous post](/blog/effective-code-review-1/), we discussed effective ways of asking for code review. In this post, we will delve into the other side of the coin: giving effective feedback during code review.

## Principles for giving code review feedback

When providing code review feedback, it's important to keep two key principles in mind:

- **Empathy towards the code author**: recognize that the code author may have invested significant time and effort into the pull request (PR). Be mindful of your tone and considerate in your comments.

- **Write actionable feedback**: make sure your feedback provides clear actions or steps for the author to follow.

Throughout the rest of this post, we will provide examples and tips to elaborate on these principles.

## 1. Let machines do the boring part

Automated tools can help identify common issues in the code. By leveraging these tools in the CI, code reviewers can focus on more complex aspects of the code changes. The friction between team members is reduced because the reviewers do not need to be the annoying one to tell the code author to fix these minor issues.

![Machine vs Human](/machine-vs-human.png)

## 2. Reading the pull request (PR)

### 2.1 Start with the high level and obvious

When beginning the review, start with the high-level information provided in the PR description, such as the associated JIRA ticket and the description of the implemented changes. Try to understand the problem that this PR aims to solve. Additionally, quickly skim through the PR to identify any obvious mistakes, such as broken CI, redundant files, or excessively large PRs that are impossible to review thoroughly. If you spot on any of these, provide initial feedback and suggest that the code author address them before resubmitting the PR.

### 2.2 Use filters to reduce noise

When reading the code, leverage the filter in the GitHub UI to focus on the most important changes. You can ignore whitespace changes, specific file types (e.g., package lock files), deleted/moved files, and files that you have already reviewed (those marked as `viewed`).

By using filters, a seemingly large change may turn out to require much less effort to review.

![Filter](/filter.png)

### 2.3 Filter changes by commits

Another way to understand the changes is to review the git history of the PR. The GitHub UI allows you to filter and review the changes by commit. Assuming the code author has structured the git commit history in a clean manner, this approach provides a good narrative for understanding the changes. 

![Filter by commit](/filter-by-commit.png)

Note: this only works if the code author has done its job [writing a clean git history](/blog/atomic-commits/) before asking for code review. 

## 3. Leaving comments

Once you have ready through the PR, you are ready to write comments. Here are a few tips to make your comments more effective and well-received. Some of these tips can be very helpful for non-native English speakers, as misunderstandings often occur when the message is written in a poor way.

### 3.1 Avoid using "you"

Using "we" generally feels more polite and emphasizes the idea of working as a team.

> DON'T:
>
> `Can you rename this variable to something more descriptive, like seconds_remaining?`
>
> DO:
>
> `Can we rename this variable to something more descriptive, like seconds_remaining?`

### 3.2 Frame feedback as requests, not commands

Using a request tone sounds more polite:

> DON'T:
>
> `Move the Foo class to a separate file`
>
> DO:
>
> `Can we move the Foo class to a separate file?`

### 3.3 Provide code examples generously

Try to be explicit about your suggestions and utilize the [GitHub suggestion feature](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/incorporating-feedback-in-your-pull-request) where possible.

![Code example](/code-example-gh.png)


### 3.4 Respect the scope of the PR

Avoid commenting on things that are out of the PR's scope. For example, if you notice a naming issue that is not introduced by this PR, it is better to create a separate GitHub issue or JIRA ticket to track that issue. This helps maintain focus on the current PR.

### 3.5 Avoid repeating comments on similar issues

Repeating comments on the same type of issue creates distractions and noise. Instead, write one comment addressing the issue and mention that there are multiple instances of the same problem. Trust that the code author will address them collectively.

![Don't Repeat Comments](/dont-repeat-comments.png)

### 3.6 Offer praise

When possible, offer genuine praise for well-done aspects of the code. This makes your other suggestions more receptive, demonstrating that you are not merely being critical.

### 3.7 Use conventional comment format

A good PR comment should contain the following information:

- The type of comment (bug, nitpick, question, etc.).
- Whether the issue is a blocker, and whether it can be addressed later on.
- The details of the feedback.

[Conventional Comment](https://conventionalcomments.org/) is a great framework for framing such information in PRs.

We won't go into detail on this here, but here is a quick example:

> **nitpick (non-blocking)**: the variable name `xyz` is not clear
>
> Consider renaming it to `username` for clarity. This can be done in a future PR.

Often times, people receiving feedback are overwhelmed by many feedbacks and they are worried that the reviewers willl be upset if not all feedbacks are addressed. If you write a comment like this, you are sending a clear signal to the author that the issue doesn't have to be addressed in this PR. This will be a big relief for the author who wants to ship the code ASAP.

Here is another example:

> **bug (blocking)**: this function returns error
>
> The input values to the function are incorrect, please refer to the API doc for detail

This comment points out a critical issue. It has to be fixed in this PR unless the author disagree otherwise. 


### 3.8 Approve if no more blockers

You should approve the PR as soon as there is no blocker/critical issues in the PR and trust the author will address other issues in the future. This allows the team to move fast and avoid a standoff in a PR feedback loop.

### If the review becomes a standoff

With all the tips provided above, there is still a chance that a review turns into a standoff situation. No one agrees with anyone, and the PR is unable to process further. In this case, it is better for the author to create a live meeting to go through the PR instead of talking via text offline. Discussing via text offline can often cause misunderstanding and can be avoided in a live session.


## Final thoughts

In summary, giving effective feedback during code review is all about providing actionable and explicit feedback. Actionable feedback reduces back-and-forth communication, and showing empathy and offering praise to the code author helps make the entire process smoother.

## References

- [https://mtlynch.io/human-code-reviews-1/](https://mtlynch.io/human-code-reviews-1/)
- [https://curtiseinsmann.medium.com/how-to-nitpick-on-code-reviews-with-empathy-d6cb8e670ca4](https://curtiseinsmann.medium.com/how-to-nitpick-on-code-reviews-with-empathy-d6cb8e670ca4)